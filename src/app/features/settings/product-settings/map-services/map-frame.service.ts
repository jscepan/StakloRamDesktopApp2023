import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity } from 'src/app/shared/components/form/form.component';
import { TableShow } from 'src/app/shared/components/table-show/table-show.component';
import { FrameModel } from 'src/app/shared/models/frame-model';
import { MapProductService } from './map-product.service';

@Injectable()
// implements ProductSettings<FrameModel>
export class MapFrameService extends MapProductService {
  createEmptyEntity(): Observable<Entity[]> {
    return new Observable((subscriber) => {
      subscriber.next([
        {
          label: { key: 'code', value: this.translateService.instant('code') },
          type: 'string',
          value: '',
          required: true,
        },
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
            { key: 'm', value: 'm' },
            { key: 'cm', value: 'cm' },
            { key: 'mm', value: 'mm' },
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
            key: 'frameWidthMM',
            value: this.translateService.instant('fwMM'),
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

  mapEntityToFrame(entity: FrameModel): Observable<Entity[]> {
    return new Observable((subscriber) => {
      subscriber.next([
        {
          label: { key: 'id', value: this.translateService.instant('id') },
          type: 'string',
          value: entity.oid,
          disabled: true,
        },
        {
          label: { key: 'code', value: this.translateService.instant('code') },
          type: 'string',
          value: entity.code,
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
            { key: 'm', value: this.translateService.instant('m') },
            { key: 'cm', value: this.translateService.instant('cm') },
            { key: 'mm', value: this.translateService.instant('mm') },
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
            key: 'frameWidthMM',
            value: this.translateService.instant('frameWidthMM'),
          },
          type: 'number',
          value: entity.frameWidthMM,
          required: true,
        },
        {
          label: {
            key: 'cashRegisterNumber',
            value: this.translateService.instant('cashRegisterNumber'),
          },
          type: 'number',
          value: entity.cashRegisterNumber || 0,
          required: true,
        },
      ]);
      subscriber.complete();
    });
  }

  getTableData(entities: FrameModel[]): TableShow {
    let table: TableShow = {
      header: [
        this.translateService.instant('id'),
        this.translateService.instant('code'),
        this.translateService.instant('name'),
        this.translateService.instant('uom'),
        this.translateService.instant('pricePerUom'),
        this.translateService.instant('frameWidthMM'),
        this.translateService.instant('cashRegisterNumber'),
      ],
      rowData: [],
    };
    entities.forEach((entity) => {
      table.rowData.push({
        data: [
          entity.oid,
          entity.code,
          entity.name,
          entity.uom,
          entity.pricePerUom + '',
          entity.frameWidthMM + '',
          entity.cashRegisterNumber + '',
        ],
        isDeleted: !!!entity.isActive,
      });
    });
    return table;
  }
}
