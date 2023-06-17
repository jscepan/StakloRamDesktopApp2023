import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceChargeComponent } from './invoice-charge.component';

const routes: Routes = [
  { path: ':invoiceOid', component: InvoiceChargeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceChargeRoutingModule {}
