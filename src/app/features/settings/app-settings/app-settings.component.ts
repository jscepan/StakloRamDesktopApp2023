import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MODE } from 'src/app/shared/components/basic-alert/basic-alert.interface';
import { Entity } from 'src/app/shared/components/form/form.component';
import { QRCodeErrorCorrectionLevel } from 'src/app/shared/constants';
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

  items: Entity[] = [];
  settings?: AppSettings;

  constructor(
    private appSettingsService: SettingsStoreService,
    private route: Router,
    private globalService: GlobalService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.subs.sink.settings = this.appSettingsService.settings.subscribe(
      (settings) => {
        this.settings = settings;
        this.mapFormData(settings);
      }
    );
  }

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
    if (settings)
      this.items.push(
        {
          type: 'select',
          required: true,
          errorMessage: 'string',
          value: settings.decimalNumberSign,
          optionalValues: [
            { key: '.', value: '.' },
            { key: ',', value: ',' },
          ],
          label: {
            key: 'decimalNumberSign',
            value: this.translateService.instant('decimalNumberSign'),
          },
        },
        {
          type: 'select',
          required: true,
          errorMessage: 'string',
          value: settings.thousandsNumberSign,
          optionalValues: [
            { key: '.', value: '.' },
            { key: ',', value: ',' },
          ],
          label: {
            key: 'thousandsNumberSign',
            value: this.translateService.instant('thousandsNumberSign'),
          },
        },
        // {
        //   type: 'select',
        //   required: true,
        //   errorMessage: 'string',
        //   value: settings.formatSettings.numberFormat,
        //   optionalValues: [
        //     { key: '.000', value: '.000' },
        //     { key: '.00', value: '.00' },
        //   ],
        //   label: { key: 'numberFormat', value: 'numberFormat' },
        // },
        {
          type: 'select',
          required: true,
          errorMessage: 'string',
          value: settings.dateFormat,
          optionalValues: [
            { key: 'dd.mm.yyyy', value: 'dd.mm.yyyy' },
            { key: 'dd/mm/yyyy', value: 'dd/mm/yyyy' },
            { key: 'mm.dd.yyyy', value: 'mm.dd.yyyy' },
            { key: 'mm/dd/yyyy', value: 'mm/dd/yyyy' },
          ],
          label: {
            key: 'dateFormat',
            value: this.translateService.instant('dateFormat'),
          },
        },
        {
          type: 'string',
          required: true,
          errorMessage: 'string',
          value: settings.currencyFormat,
          label: {
            key: 'currencyFormat',
            value: this.translateService.instant('currencyFormat'),
          },
        },
        {
          type: 'string',
          required: true,
          errorMessage: 'string',
          value: settings.currencyDisplayValue,
          label: {
            key: 'currencyDisplayValue',
            value: this.translateService.instant('currencyDisplayValue'),
          },
        },
        {
          type: 'number',
          required: true,
          errorMessage: 'string',
          value: settings.qrCodeSizeInPixel,
          label: {
            key: 'qrCodeSizeInPixel',
            value: this.translateService.instant('qrCodeSizeInPixel'),
          },
        },
        {
          type: 'select',
          required: true,
          errorMessage: 'string',
          value: settings.qrCodeErrorCorrectionLevel,
          optionalValues: Object.keys(QRCodeErrorCorrectionLevel).map(
            (value) => ({
              key: value,
              value: this.translateService.instant(value),
            })
          ),
          label: {
            key: 'qrCodeErrorCorrectionLevel',
            value: this.translateService.instant('qrCodeErrorCorrectionLevel'),
          },
        },
        // {
        //   type: 'select',
        //   required: true,
        //   errorMessage: 'string',
        //   value: settings.applicationDesign.buttonSize,
        //   optionalValues: [
        //     { key: 'big', value: 'big' },
        //     { key: 'middle', value: 'middle' },
        //     { key: 'small', value: 'small' },
        //   ],
        //   label: { key: 'buttonSize', value: 'buttonSize' },
        // },
        // {
        //   type: 'number',
        //   required: true,
        //   errorMessage: 'string',
        //   value: settings.applicationDesign.fontSize,
        //   label: { key: 'fontSize', value: 'fontSize' },
        // },
        // {
        //   type: 'number',
        //   required: true,
        //   errorMessage: 'string',
        //   value: settings.applicationDesign.fontSizeList,
        //   label: { key: 'fontSizeList', value: 'fontSizeList' },
        // },
        {
          type: 'select',
          required: true,
          errorMessage: 'string',
          value: settings.language,
          optionalValues: [
            { key: 'rs', value: 'Srpski' },
            { key: 'en', value: 'Engleski' },
          ],
          label: {
            key: 'language',
            value: this.translateService.instant('language'),
          },
        },
        {
          type: 'number',
          required: true,
          errorMessage: 'string',
          value: settings.minGlassSurface,
          label: {
            key: 'minGlassSurface',
            value: this.translateService.instant('minGlassSurface'),
          },
        },
        {
          type: 'number',
          required: true,
          errorMessage: 'string',
          value: settings.copies,
          label: {
            key: 'copies',
            value: this.translateService.instant('copies'),
          },
        },
        {
          type: 'number',
          required: true,
          errorMessage: 'string',
          value: settings.defaultDimensionsWidth,
          label: {
            key: 'defaultDimensionsWidth',
            value: this.translateService.instant('defaultDimensionsWidth'),
          },
        },
        {
          type: 'number',
          required: true,
          errorMessage: 'string',
          value: settings.defaultDimensionsHeight,
          label: {
            key: 'defaultDimensionsHeight',
            value: this.translateService.instant('defaultDimensionsHeight'),
          },
        },
        {
          type: 'number',
          required: true,
          errorMessage: 'string',
          value: settings.increaseButtonOneValue,
          label: {
            key: 'increaseButtonOneValue',
            value: this.translateService.instant('increaseButtonOneValue'),
          },
        },
        {
          type: 'number',
          required: true,
          errorMessage: 'string',
          value: settings.increaseButtonTwoValue,
          label: {
            key: 'increaseButtonTwoValue',
            value: this.translateService.instant('increaseButtonTwoValue'),
          },
        },
        {
          type: 'number',
          required: true,
          errorMessage: 'string',
          value: settings.increaseButtonThreeValue,
          label: {
            key: 'increaseButtonThreeValue',
            value: this.translateService.instant('increaseButtonThreeValue'),
          },
        },
        {
          type: 'string',
          required: true,
          errorMessage: 'string',
          value: settings.footer,
          label: {
            key: 'footer',
            value: this.translateService.instant('footer'),
          },
        },
        {
          type: 'string',
          required: true,
          errorMessage: 'string',
          value: settings.header,
          label: {
            key: 'header',
            value: this.translateService.instant('header'),
          },
        },
        {
          type: 'string',
          required: true,
          errorMessage: 'string',
          value: settings.printer,
          label: {
            key: 'printer',
            value: this.translateService.instant('printer'),
          },
        }
      );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
