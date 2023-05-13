import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ComponentService } from 'src/app/services/component.service';
import { CryptosService } from 'src/app/services/cryptos.service';
import { WsApiService } from 'src/app/services/ws-api.service';
import { AlertButton } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { Storage } from '@ionic/storage-angular';
import { AesKey } from 'src/app/interfaces/aes';

@Component({
  selector: 'app-reset-pin',
  templateUrl: './reset-pin.page.html',
  styleUrls: ['./reset-pin.page.scss'],
})
export class ResetPinPage implements OnInit {

  newPin: string = "";
  confirmNewPin: string = "";
  otp: string = "";
  user: User;

  constructor(
    private component: ComponentService,
    private ws: WsApiService,
    private loadingCtrl: LoadingController,
    private crypto: CryptosService,
    private modalCtrl: ModalController,
    private storage: Storage,
  ) { }

  ngOnInit() {

    this.storage.get('user').then(user => {
      this.user = user;
      this.sentOtp();
    });


  }

  emailSentDialog(){
    const btn: AlertButton = {
      text: 'Confirm',
      cssClass: 'success',
      handler: () => {
      }
    };

    this.component.alertMessage('OTP Sent', `An OTP Code has been sent to your email\nPlease check your email\n${this.user.email}`, 'success', 'Cancel', btn);
  }

  async sentOtp(){
    const loading = await this.loadingCtrl.create({
      message: 'Generating OTP....',
      spinner: 'bubbles',
    });
    loading.present();
    this.ws.post<any>('/otp/email').subscribe(
      res => {
        loading.dismiss();
        this.emailSentDialog();
        
      }
    )
  }

  async changePin(){

    if(this.newPin !== this.confirmNewPin){
      this.component.toastMessage('Pin number does not match', 'danger');
      return
    }

    const loading = await this.loadingCtrl.create({
      message: 'Changing PIN....',
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

    const encryptedPIN = await this.crypto.aesEncryption(aesKey, this.newPin);
    const userBody = {
      "otp": this.otp,
      "new_pin": encryptedPIN,
      "aes_key": encrypted_aesKey,
    }

    this.ws.post<any>('/auth/change_pin',{body: userBody}).subscribe(
      resp =>{
        console.log(resp);
        this.component.toastMessage('PIN changed successfully', 'success');
        this.modalCtrl.dismiss({ completed: true });
        loading.dismiss()

      }, error => {
        console.log(error);
        this.component.toastMessage(error.error.detail, 'danger');
        loading.dismiss()
      }
    )

  }

  onCodeChangedOTP(code: string){
    this.otp = code;
  }

  onCodeChangedNewPin(code: string){
    this.newPin = code;
  }

  onCodeChangedConfirmNewPin(code: string){
    this.confirmNewPin = code;
  }

}
