import { Observable } from 'rxjs';

export interface DefaultStrategies {
  global: RenderStrategy;
  native: RenderStrategy;
  local: RenderStrategy;
  detach: RenderStrategy;
  noop: RenderStrategy;
}

interface RenderStrategy {
  /**
   * @property
   * Name of the strategy
   */
  name: string;
  /**
   * @property
   * Static method to uses the strategy specific behavior when call the render method.
   * Takes a callback that signals the render and returns an AbortController to stop scheduled work
   */
  scheduleCD: <T>(afterCD?: () => T) => AbortController;
  /**
   * @property
   * RxJS operator to uses the strategy specific behavior when call the render method.
   * Takes a callback that signals the render and returns and Observable to unsubscribe from and stop work.
   * This function will get called for every rendered value.
   */
  rxScheduleCD: <T>(o: Observable<T>) => Observable<any>;
  /**
   * @property
   * Calls the render method directly
   */
  // @TODO This is needed in situations like
  detectChanges: () => void;
}