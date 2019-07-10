import * as Git from 'isomorphic-git';
import { initRepository } from '../../../src/Stage/prepare';
import {
  buildIsomorphicGitConfig,
  buildInternalPath,
} from '../../__fixtures__';
import { pfs } from '../../__helpers__';
import add from '../../../src/Stage/commands/add';
import { PathTreeObject } from '../../../src/models/PathTreeObject';
import { BlobObject, TreeObject, createInternalPath } from '../../../src';
import fetchByOid from '../../../src/RepositoryPrimitives/fetchByOid';
import headTree from '../../../src/RepositoryPrimitives/headTree';
import { createGlobalWriteInfo } from '../../../src/models/GlobalWriteInfo';
import remove from '../../../src/Stage/commands/remove';

describe(add, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns PathTreeObject[]', async () => {
    const root = (await headTree(config)) as TreeObject;
    const globalWriteInfo = createGlobalWriteInfo(
      'blob',
      buildInternalPath({ path: '/foo/bar/baz.txt' }),
      new Buffer('test', 'utf8'),
    );
    const writeResult = (await add(
      config,
      root,
      globalWriteInfo,
    )) as PathTreeObject[];

    const content = ((await fetchByOid(
      config,
      writeResult[writeResult.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('test');

    const [[, newRoot]] = writeResult;

    const actual = (await remove(
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
