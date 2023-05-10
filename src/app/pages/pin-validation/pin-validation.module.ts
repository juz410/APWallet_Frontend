import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PinValidationPageRoutingModule } from './pin-validation-routing.module';

import { PinValidationPage } from './pin-validation.page';
import { CodeInputModule } from 'angular-code-input';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PinValidationPageRoutingModule,
    CodeInputModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
  declarations: [PinValidationPage]
})
export class PinValidationPageModule {}
