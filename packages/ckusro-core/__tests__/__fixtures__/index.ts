import {
  CkusroConfig,
  convertColorScheme,
} from '../../src/models/CkusroConfig';
import { InternalPath } from '../../src/models/InternalPath';
import { Plugins } from '../../src/models/plugins';
import { RepoPath } from '../../src/models/RepoPath';
import { TreeEntry } from '../../src';

export function fixtureBuilder<T>(base: T): (override?: Partial<T>) => T {
  return (override: Partial<T> = {}) => {
    return { ...base, ...override };
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildPlugins = fixtureBuilder<Plugins<any, any>>({
  parsers: [],
  components: [],
});

export const buildCkusroConfig = fixtureBuilder<CkusroConfig>({
  base: '/repositories',
  stage: '/stage',
  coreId: 'ckusro-core__test',
  colorScheme: convertColorScheme({
    main: 'B22E42',
    accent: 'A4CE50',
    text: '090C02',
    background: 'DDE2C6',
    base: 'BBC5AA',
  }),
  corsProxy: null,
  authentication: {
    github: null,
  },
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

export const buildTreeEntry = fixtureBuilder<TreeEntry>({
  type: 'tree',
  oid: '4b825dc642cb6eb9a060e54bf8d69288fbee4904',
  mode: '100644',
  path: 'test',
});
