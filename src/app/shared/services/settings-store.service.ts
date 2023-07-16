import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  DateFormat,
  QRCodeErrorCorrectionLevel,
  getDateFormatEnumByKey,
} from '../constants';
import { formatDate } from '@angular/common';
import { AppSettingsWebService } from './web-services/app-settings.service';
import { finalize } from 'rxjs/operators';

export class AppSettings {
  // framing
  defaultDimensionsWidth: number = 20;
  defaultDimensionsHeight: number = 30;
  minGlassSurface: number = 0.1;

  // glassing

  // invoice
  decimalNumberSign: '.' | ',' = ',';
  dateFormat: DateFormat = DateFormat.DAY_MONTH_YEAR_DOT;
  invoicePrintWidth: number = 8;
  currencyDisplayValue: string = 'Din';
  increaseButtonOneValue: number = 1000;
  increaseButtonTwoValue: number = 200;
  increaseButtonThreeValue: number = 100;
  header: string = 'STAKLO RAM';
  footer: string = 'Hvala Vam na poverenju';
  qrCodeSizeInPixel: number = 130;
  qrCodeErrorCorrectionLevel: QRCodeErrorCorrectionLevel =
    QRCodeErrorCorrectionLevel.EXTRALARGE_levelH;

  // printer
  printer: string = 'Neki';
  copies: number = 1;

  // app
  language: 'rs' | 'en' = 'rs';
  touchScreenKeyboardEnabled: boolean = true;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsStoreService {
  private settings$: BehaviorSubject<AppSettings | undefined> =
    new BehaviorSubject<AppSettings | undefined>(undefined);
  public settings: Observable<AppSettings | undefined> =
    this.settings$.asObservable();

  private printers$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );
  public printers: Observable<string[]> = this.printers$.asObservable();

  private readonly _dataLoaded = new BehaviorSubject<boolean>(false);
  readonly dataLoaded$ = this._dataLoaded.asObservable();

  constructor(public baseWebService: AppSettingsWebService<AppSettings>) {
    this.baseWebService
      .getPrinters()
      .pipe(
        finalize(() => {
          this.baseWebService.getSettings().subscribe((settings) => {
            if (settings) {
              this.settings$.next(settings);
              this._dataLoaded.next(true);
            }
          });
        })
      )
      .subscribe((printers) => {
        if (printers) {
          this.printers$.next(printers);
        }
      });
  }

  updateSettings(settings: AppSettings): Observable<boolean> {
    this._dataLoaded.next(false);
    return new Observable((subscriber) => {
      this.baseWebService.updateSettings(settings).subscribe((settings) => {
        if (settings) {
          this.settings$.next(settings);
          this._dataLoaded.next(true);
          subscriber.next(true);
          subscriber.complete();
        }
      });
    });
  }

  public getFormatedDate(date: string): string {
    const dateFormat = getDateFormatEnumByKey(
      this.settings$.getValue()?.dateFormat
    );
    let d;
    dateFormat ? (d = formatDate(date, dateFormat, 'en-US')) : (d = date);
    return d;
  }

  public getFormatedDateAndTime(date: Date): string {
    const dateFormat = getDateFormatEnumByKey(
      this.settings$.getValue()?.dateFormat
    );
    return formatDate(date, `${dateFormat} HH:mm`, 'en-US');
  }
}
