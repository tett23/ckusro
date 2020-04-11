import FS from 'fs';
import { initRepository } from '../../../src/Stage/prepare';
import {
  buildIsomorphicGitConfig,
  buildInternalPath,
} from '../../__fixtures__';
import { pfs } from '../../__helpers__';
import add from '../../../src/Stage/commands/add';
import { PathTreeObject } from '../../../src/models/PathTreeObject';
import {
  BlobObject,
  TreeObject,
  createInternalPath,
  InternalPathGitObject,
  InternalPathTreeObject,
} from '../../../src';
import fetchByOid from '../../../src/RepositoryPrimitives/fetchByOid';
import headTree from '../../../src/RepositoryPrimitives/headTree';
import { createGlobalWriteInfo } from '../../../src/models/GlobalWriteInfo';
import remove from '../../../src/Stage/commands/remove';

describe(add, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns PathTreeObject[]', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const globalWriteInfo = createGlobalWriteInfo(
      'blob',
      buildInternalPath({ path: '/foo/bar/baz.txt' }),
      new Buffer('test', 'utf8'),
    );
    const writeResult = (await add(
      fs,
      config,
      root,
      globalWriteInfo,
    )) as InternalPathGitObject[];

    const content = ((await fetchByOid(
      fs,
      config,
      writeResult[writeResult.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('test');

    const [[, newRoot]] = writeResult as InternalPathTreeObject[];

    const actual = (await remove(
      fs,
      config,
      newRoot,
      globalWriteInfo,
    )) as PathTreeObject[];

    const expected = createInternalPath(globalWriteInfo.internalPath)
      .flat()
      .split('/')
      .slice(0, -1);
    expect(actual.map(([item]) => item)).toMatchObject(expected);
  });
});
