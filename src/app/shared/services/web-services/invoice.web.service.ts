import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceModel } from '../../models/invoice-model';
import { BaseWebService } from './base-web.service';
import { EntityBaseWebService } from 'src/app/core/services/entity-base.web-service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceWebService {
  constructor(public baseWebService: BaseWebService) {}

  getEntityByOid(oid: string): Observable<InvoiceModel> {
    return this.baseWebService.getRequest<InvoiceModel>('invoices' + '/' + oid);
  }

  createEntity(invoice: InvoiceModel): Observable<InvoiceModel> {
    return this.baseWebService.postRequest<InvoiceModel>('invoices', invoice);
  }

  updateEntity(invoice: InvoiceModel): Observable<InvoiceModel> {
    return this.baseWebService.putRequest<InvoiceModel>('invoices', invoice);
  }
}
