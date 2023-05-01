import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { WsApiService } from 'src/app/services/ws-api.service';
import { Router } from '@angular/router';

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


  constructor(
    private ws: WsApiService,
    private router: Router
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

  topupPage(){
    this.router.navigateByUrl('/top-up')
  }

  transferPage(){
    this.router.navigateByUrl('/instant-transfer')
  }

  qrPage(){
    // this.router.navigateByUrl('/qr')
  }

}
