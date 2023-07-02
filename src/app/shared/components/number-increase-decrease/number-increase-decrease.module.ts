import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { NumberIncreaseDecreaseComponent } from './number-increase-decrease.component';
import { IconsModule } from '../../modules/icons/icons.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [NumberIncreaseDecreaseComponent],
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    IconsModule,
  ],
  exports: [NumberIncreaseDecreaseComponent],
})
export class NumberIncreaseDecreaseModule {}
