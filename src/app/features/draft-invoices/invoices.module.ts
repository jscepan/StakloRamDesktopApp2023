import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { TableShowModule } from 'src/app/shared/components/table-show/table-show.module';

@NgModule({
  declarations: [InvoicesComponent],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    ButtonModule,
    TranslateModule,
    TableShowModule,
  ],
  exports: [InvoicesComponent],
})
export class InvoicesModule {}
