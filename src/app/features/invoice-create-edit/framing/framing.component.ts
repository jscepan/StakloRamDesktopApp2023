import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';

@Component({
  selector: 'app-framing',
  templateUrl: './framing.component.html',
  styleUrls: ['./framing.component.scss'],
  providers: [],
})
export class FramingComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
