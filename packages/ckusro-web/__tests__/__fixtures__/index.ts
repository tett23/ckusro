import {
  CkusroConfig,
  RepoPath,
  InternalPath,
  TreeEntry,
  BlobBufferInfo,
} from '@ckusro/ckusro-core';
import { createHash } from 'crypto';
import { Ref, RefManager } from '../../src/models/RefManager';
import { State, initialState } from '../../src/modules';
import { PWorkers } from '../../src/Workers';
import { GlobalBlobWriteInfo } from '@ckusro/ckusro-core/lib/src/models/GlobalWriteInfo';

export function fixtureBuilder<T>(base: T): (override?: Partial<T>) => T {
  return (override: Partial<T> = {}) => {
    return { ...base, ...override };
  };
}

export const buildCkusroConfig = fixtureBuilder<CkusroConfig>({
  base: '/repositories',
  stage: '/stage',
  coreId: 'ckusro-web__test',
  corsProxy: null,
  authentication: {
    github: null,
  },
  colorScheme: {
    main: 0,
    accent: 0,
    text: 0,
    background: 0,
    base: 0,
  },
  plugins: {
    parsers: [],
    components: [],
  },
  repositories: [],
  git: {
    user: {
      name: 'test_user',
      email: 'test_user@example.com',
    },
  },
});

export const buildState = fixtureBuilder<State>({
  ...initialState(),
});

export const buildRepoPath = fixtureBuilder<RepoPath>({
  domain: 'example.com',
  user: 'test_user',
  name: 'test_repo',
});

export const buildInternalPath = fixtureBuilder<InternalPath>({
  path: '/',
  repoPath: buildRepoPath(),
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

export const buildInternalPathEntry = (
  internalPath: InternalPath,
  treeEntry: TreeEntry,
) => [internalPath, treeEntry] as const;

export const buildRef = fixtureBuilder<Ref>({
  repoPath: buildRepoPath(),
  name: 'HEAD',
  oid: '6250ead2a013f1e15bb8df838600ec8528fa5b8c',
});

export const buildRefManager = fixtureBuilder<RefManager>({ refs: [] });

export const buildBlobBufferInfo = fixtureBuilder<BlobBufferInfo>({
  type: 'blob',
  oid: randomOid(),
  internalPath: buildInternalPath(),
});

export const buildPWorkers = fixtureBuilder<PWorkers>({
  readConfig: jest.fn().mockResolvedValue(buildCkusroConfig()),
  writeConfig: jest.fn().mockResolvedValue(true),
  readPersistedState: jest.fn().mockResolvedValue(null),
  writePersistedState: jest.fn(),
  fetchObjects: jest.fn().mockResolvedValue([]),
  connectStore: jest.fn(),
  dispatch: jest.fn().mockResolvedValue(true),
});

export const buildGlobalBlobWriteInfo = fixtureBuilder<GlobalBlobWriteInfo>({
  type: 'blob',
  internalPath: buildInternalPath(),
  content: Buffer.from(''),
});
