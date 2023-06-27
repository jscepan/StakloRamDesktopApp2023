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
  QRCodeErrorCorrectionLevel,
  SERVICE_TYPE,
} from 'src/app/shared/constants';
import { InvoiceItemModel } from 'src/app/shared/models/invoice-item.model';
import { InvoiceModel } from 'src/app/shared/models/invoice-model';
import { InvoiceItemCalculatorService } from 'src/app/shared/services/invoice-item-amount-calculator.service';
import { SettingsStoreService } from 'src/app/shared/services/settings-store.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { TranslateService } from '@ngx-translate/core';

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
  qrCodeSizeInPixel: number = 100;
  qrCodeErrorCorrectionLevel: QRCodeErrorCorrectionLevel =
    QRCodeErrorCorrectionLevel.EXTRALARGE_levelH;

  header: string = '';
  footer: string = '';
  currencyDisplay: string = '';

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
      this.currencyDisplay = settings?.currencyDisplayValue ?? '';
      this.qrCodeSizeInPixel = settings?.qrCodeSizeInPixel ?? 130;
      this.qrCodeErrorCorrectionLevel =
        settings?.qrCodeErrorCorrectionLevel ??
        QRCodeErrorCorrectionLevel.EXTRALARGE_levelH;
    });
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  getQrCodeDataForInvoice(): string {
    return this.prefix + this.dataModel.oid;
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

  getItemsDescription(): string[] {
    let items: string[] = [];
    let num = 1;
    this.invoiceItemCalculatorService
      .getFramesLengthAmountForInvoiceItems(this.dataModel.invoiceItems)
      .forEach((item) => {
        if (item.amount && item.amount > 0) {
          items.push(
            num +
              ') ' +
              item.length +
              ' ' +
              item.uom +
              ' X ' +
              item.frame.cashRegisterNumber +
              ' (' +
              item.frame.name +
              ', ' +
              item.frame.code.substring(0, 2) +
              ')'
          );
          num++;
        }
      });
    this.invoiceItemCalculatorService
      .getPasspartuLengthForInvoiceItems(this.dataModel.invoiceItems)
      .forEach((item) => {
        if (item.amount && item.amount > 0) {
          items.push(
            num +
              ') ' +
              item.length +
              ' ' +
              item.uom +
              ' X ' +
              item.passpartuColor.passpartu.cashRegisterNumber +
              ' (' +
              item.passpartuColor.name +
              ')'
          );
          num++;
        }
      });
    this.invoiceItemCalculatorService
      .getGlassLengthForInvoiceItems(this.dataModel.invoiceItems)
      .forEach((item) => {
        if (item.amount && item.amount > 0) {
          items.push(
            num +
              ') ' +
              item.length +
              ' ' +
              item.uom +
              ' X ' +
              item.glass.cashRegisterNumber +
              ' (' +
              item.glass.name +
              ')'
          );
          num++;
        }
      });
    this.invoiceItemCalculatorService
      .getMirrorLengthForInvoiceItems(this.dataModel.invoiceItems)
      .forEach((item) => {
        if (item.amount && item.amount > 0) {
          items.push(
            num +
              ') ' +
              item.length +
              ' ' +
              item.uom +
              ' X ' +
              item.mirror.cashRegisterNumber +
              ' (' +
              item.mirror.name +
              ')'
          );
          num++;
        }
      });
    this.invoiceItemCalculatorService
      .getSandingLengthForInvoiceItems(this.dataModel.invoiceItems)
      .forEach((item) => {
        if (item.amount && item.amount > 0) {
          items.push(
            num +
              ') ' +
              item.length +
              ' ' +
              item.uom +
              ' X ' +
              item.sanding.cashRegisterNumber +
              ' (' +
              item.sanding.name +
              ')'
          );
          num++;
        }
      });
    this.invoiceItemCalculatorService
      .getFacetingLengthForInvoiceItems(this.dataModel.invoiceItems)
      .forEach((item) => {
        if (item.amount && item.amount > 0) {
          items.push(
            num +
              ') ' +
              item.length +
              ' ' +
              item.uom +
              ' X ' +
              item.faceting.cashRegisterNumber +
              ' (' +
              item.faceting.name +
              ')'
          );
          num++;
        }
      });
    return items;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
