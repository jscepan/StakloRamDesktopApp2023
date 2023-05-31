import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { KeyboardNumericComponent } from './keyboard-numeric.component';
import { ButtonModule } from '../../button/button.module';

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
  entryComponents: [KeyboardNumericComponent],
})
export class KeyboardNumericModule {}
