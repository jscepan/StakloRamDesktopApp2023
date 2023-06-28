import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicePrintedComponent } from './invoice-printed.component';
import { FramingDescriptionModule } from 'src/app/shared/components/framing-description/framing-description.module';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { CustomNumberPipeModule } from 'src/app/core/pipes/custom-number-pipe.module';

@NgModule({
  declarations: [InvoicePrintedComponent],
  imports: [
    CommonModule,
    FramingDescriptionModule,
    TranslateModule,
    QRCodeModule,
    CustomNumberPipeModule,
  ],
  exports: [InvoicePrintedComponent],
})
export class InvoicePrintedModule {}
