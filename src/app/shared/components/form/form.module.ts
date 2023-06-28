import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { FormComponent } from './form.component';
import { KeyboardNumericModule } from '../keyboard/numeric/keyboard-numeric.module';
import { KeyboardAlphabetModule } from '../keyboard/alphabet/keyboard-alphabet.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    TranslateModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    TranslateModule,
    KeyboardAlphabetModule,
    KeyboardNumericModule,
  ],
  exports: [FormComponent],
  declarations: [FormComponent],
})
export class FormModule {}
