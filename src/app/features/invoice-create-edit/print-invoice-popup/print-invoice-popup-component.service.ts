import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscriber } from 'rxjs';
import { InvoiceModel } from 'src/app/shared/models/invoice-model';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { PrintInvoicePopupComponent } from './print-invoice-popup.component';

@Injectable()
export class PrintInvoicePopupService {
  private subs = new SubscriptionManager();

  constructor(private _matDialog: MatDialog) {}

  openDialog(invoice: InvoiceModel): Observable<InvoiceModel> {
    return new Observable((observer: Subscriber<InvoiceModel>) => {
      const config: MatDialogConfig = new MatDialogConfig();
      config.width = '80%';
      config.height = '80%';
      config.data = {
        invoice,
      };

      this.subs.sink.$openSelectPopup = this._matDialog
        .open(PrintInvoicePopupComponent, config)
        .afterClosed()
        .subscribe(
          (invoice: InvoiceModel) => {
            observer.next(invoice);
            observer.complete();
          },
          () => observer.error()
        );
    });
  }
}
