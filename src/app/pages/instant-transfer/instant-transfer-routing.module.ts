import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstantTransferPage } from './instant-transfer.page';

const routes: Routes = [
  {
    path: '',
    component: InstantTransferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstantTransferPageRoutingModule {}
