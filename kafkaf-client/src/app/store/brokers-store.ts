import { Provider } from '@angular/core';
import { environment } from '../../environments/environment';
import { BaseState, BrokersInfoView, ItemIdPK } from '../store/models';
import { BaseStore } from './base-store';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import { filter, map, pairwise, startWith } from 'rxjs';

export class BrokersStore extends BaseStore<BrokersInfoView> {
  constructor(clusterIdx: number) {
    super({ clusterIdx });
  }

  protected override resourceUrl(clusterIdx: number): string {
    return `${environment.apiUrl}/clusters/${clusterIdx}/brokers`;
  }

  protected override resourceItemUrl(clusterIdx: number, _: ItemIdPK): string {
    return `${environment.apiUrl}/clusters/${clusterIdx}/brokers`;
  }

  protected override getItemKey(_: BrokersInfoView): string | number {
    throw new Error('Method not implemented.');
  }

  public loadBrokers(): void {
    this.loadItem(NaN, false);
  }
}

export function provideBrokersStore(): Provider {
  return {
    provide: BrokersStore,
    deps: [ActivatedRoute, LoggerService],
    useFactory: (route: ActivatedRoute, logger: LoggerService) => {
      const cache = new Map<number, BaseState<BrokersInfoView>>();
      const store = new BrokersStore(NaN);

      route.paramMap
        .pipe(
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
        )
        .subscribe(([prevCluster, currentCluster]) => {
          logger.debug('Cluster changed ', prevCluster, '→', currentCluster);

          // store old data
          if (prevCluster >= 0) {
            cache.set(prevCluster, store.wholeState());
          }

          const cachedState = cache.get(currentCluster);

          if (cachedState) {
            store.setState(cachedState);
            return;
          }

          const defaultState: BaseState<BrokersInfoView> = {
            items: [],
            clusterIdx: currentCluster,
          };

          store.setState(defaultState);
        });

      return store;
    },
  };
}
