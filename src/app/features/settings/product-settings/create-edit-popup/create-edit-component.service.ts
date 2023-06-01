import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscriber } from 'rxjs';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { CreateEditPopupComponent } from './create-edit-popup.component';
import { Entity } from 'src/app/shared/components/form/form.component';

@Injectable()
export class CreateEditComponentService {
  private subs = new SubscriptionManager();

  constructor(private _matDialog: MatDialog) {}

  openDialog(items: Entity[], isEdit: boolean = false): Observable<any> {
    return new Observable(
      (observer: Subscriber<KeyValue<string, string>[]>) => {
        const config: MatDialogConfig = new MatDialogConfig();

        config.data = {
          items,
          isEdit,
        };

        this.subs.sink.$openSelectPopup = this._matDialog
          .open(CreateEditPopupComponent, config)
          .afterClosed()
          .subscribe(
            (item: KeyValue<string, string>[]) => {
              observer.next(item);
              observer.complete();
            },
            () => observer.error()
          );
      }
    );
  }
}
