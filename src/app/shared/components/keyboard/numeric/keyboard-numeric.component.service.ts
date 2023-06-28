import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { KeyboardNumericComponent } from './keyboard-numeric.component';
import { UOM } from 'src/app/shared/constants';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable()
export class KeyboardNumericComponentService {
  private subs = new SubscriptionManager();

  constructor(private _matDialog: MatDialog) {}

  openDialog(
    title: string,
    uom: UOM,
    showNextOperationButton: boolean,
    inputFieldTitle: string,
    value: number = 0,
    codeInput: boolean = false
  ): Observable<{ value: number; nextOperation: boolean }> {
    return new Observable(
      (observer: Subscriber<{ value: number; nextOperation: boolean }>) => {
        const config: MatDialogConfig = new MatDialogConfig();

        config.data = {
          title,
          uom,
          value,
          showNextOperationButton,
          inputFieldTitle,
          codeInput,
        };

        this.subs.sink.$openSelectPopup = this._matDialog
          .open(KeyboardNumericComponent, config)
          .afterClosed()
          .subscribe(
            (data: { value: number; nextOperation: boolean }) => {
              observer.next(data);
              observer.complete();
            },
            () => observer.error()
          );
      }
    );
  }
}
