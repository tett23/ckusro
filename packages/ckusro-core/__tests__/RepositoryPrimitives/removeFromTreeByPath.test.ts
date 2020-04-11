import FS from 'fs';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import {
  PathTreeObject,
  PathTreeOrBlobObject,
} from '../../src/models/PathTreeObject';
import { TreeObject } from '../../src';
import headTree from '../../src/RepositoryPrimitives/headTree';
import { writeBlob } from '../../src/RepositoryPrimitives/writeBlob';
import removeFromTreeByPath from '../../src/RepositoryPrimitives/removeFromTreeByPath';

describe(removeFromTreeByPath, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns PathTreeObject[]', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const tmp = (await writeBlob(fs, config, root, {
      type: 'blob',
      path: '/test/exists',
      content: Buffer.from(''),
    })) as PathTreeObject[];
    const writeResult = (await writeBlob(fs, config, tmp[0][1], {
      type: 'blob',
      path: '/test/remove',
      content: Buffer.from(''),
    })) as PathTreeOrBlobObject[];
    const [[, newRoot]] = writeResult.slice(0, -1) as PathTreeObject[];
    const [[, parent]] = writeResult.slice(-2) as PathTreeObject[];

    expect(parent.content.map((item) => item.path)).toMatchObject([
      'exists',
      'remove',
    ]);

    const actual = (await removeFromTreeByPath(
      fs,
      config,
      newRoot,
      '/test/remove',
    )) as PathTreeObject[];
    expect(actual).not.toBeInstanceOf(Error);

    const [[, newLeaf]] = actual.slice(-1);
    expect(newLeaf.content.map((item) => item.path)).toMatchObject(['exists']);
  });
});
