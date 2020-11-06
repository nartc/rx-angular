import { MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import { filter, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { unstable_cancelCallback, unstable_scheduleCallback } from './react-source-code/scheduler';
import { ReactSchedulerTask } from './react-source-code/schedulerMinHeap';
import { coalesceWith, coalescingManager } from '@rx-angular/template';
import { ReactPriorityLevel, ReactSchedulerWorkDefinition } from './model';


export const reactSchedulerTick = (priority: ReactPriorityLevel, work: () => void, options?: any): Observable<number> =>
  new Observable<number>((subscriber) => {
    const _work = () => {
      work();
      subscriber.next(0);
    };
    const task = unstable_scheduleCallback(priority, _work, options);
    return () => {
      unstable_cancelCallback(task);
    };
  });


// RenderBehavior
export function scheduleLikeReact<T>(priority: ReactPriorityLevel, work: any, context: any) {
  return (o$: Observable<T>): Observable<T> => o$.pipe(
    coalesceWith(reactSchedulerTick(priority, work), context)
  );
}

export function _scheduleLikeReact<T>(
  workDefinitionFn: () => ReactSchedulerWorkDefinition
): MonoTypeOperatorFunction<T> {
  // Local queue of references of the work function needed to dispose their execution
  let scheduledTask: ReactSchedulerTask;
  let workDefinition: ReactSchedulerWorkDefinition;
  const depleteQueue$ = new Observable<void>(subscriber => {
    subscriber.next();
    return () => {
      if (workDefinition) {
        coalescingManager.remove(workDefinition.scope);
      }
      if (scheduledTask) {
        unstable_cancelCallback(scheduledTask);
        scheduledTask = null;
        workDefinition = null;
      }
    };
  });
  return (o$: Observable<T>) => {
    // To clarify

    // If we could switchMap into the next schedule call
    // switchMap(() => globalWorker.scheduleTask(scheduledTask))
    // pro: do less work in global queue
    // cons: end up in eternal scheduling

    // Is it important to tie the signal of an executed work to the related scheduled work,
    // meaning maintaining the order of emission?
    return depleteQueue$.pipe(
      switchMapTo(o$),
      tap(() => workDefinition = workDefinitionFn()),
      filter(() => !coalescingManager.isCoalescing(workDefinition.scope)),
      switchMap(val => {
        if (scheduledTask) {
          unstable_cancelCallback(scheduledTask);
        }
        const workDone = new Subject<T>();
        coalescingManager.add(workDefinition.scope);
        scheduledTask = unstable_scheduleCallback(
          workDefinition.priority,
          () => {
            const w = workDefinition.work;
            const s = workDefinition.scope;
            scheduledTask = null;
            workDefinition = null;
            coalescingManager.remove(s);
            if (!coalescingManager.isCoalescing(s)) {
              w();
              workDone.next(val);
            }
          },
          null
        );
        return workDone;
      })
    );
  };
}
