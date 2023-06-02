import { Observable } from 'rxjs';
import { Entity } from 'src/app/shared/components/form/form.component';
import { TableShow } from 'src/app/shared/components/table-show/table-show.component';
import { BaseModel } from 'src/app/shared/models/base-model';

export interface ProductSettings<T extends BaseModel> {
  createEmptyEntity(): Observable<Entity[]>;

  mapEntityToFrame(entity: T): Observable<Entity[]>;

  getTableData(entities: T[]): TableShow;
}
