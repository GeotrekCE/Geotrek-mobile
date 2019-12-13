import { OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

export class UnSubscribe implements OnInit, OnDestroy {
  protected subscriptions$$: Subscription[];

  constructor() {
    this.subscriptions$$ = [];
  }

  ngOnInit() {
    if (!!this.subscriptions$$) {
      this.subscriptions$$ = [];
    }
  }

  ngOnDestroy() {
    this.subscriptions$$.forEach((subscription: Subscription) =>
      unsubscribe(subscription)
    );
    this.subscriptions$$ = [];
  }
}

export function unsubscribe(subscription: Subscription) {
  if (subscription && subscription.unsubscribe) {
    subscription.unsubscribe();
  }
}
