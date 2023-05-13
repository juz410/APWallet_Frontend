import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WsApiService } from 'src/app/services/ws-api.service';
import { Observable, map } from 'rxjs';
import { StaffProfile, StudentPhoto, User } from 'src/app/interfaces/user';
import { Storage } from '@ionic/storage-angular';
import { CasService } from 'src/app/services/cas.service';
import { ComponentService } from 'src/app/services/component.service';
import { AlertButton, ModalController, NavController } from '@ionic/angular';
import { ResetPinPage } from '../reset-pin/reset-pin.page';
import { AdminTransactionsHistoryPage } from '../admin-transactions-history/admin-transactions-history.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  pictureUrl = environment.pictureUrl;
  photo$: Observable<string>;
  user: User
  staffProfile$: Observable<any>;

  constructor(
    private ws: WsApiService,
    private storage: Storage,
    private cas: CasService,
    private component: ComponentService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getPhoto();
  }

  async getPhoto() {
    this.user = await this.storage.get('user');
    console.log(this.user)
    if (this.user.role === 'student') {
      console.log("TEST")
      this.photo$ = this.ws.get<StudentPhoto>('/student/photo', { url: this.pictureUrl })
        .pipe(map(image => image.base64_photo = `data:image/jpg;base64,${image?.base64_photo}`));
    } else {
      this.staffProfile$ = this.ws.get<StaffProfile>('/staff/profile', { url: this.pictureUrl })
    }
  }

  resetPIN() {
    const btn: AlertButton = {
      text: 'Confirm',
      cssClass: 'danger',
      handler: () => {
        this.resetPinDialog()
      }
    };

    this.component.alertMessage('Warning', 'Are you sure you want to rest your PIN?', 'danger', 'Cancel', btn);

  }

  async adminTransactionsDialog(){
    const modal = await this.modalCtrl.create({
      component: AdminTransactionsHistoryPage ,
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });
    await modal.present();
  }

  async resetPinDialog(){
    const modal = await this.modalCtrl.create({
      component: ResetPinPage ,
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });
    await modal.present();
  }

  logoutConfirm() {
    const btn: AlertButton = {
      text: 'Logout',
      cssClass: 'danger',
      handler: () => {
        this.logout()
      }
    };

    this.component.alertMessage('Warning', 'Are you sure you want to log out?', 'danger', 'Cancel', btn);
  }

  logout() {
    this.cas.deleteTGT().subscribe(resp => {
      this.storage.clear();
      this.component.toastMessage("Logout Successful", "success")
      this.navCtrl.navigateRoot('/login', { replaceUrl: true });
    })
  }

}
