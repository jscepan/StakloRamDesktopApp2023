import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MODE } from 'src/app/shared/components/basic-alert/basic-alert.interface';
import { KeyboardAlphabetComponentService } from 'src/app/shared/components/keyboard/alphabet/keyboard-alphabet.component.service';
import { UserModel } from 'src/app/shared/models/user-model';
import { UserDataStoreService } from 'src/app/shared/services/data-store-services/user-data-store.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  providers: [KeyboardAlphabetComponentService],
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  users: UserModel[] = [];

  constructor(
    private route: Router,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private userDataStoreService: UserDataStoreService,
    private keyboardAlphabetComponentService: KeyboardAlphabetComponentService
  ) {}

  ngOnInit(): void {
    this.subs.sink.users = this.userDataStoreService.entities.subscribe(
      (entities) => {
        this.users = entities;
      }
    );
  }

  cancel(): void {
    this.route.navigate(['settings']);
  }

  createNewUser(): void {
    this.subs.sink.create = this.keyboardAlphabetComponentService
      .openDialog('', this.translateService.instant('userName'))
      .subscribe((name: string) => {
        if (name && name.trim().length > 0) {
          this.userDataStoreService
            .createNewEntity({ oid: '', name, isActive: true })
            .subscribe(() => {
              this.globalService.showBasicAlert(
                MODE.success,
                this.translateService.instant('success'),
                this.translateService.instant('user') +
                  ' ' +
                  this.translateService.instant('successfullyCreated')
              );
            });
        }
      });
  }

  toggleUserActivation(user: UserModel): void {
    if (user.isActive) {
      this.subs.sink.delete = this.userDataStoreService
        .deleteEntity(user)
        .subscribe(() => {
          this.globalService.showBasicAlert(
            MODE.success,
            this.translateService.instant('success'),
            this.translateService.instant('userDeactivated')
          );
        });
    } else {
      this.subs.sink.edit = this.userDataStoreService
        .editEntity({ ...user, isActive: true })
        .subscribe(() => {
          this.globalService.showBasicAlert(
            MODE.success,
            this.translateService.instant('success'),
            this.translateService.instant('userActivated')
          );
        });
    }
  }

  editUserData(user: UserModel): void {
    this.subs.sink.edit = this.keyboardAlphabetComponentService
      .openDialog(user.name, this.translateService.instant('userName'))
      .subscribe((name: string) => {
        if (name && name.trim().length > 0) {
          this.userDataStoreService
            .editEntity({ ...user, name })
            .subscribe(() => {
              this.globalService.showBasicAlert(
                MODE.success,
                this.translateService.instant('success'),
                this.translateService.instant('userDataChanged')
              );
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
