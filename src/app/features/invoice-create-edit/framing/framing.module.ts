import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FramingRoutingModule } from './framing-routing.module';
import { FramingComponent } from './framing.component';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [FramingComponent],
  imports: [
    CommonModule,
    FramingRoutingModule,
    MatStepperModule,
    ReactiveFormsModule,
    ButtonModule,
    TranslateModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  exports: [FramingComponent],
})
export class FramingModule {}
