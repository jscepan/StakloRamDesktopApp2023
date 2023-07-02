import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { PasspartuWidthPopupComponent } from './passpartu-width-popup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

export class PasspartuWidthMargins {
  top?: number;
  down?: number;
  left?: number;
  right?: number;
}

@Injectable()
export class PasspartuWidthPopupPopupService {
  private subs = new SubscriptionManager();

  constructor(private _matDialog: MatDialog) {}

  openDialog(
    passpartuWidthMargins?: PasspartuWidthMargins
  ): Observable<PasspartuWidthMargins> {
    return new Observable((observer: Subscriber<PasspartuWidthMargins>) => {
      const config: MatDialogConfig = new MatDialogConfig();

      config.data = {
        passpartuWidthMargins,
      };

      this.subs.sink.$openSelectPopup = this._matDialog
        .open(PasspartuWidthPopupComponent, config)
        .afterClosed()
        .subscribe(
          (data: PasspartuWidthMargins) => {
            observer.next(data);
            observer.complete();
          },
          () => observer.error()
        );
    });
  }
}
