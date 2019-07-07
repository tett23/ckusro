import { BlobObject, CkusroConfig } from '@ckusro/ckusro-core';
import crypto from 'crypto';
import { Ref, RefManager } from '../../src/models/RefManager';
import { State } from '../../src/modules';
import { initialDomainState } from '../../src/modules/domain';
import { initialMiscState } from '../../src/modules/misc';
import { initialWorkerState } from '../../src/modules/workers';
import uiReducer from '../../src/modules/ui';

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
  domain: initialDomainState(),
  config: buildCkusroConfig(),
  misc: initialMiscState(),
  ui: uiReducer(undefined, {} as any), // eslint-disable-line @typescript-eslint/no-explicit-any
  workers: initialWorkerState(),
});

export const buildRef = fixtureBuilder<Ref>({
  repository: 'test_repo',
  name: 'HEAD',
  oid: '6250ead2a013f1e15bb8df838600ec8528fa5b8c',
});

export const buildRefManager = fixtureBuilder<RefManager>({});

export function buildBlobObject(content: string | Buffer): BlobObject {
  let buffer: Buffer;
  if (typeof content === 'string') {
    buffer = new Buffer(content);
  } else {
    buffer = content;
  }

  const oid = crypto
    .createHash('sha1')
    .update(buffer)
    .digest('hex');

  return {
    type: 'blob',
    oid,
    content: buffer,
  };
}
