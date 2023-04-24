import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CasService } from 'src/app/services/cas.service';
import { WsApiService } from 'src/app/services/ws-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string;
  password: string;
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private cas: CasService,
    private ws: WsApiService
    ) { }

  ngOnInit() {
  }

  login() {
    console.log(this.username, this.password)
    const url = this.route.snapshot.queryParams['redirect'] || '/';
    // this.router.navigateByUrl(url, {replaceUrl: true});
    this.cas.getTGT(this.username,this.password).subscribe( resp => {

      this.ws.get<any>('/user/').subscribe(
        resp => {

        }, error => {
          console.log(error.error);
          if(error.error.detail==="User not found"){

          }
        }
      )
      // this.router.navigateByUrl(url, {replaceUrl: true});
    })
  }

}
