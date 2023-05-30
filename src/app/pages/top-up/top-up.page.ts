import { Component, OnInit } from '@angular/core';
import { Card, User } from 'src/app/interfaces/user';
import { WsApiService } from 'src/app/services/ws-api.service';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import { NavController, LoadingController, AlertButton } from '@ionic/angular';
import { banks, Bank } from 'src/app/interfaces/bank';
import { ComponentService } from 'src/app/services/component.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.page.html',
  styleUrls: ['./top-up.page.scss'],
})
export class TopUpPage implements OnInit {

  user: User;
  topupMethod: string = 'card';
  // amount: number = 10
  cards$: Observable<Card[]>;
  banks: Bank [] = banks;
  isLoading: boolean = false;

  topUpForm: FormGroup;


  constructor(
    private storage: Storage,
    private ws: WsApiService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private component: ComponentService,
    private formBuilder: FormBuilder
  ) { }

  ionViewWillEnter(){
    

    this.cards$ = this.ws.get<Card[]>(`/card/`)
    this.storage.get('user').then(
      user => {
        this.user = user
      }
    )

  }

  ngOnInit() {
    this.topUpForm = this.formBuilder.group({
      amount: [10, [Validators.required, Validators.pattern("^[0-9]*\.?[0-9]*$")]],
    })

  }

  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  // onInput(event) {
  //   const inputValue = event.target.value;
  //   this.amount = inputValue.replace(/[^0-9.]*/g, '');
  // }

  topUpButtonDisable(){
    if(this.topUpForm.value.amount < 10 
      || 
      this.topUpForm.value.amount > 1000
      ||
      !this.topUpForm.valid){
        return true
      }
    return false
  }
  
  

  onSegmentChanged(event) {
    this.topupMethod = event.detail.value;
  }

  topupCardConfirm(card){
    const amount = this.topUpForm.value.amount

    const btn: AlertButton = {
      text: 'Topup',
      cssClass: 'success',
      handler: () => {
        this.topupCard(card)
      }
    };

    this.component.alertMessage('Topping Up', `Topping up RM${amount} with card ${card.card_number.slice(-4)}`, 'success', 'Cancel', btn);
  }

  async topupCard(card){
    const amount = this.topUpForm.value.amount
    const loading = await this.loadingCtrl.create({
      message: 'Topping Up....',
      spinner: 'bubbles',
    });
    await loading.present();
    const cardID = card.card_id
    const body = {
      'amount' : amount,
      'transaction_method': 'card_topup',
      'card_id' : cardID
    }

    this.ws.post<any>(`/transaction/`, {body: body}).subscribe(
      resp => {
        loading.dismiss()
        this.component.toastMessage('Top Up Successfull!', 'success')

        this.user.balance += amount
        this.storage.set('user', this.user);
        // this.amount = 10
        this.topUpForm.controls['amount'].setValue(10);

      },
      err => {
        this.component.toastMessage(err, 'danger')
      }
    )
  }

  topupBankConfirm(bank: Bank){
    const amount = this.topUpForm.value.amount

    const btn: AlertButton = {
      text: 'Topup',
      cssClass: 'success',
      handler: () => {
        this.topupBank(bank)
      }
    };

    this.component.alertMessage('Topping Up', `Topping up RM${amount} with ${bank.name}`, 'success', 'Cancel', btn);
  }

  async topupBank(bank: Bank){
    const amount = this.topUpForm.value.amount

    const loading = await this.loadingCtrl.create({
      message: 'Topping Up....',
      spinner: 'bubbles',
    });
    await loading.present();
    const body = {
      'amount' : amount,
      'transaction_method': 'online_banking',
    }

    this.ws.post<any>(`/transaction/`, {body : body}).subscribe(
      resp => {
        loading.dismiss()
        this.component.toastMessage(`Top Up Successful with ${bank.name}!`, 'success')
        
        this.user.balance += amount
        this.storage.set('user', this.user);
        this.topUpForm.controls['amount'].setValue(10);


      },
      err => {
        this.component.toastMessage(err, 'danger')
      }
    )

  }

  addNewCard(){
    this.navCtrl.navigateForward('/tabs/card/add-new-card')
  }

}
