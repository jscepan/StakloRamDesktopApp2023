import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserModel } from '../../models/user-model';
import { BaseWebService } from '../web-services/base-web.service';
import { BaseDataStoreService } from './base-data-store.service';

@Injectable({ providedIn: 'root' })
export class UserDataStoreService extends BaseDataStoreService<UserModel> {
  private currentUser$: BehaviorSubject<UserModel | undefined> =
    new BehaviorSubject<UserModel | undefined>(undefined);
  public readonly currentUser: Observable<UserModel | undefined> =
    this.currentUser$.asObservable();
  entSubs: Subscription;

  selectUser(user: UserModel): void {
    this.currentUser$.next(user);
  }

  constructor(public baseWebService: BaseWebService) {
    super(baseWebService, 'users');
    this.entSubs = this.entities.subscribe((users) => {
      users.forEach((user) => {
        if (!this.currentUser$.getValue() && user.isActive) {
          this.selectUser(user);
          this.entSubs?.unsubscribe();
        }
      });
    });
  }

  public deleteEntity(entity: UserModel): Observable<boolean> {
    entity = { ...entity, isActive: false };
    return new Observable((subscriber) => {
      this.baseWebService
        .putRequest(this.domainName + '/' + entity.oid, entity)
        .subscribe(() => {
          let entities = this.getEntities()
            .getValue()
            .map((user) => {
              return user.oid === entity.oid
                ? { ...user, isActive: false }
                : user;
            });
          this.setEntities(entities);
          subscriber.next();
          subscriber.complete();
        });
    });
  }
}
