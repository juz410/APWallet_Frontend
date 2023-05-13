import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    children: [
      {
        path: 'reset-pin',
        canActivate: [AuthGuard],
        loadChildren: () => import('../reset-pin/reset-pin.module').then( m => m.ResetPinPageModule)
      },
      {
        path: 'admin-transactions-history',
        canActivate: [AuthGuard],
        loadChildren: () => import('../admin-transactions-history/admin-transactions-history.module').then( m => m.AdminTransactionsHistoryPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
