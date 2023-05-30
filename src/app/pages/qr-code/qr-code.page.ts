import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from 'src/app/interfaces/user';
import { AlertButton, NavController, Platform } from '@ionic/angular';
import { ComponentService } from 'src/app/services/component.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage implements OnInit {

  user: User
  scan: boolean = false

  isCapacitor: boolean;
  sending = false;

  constructor(
    private storage: Storage,
    public plt: Platform,
    private component: ComponentService,
    private navCtrl: NavController,


  ) { }

  async ionViewWillEnter() {
    this.isCapacitor = this.plt.is('capacitor');
    if(!this.isCapacitor){
      this.component.toastMessage('This feature is only available for mobile phone','danger')
      this.navCtrl.navigateBack('/tabs/home')
      
    }
    this.user = await this.storage.get('user')
    
  }

  ngOnInit() {


  }


  

}
