import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Platform, AlertButton, NavController } from '@ionic/angular';
import { ComponentService } from 'src/app/services/component.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
})
export class ScanQrPage implements OnInit {

  scan: boolean = false;
  isCapacitor: boolean;
  
  constructor(
    public plt: Platform,
    private component: ComponentService,
    private navCtrl: NavController,

  ) { }

  async ionViewWillEnter(){
    this.isCapacitor = this.plt.is('capacitor');
    if(!this.isCapacitor){
      this.component.toastMessage('This feature is only available for mobile phone','danger')
      this.navCtrl.navigateBack('/tabs/home')
    }else{
      this.swapMode()
    }
  }

  ngOnInit() {
  }

  async swapMode() {
    this.scan = !this.scan;
    if (this.scan) {
      const allowed = await this.checkPermission();
      await BarcodeScanner.prepare();

      if (allowed) {
        const result = await BarcodeScanner.startScan();

        if (result.hasContent) {
          const userId = result.content
          let navigationExtras: NavigationExtras = {
            queryParams:{
              userId: userId
            },
            state: {
              redirected: true
            }
          };
          this.navCtrl.navigateForward(['/tabs/instant-transfer'], navigationExtras);
          BarcodeScanner.stopScan();
          
        }
      }
    } else {
      BarcodeScanner.stopScan();
    }
  }

  async checkPermission(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (status.granted) {
        resolve(true)
      } else if (status.denied) {
        const btn: AlertButton = {
          text: 'Open Settings',
          cssClass: 'danger',
          handler: () => {
            BarcodeScanner.openAppSettings();
          }
        };
        this.component.alertMessage('Permission Denied', 'You denied access to your camera. To scan the Attendance Code, you will need to grant access to camera.', 'danger', 'Cancel', btn);

      } else {
        resolve(false);
      }
    });
  }

  ionViewWillLeave(){
    // stop scan mode
    if (this.isCapacitor && this.scan) {
      this.swapMode();
    }
  }

}
