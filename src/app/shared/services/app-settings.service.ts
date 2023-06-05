import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LanguageService } from 'src/app/language.service';
import { AppSettingsWebService } from './web-services/app-settings.service';

export class AppSettings {
  thousandsNumberSign: '.' | ',' = '.';
  decimalNumberSign: '.' | ',' = ',';
  dateFormat: 'dd.mm.yyyy' | 'dd/mm/yyyy' | 'mm.dd.yyyy' | 'mm/dd/yyyy' =
    'dd.mm.yyyy';
  currencyFormat: string = 'Din';
  currencyDisplayValue: string = 'Din';
  language: 'rs' | 'en' = 'rs';
  minGlassSurface: number = 1;
  copies: number = 2;
  footer: string = 'Footer neki';
  header: string = 'Header neki';
  printer: string = 'Printer neki';
}

@Injectable({ providedIn: 'root' })
export class AppSettingsService {
  private $settings: BehaviorSubject<AppSettings> =
    new BehaviorSubject<AppSettings>(new AppSettings());
  public settings: Observable<AppSettings> = this.$settings.asObservable();
  fs: any;

  constructor(
    private languageService: LanguageService,
    private webService: AppSettingsWebService<AppSettings>
  ) {
    this.webService.getSettings().subscribe((sett) => {
      this.$settings.next(sett);
    });
  }

  public updateSettings(settings: AppSettings): Observable<void> {
    return new Observable((subscriber) => {
      this.webService.updateSettings(settings).subscribe((settings) => {
        if (settings) {
          this.languageService.changeLanguage(settings.language);
          this.$settings.next(settings);
          return subscriber.next();
        }
      });
    });
  }
}
