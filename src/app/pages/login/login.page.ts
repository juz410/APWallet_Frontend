import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CasService } from 'src/app/services/cas.service';
import { WsApiService } from 'src/app/services/ws-api.service';
import { ModalController } from '@ionic/angular';
import { RegistrationPage } from '../registration/registration.page';
import { ComponentService } from 'src/app/services/component.service';
import { Storage } from '@ionic/storage-angular';
import { FormGroup, FormBuilder,Validator, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm:FormGroup;
  url: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cas: CasService,
    private ws: WsApiService,
    private modalCtrl: ModalController,
    private component: ComponentService,
    private storage: Storage,
    private fb:FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
        this.storage.get('publicKey').then(
      resp => {
        if(!resp){
          this.http.get<any>(`${environment.url}/key/public-key`).subscribe(
            resp => {
              this.storage.set('publicKey', resp.public_key);
            }
          )
        }
      }
    )
    this.url = this.route.snapshot.queryParams['redirect'] || '/';
    this.loginForm = this.fb.group({
      username:['',[Validators.required]],
      password:['',[Validators.required]]
    });
  }

  login() {

    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    this.cas.getTGT(username, password).subscribe(resp => {

      this.ws.get<any>('/user/').subscribe(
        resp => {
          this.storage.set('user', resp);
          this.router.navigateByUrl(this.url, { replaceUrl: true });

        }, error => {
          console.log(error.error);
          if (error.error.detail === "User not found") {
            this.createRegister()
          } else {
            this.component.toastMessage(error.error.detail, 'danger');
          }
        }
      )
    }, error => {
      this.component.toastMessage('Invalid username or password', 'danger');
    }
    )
  }

  async createRegister() {
    const modal = await this.modalCtrl.create({
      component: RegistrationPage,
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.completed) {
      this.router.navigateByUrl(this.url, { replaceUrl: true });
    }else{
      this.storage.remove('tgt')
      this.storage.remove('cred')
    }
  }

  canDone(){
    return this.loginForm.valid;
  }

}
