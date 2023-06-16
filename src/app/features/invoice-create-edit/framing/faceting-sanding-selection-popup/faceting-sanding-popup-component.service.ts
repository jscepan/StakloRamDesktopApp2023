import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscriber } from 'rxjs';
import { ProductModel } from 'src/app/shared/models/product-model';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { FacetingSandingPopupComponent } from './faceting-sanding-popup.component';

@Injectable()
export class FacetingSandingPopupService {
  private subs = new SubscriptionManager();

  constructor(private _matDialog: MatDialog) {}

  openDialog(
    faceting: ProductModel,
    sanding: ProductModel
  ): Observable<{ faceting: ProductModel; sanding: ProductModel }> {
    return new Observable(
      (
        observer: Subscriber<{ faceting: ProductModel; sanding: ProductModel }>
      ) => {
        const config: MatDialogConfig = new MatDialogConfig();
        // config.width = '80%';
        // config.height = '80%';
        config.data = {
          faceting,
          sanding,
        };

        this.subs.sink.$openSelectPopup = this._matDialog
          .open(FacetingSandingPopupComponent, config)
          .afterClosed()
          .subscribe(
            (data: { faceting: ProductModel; sanding: ProductModel }) => {
              observer.next(data);
              observer.complete();
            },
            () => observer.error()
          );
      }
    );
  }
}
