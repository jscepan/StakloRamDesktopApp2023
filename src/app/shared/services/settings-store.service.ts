import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  DateFormat,
  QRCodeErrorCorrectionLevel,
  getDateFormatEnumByKey,
} from '../constants';
import { formatDate } from '@angular/common';
import { AppSettingsWebService } from './web-services/app-settings.service';

export class AppSettings {
  decimalNumberSign: '.' | ',' = ',';
  thousandsNumberSign: '.' | ',' = '.';
  dateFormat: DateFormat = DateFormat.DAY_MONTH_YEAR_DOT;
  currencyFormat: string = 'din';
  currencyDisplayValue: string = 'Din';
  qrCodeSizeInPixel: number = 130;
  qrCodeErrorCorrectionLevel: QRCodeErrorCorrectionLevel =
    QRCodeErrorCorrectionLevel.EXTRALARGE_levelH;
  language: 'rs' | 'en' = 'rs';
  minGlassSurface: number = 0.1;
  copies: number = 1;
  defaultDimensionsWidth: number = 20;
  defaultDimensionsHeight: number = 30;
  increaseButtonOneValue: number = 1000;
  increaseButtonTwoValue: number = 200;
  increaseButtonThreeValue: number = 100;
  footer: string = 'Hvala Vam na poverenju';
  header: string = 'STAKLO RAM';
  printer: string = 'Neki';
}

@Injectable({
  providedIn: 'root',
})
export class SettingsStoreService {
  private settings$: BehaviorSubject<AppSettings | undefined> =
    new BehaviorSubject<AppSettings | undefined>(undefined);
  public settings: Observable<AppSettings | undefined> =
    this.settings$.asObservable();

  private readonly _dataLoaded = new BehaviorSubject<boolean>(false);
  readonly dataLoaded$ = this._dataLoaded.asObservable();

  constructor(public baseWebService: AppSettingsWebService<AppSettings>) {
    this.baseWebService.getSettings().subscribe((settings) => {
      if (settings) {
        this.settings$.next(settings);
        this._dataLoaded.next(true);
      }
    });
    this.baseWebService.getPrinters().subscribe((printers) => {
      console.log('printersprintersprintersprintersprinters');
      console.log(printers);
    });
  }

  getSettings(): AppSettings | undefined {
    return this.settings$.getValue();
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
