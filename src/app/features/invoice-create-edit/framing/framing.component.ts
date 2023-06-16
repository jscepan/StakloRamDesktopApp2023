import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-framing',
  templateUrl: './framing.component.html',
  styleUrls: ['./framing.component.scss'],
  providers: [
    KeyboardNumericComponentService,
    SelectionComponentService,
    FacetingSandingPopupService,
  ],
})
export class FramingComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  isEdit: boolean = false;
  @ViewChild('stepper') stepper!: MatStepper;
  invoiceItemForm!: FormGroup;
  countOfItems: number = 1;

  private $isOutterDimension: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isOutterDimension: Observable<boolean> =
    this.$isOutterDimension.asObservable();

  constructor(
    private route: Router,
    private keyboardNumericComponentService: KeyboardNumericComponentService,
    private selectPopUp: SelectionComponentService,
    private appSettingsService: SettingsStoreService,
    private glassStoreService: GlassDataStoreService,
    private passpartuColorStoreService: PasspartuColorDataStoreService,
    private mirrorStoreService: MirrorDataStoreService,
    private facetingSandingPopupService: FacetingSandingPopupService,
    private globalService: GlobalService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
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
          settings?.defaultDimensionsWidth,
          []
        ),
        dimensionsOutterHeight: new FormControl(
          settings?.defaultDimensionsHeight,
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
        amount: new FormControl(SERVICE_TYPE.FRAMING, [Validators.required]),
      });
    });

    this.subs.sink = this.isOutterDimension.subscribe((selected) => {
      if (selected) {
        this.invoiceItemForm.patchValue({
          dimensionsOutterWidth: this.invoiceItemForm.value
            .dimensionsOutterWidth
            ? this.invoiceItemForm.value.dimensionsOutterWidth
            : this.invoiceItemForm.value.dimensionsWidth,
        });
        this.invoiceItemForm.patchValue({
          dimensionsOutterHeight: this.invoiceItemForm.value
            .dimensionsOutterHeight
            ? this.invoiceItemForm.value.dimensionsOutterHeight
            : this.invoiceItemForm.value.dimensionsHeight,
        });
      } else {
        this.invoiceItemForm.patchValue({
          dimensionsOutterWidth: 0,
        });
        this.invoiceItemForm.patchValue({
          dimensionsOutterHeight: 0,
        });
      }
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
              });
              this.invoiceItemForm.patchValue({
                mirror: undefined,
              });
              this.invoiceItemForm.patchValue({
                faceting: undefined,
              });
              this.invoiceItemForm.patchValue({
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
              });
              if (!this.invoiceItemForm.value.dimensionsOutterWidth) {
                this.selectPasspartuWidth();
              }
              this.invoiceItemForm.patchValue({
                mirror: undefined,
              });
              this.invoiceItemForm.patchValue({
                faceting: undefined,
              });
              this.invoiceItemForm.patchValue({
                sanding: undefined,
              });
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
          });
          this.invoiceItemForm.patchValue({
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
              });
              this.invoiceItemForm.patchValue({
                glass: undefined,
              });
              this.invoiceItemForm.patchValue({
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
          });
          this.invoiceItemForm.patchValue({
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
        break;
      case 'mirror':
        this.invoiceItemForm.patchValue({
          mirror: undefined,
        });
        this.invoiceItemForm.patchValue({
          faceting: undefined,
        });
        this.invoiceItemForm.patchValue({
          sanding: undefined,
        });
        break;
    }
  }

  cancel(): void {
    this.route.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
