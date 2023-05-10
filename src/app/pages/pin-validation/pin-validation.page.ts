import { Component, OnInit } from '@angular/core';
import { WsApiService } from 'src/app/services/ws-api.service';
import { AesKey } from 'src/app/interfaces/aes';
import { CryptosService } from 'src/app/services/cryptos.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { ComponentService } from 'src/app/services/component.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-pin-validation',
  templateUrl: './pin-validation.page.html',
  styleUrls: ['./pin-validation.page.scss'],
})
export class PinValidationPage implements OnInit {

  pinNumber: string = "";

  constructor(
    private modalCtrl: ModalController,
    private component: ComponentService,
    private storage: Storage,
    private ws: WsApiService,
    private loadingCtrl: LoadingController,
    private crypto: CryptosService
  ) { }

  ngOnInit() {

  }

  async validate(){

    const loading = await this.loadingCtrl.create({
      message: 'Validating....',
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

    const encryptedPIN = await this.crypto.aesEncryption(aesKey, this.pinNumber);
    const userBody = {
      "pin_number": encryptedPIN,
      "aes_key": encrypted_aesKey,
    }

    this.ws.post('/auth/validate_pin_number', {body: userBody}).subscribe(
      resp => {
        loading.dismiss();
        this.modalCtrl.dismiss({ completed: true, pinNumber: this.pinNumber });
      }, err => {
        this.component.toastMessage(err.error.detail, 'danger');
        loading.dismiss();

      }
    )



  }

  onCodeChanged(code: string) {
    this.pinNumber=code;
  }


}
