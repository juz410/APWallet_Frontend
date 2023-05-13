import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminTransactionsHistoryPage } from './admin-transactions-history.page';

const routes: Routes = [
  {
    path: '',
    component: AdminTransactionsHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTransactionsHistoryPageRoutingModule {}
