import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard} from './guards/auth.guard';
import { DeauthGuard} from './guards/deauth.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    canActivate: [DeauthGuard],
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'card',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/card/card.module').then( m => m.CardPageModule)
  },
  {
    path: 'top-up',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/top-up/top-up.module').then( m => m.TopUpPageModule)
  },
  {
    path: 'transactions-history',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/transactions-history/transactions-history.module').then( m => m.TransactionsHistoryPageModule)
  },
  {
    path: 'instant-transfer',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/instant-transfer/instant-transfer.module').then( m => m.InstantTransferPageModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
