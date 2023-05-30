import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User, RecentUser } from 'src/app/interfaces/user';
import { WsApiService } from 'src/app/services/ws-api.service';
import { Storage } from '@ionic/storage-angular';
import { ComponentService } from 'src/app/services/component.service';
import { AlertButton, LoadingController, ModalController } from '@ionic/angular';
import { PinValidationPage } from '../pin-validation/pin-validation.page';
import { AesKey } from 'src/app/interfaces/aes';
import { CryptosService } from 'src/app/services/cryptos.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-instant-transfer',
  templateUrl: './instant-transfer.page.html',
  styleUrls: ['./instant-transfer.page.scss'],
})
export class InstantTransferPage implements OnInit {

  recentUsers: RecentUser[] = []
  receiver: User
  receiver$: Observable<User>
  // receiverID: string;
  // amount: number;
  user: User;
  transferForm: FormGroup;

  constructor(
    private ws: WsApiService,
    private storage: Storage,
    private component: ComponentService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private crypto: CryptosService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder

  ) { 


  }

  ionViewWillEnter(){
    this.getRecentUsers()
    this.storage.get('user').then(
      user => {
        this.user = user
      }
    )
  }

  ionViewDidEnter(){
    this.route.queryParams.subscribe(params => {
      const userId = params['userId']
      // this.receiverID = userId
      this.transferForm.controls['receiverID'].setValue(userId)
    });
  }


  ngOnInit() {
    this.transferForm = this.formBuilder.group(
      {
        receiverID: ['',[Validators.required]],
        amount: [0,[Validators.required, Validators.pattern("^[0-9]*\.?[0-9]*$")] ]
      }
    )
  }

  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  
  
  transferCheck() {
    const receiverID = this.transferForm.value.receiverID
    this.receiver$ = this.ws.get<User>(`/user/search?user_id=${receiverID}`)

    this.receiver$.subscribe(
      resp => {
        this.receiver = resp
        this.storeRecentUser(this.receiver)
        this.transferConfirmation()

      },
      err => {
        this.component.toastMessage(err.error.detail, 'danger')
      }
    )
  }

  transferConfirmation() {
    const amount = this.transferForm.value.amount
    const btn: AlertButton = {
      text: 'Transfer',
      cssClass: 'success',
      handler: () => {
        this.pinValidation()
      }
    };

    this.component.alertMessage('Transferring', `Transferring RM${amount} to ${this.receiver.name}`, 'success', 'Cancel', btn);
  }
  

  async getRecentUsers() {
    this.recentUsers = await this.storage.get('recentUsers')
  }

  async pinValidation() {
    const modal = await this.modalCtrl.create({
      component: PinValidationPage,
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.completed) {
      console.log(data.pinNumber)
      this.transfer(data.pinNumber)
    }
  }

  async transfer(pinNumber: string) {
    const amount = this.transferForm.value.amount
    const receiverID = this.transferForm.value.receiverID
    const loading = await this.loadingCtrl.create({
      message: 'Transferring....',
      spinner: 'bubbles',
    });
    loading.present();
    
    const aesKey: AesKey = {
      key: this.crypto.generateRandomString(),
      iv: this.crypto.generateRandomString()
    }

    const encrypted_aesKey: AesKey ={
      key: await this.crypto.publicKeyEncrypt(aesKey.key),
      iv: await this.crypto.publicKeyEncrypt(aesKey.iv),
    }

    const encryptedPIN = await this.crypto.aesEncryption(aesKey, pinNumber);
    const userBody = {
      "pin_number": encryptedPIN,
      "receiver_id": this.receiver.user_id,
      "amount": amount,
      "transaction_method": "instant_transfer",
      "aes_key": encrypted_aesKey,
    }

    this.ws.post<any>(`/transaction/`,{body: userBody}).subscribe(
      resp => {
        loading.dismiss()
        this.component.toastMessage(`Transfered RM${amount} to ${this.receiver.name}`, 'success')
        this.user.balance -= amount
        this.storage.set('user', this.user);
      },
      err => {
        loading.dismiss()
        this.component.toastMessage(err.error.detail, 'danger')
      }
    )

  }

  quickTransfer(receiverID: string){
    this.transferForm.controls['receiverID'].setValue(receiverID);
    this.transferCheck()
  }

  storeRecentUser(user: User) {
  
    const recentUser: RecentUser = {
      'name': user.name,
      'user_id': user.user_id
    }

    if(recentUser.user_id === this.user.user_id) return;
    // Get the existing list from storage
    this.storage.get('recentUsers').then((existingList: any[]) => {
      const newList = existingList || [];
    
      const index = newList.findIndex((ru: any) => ru.user_id === recentUser.user_id);
      if (index !== -1) {
        // If the new recent user exists in the list, remove its previous occurrence
        newList.splice(index, 1);
      }
    
      newList.unshift(recentUser);
    
      this.storage.set('recentUsers', newList);
    });
  }

}
