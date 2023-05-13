import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPinPageRoutingModule } from './reset-pin-routing.module';

import { ResetPinPage } from './reset-pin.page';
import { CodeInputModule } from 'angular-code-input';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPinPageRoutingModule,
    CodeInputModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
  declarations: [ResetPinPage]
})
export class ResetPinPageModule {}
