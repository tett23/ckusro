import FS from 'fs';
import { initRepository } from '../../../src/Stage/prepare';
import {
  buildIsomorphicGitConfig,
  buildInternalPath,
} from '../../__fixtures__';
import { pfs } from '../../__helpers__';
import add from '../../../src/Stage/commands/add';
import {
  BlobObject,
  TreeObject,
  createInternalPath,
  InternalPathGitObject,
} from '../../../src';
import fetchByOid from '../../../src/RepositoryPrimitives/fetchByOid';
import headTree from '../../../src/RepositoryPrimitives/headTree';
import { createGlobalWriteInfo } from '../../../src/models/GlobalWriteInfo';

describe(add, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns TreeObject', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const internalPath = buildInternalPath({ path: '/foo/bar/baz.txt' });
    const globalWriteInfo = createGlobalWriteInfo(
      'blob',
      internalPath,
      Buffer.from('test', 'utf8'),
    );

    const actual = (await add(
      fs,
      config,
      root,
      globalWriteInfo,
    )) as InternalPathGitObject[];
    const expected = createInternalPath(internalPath).tree();
    expect(actual.map(([item]) => item.path)).toMatchObject(expected);

    const content = ((await fetchByOid(
      fs,
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('test');
  });
});
