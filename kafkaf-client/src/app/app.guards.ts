import { CanMatchFn, Route, UrlSegment } from '@angular/router';

// helper: check if string is a positive integer
function isPositiveInt(value: string | null | undefined): boolean {
  return !!value && /^\d+$/.test(value) && Number(value) >= 0;
}

export const clusterGuardFn: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const segment = segments[1].path;

  return isPositiveInt(segment);
};

export const clusterBrokerGuardFn: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const cluster = segments[1]?.path;
  const broker = segments[3]?.path;

  return isPositiveInt(cluster) && isPositiveInt(broker);
};
