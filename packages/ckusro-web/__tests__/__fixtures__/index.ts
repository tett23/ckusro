import { BlobObject, CkusroConfig } from '@ckusro/ckusro-core';
import crypto from 'crypto';
import { Ref, RefManager } from '../../src/models/RefManager';
import { State } from '../../src/modules';
import { initialDomainState } from '../../src/modules/domain';
import { initialGitObjectListState } from '../../src/modules/gitObjectList';
import { initialMiscState } from '../../src/modules/misc';
import { initialObjectViewState } from '../../src/modules/objectView';
import { initialWorkerState } from '../../src/modules/workers';

export function fixtureBuilder<T>(base: T): (override?: Partial<T>) => T {
  return (override: Partial<T> = {}) => {
    return { ...base, ...override };
  };
}

export const buildCkusroConfig = fixtureBuilder<CkusroConfig>({
  base: '/repositories',
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
});

export const buildState = fixtureBuilder<State>({
  domain: initialDomainState(),
  config: buildCkusroConfig(),
  misc: initialMiscState(),
  objectView: initialObjectViewState(),
  gitObjectList: initialGitObjectListState(),
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
