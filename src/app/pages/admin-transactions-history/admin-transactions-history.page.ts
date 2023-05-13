import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonContent, LoadingController, ModalController } from '@ionic/angular';
import { Observable, filter } from 'rxjs';
import { WsApiService } from 'src/app/services/ws-api.service';
import { Storage } from '@ionic/storage-angular';
import { ComponentService } from 'src/app/services/component.service';

@Component({
  selector: 'app-admin-transactions-history',
  templateUrl: './admin-transactions-history.page.html',
  styleUrls: ['./admin-transactions-history.page.scss'],
})
export class AdminTransactionsHistoryPage implements OnInit {
  @ViewChild(IonContent) ionContent: IonContent;

  senderID: string = ''
  receiverID: string = ''
  transactionMethod: string = '';

  paraSenderID: string = ''
  paraReceiverID: string = ''
  paraTransactionMethod: string = ''
  currentPage = 0;
  isLast: boolean = false;

  transactions$: Observable<any>;
  transactions: any = []

  transactionMethodsOptions= [
    {
      name: 'Instant Transfer',
      value: 'instant_transfer'
    },
    {
      name: 'Online Banking',
      value: 'online_banking'
    },
    {
      name: 'Card Topup',
      value: 'card_topup'
    }
  ]

  
  constructor(
    private loadingCtrl: LoadingController,
    private ws: WsApiService,
    private component: ComponentService,
    private modalCtrl: ModalController,

  ) { }

  ionViewWillEnter(){
    this.isLast = false;
    this.currentPage = 0;
    this.transactions = [];
    this.loadTransactions();
  }

  async loadTransactions(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });
    await loading.present();

    this.transactions$ = this.ws.get<any[]>(`/transaction/?page=${this.currentPage}&sender_id=${this.paraSenderID}&receiver_id=${this.paraReceiverID}&transaction_method=${this.paraTransactionMethod}`)
    this.transactions$.subscribe(resp => {
      loading.dismiss();
      if (resp.length === 0) {
        this.isLast = true;
      }else{
        this.transactions.push(...resp);
      }
      this.scrollToBottom()
    },
     error => {
      this.transactions = []
      this.component.toastMessage(error.error.detail, 'danger');
      this.isLast = true;
      loading.dismiss();


     }
    )
  }

  onIonInfinite(event) {
    this.currentPage += 1;
    this.loadTransactions();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  ngOnInit() {
  }

  filter(){
    this.isLast = false;
    this.transactions = [];
    this.currentPage = 0;
    this.paraReceiverID = this.receiverID
    this.paraSenderID = this.senderID
    this.paraTransactionMethod = this.transactionMethod
    this.loadTransactions();
    

  }

  clearFilter(){
    this.receiverID = '';
    this.senderID = '';
    this.transactionMethod = '';
    this.filter();

  }

  scrollToBottom() {
    this.ionContent.scrollToBottom(300);
  }

  dismiss(){
    this.modalCtrl.dismiss({ completed: true });
  }
  

}
