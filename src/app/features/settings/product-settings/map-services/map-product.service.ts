import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Entity } from 'src/app/shared/components/form/form.component';
import { TableShow } from 'src/app/shared/components/table-show/table-show.component';
import { ProductModel } from 'src/app/shared/models/product-model';
import { ProductSettings } from '../product-settings.interface';
import { getDisplayNumberAsString } from 'src/app/shared/utils';

@Injectable()
export class MapProductService implements ProductSettings<ProductModel> {
  constructor(public translateService: TranslateService) {}

  createEmptyEntity(): Observable<Entity[]> {
    return new Observable((subscriber) => {
      subscriber.next([
        {
          label: { key: 'name', value: this.translateService.instant('name') },
          type: 'string',
          value: '',
          required: true,
        },
        {
          label: { key: 'uom', value: this.translateService.instant('uom') },
          type: 'select',
          value: 'cm',
          optionalValues: [
            { key: 'cm', value: 'cm' },
            { key: 'mm', value: 'mm' },
            { key: 'm', value: 'm' },
            { key: 'm2', value: 'm2' },
          ],
          required: true,
        },
        {
          label: {
            key: 'pricePerUom',
            value: this.translateService.instant('ppUOM'),
          },
          type: 'number',
          value: 0,
          required: true,
        },
        {
          label: {
            key: 'cashRegisterNumber',
            value: this.translateService.instant('crNum'),
          },
          type: 'number',
          value: 0,
          required: true,
        },
      ]);
      subscriber.complete();
    });
  }

  mapEntityToFrame(entity: ProductModel): Observable<Entity[]> {
    return new Observable((subscriber) => {
      subscriber.next([
        {
          label: { key: 'id', value: this.translateService.instant('id') },
          type: 'string',
          value: entity.oid,
          disabled: true,
        },
        {
          label: { key: 'name', value: this.translateService.instant('name') },
          type: 'string',
          value: entity.name,
          required: true,
        },
        {
          label: { key: 'uom', value: this.translateService.instant('UOM') },
          type: 'select',
          value: entity.uom,
          optionalValues: [
            { key: 'cm', value: this.translateService.instant('cm') },
            { key: 'mm', value: this.translateService.instant('mm') },
            { key: 'm', value: this.translateService.instant('m') },
            { key: 'm2', value: this.translateService.instant('m2') },
          ],
          required: true,
        },
        {
          label: {
            key: 'pricePerUom',
            value: this.translateService.instant('pricePerUom'),
          },
          type: 'number',
          value: entity.pricePerUom || 0,
          required: true,
        },
        {
          label: {
            key: 'cashRegisterNumber',
            value: this.translateService.instant('cashRegisterNumber'),
          },
          type: 'number',
          value: entity.cashRegisterNumber || '',
          required: true,
        },
      ]);
      subscriber.complete();
    });
  }

  getTableData(entities: ProductModel[]): TableShow {
    let table: TableShow = {
      header: [
        this.translateService.instant('id'),
        this.translateService.instant('name'),
        this.translateService.instant('uom'),
        this.translateService.instant('pricePerUom'),
        this.translateService.instant('cashRegisterNumber'),
      ],
      rowData: [],
    };
    entities.forEach((entity) => {
      table.rowData.push({
        data: [
          entity.oid,
          entity.name,
          entity.uom,
          getDisplayNumberAsString(entity.pricePerUom),
          getDisplayNumberAsString(entity.cashRegisterNumber),
        ],
        isDeleted: !!!entity.isActive,
      });
    });
    return table;
  }
}
