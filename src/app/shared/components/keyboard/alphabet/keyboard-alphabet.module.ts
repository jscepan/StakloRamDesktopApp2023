import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { KeyboardAlphabetComponent } from './keyboard-alphabet.component';
import { ButtonModule } from '../../button/button.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    TranslateModule,
  ],
  exports: [KeyboardAlphabetComponent],
  declarations: [KeyboardAlphabetComponent],
})
export class KeyboardAlphabetModule {}
