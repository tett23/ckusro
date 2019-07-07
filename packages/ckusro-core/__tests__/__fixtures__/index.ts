import {
  CkusroConfig,
  convertColorScheme,
} from '../../src/models/CkusroConfig';
import { InternalPath } from '../../src/models/InternalPath';
import { Plugins } from '../../src/models/plugins';
import { RepoPath } from '../../src/models/RepoPath';
import { TreeEntry } from '../../src';
import { createHash } from 'crypto';
import {
  IsomorphicGitConfig,
  toIsomorphicGitConfig,
} from '../../src/models/IsomorphicGitConfig';
import { RepositoryInfo } from '../../src/models/RepositoryInfo';

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

export const buildRepoPath = fixtureBuilder<RepoPath>({
  domain: 'example.com',
  user: 'tett23',
  name: 'test',
});

export const buildInternalPath = fixtureBuilder<InternalPath>({
  repoPath: buildRepoPath(),
  path: 'foo.md',
});

export const buildRepositoryInfo = fixtureBuilder<RepositoryInfo>({
  url: 'http://example.com',
  repoPath: buildRepoPath(),
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
  repositories: [buildRepositoryInfo()],
  git: {
    user: {
      name: 'test_user',
      email: 'test_user@example.com',
    },
  },
});

export const buildIsomorphicGitConfig = fixtureBuilder<IsomorphicGitConfig>({
  ...toIsomorphicGitConfig(buildCkusroConfig(), buildRepoPath()),
});

export const buildTreeEntry = fixtureBuilder<TreeEntry>({
  type: 'tree',
  oid: randomOid(),
  mode: '040000',
  path: 'test',
});

export function randomOid(): string {
  const currentDate = new Date().getTime().toString();
  const random = Math.random().toString();

  return createHash('sha1')
    .update(currentDate + random)
    .digest('hex');
}
