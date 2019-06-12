import {
  CkusroConfig,
  convertColorScheme,
} from '../../src/models/CkusroConfig';
import { RepoPath } from '../../src/models/RepoPath';

export function fixtureBuilder<T>(base: T): (override?: Partial<T>) => T {
  return (override: Partial<T> = {}) => {
    return { ...base, ...override };
  };
}

export const buildCkusroConfig = fixtureBuilder<CkusroConfig>({
  base: '/repositories',
  colorScheme: convertColorScheme({
    main: 'B22E42',
    accent: 'A4CE50',
    text: '090C02',
    background: 'DDE2C6',
    base: 'BBC5AA',
  }),
});

export const buildRepoPath = fixtureBuilder<RepoPath>({
  domain: 'example.com',
  user: 'tett23',
  name: 'test',
});
