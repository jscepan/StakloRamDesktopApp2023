import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicePrintedComponent } from './invoice-printed.component';
import { FramingDescriptionModule } from 'src/app/shared/components/framing-description/framing-description.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [InvoicePrintedComponent],
  imports: [
    CommonModule,
    FramingDescriptionModule,
    NgxBarcodeModule,
    TranslateModule,
  ],
  exports: [InvoicePrintedComponent],
})
export class InvoicePrintedModule {}
