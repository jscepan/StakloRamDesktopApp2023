import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
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
import { InvoiceItemModel } from 'src/app/shared/models/invoice-item.model';
import { PasspartuColorModel } from 'src/app/shared/models/passpartu-color-model';
import { PasspartuWidthPopupPopupService } from './passpartu-width-popup/passpartu-width-popup-component.service';

@Component({
  selector: 'app-framing',
  templateUrl: './framing.component.html',
  styleUrls: ['./framing.component.scss'],
  providers: [
    KeyboardNumericComponentService,
    SelectionComponentService,
    FacetingSandingPopupService,
    InvoiceItemCalculatorService,
    PasspartuWidthPopupPopupService,
  ],
})
export class FramingComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  componentMode: 'CREATE_NEW' | 'ADD_DRAFT' | 'EDIT_DRAFT' | 'EDIT' =
    'CREATE_NEW';
  @ViewChild('stepper') stepper!: MatStepper;
  invoiceItemForm!: UntypedFormGroup;
  countOfItems: number = 1;

  invoiceOid: string | undefined;
  invoiceItemOid?: string | null;

  private $isOutterDimension: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isOutterDimension: Observable<boolean> =
    this.$isOutterDimension.asObservable();

  touchScreenKeyboardEnabled: boolean = true;

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
    private passpartuWidthPopupPopupService: PasspartuWidthPopupPopupService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.invoiceOid =
      this._activeRoute.snapshot.paramMap.get('invoiceOid') ?? undefined;
    this.invoiceItemOid =
      this._activeRoute.snapshot.paramMap.get('invoiceItemOid');
    if (
      this.invoiceOid?.startsWith('draft') &&
      this.invoiceItemOid?.startsWith('draft')
    ) {
      this.componentMode = 'EDIT_DRAFT';
    } else if (this.invoiceOid?.startsWith('draft')) {
      this.componentMode = 'ADD_DRAFT';
    } else if (this.invoiceOid) {
      this.componentMode = 'EDIT';
    } else {
      this.componentMode = 'CREATE_NEW';
    }

    this.initializeForm();
  }

  initializeForm(): void {
    // TODO: napravi logiku za this.countOfItems kada je edit...

    this.subs.sink = this.generateInvoiceItem().subscribe(
      (invoiceItem: InvoiceItemModel) => {
        this.invoiceItemForm = new UntypedFormGroup({
          oid: new UntypedFormControl(invoiceItem.oid, [Validators.required]),
          title: new UntypedFormControl(invoiceItem.title, [
            Validators.required,
          ]),
          serviceType: new UntypedFormControl(SERVICE_TYPE.FRAMING, [
            Validators.required,
          ]),
          dimensionsWidth: new UntypedFormControl(invoiceItem.dimensionsWidth, [
            Validators.required,
            Validators.min(1),
          ]),
          dimensionsHeight: new UntypedFormControl(
            invoiceItem.dimensionsHeight,
            [Validators.required, Validators.min(1)]
          ),
          dimensionsUom: new UntypedFormControl(invoiceItem.dimensionsUom, [
            Validators.required,
          ]),
          dimensionsOutterWidth: new UntypedFormControl(
            invoiceItem.dimensionsOutterWidth
          ),
          dimensionsOutterHeight: new UntypedFormControl(
            invoiceItem.dimensionsOutterHeight
          ),
          glass: new UntypedFormControl(invoiceItem.glass, []),
          mirror: new UntypedFormControl(invoiceItem.mirror, []),
          faceting: new UntypedFormControl(invoiceItem.faceting, []),
          sanding: new UntypedFormControl(invoiceItem.sanding, []),
          selectedFrames: new UntypedFormControl(
            invoiceItem.selectedFrames,
            []
          ),
          selectedPasspartuColors: new UntypedFormControl(
            invoiceItem.selectedPasspartuColors ?? [],
            []
          ),
          amount: new UntypedFormControl(invoiceItem.amount, [
            Validators.required,
          ]),
        });
      }
    );

    this.subs.sink = this.isOutterDimension.subscribe((selected) => {
      if (selected) {
        this.invoiceItemForm.patchValue({
          dimensionsOutterWidth: this.invoiceItemForm.value
            .dimensionsOutterWidth
            ? this.invoiceItemForm.value.dimensionsOutterWidth
            : this.invoiceItemForm.value.dimensionsWidth,
          dimensionsOutterHeight: this.invoiceItemForm.value
            .dimensionsOutterHeight
            ? this.invoiceItemForm.value.dimensionsOutterHeight
            : this.invoiceItemForm.value.dimensionsHeight,
          passpartuTop: undefined,
          passpartuDown: undefined,
          passpartuLeft: undefined,
          passpartuRight: undefined,
          passpartuWidthUom: undefined,
        });
      } else {
        this.invoiceItemForm.patchValue({
          dimensionsOutterWidth: 0,
          dimensionsOutterHeight: 0,
        });
      }
    });
  }

  generateInvoiceItem(): Observable<InvoiceItemModel> {
    return new Observable((subscriber) => {
      this.subs.sink = this.appSettingsService.settings.subscribe(
        (settings) => {
          this.touchScreenKeyboardEnabled =
            settings?.touchScreenKeyboardEnabled ?? true;
          let invoiceItem: InvoiceItemModel = {
            oid: '',
            title: '',
            serviceType: SERVICE_TYPE.FRAMING,
            dimensionsWidth: settings?.defaultDimensionsWidth || 20,
            dimensionsHeight: settings?.defaultDimensionsHeight || 30,
            dimensionsUom: UOM.CENTIMETER,
            dimensionsOutterWidth: 0,
            dimensionsOutterHeight: 0,
            glass: undefined,
            mirror: undefined,
            faceting: undefined,
            sanding: undefined,
            selectedFrames: [],
            amount: 0,
          };

          if (this.componentMode === 'EDIT') {
            // TODO idi na api i uzmi fakturu...
            if (invoiceItem.dimensionsOutterWidth) {
              this.$isOutterDimension.next(true);
            }
          } else if (this.componentMode === 'EDIT_DRAFT') {
            this.subs.sink =
              this.draftInvoicesStoreService.draftInvoices.subscribe(
                (invoices) => {
                  const inv = invoices.filter(
                    (i) => i.oid === this.invoiceOid
                  )[0];

                  if (inv) {
                    invoiceItem = inv.invoiceItems.filter(
                      (ii) => ii.oid === this.invoiceItemOid
                    )[0];
                    if (invoiceItem.dimensionsOutterWidth) {
                      this.$isOutterDimension.next(true);
                    }
                    subscriber.next(invoiceItem);
                    subscriber.complete();
                  } else {
                    this.route.navigate(['invoice-create-edit', 'framing']);
                  }
                }
              );
          } else {
            subscriber.next(invoiceItem);
            subscriber.complete();
          }
        }
      );
    });
  }

  toggleInnerOutterDimension(): void {
    if (
      this.$isOutterDimension.getValue() &&
      this.invoiceItemForm.value.passpartuColor &&
      !this.invoiceItemForm.value.passpartuTop &&
      !this.invoiceItemForm.value.passpartuDown &&
      !this.invoiceItemForm.value.passpartuLeft &&
      !this.invoiceItemForm.value.passpartuRight
    ) {
      this.selectPasspartuWidth();
    }
    this.$isOutterDimension.next(!this.$isOutterDimension.getValue());
  }

  insertWidthAndHeight(): void {
    if (!this.touchScreenKeyboardEnabled) {
      return;
    }
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
          this.invoiceItemForm.get('dimensionsWidth')?.setValue(data.value);
        }
        if (data?.nextOperation) {
          this.insertHeight();
        }
      });
  }

  insertHeight(): void {
    if (!this.touchScreenKeyboardEnabled) {
      return;
    }
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
          this.invoiceItemForm.get('dimensionsHeight')?.setValue(data.value);
        }
      });
  }

  insertOutterWidthAndHeight(): void {
    if (!this.touchScreenKeyboardEnabled) {
      return;
    }
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
            ?.setValue(data.value);
        }
        if (data?.nextOperation) {
          this.insertOutterHeight();
        }
      });
  }

  insertOutterHeight(): void {
    if (!this.touchScreenKeyboardEnabled) {
      return;
    }
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
            ?.setValue(data.value);
        }
      });
  }

  insertCount(): void {
    if (!this.touchScreenKeyboardEnabled) {
      return;
    }
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
          this.countOfItems = +data.value;
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
                selected: false,
                thumbnailUrl: THUMBNAIL_PASSPARTU,
              };
            })
          )
          .subscribe((oid: string) => {
            if (oid) {
              const selectedPasspartu: PasspartuColorModel = passpartues.filter(
                (g) => g.oid === oid
              )[0];
              const selectedPasspartuColors: {
                passpartuColor?: PasspartuColorModel;
                passpartuTop?: number;
                passpartuDown?: number;
                passpartuLeft?: number;
                passpartuRight?: number;
                passpartuWidthUom?: UOM;
              }[] = this.invoiceItemForm.get('selectedPasspartuColors')?.value;
              selectedPasspartuColors.push({
                passpartuColor: selectedPasspartu,
              });
              this.invoiceItemForm.patchValue({
                selectedPasspartuColors,
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
    this.subs.sink.passInputWidth = this.passpartuWidthPopupPopupService
      .openDialog()
      .subscribe((margins) => {
        if (
          margins &&
          ((margins.top !== undefined && margins.top > 0) ||
            (margins.down !== undefined && margins.down > 0) ||
            (margins.left !== undefined && margins.left > 0) ||
            (margins.right !== undefined && margins.right > 0))
        ) {
          const selectedPasspartuColors: {
            passpartuColor?: PasspartuColorModel;
            passpartuTop: number;
            passpartuDown: number;
            passpartuLeft: number;
            passpartuRight: number;
            passpartuWidthUom?: UOM;
          }[] = this.invoiceItemForm.get('selectedPasspartuColors')?.value;

          let lastElement =
            selectedPasspartuColors[selectedPasspartuColors.length - 1];
          lastElement = {
            ...lastElement,
            passpartuTop: margins.top || 0,
            passpartuDown: margins.down || 0,
            passpartuLeft: margins.left || 0,
            passpartuRight: margins.right || 0,
            passpartuWidthUom: UOM.CENTIMETER,
          };
          const updatedSelectedPasspartuColors = selectedPasspartuColors.map(
            (element, index) => {
              if (index === selectedPasspartuColors.length - 1) {
                // Ako je poslednji element, izvršite promene
                return lastElement;
              } else {
                // Inače zadržite nepromenjeni element
                return element;
              }
            }
          );

          this.invoiceItemForm.patchValue({
            selectedPasspartuColors: updatedSelectedPasspartuColors,
          });
        } else {
          this.globalService.showBasicAlert(
            MODE.error,
            this.translateService.instant('missingData'),
            this.translateService.instant('passpartuWidthIsRequiredField')
          );
          this.selectPasspartuWidth();
        }
      });

    /*
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
          const selectedPasspartuColors: {
            passpartuColor?: PasspartuColorModel;
            passpartuWidth?: number;
            passpartuWidthUom?: UOM;
          }[] = this.invoiceItemForm.get('selectedPasspartuColors')?.value;

          let lastElement =
            selectedPasspartuColors[selectedPasspartuColors.length - 1];
          lastElement = {
            ...lastElement,
            passpartuWidth: data?.value,
            passpartuWidthUom: UOM.CENTIMETER,
          };
          const updatedSelectedPasspartuColors = selectedPasspartuColors.map(
            (element, index) => {
              if (index === selectedPasspartuColors.length - 1) {
                // Ako je poslednji element, izvršite promene
                return lastElement;
              } else {
                // Inače zadržite nepromenjeni element
                return element;
              }
            }
          );

          this.invoiceItemForm.patchValue({
            selectedPasspartuColors: updatedSelectedPasspartuColors,
          });
        } else {
          // if (!this.invoiceItemForm.get('selectedPasspartuColors')?.value.passpartuWidth) {
          this.globalService.showBasicAlert(
            MODE.error,
            this.translateService.instant('missingData'),
            this.translateService.instant('passpartuWidthIsRequiredField')
          );
          this.selectPasspartuWidth();
          // }
        }
      });
      */
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
          selectedPasspartuColors: [],
          passpartuColor: undefined,
          passpartuTop: undefined,
          passpartuDown: undefined,
          passpartuLeft: undefined,
          passpartuRight: undefined,
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
            true,
            true
          )
          .subscribe((code: { value: number | string; nextOperation: boolean }) => {
            if (code && code.value) {
              if (code.value.toString().length === 4 && +code.value >= 0 && +code.value <= 9999) {
                const c = code.value.toString().substring(0, 2);
                const colorCode = code.value.toString().substring(2, 4);
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
    if (this.componentMode === 'CREATE_NEW') {
      this.route.navigate(['/']);
    } else {
      this.route.navigate(['invoice-create-edit', 'edit', this.invoiceOid]);
    }
  }

  finish(): void {
    this.invoiceItemForm.patchValue({
      title: this.invoiceItemCalculatorService.getInvoiceItemTitle(
        this.invoiceItemForm.value
      ),
      amount: roundOnDigits(
        this.invoiceItemCalculatorService.getInvoiceItemAmount(
          this.invoiceItemForm.value
        ),
        2
      ),
    });
    if (this.componentMode === 'EDIT_DRAFT') {
      if (this.invoiceOid) {
        this.draftInvoicesStoreService.editDraftInvoiceItem(
          this.invoiceOid,
          this.invoiceItemForm.value
        );
        this.route.navigate(['invoice-create-edit', 'edit', this.invoiceOid]);
      }
    } else if (this.componentMode === 'EDIT') {
      // TODO
    } else if (
      this.componentMode === 'CREATE_NEW' ||
      this.componentMode === 'ADD_DRAFT'
    ) {
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
