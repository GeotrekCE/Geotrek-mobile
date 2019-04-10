import { animate, style, transition, trigger } from '@angular/animations';

export const expandCollapse = trigger('expandCollapse', [
    transition(':enter', [
      style({ transform: 'scaleY(0)' }),
      animate('250ms ease-out', style({ transform: 'scaleY(1)' }))
    ]),
    transition(':leave', [
      style({ transform: 'scaleY(1)' }),
      animate('250ms ease-in', style({ transform: 'scaleY(0)' }))
    ])
  ]);
