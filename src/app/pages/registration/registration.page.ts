import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComponentService } from 'src/app/services/component.service';
import { Storage } from '@ionic/storage-angular';
// import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';
import { WsApiService } from 'src/app/services/ws-api.service';
import { AesKey } from 'src/app/interfaces/aes';
import { CryptosService } from 'src/app/services/cryptos.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  // sending = false;
  phoneNumber: string;
  pinNumber: string = "";
  confirmPinNumber: string = "";

  registerForm: FormGroup;
  isLoading = false;




  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private component: ComponentService,
    private storage: Storage,
    private ws: WsApiService,
    private crypto: CryptosService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.pattern("^\\d{10,11}$")]],
    })
  }

  async submit(){

    if(this.pinNumber !== this.confirmPinNumber){
      this.component.toastMessage('Pin number does not match', 'danger');
      return
    }
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
      "phone_number": this.registerForm.value.phoneNumber,
      "aes_key": encrypted_aesKey,
    }

    this.isLoading = true;

    this.ws.post<any>('/user/register',{body: userBody}).subscribe(
      resp =>{
        console.log(resp);
        this.storage.set('user', resp);
        this.component.toastMessage('Registration successful', 'success');
        this.modalCtrl.dismiss({ completed: true });

      }, error => {
        console.log(error);
        this.component.toastMessage(error.error.detail, 'danger');
        this.isLoading = false;
      }
    )
  }


  register(){

  }

  onCodeChanged(code: string) {
    this.pinNumber=code;
  }

  onCodeChangedConfirmPin(code: string) {
    this.confirmPinNumber=code;
  }
}
