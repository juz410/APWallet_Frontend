import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private http: HttpClient
  ) {
    this.storage.create();
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
  }
}
