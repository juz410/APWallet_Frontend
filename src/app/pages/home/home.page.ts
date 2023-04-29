import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { WsApiService } from 'src/app/services/ws-api.service';

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


  // transactions = [{
  //   id: 1,
  //   transactionMethod: 'card_topup',
  //   amount: '100',
  //   date: '2020-01-01',
  //   receiver_id: 'appsteststaff1',
  //   card_last_4_digits: '1234',
  //   sender_id: null
  // }, {
  //   id: 2,
  //   transactionMethod: 'instant_transfer',
  //   amount: '50',
  //   date: '2020-01-02',
  //   receiver_id: 'TP061435',
  //   sender_id: 'appsteststaff1'
  // }, {
  //   id: 3,
  //   transactionMethod: 'online_banking_topup',
  //   amount: '100',
  //   date: '2020-01-03',
  //   receiver_id: 'appsteststaff1',
  //   sender_id: null
  // }
// ]

  constructor(
    private ws: WsApiService,
  ) { }

  ngOnInit() {
    this.user$ = this.ws.get<User>(`/user/`)
    this.user$.subscribe(
      user => {
        this.user = user
      }
    )
    this.transactions$ = this.ws.get<any>(`/transaction/user`)

  }

}
