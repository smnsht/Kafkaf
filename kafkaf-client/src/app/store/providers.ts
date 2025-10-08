import { Provider, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import { map, startWith, filter, pairwise, Observable } from 'rxjs';


/**
 * Emits pairs of [previousCluster, currentCluster] whenever the route param changes.
 */
export function clusterChanges$(
  route: ActivatedRoute,
  logger: LoggerService
): Observable<[number, number]> {
  return route.paramMap.pipe(
    map((params) => {
      const cluster = Number(params.get('cluster'));
      if (isNaN(cluster)) {
        logger.warn('Bad cluster param, got NaN!');
      }
      return cluster;
    }),
    startWith(-1),
    filter((cluster) => !isNaN(cluster)),
    pairwise()
  );
}


// export function provideClusteredStore<
//   TState,
//   TStore extends {
//     wholeState(): TState;
//     setState(state: TState): void;
//   }
// >(storeClass: Type<TStore>, createDefaultState: (clusterIdx: number) => TState): Provider {
//   const cache = new Map<number, TState>();

//   return {
//     provide: storeClass,
//     deps: [ActivatedRoute, LoggerService],
//     useFactory: (route: ActivatedRoute, logger: LoggerService) => {
//       const store = new storeClass(NaN); // assumes constructor takes clusterIdx

//       route.paramMap
//         .pipe(
//           map((params) => {
//             const cluster = Number(params.get('cluster'));
//             if (isNaN(cluster)) {
//               logger.warn('Bad cluster param, got NaN!');
//             }
//             return cluster;
//           }),
//           startWith(-1),
//           filter((cluster) => !isNaN(cluster)),
//           pairwise()
//         )
//         .subscribe(([prevCluster, currentCluster]) => {
//           logger.debug('Cluster changed ', prevCluster, '→', currentCluster);

//           // store old data
//           if (prevCluster >= 0) {
//             cache.set(prevCluster, store.wholeState());
//           }

//           const cachedState = cache.get(currentCluster);
//           if (cachedState) {
//             store.setState(cachedState);
//             return;
//           }

//           store.setState(createDefaultState(currentCluster));
//         });

//       return store;
//     },
//   };
// }
