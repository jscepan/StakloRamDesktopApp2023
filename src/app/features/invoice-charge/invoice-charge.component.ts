import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { InvoiceModel } from 'src/app/shared/models/invoice-model';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { InvoiceWebService } from 'src/app/shared/services/web-services/invoice.web.service';

@Component({
  selector: 'app-invoice-charge',
  templateUrl: './invoice-charge.component.html',
  styleUrls: ['./invoice-charge.component.scss'],
  providers: [],
})
export class InvoiceChargeComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  invoiceOid: string | undefined;
  invoice!: InvoiceModel;

  constructor(
    private route: Router,
    private _activeRoute: ActivatedRoute,
    private translateService: TranslateService,
    private webService: InvoiceWebService,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.invoiceOid =
      this._activeRoute.snapshot.paramMap.get('invoiceOid') ?? undefined;
    if (this.invoiceOid) {
      this.subs.sink = this.webService
        .getEntityByOid(this.invoiceOid)
        .subscribe((invoice) => {
          if (invoice) {
            this.invoice = invoice;
          } else {
            // this.globalService.showBasicAlert(MODE.error, this.translateService.instant('inputError'),'')
            this.route.navigate(['/']);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
