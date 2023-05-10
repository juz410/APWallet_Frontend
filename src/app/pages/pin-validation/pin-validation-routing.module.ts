import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PinValidationPage } from './pin-validation.page';

const routes: Routes = [
  {
    path: '',
    component: PinValidationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PinValidationPageRoutingModule {}
