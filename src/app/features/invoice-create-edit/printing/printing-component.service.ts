import { Injectable } from '@angular/core';
import { InvoiceModel } from 'src/app/shared/models/invoice-model';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrintingComponent } from './printing.component';

@Injectable()
export class PrintingService {
  private subs = new SubscriptionManager();

  constructor(private _matDialog: MatDialog) {}

  print(invoice: InvoiceModel): void {
      const config: MatDialogConfig = new MatDialogConfig();
      config.data = {
        invoice,
      };

      this.subs.sink.$openSelectPopup = this._matDialog
        .open(PrintingComponent, config)
        .afterClosed()
        .subscribe(
          (invoice: InvoiceModel) => {
            console.log(invoice);
          },
        );
  }
}
