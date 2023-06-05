import { BaseModel } from './base-model';

export class UserModel extends BaseModel {
  name: string = '';
  isActive: boolean = false;
}
