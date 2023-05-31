import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscriber } from 'rxjs';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { KeyboardAlphabetComponent } from './keyboard-alphabet.component';

@Injectable()
export class KeyboardAlphabetComponentService {
  private subs = new SubscriptionManager();

  constructor(private _matDialog: MatDialog) {}

  /*
  EXAMPLE
  this.subs.sink.$inputText =
  this.keyboardAlphabetComponentService.openDialog().subscribe((text) => {
    if (text!==undefined) {
      // TODO set text to value
    }
  });
*/

  openDialog(value: string = '', title: string = ''): Observable<string> {
    return new Observable((observer: Subscriber<string>) => {
      const config: MatDialogConfig = new MatDialogConfig();
      // config.width = '80%';
      // config.height = '80%';
      config.data = {
        value,
        title,
      };

      this.subs.sink.$openSelectPopup = this._matDialog
        .open(KeyboardAlphabetComponent, config)
        .afterClosed()
        .subscribe(
          (text: string) => {
            observer.next(text);
            observer.complete();
          },
          () => observer.error()
        );
    });
  }
}
