import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableShow } from 'src/app/shared/components/table-show/table-show.component';
import { InvoiceModel } from 'src/app/shared/models/invoice-model';
import { DraftInvoicesService } from 'src/app/shared/services/data-store-services/draft-invoice-items-store.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import {
  getDisplayNumberAsString,
  getFormatedDateAndTime,
} from 'src/app/shared/utils';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  providers: [],
})
export class InvoicesComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  invoices!: TableShow;

  constructor(
    private route: Router,
    private draftInvoicesStoreService: DraftInvoicesService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.draftInvoicesStoreService.draftInvoices.subscribe(
      (invoices) => {
        if (invoices) {
          this.invoices = this.mapDataToTableShow(invoices.reverse());
        }
      }
    );
  }

  mapDataToTableShow(invoices: InvoiceModel[]): TableShow {
    let table: TableShow = {
      header: [
        this.translateService.instant('code'),
        this.translateService.instant('date'),
        this.translateService.instant('advancePayment'),
        this.translateService.instant('buyerName'),
      ],
      rowData: [],
    };
    invoices.forEach((entity) => {
      table.rowData.push({
        data: [
          entity.oid,
          getFormatedDateAndTime(entity.createDate),
          getDisplayNumberAsString(entity.advancePayment),
          entity.buyerName ?? '',
        ],
        isDeleted: false,
      });
    });
    return table;
  }

  editInvoice(oid: string): void {
    this.route.navigate(['invoice-create-edit', 'edit', oid]);
  }

  deleteInvoice(oid: string): void {
    this.draftInvoicesStoreService.removeDraftInvoice(oid);
  }

  cancel(): void {
    this.route.navigate(['/']);
  }

  clear(): void {
    this.draftInvoicesStoreService.clearDraftInvoices();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
