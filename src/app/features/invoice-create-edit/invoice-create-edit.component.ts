import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MODE } from 'src/app/shared/components/basic-alert/basic-alert.interface';
import { InvoiceItemModel } from 'src/app/shared/models/invoice-item.model';
import { InvoiceModel } from 'src/app/shared/models/invoice-model';
import { DraftInvoicesService } from 'src/app/shared/services/data-store-services/draft-invoice-items-store.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SettingsStoreService } from 'src/app/shared/services/settings-store.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { InvoiceWebService } from 'src/app/shared/services/web-services/invoice.web.service';
import { PrintInvoicePopupService } from './print-invoice-popup/print-invoice-popup-component.service';
import { Location } from '@angular/common';
import { SERVICE_TYPE } from 'src/app/shared/constants';

@Component({
  selector: 'app-invoice-create-edit',
  templateUrl: './invoice-create-edit.component.html',
  styleUrls: ['./invoice-create-edit.component.scss'],
  providers: [InvoiceWebService, PrintInvoicePopupService],
})
export class InvoiceCreateEditComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  componentMode: 'DRAFT' | 'EDIT' = 'DRAFT';
  currency: string = '';

  invoiceForm!: UntypedFormGroup;
  invoice: InvoiceModel = new InvoiceModel();

  constructor(
    private route: Router,
    private _activeRoute: ActivatedRoute,
    private draftInvoicesStoreService: DraftInvoicesService,
    private invoiceWebService: InvoiceWebService,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private printInvoicePopupComponentService: PrintInvoicePopupService,
    private location: Location,
    private appSettingsService: SettingsStoreService
  ) {}

  ngOnInit(): void {
    const oid = this._activeRoute.snapshot.paramMap.get('invoiceOid');

    this.componentMode = oid?.startsWith('draft') ? 'DRAFT' : 'EDIT';

    if (this.componentMode === 'DRAFT') {
      this.subs.sink = this.draftInvoicesStoreService.draftInvoices.subscribe(
        (invoices) => {
          const invoice = invoices.filter((i) => i.oid === oid)[0];
          if (invoice) {
            this.invoice = invoice;
            this.initializeForm();
            this.setInvoiceAmount();
          }
        }
      );
    } else {
      if (oid) {
        this.subs.sink = this.invoiceWebService.getEntityByOid(oid).subscribe(
          (invoice) => {
            if (invoice && invoice.oid) {
              this.invoice = invoice;
              this.initializeForm();
            }
          },
          () => {
            this.route.navigate(['/']);
          }
        );
      } else {
        this.route.navigate(['/']);
      }
    }

    this.subs.sink = this.appSettingsService.settings.subscribe((settings) => {
      this.currency = settings?.currencyDisplayValue ?? '';
    });
  }

  initializeForm(): void {}

  create(action: 'framing' | 'glassing'): void {
    if (this.invoice?.oid) {
      this.route.navigate([
        'invoice-create-edit',
        'edit',
        this.invoice.oid,
        action,
      ]);
    } else {
      this.route.navigate(['invoice-create-edit', action]);
    }
  }

  cancel(): void {
    this.location.back();
  }

  editInvoiceItem(invoiceItem: InvoiceItemModel): void {
    this.route.navigate([
      'invoice-create-edit',
      'edit',
      this.invoice.oid,
      'framing',
      'edit',
      invoiceItem.oid,
    ]);
  }

  deleteInvoiceItem(invoiceItem: InvoiceItemModel): void {
    this.draftInvoicesStoreService.removeDraftInvoiceItem(
      this.invoice.oid,
      invoiceItem.oid
    );
  }

  setInvoiceAmount(): void {
    let amount = 0;
    this.invoice.invoiceItems.forEach((item) => {
      amount += item.amount;
    });
    this.invoice.amount = amount;
  }

  saveChangesAndPrint(): void {
    this.subs.sink.printInvoice = this.printInvoicePopupComponentService
      .openDialog(this.invoice)
      .subscribe((invoice: InvoiceModel) => {
        if (invoice) {
          this.invoice.advancePayment = invoice.advancePayment;
          this.invoice.buyerName = invoice.buyerName ?? '';
          this.invoice.user = invoice.user;
          // TODO
          if (this.componentMode === 'DRAFT') {
            this.subs.sink = this.invoiceWebService
              .createEntity(this.invoice)
              .subscribe((invoice) => {
                if (invoice && invoice.oid) {
                  // TODO obrisi fakturu iz draft moda
                  this.draftInvoicesStoreService.removeDraftInvoice(
                    this.invoice.oid
                  );
                  this.invoice.oid = invoice.oid;
                  this.printInvoice();
                  this.globalService.showBasicAlert(
                    MODE.success,
                    this.translateService.instant('invoiceCreated'),
                    this.translateService.instant('invoiceSuccessfullyCreated')
                  );
                  this.route.navigate(['/']);
                }
              });
          } else {
            this.subs.sink = this.invoiceWebService
              .updateEntity(this.invoice)
              .subscribe((invoice) => {
                if (invoice) {
                  this.invoice.oid = invoice.oid;
                  // this.globalService.showBasicAlert(
                  //   MODE.success,
                  //   this.translateService.instant('invoiceUpdated'),
                  //   this.translateService.instant('invoiceSuccessfullyUpdated')
                  // );
                  this.printInvoice();
                }
              });
          }
        }
      });
  }

  getInvoiceItemHeader(item: InvoiceItemModel): string {
    let header = '';
    if (item.serviceType === SERVICE_TYPE.FRAMING) {
      if (item.mirror?.oid) {
        header += this.translateService.instant('mirror');
      } else {
        header += this.translateService.instant('picture');
      }
      header += `: ${item.dimensionsWidth} X ${item.dimensionsHeight} ${item.dimensionsUom}`;
    }

    return header;
  }

  printInvoice(): void {
    this.invoiceWebService.print(this.invoice).subscribe((printed) => {
      console.log('printedprintedprintedprinted');
      console.log(printed);
    });
  }

  printFiscalInvoice(): void {
    // TODO
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
