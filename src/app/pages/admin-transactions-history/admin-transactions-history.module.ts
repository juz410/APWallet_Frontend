import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminTransactionsHistoryPageRoutingModule } from './admin-transactions-history-routing.module';

import { AdminTransactionsHistoryPage } from './admin-transactions-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminTransactionsHistoryPageRoutingModule
  ],
  declarations: [AdminTransactionsHistoryPage]
})
export class AdminTransactionsHistoryPageModule {}
