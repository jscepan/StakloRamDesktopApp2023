import { Injectable } from '@angular/core';
import { BaseWebService } from '../web-services/base-web.service';
import { BaseDataStoreService } from './base-data-store.service';
import { FrameModel } from '../../models/frame-model';

@Injectable({ providedIn: 'root' })
export class FrameDataStoreService extends BaseDataStoreService<FrameModel> {
  constructor(public baseWebService: BaseWebService) {
    super(baseWebService, 'frames');
  }
}
