import { Injectable } from '@angular/core';
import { AlertButton, AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }


  async alertMessage(header: string, message: string, cssClass: 'danger' | 'success', cancelText?: string, button?: AlertButton) {
    // How class name is named in native-elements.scss
    const formattedCssClass = `${cssClass}-alert`;
    // Add Cancel as Default button
    const buttons: AlertButton[] = [{
      text: cancelText ? cancelText : 'Dismiss',
      role: 'cancel',
      cssClass: 'cancel'
    }];

    if (button) {
      buttons.push(button);
    }

    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons,
      cssClass: formattedCssClass,
    });
    await alert.present();
  }

  async toastMessage(message: string, color: 'success' | 'warning' | 'danger' | 'medium') {
    const toast = await this.toastCtrl.create({
      message,
      color,
      position: 'top',
      duration: 3000,
      animated: true,
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}
