import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionsHistoryPage } from './transactions-history.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionsHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsHistoryPageRoutingModule {}
