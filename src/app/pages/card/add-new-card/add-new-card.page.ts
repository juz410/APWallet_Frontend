import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { months, expireYears } from 'src/app/interfaces/share';
import { ComponentService } from 'src/app/services/component.service';
import { CryptosService } from 'src/app/services/cryptos.service';
import { WsApiService } from 'src/app/services/ws-api.service';
import { AesKey } from 'src/app/interfaces/aes';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.page.html',
  styleUrls: ['./add-new-card.page.scss'],
})
export class AddNewCardPage implements OnInit {

  months = months;
  expireYears = expireYears;
  addNewCardForm: FormGroup;
  isLoading = false;



  constructor(
    private crypto: CryptosService,
    private ws: WsApiService,
    private formBuilder: FormBuilder,
    private component: ComponentService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {

    this.addNewCardForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern("^\\d{16}$")]],
      cardExpireMonth: ['', [Validators.required]],
      cardExpireYear: ['', [Validators.required]],
      cardCvv: ['', [Validators.required, Validators.pattern("^\\d{3}$")]],
    })
  }


  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  addCard(){
    this.submit()
  }

  async submit(){
    const aesKey: AesKey = {
      key: this.crypto.generateRandomString(),
      iv: this.crypto.generateRandomString()
    }

    const encrypted_cardNumber = await this.crypto.aesEncryption(aesKey, this.addNewCardForm.value.cardNumber);
    const encrypted_cardExpireMonth = await this.crypto.aesEncryption(aesKey, this.addNewCardForm.value.cardExpireMonth);
    const encrypted_cardExpireYear = await this.crypto.aesEncryption(aesKey, this.addNewCardForm.value.cardExpireYear);
    const encrypted_cardCvv = await this.crypto.aesEncryption(aesKey, this.addNewCardForm.value.cardCvv);

    const encrypted_aesKey: AesKey ={
      key: await this.crypto.publicKeyEncrypt(aesKey.key),
      iv: await this.crypto.publicKeyEncrypt(aesKey.iv),
    }
    const body = {
      "card_number": encrypted_cardNumber,
      "card_expire_month": encrypted_cardExpireMonth,
      "card_expire_year": encrypted_cardExpireYear,
      "card_cvv": encrypted_cardCvv,
      "aes_key": encrypted_aesKey
    }
    
    this.isLoading = true;

    this.ws.post<any>('/card/', {body: body}).subscribe(
      resp => {
        console.log(resp)
        this.isLoading = false;
        this.component.toastMessage('Card added successfully', 'success');
        this.addNewCardForm.reset();
        this.navCtrl.navigateBack('/tabs/card')
        
      },
      error => {
        console.log(error)
        this.isLoading = false;
        this.component.toastMessage(error.error.detail, 'danger');
      }
    )


  }

  canDone(){
    // return true
    return this.addNewCardForm.valid
  }

}
