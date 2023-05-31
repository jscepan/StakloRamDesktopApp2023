import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';

@Component({
  selector: 'app-invoice-create-edit',
  templateUrl: './invoice-create-edit.component.html',
  styleUrls: ['./invoice-create-edit.component.scss'],
  providers: [],
})
export class InvoiceCreateEditComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  isDraft: boolean = true;
  isEdit: boolean = true;
  currency: string = 'din';

  invoiceForm!: FormGroup;

  constructor(private route: Router, private _activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const oid = this._activeRoute.snapshot.paramMap.get('invoiceOid');
  }

  initializeForm(): void {}

  create(action: 'framing' | 'glassing'): void {}

  cancel(): void {
    this.route.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
