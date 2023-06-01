import { UOM } from '../constants';
import { BaseModel } from './base-model';

export class ProductModel extends BaseModel {
  name: string = '';
  uom: UOM = UOM.CENTIMETER;
  pricePerUom?: number;
  cashRegisterNumber?: number;
  isActive?: boolean;
}
