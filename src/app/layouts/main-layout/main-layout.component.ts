import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';
import {
  SidebarI,
  SidebarNavItemI,
} from 'src/app/shared/components/sidebar/sidebar.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  providers: [LocalStorageService],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  public subs: SubscriptionManager = new SubscriptionManager();

  sidebar!: SidebarI;

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    let navItems: SidebarNavItemI[] = [
      {
        id: 'dashboard',
        title: this.translateService.instant('dashboard'),
        icon: 'home',
        activated: false,
      },
    ];
    this.sidebar = {
      isExpanded: false,
      isCollapsible: true,
      logoUrl: '/assets/images/me-logo.png',
      navItems: navItems,
    };
  }

  changeLanguage(language: string): void {
    this.languageService.changeLanguage(language);
  }

  toggleSidebar(): void {
    this.sidebar = { ...this.sidebar, isExpanded: !this.sidebar.isExpanded };
  }

  sidebarEvents(event: any): void {
    if (event.eventName === 'changeLanguage') {
      this.languageService.changeLanguage(event.payload);
      location.reload();
    } else if (event.eventName === 'logout') {
      this.logout();
    } else if (event.eventName === 'passwordChange') {
      this.router.navigate(['settings', 'password-change']);
    } else if (event.eventName === 'userProfile') {
      this.router.navigate(['settings', 'user-profile']);
    } else {
      let selectedNavItem: SidebarNavItemI | undefined;
      this.sidebar.navItems.forEach((item) => {
        if (item.id === event.payload.navItemId) {
          selectedNavItem = item;
          return;
        }
        if (item.children?.length) {
          item.children.forEach((child) => {
            if (child.id === event.payload.navItemId) {
              selectedNavItem = child;
              return;
            }
          });
        }
      });
      if (selectedNavItem) {
        if (selectedNavItem?.children?.length) {
          this.sidebar = {
            ...this.sidebar,
            isExpanded: true,
            navItems: this.sidebar.navItems.map((item) => {
              return {
                ...item,
                activated: item.id === event.payload.navItemId,
              };
            }),
          };
        } else {
          this.sidebar = {
            ...this.sidebar,
            isExpanded: false,
            navItems: this.sidebar.navItems.map((item) => {
              return {
                ...item,
                activated: item.id === event.payload.navItemId,
              };
            }),
          };
          this.router.navigateByUrl(event.payload.navItemId);
        }
      }
    }
  }

  logout(): void {
    this.router.navigate(['auth/login']);
  }

  ngOnDestroy(): void {}
}
