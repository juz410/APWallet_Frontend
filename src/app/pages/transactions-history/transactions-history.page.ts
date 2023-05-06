import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { Storage } from '@ionic/storage-angular';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { WsApiService } from 'src/app/services/ws-api.service';


@Component({
  selector: 'app-transactions-history',
  templateUrl: './transactions-history.page.html',
  styleUrls: ['./transactions-history.page.scss'],
})
export class TransactionsHistoryPage implements OnInit {

  user: User;
  currentPage = 0;
  transactions: any = []
  transactions$: Observable<any>;
  isLast: boolean = false;

  constructor(
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private ws: WsApiService,

  ) { }

  ionViewWillEnter(){
    this.storage.get('user').then(
      user => {
        this.user = user
      }
    )
    this.loadTransactions();
  }

  ngOnInit() {
  }

  private async loadTransactions() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });
    await loading.present();
    this.transactions$ = this.ws.get<any>(`/transaction/user?page=${this.currentPage}`)
    this.transactions$.subscribe(resp => {
      loading.dismiss();
      if (resp.length === 0) {
        this.isLast = true;
      }
      this.transactions.push(...resp);

    })

  };

  onIonInfinite(event) {
    this.currentPage += 1;
    this.loadTransactions();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

}
