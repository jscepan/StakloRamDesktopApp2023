import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { KeyboardAlphabetComponent } from './keyboard-alphabet.component';
import { ButtonModule } from '../../button/button.module';

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
