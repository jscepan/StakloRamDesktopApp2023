import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MODE } from 'src/app/shared/components/basic-alert/basic-alert.interface';
import {
  DateFormat,
  QRCodeErrorCorrectionLevel,
} from 'src/app/shared/constants';
import { GlobalService } from 'src/app/shared/services/global.service';
import {
  AppSettings,
  SettingsStoreService,
} from 'src/app/shared/services/settings-store.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss'],
})
export class AppSettingsComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  settings?: AppSettings;
  printers: string[] = [];

  appSettingsForm?: FormGroup;

  decimalNumberSignOptions: { key: string; value: string }[] = [
    { key: '.', value: '.' },
    { key: ',', value: ',' },
  ];
  dateFormatOptions!: { key: string; value: string }[];
  qrCodeErrorCorrectionLevelOptions!: { key: string; value: string }[];
  languageOptions!: { key: string; value: string }[];
  printerOptions!: { key: string; value: string }[];

  constructor(
    private appSettingsService: SettingsStoreService,
    private route: Router,
    private globalService: GlobalService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.subs.sink.printSettings = this.appSettingsService.printers.subscribe(
      (printers) => {
        this.printers = printers;
      }
    );
    this.subs.sink.settings = this.appSettingsService.settings.subscribe(
      (settings) => {
        this.settings = settings;
        this.mapFormData(settings);
      }
    );
  }

  insertText(controlName: string): void {}

  insertNumber(controlName: string): void {}

  cancel(): void {
    this.route.navigate(['settings']);
  }

  submit(setting: AppSettings): void {
    this.subs.sink.updateSettings = this.appSettingsService
      .updateSettings(setting)
      .subscribe(() => {
        this.globalService.showBasicAlert(
          MODE.success,
          this.translateService.instant('success'),
          this.translateService.instant('settingsSuccessfullyUpdated')
        );
        this.route.navigate(['settings']);
      });
  }

  mapFormData(settings?: AppSettings): void {
    if (settings) {
      this.dateFormatOptions = Object.keys(DateFormat).map((key) => ({
        key,
        value: this.translateService.instant(
          DateFormat[key as keyof typeof DateFormat]
        ),
      }));
      this.qrCodeErrorCorrectionLevelOptions = Object.keys(
        QRCodeErrorCorrectionLevel
      ).map((value) => ({
        key: value,
        value: this.translateService.instant(value),
      }));
      this.languageOptions = [
        { key: 'rs', value: this.translateService.instant('rs') },
        { key: 'en', value: this.translateService.instant('en') },
      ];
      this.printerOptions = this.printers.map((value) => {
        return { key: value, value: value };
      });

      this.appSettingsForm = new FormGroup({
        decimalNumberSign: new FormControl(this.settings?.decimalNumberSign, [
          Validators.required,
        ]),
        dateFormat: new FormControl(this.settings?.dateFormat, [
          Validators.required,
        ]),
        currencyFormat: new FormControl(this.settings?.currencyFormat, [
          Validators.required,
        ]),
        currencyDisplayValue: new FormControl(
          this.settings?.currencyDisplayValue || '',
          [Validators.required]
        ),
        qrCodeSizeInPixel: new FormControl(
          this.settings?.qrCodeSizeInPixel || '',
          [Validators.required]
        ),
        qrCodeErrorCorrectionLevel: new FormControl(
          this.settings?.qrCodeErrorCorrectionLevel || '',
          [Validators.required]
        ),
        language: new FormControl(this.settings?.language || '', [
          Validators.required,
        ]),
        minGlassSurface: new FormControl(this.settings?.minGlassSurface || '', [
          Validators.required,
        ]),
        copies: new FormControl(this.settings?.copies || '', [
          Validators.required,
        ]),
        defaultDimensionsWidth: new FormControl(
          this.settings?.defaultDimensionsWidth || '',
          [Validators.required]
        ),
        defaultDimensionsHeight: new FormControl(
          this.settings?.defaultDimensionsHeight || '',
          [Validators.required]
        ),
        increaseButtonOneValue: new FormControl(
          this.settings?.increaseButtonOneValue || '',
          [Validators.required]
        ),
        increaseButtonTwoValue: new FormControl(
          this.settings?.increaseButtonTwoValue || '',
          [Validators.required]
        ),
        increaseButtonThreeValue: new FormControl(
          this.settings?.increaseButtonThreeValue || '',
          [Validators.required]
        ),
        header: new FormControl(this.settings?.header || '', [
          Validators.required,
        ]),
        footer: new FormControl(this.settings?.footer || '', [
          Validators.required,
        ]),
        printer: new FormControl(this.settings?.printer || '', [
          Validators.required,
        ]),
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
