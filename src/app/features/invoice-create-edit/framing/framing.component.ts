import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionComponentService } from '@features/selection-popup/selection-component.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { KeyboardNumericComponentService } from 'src/app/shared/components/keyboard/numeric/keyboard-numeric.component.service';
import {
  SERVICE_TYPE,
  THUMBNAIL_GLASS,
  THUMBNAIL_MIRROR,
  THUMBNAIL_PASSPARTU,
  UOM,
} from 'src/app/shared/constants';
import { GlassDataStoreService } from 'src/app/shared/services/data-store-services/glass-data-store.service';
import { MirrorDataStoreService } from 'src/app/shared/services/data-store-services/mirror-data-store.service';
import { SettingsStoreService } from 'src/app/shared/services/settings-store.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { FacetingSandingPopupService } from './faceting-sanding-selection-popup/faceting-sanding-popup-component.service';
import { PasspartuColorDataStoreService } from 'src/app/shared/services/data-store-services/passpartu-color-data-store.service';
import { MODE } from 'src/app/shared/components/basic-alert/basic-alert.interface';
import { GlobalService } from 'src/app/shared/services/global.service';
import { FrameDataStoreService } from 'src/app/shared/services/data-store-services/frame-data-store.service';
import { InvoiceItemCalculatorService } from 'src/app/shared/services/invoice-item-amount-calculator.service';
import { DraftInvoicesService } from 'src/app/shared/services/data-store-services/draft-invoice-items-store.service';
import { roundOnDigits } from 'src/app/shared/utils';

