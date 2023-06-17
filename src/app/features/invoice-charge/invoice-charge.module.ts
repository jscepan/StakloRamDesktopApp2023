import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceChargeComponent } from './invoice-charge.component';
import { InvoiceChargeRoutingModule } from './invoice-charge-routing.module';

@NgModule({
  declarations: [InvoiceChargeComponent],
  imports: [CommonModule, InvoiceChargeRoutingModule],
  exports: [InvoiceChargeComponent],
})
export class InvoiceChargeModule {}
