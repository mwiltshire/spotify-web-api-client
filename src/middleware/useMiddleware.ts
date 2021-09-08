import { Middleware } from './types';
import { Fetcher } from '../types';

export function useMiddleware(...fns: Middleware[]) {
  return (next: Fetcher) =>
    fns.reduceRight(async (r, n) => {
      const f = await r;
      return n(f);
    }, Promise.resolve(next));
}
