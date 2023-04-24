import { Component } from '@angular/core';
import { WsApiService } from 'src/app/services/ws-api.service';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { RegistrationPage } from '../registration/registration.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private ws: WsApiService,
    private http: HttpClient,
    private modalCtrl: ModalController
  ) {}

  test(){

    this.openComponent()
    // this.ws.get<any>('/user/').subscribe( 
    //   resp => {
    //   console.log(resp);
    // },
    // error => {
    //   console.log(error.error);
    // })
    // const userRgister = {
    //   'pin_number' : '123456',
    //   'phone_number' : '1234567890'
    // }
    // this.ws.post<any>('/user/register', {body: userRgister}).subscribe( resp => {
    //   console.log(resp);
    // })
  }

  async openComponent(){
    const modal = await this.modalCtrl.create({
      component: RegistrationPage,
    });
    await modal.present();
  }
}
