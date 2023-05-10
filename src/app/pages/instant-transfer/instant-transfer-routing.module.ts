import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstantTransferPage } from './instant-transfer.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: InstantTransferPage,
    children: [
      {
        path: 'pin-validation',
        canActivate: [AuthGuard],
        loadChildren: () => import('../pin-validation/pin-validation.module').then( m => m.PinValidationPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstantTransferPageRoutingModule {}
