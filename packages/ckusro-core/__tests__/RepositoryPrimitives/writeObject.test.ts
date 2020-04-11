import FS from 'fs';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import {
  isTreeObject,
  TreeObject,
  CommitObject,
  isCommitObject,
  isBlobObject,
  BlobObject,
  isTagObject,
  TagObject,
} from '../../src';
import { writeObject } from '../../src/RepositoryPrimitives/writeObject';

describe(writeObject, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns CommitObject', async () => {
    const tree = await writeObject(fs, config, { type: 'tree', content: [] });
    const author = {
      name: 'test',
      email: 'test@example.com',
      timestamp: 1,
      timezoneOffset: 0,
    };
    const commit: CommitObject['content'] = {
      message: 'test',
      tree: (tree as TreeObject).oid,
      parent: [],
      author,
      committer: author,
    };
    const actual = await writeObject(fs, config, {
      type: 'commit',
      content: commit,
    });

    expect(isCommitObject(actual as CommitObject)).toBe(true);
  });

  it('returns TreeObject', async () => {
    const blob = await writeObject(fs, config, {
      type: 'blob',
      content: new Buffer(''),
    });
    const tree: TreeObject['content'] = [
      {
        mode: '100644',
        path: '.gitkeep',
        oid: (blob as BlobObject).oid,
        type: 'blob',
      },
    ];
    const actual = await writeObject(fs, config, {
      type: 'tree',
      content: tree,
    });

    expect(isTreeObject(actual as TreeObject)).toBe(true);
  });

  it('returns BlobObject', async () => {
    const actual = await writeObject(fs, config, {
      type: 'blob',
      content: new Buffer('test'),
    });

    expect(isBlobObject(actual as BlobObject)).toBe(true);
  });

  it('returns TagObject', async () => {
    const blob = await writeObject(fs, config, {
      type: 'blob',
      content: new Buffer('test'),
    });
    const author = {
      name: 'test',
      email: 'test@example.com',
      timestamp: 1,
      timezoneOffset: 0,
    };

    const tag: TagObject['content'] = {
      type: 'blob',
      object: (blob as BlobObject).oid,
      tag: 'test',
      message: 'test',
      tagger: author,
    };
    const actual = await writeObject(fs, config, { type: 'tag', content: tag });

    expect(isTagObject(actual as TagObject)).toBe(true);
  });
});
