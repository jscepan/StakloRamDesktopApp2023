import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsStoreService } from 'src/app/shared/services/settings-store.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';

@Component({
  selector: 'app-settings-layout',
  templateUrl: './settings-layout.component.html',
  styleUrls: ['./settings-layout.component.scss'],
})
export class SettingsLayoutComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  routes: string[] = [
    'frames',
    'glass',
    'passpartu',
    'passpartuColor',
    'mirror',
    'faceting',
    'sanding',
    'appSettings',
    'users',
  ];

  constructor(
    private router: Router,
    private settingsStoreService: SettingsStoreService
  ) {}

  ngOnInit(): void {}

  navigateTo(url: string): void {
    url === 'appSettings' || url === 'users'
      ? this.router.navigate(['settings', url])
      : this.router.navigate(['settings', 'products-settings', url]);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
