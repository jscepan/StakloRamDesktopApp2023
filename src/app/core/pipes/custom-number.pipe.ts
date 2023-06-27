import { Pipe, PipeTransform } from '@angular/core';
import { SettingsStoreService } from 'src/app/shared/services/settings-store.service';

@Pipe({
  name: 'customNumber',
})
export class CustomNumberPipe implements PipeTransform {
  decimalNumberSign: '.' | ',' = ',';

  constructor(private settingsService: SettingsStoreService) {
    this.settingsService.settings.subscribe((settings) => {
      this.decimalNumberSign = settings?.decimalNumberSign ?? ',';
    });
  }

  transform(value: any, decimalCount?: number): any {
    if (typeof value === 'number') {
      if (this.decimalNumberSign === ',') {
        return this.roundOnDigits(value, decimalCount).toLocaleString('de-DE');
      } else if (this.decimalNumberSign === '.') {
        return this.roundOnDigits(value, decimalCount).toLocaleString('en-US');
      }
    } else {
      return value;
    }
  }

  private roundOnDigits(value: number, numberOfDigits?: number): number {
    let val = value;
    if (numberOfDigits)
      val =
        Math.round(value * Math.pow(10, numberOfDigits)) /
        Math.pow(10, numberOfDigits);
    return value;
  }
}
