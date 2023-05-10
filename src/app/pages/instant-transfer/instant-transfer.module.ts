import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstantTransferPageRoutingModule } from './instant-transfer-routing.module';

import { InstantTransferPage } from './instant-transfer.page';
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstantTransferPageRoutingModule,
    ScrollingModule

  ],
  declarations: [InstantTransferPage]
})
export class InstantTransferPageModule {}
