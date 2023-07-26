import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  BARCODE_PREFIX,
  DateFormat,
  QRCodeErrorCorrectionLevel,
  SERVICE_TYPE,
  getDateFormatEnumByKey,
  getQRCodeErrorCorrectionLevelEnumByKey,
} from 'src/app/shared/constants';
import { InvoiceItemModel } from 'src/app/shared/models/invoice-item.model';
import { InvoiceModel } from 'src/app/shared/models/invoice-model';
import { InvoiceItemCalculatorService } from 'src/app/shared/services/invoice-item-amount-calculator.service';
import { SettingsStoreService } from 'src/app/shared/services/settings-store.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { TranslateService } from '@ngx-translate/core';
import { getDisplayNumberAsString } from 'src/app/shared/utils';

@Component({
  selector: 'app-invoice-printed',
  templateUrl: './invoice-printed.component.html',
  styleUrls: ['./invoice-printed.component.scss'],
  providers: [InvoiceItemCalculatorService],
})
export class InvoicePrintedComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private subs = new SubscriptionManager();
  prefix: string = BARCODE_PREFIX;

  @Input() dataModel!: InvoiceModel;
  invoicePrintWidth: number = 8;
  qrCodeSizeInPixel: number = 100;
  qrCodeErrorCorrectionLevel: QRCodeErrorCorrectionLevel =
    QRCodeErrorCorrectionLevel.EXTRALARGE_levelH;

  header: string = '';
  footer: string = '';
  currencyDisplay: string = '';

  dateFormat: DateFormat = DateFormat.DAY_MONTH_YEAR_CROSS;

  constructor(
    private settingsService: SettingsStoreService,
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private invoiceItemCalculatorService: InvoiceItemCalculatorService
  ) {}

  ngOnInit(): void {
    this.settingsService.settings.subscribe((settings) => {
      this.header = settings?.header ?? '';
      this.footer = settings?.footer ?? '';
      this.invoicePrintWidth = settings?.invoicePrintWidth ?? 8;
      this.currencyDisplay = settings?.currencyDisplayValue ?? '';
      this.qrCodeSizeInPixel = settings?.qrCodeSizeInPixel ?? 130;
      this.qrCodeErrorCorrectionLevel =
        getQRCodeErrorCorrectionLevelEnumByKey(
          settings?.qrCodeErrorCorrectionLevel
        ) ?? QRCodeErrorCorrectionLevel.EXTRALARGE_levelH;
      this.dateFormat =
        getDateFormatEnumByKey(settings?.dateFormat) ??
        DateFormat.DAY_MONTH_YEAR_CROSS;
    });
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  getQrCodeDataForInvoice(): string {
    return this.prefix + this.dataModel.oid;
  }

  getItemsDescription(items: InvoiceItemModel[]): string[] {
    return this.invoiceItemCalculatorService.getItemsDescription(items);
  }

  getInvoiceItemHeader(item: InvoiceItemModel): string {
    return this.invoiceItemCalculatorService.getInvoiceItemHeader(item);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
