import FS from 'fs';
import { initRepository } from '../../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../../__fixtures__';
import { pfs } from '../../__helpers__';
import add from '../../../src/RepositoryPrimitives/commands/add';
import { PathTreeObject } from '../../../src/models/PathTreeObject';
import { BlobObject, TreeObject, createWriteInfo } from '../../../src';
import fetchByOid from '../../../src/RepositoryPrimitives/fetchByOid';
import headTree from '../../../src/RepositoryPrimitives/headTree';

describe(add, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns TreeObject', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      '/foo/bar/baz.txt',
      Buffer.from('test', 'utf8'),
    );

    const actual = (await add(fs, config, root, writeInfo)) as PathTreeObject[];
    const expected = writeInfo.path.split('/');
    expect(actual.map(([item]) => item)).toMatchObject(expected);

    const content = ((await fetchByOid(
      fs,
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('test');
  });
});
