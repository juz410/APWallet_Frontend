import { Component, OnInit } from '@angular/core';
import { Card, User } from 'src/app/interfaces/user';
import { WsApiService } from 'src/app/services/ws-api.service';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import { NavController, LoadingController } from '@ionic/angular';
import { banks, Bank } from 'src/app/interfaces/bank';
import { ComponentService } from 'src/app/services/component.service';


@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.page.html',
  styleUrls: ['./top-up.page.scss'],
})
export class TopUpPage implements OnInit {

  user: User;
  topupMethod: string = 'card';
  amount: number = 10
  cards$: Observable<Card[]>;
  banks: Bank [] = banks;
  isLoading: boolean = false;



  constructor(
    private storage: Storage,
    private ws: WsApiService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private component: ComponentService
  ) { }

  ionViewWillEnter(){
    this.cards$ = this.ws.get<Card[]>(`/card/`)
    this.storage.get('user').then(
      user => {
        this.user = user
      }
    )

  }

  ngOnInit() {


  }

  onSegmentChanged(event) {
    this.topupMethod = event.detail.value;
  }

  async topupCard(card){
    const loading = await this.loadingCtrl.create({
      message: 'Topping Up....',
      spinner: 'bubbles',
    });
    await loading.present();
    const cardID = card.card_id
    const body = {
      'amount' : this.amount,
      'transaction_method': 'card_topup',
      'card_id' : cardID
    }

    this.ws.post<any>(`/transaction/`, {body: body}).subscribe(
      resp => {
        loading.dismiss()
        this.component.toastMessage('Top Up Successfull!', 'success')

        this.user.balance += this.amount
        this.storage.set('user', this.user);
        this.amount = 10

      },
      err => {
        this.component.toastMessage(err, 'danger')
      }
    )
  }

  async topupBank(bank){
    const loading = await this.loadingCtrl.create({
      message: 'Topping Up....',
      spinner: 'bubbles',
    });
    await loading.present();
    const body = {
      'amount' : this.amount,
      'transaction_method': 'online_banking',
    }

    this.ws.post<any>(`/transaction/`, {body : body}).subscribe(
      resp => {
        loading.dismiss()
        this.component.toastMessage(`Top Up Successful with ${bank.name}!`, 'success')
        
        this.user.balance += this.amount
        this.storage.set('user', this.user);
        this.amount = 10

      },
      err => {
        this.component.toastMessage(err, 'danger')
      }
    )

  }

  addNewCard(){
    this.navCtrl.navigateForward('/tabs/card/add-new-card')
  }

}
