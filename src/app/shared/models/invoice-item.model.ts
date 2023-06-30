import { SERVICE_TYPE, UOM } from '../constants';
import { BaseModel } from './base-model';
import { FrameModel } from './frame-model';
import { PasspartuColorModel } from './passpartu-color-model';
import { ProductModel } from './product-model';

export class InvoiceItemModel extends BaseModel {
  title: string = '';
  serviceType?: SERVICE_TYPE;
  dimensionsWidth: number = 0;
  dimensionsHeight: number = 0;
  dimensionsUom: UOM = UOM.CENTIMETER;
  dimensionsOutterWidth?: number;
  dimensionsOutterHeight?: number;
  glass?: ProductModel;
  passpartuWidth?: number;
  passpartuWidthUom?: UOM;
  passpartuColor?: PasspartuColorModel;
  mirror?: ProductModel;
  faceting?: ProductModel;
  sanding?: ProductModel;
  selectedFrames: { frame: FrameModel; colorCode?: string }[] = [];
  selectedPasspartuColors?: {
    passpartuColor?: PasspartuColorModel;
    passpartuWidth?: number;
    passpartuWidthUom?: UOM;
  }[] = [];
  amount: number = 0;
}
