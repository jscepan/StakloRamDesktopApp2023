import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableShow } from 'src/app/shared/components/table-show/table-show.component';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
// import { CreateEditComponentService } from './create-edit-popup/create-edit-component.service';

@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrls: ['./product-settings.component.scss'],
  providers: [],
})
export class ProductSettingsComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  entities: any[] = [];
  productName: string = '';

  table?: TableShow;

  constructor(
    private _activeRoute: ActivatedRoute,
    private route: Router,
    private globalService: GlobalService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.route.navigate(['settings']);
  }

  createNewData(): void {}

  clickEditData(oid: string): void {}

  clickDeleteData(oid: string): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
