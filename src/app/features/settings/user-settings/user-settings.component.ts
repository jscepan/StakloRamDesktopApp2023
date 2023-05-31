import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  providers: [],
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  constructor(
    private route: Router,
    private globalService: GlobalService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.route.navigate(['settings']);
  }

  createNewUser(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
