import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { THUMBNAIL_PASSPARTU } from 'src/app/shared/constants';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { PasspartuWidthMargins } from './passpartu-width-popup-component.service';

export interface DialogData {
  passpartuWidthMargins: PasspartuWidthMargins;
}

@Component({
  selector: 'app-passpartu-width-popup',
  templateUrl: './passpartu-width-popup.component.html',
  styleUrls: ['./passpartu-width-popup.component.scss'],
  providers: [],
})
export class PasspartuWidthPopupComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private subs: SubscriptionManager = new SubscriptionManager();

  thumbnailUrl: string = THUMBNAIL_PASSPARTU;
  passpartuWidthMargins?: PasspartuWidthMargins;

  constructor(
    private dialogRef: MatDialogRef<PasspartuWidthPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cdRef: ChangeDetectorRef
  ) {
    this.passpartuWidthMargins = data.passpartuWidthMargins ?? {
      top: 0,
      down: 0,
      left: 0,
      right: 0,
    };
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  public saveSelection(): void {
    this.dialogRef
      .close
      //
      //
      ();
  }

  public cancelSaveSelection(): void {
    this.dialogRef.close();
  }

  changeValue(
    control: 'top' | 'down' | 'left' | 'right' | 'all',
    action: string
  ): void {
    if (control === 'all') {
      let biggestNumber: number = Math.max(
        this.passpartuWidthMargins?.top ?? Number.MIN_VALUE,
        this.passpartuWidthMargins?.down ?? Number.MIN_VALUE,
        this.passpartuWidthMargins?.left ?? Number.MIN_VALUE,
        this.passpartuWidthMargins?.right ?? Number.MIN_VALUE
      );
      if (action === 'increase') {
        biggestNumber++;
      } else {
        biggestNumber--;
        if (biggestNumber < 0) {
          biggestNumber = 0;
        }
      }

      this.passpartuWidthMargins = {
        down: biggestNumber,
        top: biggestNumber,
        left: biggestNumber,
        right: biggestNumber,
      };
    } else {
      if (this.passpartuWidthMargins) {
        const oldValue = this.passpartuWidthMargins[control];
        if (oldValue !== undefined) {
          if (action === 'decrease') {
            if (oldValue > 0) {
              this.passpartuWidthMargins = {
                ...this.passpartuWidthMargins,
                [control]: oldValue - 1,
              };
            }
          } else {
            this.passpartuWidthMargins = {
              ...this.passpartuWidthMargins,
              [control]: oldValue + 1,
            };
          }
        }
      }
    }
  }

  // selectFaceting(): void {
  //   this.subs.sink.facetingData = this.facetingData.entities.subscribe(
  //     (faces) => {
  //       this.selectionComponentService
  //         .openDialog(
  //           faces.map((f) => {
  //             return {
  //               oid: f.oid,
  //               name: f.name,
  //               selected: this.faceting?.oid === f.oid,
  //               uom: f.uom,
  //               pricePerUom: f.pricePerUom,
  //               cashRegisterNumber: f.cashRegisterNumber,
  //               thumbnailUrl: THUMBNAIL_FACETING,
  //             };
  //           })
  //         )
  //         .subscribe((oid: string) => {
  //           if (oid) {
  //             this.faceting = faces.filter((f) => f.oid === oid)[0];
  //           }
  //         });
  //     }
  //   );
  // }

  // selectSanding(): void {
  //   this.subs.sink.sandingData = this.sandingData.entities.subscribe(
  //     (sands) => {
  //       this.selectionComponentService
  //         .openDialog(
  //           sands.map((s) => {
  //             return {
  //               oid: s.oid,
  //               name: s.name,
  //               selected: this.sanding?.oid === s.oid,
  //               uom: s.uom,
  //               pricePerUom: s.pricePerUom,
  //               cashRegisterNumber: s.cashRegisterNumber,
  //               thumbnailUrl: THUMBNAIL_SANDING,
  //             };
  //           })
  //         )
  //         .subscribe((oid: string) => {
  //           if (oid) {
  //             this.sanding = sands.filter((s) => s.oid === oid)[0];
  //           }
  //         });
  //     }
  //   );
  // }

  // removeFromInvoiceItem(type: 'faceting' | 'sanding'): void {
  //   type === 'faceting'
  //     ? (this.faceting = undefined)
  //     : (this.sanding = undefined);
  // }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
