import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';
import { SidebarNavItemI } from './sidebar.interface';
import { SubscriptionManager } from '../../services/subscription.manager';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KeyboardNumericComponentService } from '../keyboard/numeric/keyboard-numeric.component.service';
import { UOM } from '../../constants';

export class NavItem {
  url: string = '';
  displayValue: string = '';
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [KeyboardNumericComponentService],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  invoiceNumberSubs!: Subscription;

  routes: NavItem[] = [
    { url: 'dashboard', displayValue: 'dashboard' },
    { url: 'invoice-create-edit/framing', displayValue: 'framing' },
    { url: 'invoice-create-edit/glassing', displayValue: 'glassing' },
    { url: 'invoices', displayValue: 'inProgress' },
    { url: 'invoice-charge', displayValue: 'chargeInvoice' },
    { url: 'search', displayValue: 'search' },
    { url: 'settings', displayValue: 'settings' },
    { url: 'exit', displayValue: 'exit' },
  ];
  selectedRoute: string = '';

  constructor(
    private router: Router,
    private keyboardNumericComponentService: KeyboardNumericComponentService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.subs.sink.$routerEvents = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url) {
        this.routes.forEach((route: { url: string; displayValue: string }) => {
          if (route.url.startsWith(val.url.replace('/', ''))) {
            this.selectedRoute = val.url.replace('/', '');
          }
        });
      }
    });
    this.routes.forEach((route: { url: string; displayValue: string }) => {
      if (route.url.startsWith(this.router.url.replace('/', ''))) {
        this.selectedRoute = this.router.url.replace('/', '');
      }
    });
  }

  navigateTo(url: string): void {
    if (url === 'exit') {
      // this.ipcService.send('exitApp');
    } else if (url === 'invoice-charge') {
      this.invoiceNumberSubs = this.keyboardNumericComponentService
        .openDialog(
          this.translateService.instant('insertInvoiceNumber'),
          UOM.NUMBER,
          false,
          this.translateService.instant('sevenDigitsNumber')
        )
        .subscribe((obj: { value: string; nextOperation: boolean }) => {
          if (obj?.value) {
            this.router.navigate(['invoice-create-edit', 'edit', obj.value]);
            // this.router.navigate(['invoice-charge', obj.value]);
          }
          if (this.invoiceNumberSubs) {
            this.invoiceNumberSubs.unsubscribe();
          }
        });
    } else {
      this.router.navigate([url]);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
