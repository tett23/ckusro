import { CkusroConfig } from '../../src/models/CkusroConfig';

export function fixtureBuilder<T>(base: T): (override?: Partial<T>) => T {
  return (override: Partial<T> = {}) => {
    return { ...base, ...override };
  };
}

export const buildCkusroConfig = fixtureBuilder<CkusroConfig>({
  base: '/repositories',
});
