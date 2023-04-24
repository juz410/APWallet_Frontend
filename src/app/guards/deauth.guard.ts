import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CasService } from '../services/cas.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DeauthGuard implements CanActivate {

  constructor(
    private cas: CasService,
    private router: Router
  ) { }

  async canActivate(): Promise<boolean | UrlTree> {
    if (await this.cas.isAuthenticated()) {
      return this.router.createUrlTree(['/']);
    }
    return true;
  }
  
}
