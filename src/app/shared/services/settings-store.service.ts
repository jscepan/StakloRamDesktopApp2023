import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseWebService } from 'src/app/core/services/base.web-service';
import { BASE_API_URL } from '../constants';

export class AppSettings {
  decimalNumberSign: '.' | ',' = ',';
  thousandsNumberSign: '.' | ',' = '.';
  dateFormat: 'dd.mm.yyyy' | 'dd/mm/yyyy' | 'mm.dd.yyyy' | 'mm/dd/yyyy' =
    'dd.mm.yyyy';
  currencyFormat: string = 'din';
  currencyDisplayValue: string = 'Din';
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

  constructor(public baseWebService: BaseWebService) {
    this.baseWebService
      .getRequest<AppSettings>(`${BASE_API_URL + '/settings'}`, AppSettings)
      .subscribe((settings) => {
        if (settings) {
          this.settings$.next(settings);
          this._dataLoaded.next(true);
        }
      });
  }

  getSettings(): AppSettings | undefined {
    return this.settings$.getValue();
  }

  updateSettings(settings: AppSettings): Observable<boolean> {
    this._dataLoaded.next(false);
    return new Observable((subscriber) => {
      this.baseWebService
        .putRequest<AppSettings, AppSettings>(
          `${BASE_API_URL + '/settings'}`,
          settings,
          AppSettings
        )
        .subscribe((settings) => {
          if (settings) {
            this.settings$.next(settings);
            this._dataLoaded.next(true);
            subscriber.next(true);
            subscriber.complete();
          }
        });
    });
  }
}
