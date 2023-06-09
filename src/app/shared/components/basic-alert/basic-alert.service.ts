import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BasicAlertComponent } from './basic-alert.component';

import { BasicAlertEventsTypes, BasicAlertI } from './basic-alert.interface';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Injectable()
export class BasicAlertService {
  constructor(
    private snackBar: MatSnackBar,
    private basicAlertConfiguration: MatSnackBarConfig
  ) {}

  openBasicAlert(data: BasicAlertI, closeAfter: number = 5000): void {
    const barRef: MatSnackBarRef<BasicAlertComponent> =
      this.snackBar.openFromComponent(BasicAlertComponent, {
        ...this.basicAlertConfiguration,
        data,
        duration: closeAfter,
      });

    barRef.instance.eventOccurs
      .pipe(takeUntil(barRef.afterDismissed()))
      .subscribe((event: { eventName: string }) => {
        if (event.eventName === BasicAlertEventsTypes.EXIT) {
          this.snackBar.dismiss();
        }
      });
  }
}
