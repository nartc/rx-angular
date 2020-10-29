import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { RX_DEFAULT_STRATEGY } from '../../../features/experiments/structural-directives/rx-let-poc/default-strategy-token';
import { toBooleanArray } from './utils';

const chunk = (arr, n) => arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : [];

@Component({
  selector: 'rxa-sibling-custom',
  template: `
    <rxa-visualizer>
      <div visualizerHeader>
        <h3>{{siblings.length}} Siblings Custom Strategy</h3>
        <rxa-strategy-select (strategyChange)="strategyChange$.next($event)"></rxa-strategy-select>
        <button mat-button unpatch (click)="filled$.next(!filled$.getValue())">DoChange</button>
      </div>
      <div class="w-100">
        <ng-container *ngFor="let sibling of siblings; trackBy:trackBy">
          <div class="sibling" *rxLet="filled$; let f; strategy: strategyChange$" [ngClass]="{filled: f}" >&nbsp;</div>
        </ng-container>
      </div>
    </rxa-visualizer>
  `,
  host: {
    class: 'd-flex w-100'
  },
  styleUrls: ['./sibling.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiblingCustomComponent {

  siblings = [];
  filled$ = new BehaviorSubject<boolean>(false);
  strategyChange$ = new BehaviorSubject<string>(this.defaultStrategy);

  @Input()
  set count(num: number) {
    this.siblings = toBooleanArray(num);
    this.filled$.next(!this.filled$.getValue());
  };

  @Input()
  value: any;

  trackBy = i => i;

  constructor(
    @Inject(RX_DEFAULT_STRATEGY) private defaultStrategy: string
  ) {

  }

}
