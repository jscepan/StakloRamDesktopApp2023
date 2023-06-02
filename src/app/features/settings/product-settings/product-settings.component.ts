import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableShow } from 'src/app/shared/components/table-show/table-show.component';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { CreateEditComponentService } from './create-edit-popup/create-edit-component.service';
import { FrameDataStoreService } from 'src/app/shared/services/data-store-services/frame-data-store.service';
import { BaseDataStoreService } from 'src/app/shared/services/data-store-services/base-data-store.service';
import { BaseModel } from 'src/app/shared/models/base-model';
import { MapFrameService } from './map-services/map-frame.service';
import { ProductSettings } from './product-settings.interface';
import { MODE } from 'src/app/shared/components/basic-alert/basic-alert.interface';
import { GlassDataStoreService } from 'src/app/shared/services/data-store-services/glass-data-store.service';
import { MapProductService } from './map-services/map-product.service';

@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrls: ['./product-settings.component.scss'],
  providers: [CreateEditComponentService, MapFrameService, MapProductService],
})
export class ProductSettingsComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  entities: any[] = [];
  productName?: string | null;

  table?: TableShow;

  mapService!: ProductSettings<BaseModel>;
  webService!: BaseDataStoreService<any>;
  productNameForAlert: string = '';

  showDeleted: boolean = false;

  constructor(
    private _activeRoute: ActivatedRoute,
    private route: Router,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private createEditComponentService: CreateEditComponentService,

    private mapFrameService: MapFrameService,
    private mapProductService: MapProductService,

    private frameDataService: FrameDataStoreService,
    private glassDataService: GlassDataStoreService
  ) {}

  ngOnInit(): void {
    this.productName = this._activeRoute.snapshot.paramMap.get('productName');
    if (!this.productName) {
      return;
    }
    switch (this.productName) {
      case 'frames':
        this.mapService = this.mapFrameService;
        this.webService = this.frameDataService;
        this.productNameForAlert = this.translateService.instant('frame');
        break;
      case 'glass':
        this.mapService = this.mapProductService;
        this.webService = this.glassDataService;
        this.productNameForAlert = this.translateService.instant('glass');
        break;
    }

    if (this.webService) {
      this.subs.sink.productSetings = this.webService.entities.subscribe(
        (entities) => {
          this.entities = entities;
          this.table = this.mapService.getTableData(entities);
        }
      );
    }
  }

  cancel(): void {
    this.route.navigate(['settings']);
  }

  createNewData(): void {
    this.subs.sink = this.mapService
      .createEmptyEntity()
      .subscribe((entities) => {
        this.createEditComponentService
          .openDialog(entities)
          .subscribe((data) => {
            if (data) {
              this.subs.sink.createNewData = this.webService
                .createNewEntity(data)
                .subscribe(() => {
                  this.globalService.showBasicAlert(
                    MODE.success,
                    this.translateService.instant('success'),
                    this.translateService.instant(this.productNameForAlert) +
                      ' ' +
                      this.translateService.instant('successfullyCreated')
                  );
                });
            }
          });
      });
  }

  clickEditData(oid: string): void {
    let entity = this.entities.find((e) => e.oid === oid);
    this.subs.sink = this.mapService
      .mapEntityToFrame(entity)
      .subscribe((entities) => {
        this.subs.sink.editData = this.createEditComponentService
          .openDialog(entities, true)
          .subscribe((data) => {
            if (data) {
              data.oid = oid;
              this.webService.editEntity(data).subscribe(() => {
                this.globalService.showBasicAlert(
                  MODE.success,
                  this.translateService.instant('success'),
                  this.translateService.instant(this.productNameForAlert) +
                    ' ' +
                    this.translateService.instant('successfullyEdited')
                );
              });
            }
          });
      });
  }

  clickDeleteData(oid: string): void {
    let entity = this.entities.find((e) => e.oid === oid);
    if (entity?.isActive) {
      this.subs.sink.editData = this.webService
        .deleteEntity(entity)
        .subscribe((isSuccess) => {
          if (isSuccess) {
            this.globalService.showBasicAlert(
              MODE.success,
              this.translateService.instant('success'),
              this.translateService.instant(this.productNameForAlert) +
                ' ' +
                this.translateService.instant('successfullyDeleted')
            );
          }
        });
    } else {
      this.subs.sink.editData = this.webService
        .activateEntity(entity)
        .subscribe((isSuccess) => {
          if (isSuccess) {
            this.globalService.showBasicAlert(
              MODE.success,
              this.translateService.instant('success'),
              this.translateService.instant(this.productNameForAlert) +
                ' ' +
                this.translateService.instant('successfullyActivated')
            );
          }
        });
    }
  }

  showDeletedEvent(show: boolean): void {
    this.showDeleted = show;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
