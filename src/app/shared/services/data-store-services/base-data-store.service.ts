import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseModel } from '../../models/base-model';
import { BaseWebService } from '../web-services/base-web.service';

@Injectable()
export class BaseDataStoreService<T extends BaseModel> {
  private $entities: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public readonly entities: Observable<T[]> = this.$entities.asObservable();

  getEntities(): BehaviorSubject<T[]> {
    return this.$entities;
  }

  setEntities(entities: T[]): void {
    this.$entities.next(entities);
  }

  constructor(
    public baseWebService: BaseWebService,
    @Inject('') public domainName: string
  ) {
    this.baseWebService
      .getRequestForArray<T>(this.domainName)
      .subscribe((entities) => {
        this.$entities.next(entities);
      });
  }

  public createNewEntity(entity: T): Observable<void> {
    return new Observable((subscriber) => {
      // TODO zapamti izmenu u bazi i dodeli oid
      this.baseWebService
        .postRequest(this.domainName, entity)
        .subscribe((newEntity) => {
          let e = this.$entities.getValue();
          e.push(newEntity);
          this.$entities.next(e);
          subscriber.next();
          subscriber.complete();
        });
    });
  }

  public editEntity(entity: T): Observable<void> {
    return new Observable((subscriber) => {
      this.baseWebService
        .putRequest(this.domainName + '/' + entity.oid, entity)
        .subscribe(() => {
          let entities = this.$entities.getValue().map((frame: T) => {
            return entity.oid === frame.oid ? entity : frame;
          });
          this.$entities.next(entities);
          subscriber.next();
          subscriber.complete();
        });
    });
  }

  public deleteEntity(entity: T): Observable<boolean> {
    entity = { ...entity, isActive: false };
    return new Observable((subscriber) => {
      this.baseWebService
        .putRequest(this.domainName + '/' + entity.oid, entity)
        .subscribe(() => {
          const ents = this.$entities.getValue().map((e) => {
            return entity.oid === e.oid ? entity : e;
          });
          this.$entities.next(ents);
          subscriber.next(true);
          subscriber.complete();
        });
    });
  }

  public activateEntity(entity: T): Observable<boolean> {
    entity = { ...entity, isActive: true };
    return new Observable((subscriber) => {
      this.baseWebService
        .putRequest(this.domainName + '/' + entity.oid, entity)
        .subscribe(() => {
          const ents = this.$entities.getValue().map((e) => {
            return entity.oid === e.oid ? entity : e;
          });
          this.$entities.next(ents);
          subscriber.next(true);
          subscriber.complete();
        });
    });
  }
}
