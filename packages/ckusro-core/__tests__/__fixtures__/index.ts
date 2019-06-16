import {
  CkusroConfig,
  convertColorScheme,
} from '../../src/models/CkusroConfig';
import { InternalPath } from '../../src/models/InternalPath';
import { Plugins } from '../../src/models/plugins';
import { RepoPath } from '../../src/models/RepoPath';

export function fixtureBuilder<T>(base: T): (override?: Partial<T>) => T {
  return (override: Partial<T> = {}) => {
    return { ...base, ...override };
  };
}

export const buildPlugins = fixtureBuilder<Plugins>({
  parsers: [],
  components: [],
});

export const buildCkusroConfig = fixtureBuilder<CkusroConfig>({
  base: '/repositories',
  coreId: 'ckusro-core__test',
  colorScheme: convertColorScheme({
    main: 'B22E42',
    accent: 'A4CE50',
    text: '090C02',
    background: 'DDE2C6',
    base: 'BBC5AA',
  }),
  plugins: buildPlugins(),
});

export const buildRepoPath = fixtureBuilder<RepoPath>({
  domain: 'example.com',
  user: 'tett23',
  name: 'test',
});

export const buildInternalPath = fixtureBuilder<InternalPath>({
  repoPath: buildRepoPath(),
  path: 'foo.md',
});
