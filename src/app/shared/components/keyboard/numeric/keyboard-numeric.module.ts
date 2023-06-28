import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { KeyboardNumericComponent } from './keyboard-numeric.component';
import { ButtonModule } from '../../button/button.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [KeyboardNumericComponent],
  imports: [
    CommonModule,
    ButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [KeyboardNumericComponent],
})
export class KeyboardNumericModule {}
