import { BaseModel } from './base-model';
import { ProductModel } from './product-model';

export class PasspartuColorModel extends BaseModel {
  name!: string;
  isActive?: boolean;
  passpartu!: ProductModel;
}
