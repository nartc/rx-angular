import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { toBooleanArray } from './utils';
import { RX_PRIMARY_STRATEGY } from '../../render-stragegies';
import { RxState } from '@rx-angular/state';
import { map } from 'rxjs/operators';

const chunk = (arr, n) => arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : [];

@Component({
  selector: 'rxa-sibling-strategy',
  template: `
    <rxa-visualizer>
      <div visualizerHeader>
        <h3>{{siblings.length}} Siblings</h3>
      </div>
      <div class="w-100 siblings">
        <div class="sibling" *ngFor="let sibling of siblings$ | push; trackBy:trackBy">
          <div *rxLet="filled$; let f; strategy: strategy$" [ngClass]="{filled: f}">&nbsp;</div>
        </div>
      </div>
    </rxa-visualizer>
  `,
  host: {
    class: 'd-flex w-100'
  },
  styleUrls: ['./sibling.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiblingStrategyComponent extends RxState<{ siblings: any[], strategy: string, filled: boolean }> {

  filled$ = this.select('filled').pipe(
    //map(() => toBoolean(toRandom()))
  );
  siblings$ = this.select('siblings');
  siblings = [];
  strategy$ = this.select('strategy');
  m$ = this.$;

  @Input()
  set count(num$: Observable<number | string>) {
    this.connect('siblings', num$.pipe(map(num => {
      this.siblings = toBooleanArray(parseInt(num as any, 10));
      return this.siblings;
    })));

  };

  @Input()
  set filled(filled$: Observable<boolean>) {
    this.connect('filled', filled$);
  }

  @Input()
  value: any;

  @Input()
  set strategy(strategy: string) {
    this.set({ strategy });
  };

  trackBy = i => i;

  constructor(
    @Inject(RX_PRIMARY_STRATEGY) private defaultStrategy: string
  ) {
    super();
    this.set({
      strategy: defaultStrategy,
      filled: true
    });
  }

}

