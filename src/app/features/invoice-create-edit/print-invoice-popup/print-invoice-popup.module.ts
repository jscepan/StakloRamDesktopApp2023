import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { PrintInvoicePopupComponent } from '@features/invoice-create-edit/print-invoice-popup/print-invoice-popup.component';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [PrintInvoicePopupComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [PrintInvoicePopupComponent],
})
export class PrintInvoicePopupModule {}