@Component({
  selector: 'app-framing',
  templateUrl: './framing.component.html',
  styleUrls: ['./framing.component.scss'],
  providers: [
    KeyboardNumericComponentService,
    SelectionComponentService,
    FacetingSandingPopupService,
    InvoiceItemCalculatorService,
  ],
})
export class FramingComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  componentMode: 'DRAFT' | 'EDIT' | 'REGULAR' = 'REGULAR';
  @ViewChild('stepper') stepper!: MatStepper;
  invoiceItemForm!: FormGroup;
  countOfItems: number = 1;

  invoiceOid: string | undefined;

  private $isOutterDimension: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isOutterDimension: Observable<boolean> =
    this.$isOutterDimension.asObservable();

  constructor(
    private route: Router,
    private _activeRoute: ActivatedRoute,
    private keyboardNumericComponentService: KeyboardNumericComponentService,
    private selectPopUp: SelectionComponentService,
    private appSettingsService: SettingsStoreService,
    private glassStoreService: GlassDataStoreService,
    private passpartuColorStoreService: PasspartuColorDataStoreService,
    private frameStoreService: FrameDataStoreService,
    private mirrorStoreService: MirrorDataStoreService,
    private facetingSandingPopupService: FacetingSandingPopupService,
    private globalService: GlobalService,
    private invoiceItemCalculatorService: InvoiceItemCalculatorService,
    private draftInvoicesStoreService: DraftInvoicesService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.invoiceOid =
      this._activeRoute.snapshot.paramMap.get('invoiceOid') ?? undefined;
    const itemOid = this._activeRoute.snapshot.paramMap.get('invoiceItemOid');
    if (itemOid?.startsWith('draft')) {
      this.componentMode = 'DRAFT';
    } else if (this.invoiceOid) {
      this.componentMode = 'EDIT';
    } else {
      this.componentMode = 'REGULAR';
    }

    this.initializeForm();

    if (this.invoiceOid) {
      this.draftInvoicesStoreService.draftInvoices.subscribe((invoices) => {
        let inv = invoices.filter((i) => i.oid === this.invoiceOid)[0];
        if (inv) {
          if (itemOid) {
            // this.isEdit = true;

            // TODO zavrsi ovu logiku
            // this.invoiceItem = inv.invoiceItems.filter(
            //   (ii) => ii.oid === itemOid
            // )[0];
            // if (this.invoiceItem.dimensionsOutterWidth) {
            //   this.$isOutterDimension.next(true);
            // }

            this.initializeForm();
          } else {
            this.initializeForm();
          }
        } else {
          this.route.navigate(['invoice-create-edit', 'framing']);
        }
      });
    } else {
      this.initializeForm();
    }
  }

  initializeForm(): void {
    // TODO: napravi logiku za this.countOfItems kada je edit...

    this.subs.sink = this.appSettingsService.settings.subscribe((settings) => {
      this.invoiceItemForm = new FormGroup({
        title: new FormControl(SERVICE_TYPE.FRAMING, [Validators.required]),
        serviceType: new FormControl(SERVICE_TYPE.FRAMING, [
          Validators.required,
        ]),
        dimensionsWidth: new FormControl(settings?.defaultDimensionsWidth, [
          Validators.required,
          Validators.min(1),
        ]),
        dimensionsHeight: new FormControl(settings?.defaultDimensionsHeight, [
          Validators.required,
          Validators.min(1),
        ]),
        dimensionsUom: new FormControl(UOM.CENTIMETER, [Validators.required]),
        dimensionsOutterWidth: new FormControl(
          0, //  settings?.defaultDimensionsWidth,
          []
        ),
        dimensionsOutterHeight: new FormControl(
          0, //  settings?.defaultDimensionsHeight,
          []
        ),
        glass: new FormControl(undefined, []),
        passpartuWidth: new FormControl(undefined, []),
        passpartuWidthUom: new FormControl(undefined, []),
        passpartuColor: new FormControl(undefined, []),
        mirror: new FormControl(undefined, []),
        faceting: new FormControl(undefined, []),
        sanding: new FormControl(undefined, []),
        selectedFrames: new FormControl([], []),
        amount: new FormControl(0, [Validators.required]),
      });
    });

    this.subs.sink = this.isOutterDimension.subscribe((selected) => {
      // if (selected) {
      //   this.invoiceItemForm.patchValue({
      //     dimensionsOutterWidth: this.invoiceItemForm.value
      //       .dimensionsOutterWidth
      //       ? this.invoiceItemForm.value.dimensionsOutterWidth
      //       : this.invoiceItemForm.value.dimensionsWidth,
      //   });
      //   this.invoiceItemForm.patchValue({
      //     dimensionsOutterHeight: this.invoiceItemForm.value
      //       .dimensionsOutterHeight
      //       ? this.invoiceItemForm.value.dimensionsOutterHeight
      //       : this.invoiceItemForm.value.dimensionsHeight,
      //   });
      // } else {
      //   this.invoiceItemForm.patchValue({
      //     dimensionsOutterWidth: 0,
      //   });
      //   this.invoiceItemForm.patchValue({
      //     dimensionsOutterHeight: 0,
      //   });
      // }
    });
  }

  toggleInnerOutterDimension(): void {
    if (
      this.$isOutterDimension.getValue() &&
      this.invoiceItemForm.value.passpartuColor &&
      !this.invoiceItemForm.value.passpartuWidth
    ) {
      this.selectPasspartuWidth();
    }
    this.$isOutterDimension.next(!this.$isOutterDimension.getValue());
  }

  insertWidthAndHeight(): void {
    this.subs.sink.insertWidth = this.keyboardNumericComponentService
      .openDialog(
        this.translateService.instant('insertDimensions'),
        UOM.CENTIMETER,
        true,
        this.translateService.instant('insertDimensionWidth'),
        this.invoiceItemForm.get('dimensionsWidth')?.value || 0
      )
      .subscribe((data) => {
        if (data?.value) {
          this.invoiceItemForm
            .get('dimensionsWidth')
            ?.setValue(parseFloat(data.value));
        }
        if (data?.nextOperation) {
          this.insertHeight();
        }
      });
  }

  insertHeight(): void {
    this.subs.sink.insertHeight = this.keyboardNumericComponentService
      .openDialog(
        this.translateService.instant('insertDimensions'),
        UOM.CENTIMETER,
        false,
        this.translateService.instant('insertDimensionHeight'),
        this.invoiceItemForm.get('dimensionsHeight')?.value || 0
      )
      .subscribe((data) => {
        if (data?.value) {
          this.invoiceItemForm
            .get('dimensionsHeight')
            ?.setValue(parseFloat(data.value));
        }
      });
  }

  insertOutterWidthAndHeight(): void {
    this.subs.sink.insertWidth = this.keyboardNumericComponentService
      .openDialog(
        this.translateService.instant('insertDimensions'),
        UOM.CENTIMETER,
        true,
        this.translateService.instant('insertDimensionWidth'),
        this.invoiceItemForm.get('dimensionsOutterWidth')?.value || 0
      )
      .subscribe((data) => {
        if (data?.value) {
          this.invoiceItemForm
            .get('dimensionsOutterWidth')
            ?.setValue(parseFloat(data.value));
        }
        if (data?.nextOperation) {
          this.insertOutterHeight();
        }
      });
  }

  insertOutterHeight(): void {
    this.subs.sink.insertHeight = this.keyboardNumericComponentService
      .openDialog(
        this.translateService.instant('insertDimensions'),
        UOM.CENTIMETER,
        false,
        this.translateService.instant('insertDimensionHeight'),
        this.invoiceItemForm.get('dimensionsOutterHeight')?.value || 0
      )
      .subscribe((data) => {
        if (data?.value) {
          this.invoiceItemForm
            .get('dimensionsOutterHeight')
            ?.setValue(parseFloat(data.value));
        }
      });
  }

  insertCount(): void {
    this.subs.sink.insertCount = this.keyboardNumericComponentService
      .openDialog(
        this.translateService.instant('insertCount'),
        UOM.PIECES,
        false,
        this.translateService.instant('countOfSameProducts'),
        this.countOfItems
      )
      .subscribe((data) => {
        if (data?.value) {
          this.countOfItems = parseFloat(data.value);
        }
      });
  }

  selectGlass(): void {
    this.subs.sink.selectGlass = this.glassStoreService.entities.subscribe(
      (glasses) => {
        this.subs.sink.selectGlassPopUp = this.selectPopUp
          .openDialog(
            glasses.map((glass) => {
              return {
                oid: glass.oid,
                name: glass.name,
                pricePerUom: glass.pricePerUom,
                uom: glass.uom,
                cashRegisterNumber: glass.cashRegisterNumber,
                selected: this.invoiceItemForm.value?.glass?.oid === glass.oid,
                thumbnailUrl: THUMBNAIL_GLASS,
              };
            })
          )
          .subscribe((oid: string) => {
            if (oid) {
              this.invoiceItemForm.patchValue({
                glass: glasses.filter((g) => g.oid === oid)[0],
                mirror: undefined,
                faceting: undefined,
                sanding: undefined,
              });
            }
          });
      }
    );
  }

  selectPasspartu(): void {
    this.subs.sink.selectPasspartu =
      this.passpartuColorStoreService.entities.subscribe((passpartues) => {
        this.subs.sink.selectPasspartuPopUp = this.selectPopUp
          .openDialog(
            passpartues.map((passpartu) => {
              return {
                oid: passpartu.oid,
                name: passpartu.name,
                pricePerUom: passpartu.passpartu.pricePerUom,
                uom: passpartu.passpartu.uom,
                cashRegisterNumber: passpartu.passpartu.cashRegisterNumber,
                selected:
                  this.invoiceItemForm.value?.passpartuColor?.oid ===
                  passpartu.oid,
                thumbnailUrl: THUMBNAIL_PASSPARTU,
              };
            }),
            'middle'
          )
          .subscribe((oid: string) => {
            if (oid) {
              this.invoiceItemForm.patchValue({
                passpartuColor: passpartues.filter((g) => g.oid === oid)[0],
                mirror: undefined,
                faceting: undefined,
                sanding: undefined,
              });
              if (!this.invoiceItemForm.value.dimensionsOutterWidth) {
                this.selectPasspartuWidth();
              }
            }
          });
      });
  }

  selectPasspartuWidth(): void {
    this.subs.sink.passInputWidth = this.keyboardNumericComponentService
      .openDialog(
        this.translateService.instant('passpartuWidth'),
        UOM.CENTIMETER,
        false,
        this.translateService.instant('insertPasspartuWidth'),
        this.invoiceItemForm.value.passpartuWidth || 0
      )
      .subscribe((data) => {
        if (data?.value) {
          this.invoiceItemForm.patchValue({
            passpartuWidth: parseFloat(data.value),
            passpartuWidthUom: UOM.CENTIMETER,
          });
        }
        if (!this.invoiceItemForm.value.passpartuWidth) {
          this.globalService.showBasicAlert(
            MODE.error,
            this.translateService.instant('missingData'),
            this.translateService.instant('passpartuWidthIsRequiredField')
          );
          this.selectPasspartuWidth();
        }
      });
  }

  selectMirror(): void {
    this.subs.sink.selectMirror = this.mirrorStoreService.entities.subscribe(
      (mirrors) => {
        this.subs.sink.selectMirrorPopUp = this.selectPopUp
          .openDialog(
            mirrors.map((mirror) => {
              return {
                oid: mirror.oid,
                name: mirror.name,
                pricePerUom: mirror.pricePerUom,
                uom: mirror.uom,
                cashRegisterNumber: mirror.cashRegisterNumber,
                selected: this.invoiceItemForm.value?.glass?.oid === mirror.oid,
                thumbnailUrl: THUMBNAIL_MIRROR,
              };
            })
          )
          .subscribe((oid: string) => {
            if (oid) {
              this.invoiceItemForm.patchValue({
                mirror: mirrors.filter((g) => g.oid === oid)[0],
                glass: undefined,
                passpartuColor: undefined,
              });
              this.openFacetingAndSandingSelectPopup();
            }
          });
      }
    );
  }

  openFacetingAndSandingSelectPopup(): void {
    this.subs.sink.facetingAndSandingPopup = this.facetingSandingPopupService
      .openDialog(
        this.invoiceItemForm.value.faceting,
        this.invoiceItemForm.value.sanding
      )
      .subscribe((data) => {
        if (data) {
          this.invoiceItemForm.patchValue({
            faceting: data.faceting,
            sanding: data.sanding,
          });
        }
      });
  }

  removeFromInvoiceItemForm(type: 'glass' | 'passpartu' | 'mirror'): void {
    switch (type) {
      case 'glass':
        this.invoiceItemForm.patchValue({
          glass: undefined,
        });
        break;
      case 'passpartu':
        this.invoiceItemForm.patchValue({
          passpartuColor: undefined,
          passpartuWidth: undefined,
        });
        break;
      case 'mirror':
        this.invoiceItemForm.patchValue({
          mirror: undefined,
          faceting: undefined,
          sanding: undefined,
        });
        break;
    }
  }

  addNewFrameToInvoiceItem(): void {
    this.subs.sink.addNewFrameToInvoice =
      this.frameStoreService.entities.subscribe((frames) => {
        this.keyboardNumericComponentService
          .openDialog(
            this.translateService.instant('insertFrameCode'),
            UOM.NUMBER,
            false,
            this.translateService.instant('fourDigitsForFrameForColor'),
            0,
            true
          )
          .subscribe((code: { value: string; nextOperation: boolean }) => {
            if (code && code.value) {
              if (code.value.length === 4) {
                const c = code.value.substring(0, 2);
                const colorCode = code.value.substring(2, 4);
                const frame = frames.find((f) => f.code === c);
                if (frame) {
                  const selectedFrames =
                    this.invoiceItemForm.get('selectedFrames')?.value;
                  selectedFrames.push({ frame, colorCode });
                  this.invoiceItemForm
                    .get('selectedFrames')
                    ?.setValue(selectedFrames);
                  return;
                }
                this.globalService.showBasicAlert(
                  MODE.error,
                  this.translateService.instant('wrongCode'),
                  this.translateService.instant(
                    'firstDigitsOfCodeHaveToBeCodeOfFrame'
                  )
                );
              } else {
                this.globalService.showBasicAlert(
                  MODE.error,
                  this.translateService.instant('wrongCode'),
                  this.translateService.instant('codeCanBeFourDigitsLong')
                );
              }
              this.addNewFrameToInvoiceItem();
            }
          });
      });
  }

  removeAddedFrame(index: number): void {
    const selectedFrames = this.invoiceItemForm.get('selectedFrames')?.value;
    selectedFrames.splice(index, 1);
    this.invoiceItemForm.get('selectedFrames')?.setValue(selectedFrames);
  }

  cancel(): void {
    this.route.navigate(['/']);
  }

  finish(): void {
    this.invoiceItemForm.patchValue({
      amount: roundOnDigits(
        this.invoiceItemCalculatorService.getInvoiceItemAmount(
          this.invoiceItemForm.value
        ),
        2
      ),
    });
    if (this.componentMode === 'EDIT') {
      // this.draftInvoicesStoreService.editDraftInvoiceItem(
      //   this.invoiceOid,
      //   this.invoiceItem
      // );
      // this.route.navigate(['invoice-create-edit', 'edit', this.invoiceOid]);
    } else {
      for (let i = 0; i < this.countOfItems; i++) {
        this.invoiceOid = this.draftInvoicesStoreService.addNewInvoiceItem(
          { ...this.invoiceItemForm.value },
          this.invoiceOid
        );
      }
      this.route.navigate(['invoice-create-edit', 'edit', this.invoiceOid]);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
