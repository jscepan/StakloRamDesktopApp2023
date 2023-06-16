import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InvoiceItemModel } from '../../models/invoice-item.model';
import { InvoiceModel } from '../../models/invoice-model';

@Injectable({ providedIn: 'root' })
export class DraftInvoicesService {
  private $draftInvoices: BehaviorSubject<InvoiceModel[]> = new BehaviorSubject<
    InvoiceModel[]
  >([]);
  public readonly draftInvoices: Observable<InvoiceModel[]> =
    this.$draftInvoices.asObservable();
  private invoiceCounter: number = 0;
  private invoiceItemsCounter: number = 0;

  constructor() {}

  clearDraftInvoices(): void {
    this.invoiceCounter = 0;
    this.invoiceItemsCounter = 0;
    this.$draftInvoices.next([]);
  }

  addNewInvoiceItem(
    invoiceItem: InvoiceItemModel,
    invoiceOid?: string
  ): string {
    const currentInvoices: InvoiceModel[] = this.$draftInvoices.getValue();
    this.invoiceItemsCounter++;
    invoiceItem.oid = 'draft' + this.invoiceItemsCounter;
    if (invoiceOid) {
      let x = currentInvoices.map((i) => {
        if (i.oid === invoiceOid) {
          i.invoiceItems.push(invoiceItem);
          return i;
        } else {
          return i;
        }
      });

      this.$draftInvoices.next(x);
      return invoiceOid;
    } else {
      this.invoiceCounter++;
      let newInvoice = new InvoiceModel();
      newInvoice.oid = 'draft' + this.invoiceCounter;
      newInvoice.invoiceItems.push(invoiceItem);
      currentInvoices.push(newInvoice);
      this.$draftInvoices.next(currentInvoices);
      return newInvoice.oid;
    }
  }

  editDraftInvoiceItem(
    invoiceOid: string,
    invoiceItem: InvoiceItemModel
  ): void {
    if (invoiceOid) {
      const items: InvoiceModel[] = this.$draftInvoices.getValue();
      let x = items.map((i) => {
        if (i.oid === invoiceOid) {
          i.invoiceItems.map((ii) => {
            if (ii.oid === invoiceItem.oid) {
              return invoiceItem;
            } else {
              return ii;
            }
          });
          return i;
        } else {
          return i;
        }
      });

      this.$draftInvoices.next(x);
    }
  }

  removeDraftInvoiceItem(invoiceOid: string, invoiceItemOid: string): void {
    const items: InvoiceModel[] = this.$draftInvoices.getValue();
    const x = items.map((i) => {
      if (i.oid === invoiceOid) {
        i.invoiceItems = i.invoiceItems.filter(
          (ii) => ii.oid !== invoiceItemOid
        );
        return i;
      } else {
        return i;
      }
    });
    this.$draftInvoices.next(x);
  }

  removeDraftInvoice(invoiceOid: string): void {
    const items: InvoiceModel[] = this.$draftInvoices.getValue();
    items.filter((i) => i.oid !== invoiceOid);
    this.$draftInvoices.next(items.filter((i) => i.oid !== invoiceOid));
  }
}
