/* tslint:disable:no-shadowed-variable */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, forkJoin, from, mergeMap, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ComponentService } from './component.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';



@Injectable({
  providedIn: 'root'
})
export class CasService {

  casUrl: string = 'https://cas.apiit.edu.my'

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private component: ComponentService,
  ) { }

  async isAuthenticated(): Promise<boolean> {
    console.log("AAA")
    return this.storage.get('tgt').then(tgt => !!tgt);
  }
  
  getTGT(username?: string, password?: string): Observable<string> {
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      observe: 'response' as 'body',
    };
    return (username && password
      ? of(new HttpParams().set('username', username).set('password', password).toString())
      : from(this.storage.get('cred'))
    ).pipe(
      switchMap(data => this.http.post(this.casUrl + '/cas/v1/tickets', data, options).pipe(
        catchError(res => res.status === 201 && res.headers.get('Location')
          ? of(res.headers.get('Location').split('/').pop())
          : username && password
            ? throwError(() => new Error(res))
            : ( console.log(res),EMPTY)),
        tap(tgt => {
          // Resolve both Promises
          console.log(tgt)
          Promise.all([this.storage.set('tgt', tgt), this.storage.set('cred', data)]);
        })
      ))
    );
  }


  getST(serviceUrl: string = this.casUrl, tgt?: string | {}): Observable<string> {
    console.log(serviceUrl)
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      params: { service: serviceUrl },
      responseType: 'text' as 'text', /* TODO: fix this in future angular */
      withCredentials: true,
    };

    return from(Network.getStatus()).pipe(
      switchMap(res => {
        if (!res.connected) {
          this.component.toastMessage('External links cannot be opened in offline mode. Please ensure you have a network connection and try again.', 'danger');
          return of('No Network');
        }

        return (tgt ? of(tgt) : from(this.storage.get('tgt'))).pipe(
          switchMap(tgt => this.http.post(`${this.casUrl}/cas/v1/tickets/${tgt}`, null, options))
        );
      })
    );
  }

  deleteTGT(tgt?: string): Observable<string> {
    const options = {
      responseType: 'text' as 'text',
      withCredentials: true,
    };
    return (tgt ? of(tgt) : from(this.storage.get('tgt'))).pipe(
      switchMap(tgt => this.http.delete(this.casUrl + '/cas/v1/tickets/' + tgt, options)),
    );
  }

  // validate(st?: string): Observable<Role> {
  //   const options = {
  //     headers: { 'Content-type': 'application/x-www-form-urlencoded' },
  //     params: { format: 'json', service: this.casUrl, ticket: st },
  //     withCredentials: true,
  //   };

  //   return this.http.get<any>(this.casUrl + '/cas/p3/serviceValidate', options).pipe(
  //     switchMap(res => {
  //       const parts = res.serviceResponse.authenticationSuccess.attributes.distinguishedName
  //         .join().toLowerCase().split(',');
  //       let role: Role = 0;
  //       let canAccessResults = false;
  //       let canAccessPayslipFileSearch = false;

  //       if (parts.indexOf('ou=students') !== -1) {
  //         role |= Role.Student;
  //       }
  //       if (parts.indexOf('ou=academic') !== -1) {
  //         role |= Role.Lecturer;
  //       }
  //       if (parts.indexOf('ou=apiit tpm') !== -1) {
  //         role |= Role.Admin;
  //       }
  //       if (!role) {
  //         this.storage.clear();
  //         return throwError(() => new Error('Group not supported'));
  //       }

  //       if (res.serviceResponse.authenticationSuccess.attributes.memberOf) { // some users do not have memberOf attribute
  //         const memberOf = res.serviceResponse.authenticationSuccess.attributes.memberOf
  //           .join().toLowerCase().split(',');

  //         // const distinguishedName = res.serviceResponse.authenticationSuccess.attributes.distinguishedName
  //         //   .join().toLowerCase().split(',');

  //         canAccessResults = memberOf.includes('cn=gims_web_result'.toLowerCase());
  //         canAccessPayslipFileSearch = memberOf.includes('cn=ACL_EPAYSLIP_ADMIN'.toLowerCase());
  //       }

  //       // make sure storage tasks are done before returning
  //       return forkJoin([
  //         from(this.storage.set('role', role)),
  //         from(this.storage.set('canAccessResults', canAccessResults)),
  //         from(this.storage.set('canAccessPayslipFileSearch', canAccessPayslipFileSearch))
  //       ]).pipe(mergeMap(() => of(role)));
  //     }),
  //   );
  // }
}
