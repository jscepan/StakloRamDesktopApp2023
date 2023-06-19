import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceModel } from '../../models/invoice-model';
import { BaseWebService } from './base-web.service';
import { ArrayResponseI } from 'src/app/core/interfaces/array-response.interface';
import { constructUrl } from '../../utils';

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

  // searchEntities(data: InvoiceSearchModel): Observable<InvoiceModel[]> {
  //   return this.baseWebService.postRequest<InvoiceModel[]>('invoices/search', [
  //     new InvoiceModel(),
  //   ]);
  // }

  // searchEntities(
  //   data: InvoiceSearchModel
  // ): Observable<ArrayResponseI<InvoiceModel>> {
  //   return this.baseWebService.postRequest<ArrayResponseI<InvoiceModel>>(
  //     'invoices/search',
  //     { entities: [], nextID: 1, totalCount: 1 }
  //   );
  // }

  searchEntities = (
    data: InvoiceSearchModel,
    // SKIP - beggining of first row (0,50,100,150...)
    skip: number = 50,
    // TOP - how many results should be return (50)
    top?: number
  ): Observable<ArrayResponseI<InvoiceModel>> => {
    const url: string = constructUrl(`invoices/search`, skip, top);
    return this.baseWebService.postRequestForArray<
      InvoiceModel,
      InvoiceSearchModel
    >(url, data, InvoiceModel);
  };
}

export class InvoiceSearchModel {
  buyerName?: string;
  dateFrom?: Date;
  dateTo?: Date;
  advancePaymentFrom?: number;
  advancePaymentTo?: number;
  ordering: 'ASC' | 'DESC' = 'DESC';
}
