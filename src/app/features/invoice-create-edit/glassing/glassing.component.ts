import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';

@Component({
  selector: 'app-glassing',
  templateUrl: './glassing.component.html',
  styleUrls: ['./glassing.component.scss'],
  providers: [],
})
export class GlassingComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  invoiceOid: string | undefined;
  isEdit: boolean = false;

  constructor(private route: Router, private _activeRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
