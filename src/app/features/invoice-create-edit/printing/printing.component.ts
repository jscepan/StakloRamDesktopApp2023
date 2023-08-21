import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MODE } from 'src/app/shared/components/basic-alert/basic-alert.interface';
import { InvoiceModel } from 'src/app/shared/models/invoice-model';
import { GlobalService } from 'src/app/shared/services/global.service';
import { InvoiceItemCalculatorService } from 'src/app/shared/services/invoice-item-amount-calculator.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { InvoicePrintModel, InvoiceWebService } from 'src/app/shared/services/web-services/invoice.web.service';

export interface DialogData {
  invoice: InvoiceModel;
}

@Component({
  selector: 'app-printing',
  templateUrl: './printing.component.html',
  styleUrls: ['./printing.component.scss'],
  providers: [InvoiceWebService, InvoiceItemCalculatorService],
})
export class PrintingComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  dataModel!: InvoiceModel;

  constructor(
    private dialogRef: MatDialogRef<PrintingComponent>,
    private invoiceWebService: InvoiceWebService,
    private invoiceItemCalculatorService: InvoiceItemCalculatorService,
    private globalService: GlobalService,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.dataModel = data.invoice;
  }

  ngOnInit(): void {
    console.log(this.dataModel);
    const invoice: InvoicePrintModel = {
      ...this.dataModel,
      placeholders: {
        invoiceNumber: this.translateService.instant('invoiceNumber'),
        buyer: this.translateService.instant('buyer'),
        createdBy: this.translateService.instant('createdBy'),
        date: this.translateService.instant('date'),
        total: this.translateService.instant('total'),
        advancePayment: this.translateService.instant('advancePayment'),
        restPayment: this.translateService.instant('restPayment'),
        thisIsNotFiscalReceipt: this.translateService.instant(
          'thisIsNotFiscalReceipt'
        ),
        cashRegisterReport: this.translateService.instant('cashRegisterReport'),
      },
      invoiceItems: this.dataModel.invoiceItems.map((ii) => {
        return {
          ...ii,
          header: this.invoiceItemCalculatorService.getInvoiceItemHeader(ii),
        };
      }),
      fiscalReceiptDescription:
        this.invoiceItemCalculatorService.getItemsDescription(
          this.dataModel.invoiceItems
        ),
    };
    this.invoiceWebService.print(invoice).subscribe((printed)=>{
      this.globalService.showBasicAlert(
        MODE.success,
        this.translateService.instant('invoicePrinted'),
        this.translateService.instant('invoiceSuccessfullyPrinted')
      );
      this.dialogRef.close();
    });
  }

  cancel(): void {
    // TODO
    this.dialogRef.close();
  }

  close(): void {
    // TODO
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
