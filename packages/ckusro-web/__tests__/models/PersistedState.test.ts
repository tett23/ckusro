import { GitObject, RepoPath, url2RepoPath } from '@ckusro/ckusro-core';
import FS from 'fs';
import merge from 'lodash.merge';
import { join } from 'path';
import { TextEncoder } from 'util';
import zlib from 'zlib';
import {
  readPersistedState,
  serializeState,
  writePersistedState,
} from '../../src/models/PersistedState';
import {
  buildBlobObject,
  buildCkusroConfig,
  buildState,
} from '../__fixtures__';
import { pfs } from '../__helpers__/pfs';

describe('PersistedState', () => {
  describe(readPersistedState, () => {
    it('returns DeepPartial<State>', async () => {
      const config = buildCkusroConfig();
      const state = buildState({ config });
      const fs = pfs();

      const blobObject = buildBlobObject('');
      state.domain.objectManager[blobObject.oid] = blobObject;
      await writeGitObject(
        fs,
        config.base,
        url2RepoPath(state.domain.repositories[0].url) as RepoPath,
        blobObject,
      );
      const serialized = serializeState(state);
      await writePersistedState(fs, serialized);
      const actual = await readPersistedState(config.coreId, fs);

      expect(merge(state, actual)).toMatchObject(state);
    });
  });
});

async function writeGitObject(
  fs: typeof FS,
  base: string,
  repoPath: RepoPath,
  object: GitObject,
): Promise<true | Error> {
  const objectParentPath = join(
    base,
    repoPath.domain,
    repoPath.user,
    repoPath.name,
    '.git',
    'objects',
    object.oid.slice(0, 2),
  );
  await fs.promises.mkdir(objectParentPath, { recursive: true });

  const objectPath = join(objectParentPath, object.oid.slice(2));

  await fs.promises.writeFile(objectPath, deflate(toRawGitObject(object)));

  return true;
}

function toRawGitObject(object: GitObject): Buffer {
  let contentLength = 0;
  let contentBuf: Buffer;
  switch (object.type) {
    case 'blob':
      contentBuf = object.content;
      contentLength = object.content.length;
      break;
    default:
      throw new Error('');
  }

  const header = new TextEncoder().encode(
    `${object.type} ${contentLength}${'\0'}`,
  );

  return Buffer.concat([header, new Uint8Array(contentBuf)]);
}

function deflate(buf: Buffer): Buffer {
  return zlib.gzipSync(buf);
}
