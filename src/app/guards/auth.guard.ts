import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CasService } from '../services/cas.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private cas: CasService,
    private storage: Storage,
    private router: Router,
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<UrlTree | boolean> {
    // authentication
    if (!await this.cas.isAuthenticated()) {
      // does not need to redirect on first login and for logout page
      return route.url.toString() === 'tabs' || route.url.toString() === 'logout'
        ? this.router.createUrlTree(['/login'])
        : this.router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
    }

    // authorization
    // const role = await this.storage.get('role');
    // // tslint:disable-next-line:no-bitwise
    // if (route.data.role && !(route.data.role & role)) {
    //   return this.router.createUrlTree([role ? '/unauthorized' : '/logout']);
    // }

    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<UrlTree | boolean> {
    return this.canActivate(route, state);
  }
  
}
