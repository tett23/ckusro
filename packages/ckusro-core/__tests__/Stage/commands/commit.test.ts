import * as Git from 'isomorphic-git';
import { initRepository } from '../../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../../__fixtures__';
import { pfs } from '../../__helpers__';
import { createWriteInfo } from '../../../src/models/writeInfo';
import { PathTreeObject } from '../../../src/RepositoryPrimitives/updateOrAppendObject';
import { BlobObject, TreeObject } from '../../../src';
import fetchByOid from '../../../src/RepositoryPrimitives/fetchByOid';
import headTree from '../../../src/RepositoryPrimitives/headTree';
import commit from '../../../src/Stage/commands/commit';
import { writeBlob } from '../../../src/RepositoryPrimitives/writeBlob';

describe(commit, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns CommitObject', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      '/foo/bar/baz.txt',
      new Buffer('test', 'utf8'),
    );

    const actual = (await writeBlob(
      config,
      root,
      writeInfo,
    )) as PathTreeObject[];
    const expected = writeInfo.path.split('/');

    expect(actual.map(([item]) => item)).toMatchObject(expected);

    const content = ((await fetchByOid(
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('test');
  });
});
