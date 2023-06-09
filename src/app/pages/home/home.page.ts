import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { WsApiService } from 'src/app/services/ws-api.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user$: Observable<User>;
  user: User;
  transactions: any = []
  transactions$: Observable<any>;
  isCapacitor: boolean;


  constructor(
    private ws: WsApiService,
    private router: Router,
    private storage: Storage,
    public plt: Platform,

  ) { }

  ionViewWillEnter(){
    this.user = null;
    this.user$ = this.ws.get<User>(`/user/`)
    this.user$.subscribe(
      user => {
        this.user = user
        this.storage.set('user', user);

      }
    )
    this.transactions$ = this.ws.get<any>(`/transaction/user`)
  }

  refresh(refresher?){
    this.ionViewWillEnter();
    if(refresher){
      refresher.target.complete();
    }
  }

  ngOnInit() {
    this.isCapacitor = this.plt.is('capacitor');
    
  }

  topupPage(){
    this.router.navigateByUrl('/tabs/top-up')
  }

  transferPage(){
    this.router.navigateByUrl('/tabs/instant-transfer')
  }

  transactionHistory(){
    this.router.navigateByUrl('/tabs/transactions-history')
  }

  qrPage(){
    this.router.navigateByUrl('/tabs/qr-code')
  }

  scanQRPage(){
    this.router.navigateByUrl('/tabs/scan-qr')
  }

}
