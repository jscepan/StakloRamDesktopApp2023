import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { KeyboardAlphabetComponentService } from 'src/app/shared/components/keyboard/alphabet/keyboard-alphabet.component.service';
import { KeyboardNumericComponentService } from 'src/app/shared/components/keyboard/numeric/keyboard-numeric.component.service';
import { TableShow } from 'src/app/shared/components/table-show/table-show.component';
import { NUMBER_OF_ITEMS_ON_PAGE, UOM } from 'src/app/shared/constants';
import { InvoiceModel } from 'src/app/shared/models/invoice-model';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { InvoiceWebService } from 'src/app/shared/services/web-services/invoice.web.service';
import {
  getDisplayNumberAsString,
  getFormatedDateAndTime,
} from 'src/app/shared/utils';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [
    InvoiceWebService,
    KeyboardAlphabetComponentService,
    KeyboardNumericComponentService,
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  private subs: SubscriptionManager = new SubscriptionManager();

  private invoices$: BehaviorSubject<InvoiceModel[]> = new BehaviorSubject<
    InvoiceModel[]
  >([]);

  invoices!: TableShow;
  totalInvoicesLength!: number;
  nextResultCounter: number = 0;

  // Filter data
  buyerName: string = '';
  dateFrom!: Date;
  dateTo!: Date;
  showPaidUnpaid: 'ALL' | 'PAID' | 'UNPAID' = 'ALL';
  ordering: 'ASC' | 'DESC' = 'DESC';
  advancePaymentFrom!: number;
  advancePaymentTo!: number;

  constructor(
    private router: Router,
    private webService: InvoiceWebService,
    private keyboardAlphabetComponentService: KeyboardAlphabetComponentService,
    private keyboardNumericComponentService: KeyboardNumericComponentService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.invoices$.asObservable().subscribe((invoices) => {
      let table: TableShow = {
        header: [
          this.translateService.instant('code'),
          this.translateService.instant('date'),
          this.translateService.instant('amount'),
          this.translateService.instant('advancePayment'),
          this.translateService.instant('restPayment'),
          this.translateService.instant('buyerName'),
        ],
        rowData: [],
      };
      invoices.forEach((entity) => {
        table.rowData.push({
          data: [
            entity.oid,
            getFormatedDateAndTime(entity.createDate),
            getDisplayNumberAsString(entity.amount),
            getDisplayNumberAsString(entity.advancePayment),
            getDisplayNumberAsString(entity.amount - entity.advancePayment),
            entity.buyerName ?? '',
          ],
          isDeleted: false,
        });
      });
      this.invoices = table;
    });
  }

  editInvoice(oid: string): void {
    this.router.navigate(['invoice-create-edit', 'edit', oid]);
  }

  deleteInvoice(oid: string): void {
    // TODO
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  insertBuyerName(): void {
    this.subs.sink = this.keyboardAlphabetComponentService
      .openDialog(
        this.buyerName ?? '',
        this.translateService.instant('insertBuyerName')
      )
      .subscribe((value) => {
        console.log(value);
        if (value != undefined) {
          this.buyerName = value;
        }
      });
  }

  useFilter(): void {
    this.nextResultCounter = 0;
    this.subs.sink = this.webService
      .searchEntities(
        {
          buyerName: this.buyerName,
          dateFrom: this.dateFrom,
          dateTo: this.dateTo,
          advancePaymentFrom: this.advancePaymentFrom,
          advancePaymentTo: this.advancePaymentTo,
          ordering: this.ordering,
          showPaidUnpaid: this.showPaidUnpaid,
        },
        this.nextResultCounter,
        NUMBER_OF_ITEMS_ON_PAGE
      )
      .subscribe((invoices) => {
        this.invoices$.next(invoices.entities);
        this.totalInvoicesLength = invoices.totalCount;
        this.nextResultCounter += NUMBER_OF_ITEMS_ON_PAGE;
      });
  }

  bottomReachedHandler(): void {
    if (this.nextResultCounter < this.totalInvoicesLength) {
      this.subs.sink = this.webService
        .searchEntities(
          {
            buyerName: this.buyerName,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            advancePaymentFrom: this.advancePaymentFrom,
            advancePaymentTo: this.advancePaymentTo,
            ordering: this.ordering,
            showPaidUnpaid: this.showPaidUnpaid,
          },
          this.nextResultCounter,
          NUMBER_OF_ITEMS_ON_PAGE
        )
        .subscribe((invoices) => {
          this.invoices$.next([
            ...this.invoices$.getValue(),
            ...invoices.entities,
          ]);
          this.nextResultCounter += NUMBER_OF_ITEMS_ON_PAGE;
        });
    }
  }

  insertAdvancePayment(type: 'from' | 'to'): void {
    this.subs.sink = this.keyboardNumericComponentService
      .openDialog(
        this.translateService.instant('insertValue'),
        UOM.NUMBER,
        false,
        this.translateService.instant('insertValue'),
        (type === 'from' ? this.advancePaymentFrom : this.advancePaymentTo) ?? 0
      )
      .subscribe((data: { value: string; nextOperation: boolean }) => {
        if (data.value) {
          type === 'from'
            ? (this.advancePaymentFrom = +data.value)
            : (this.advancePaymentTo = +data.value);
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
