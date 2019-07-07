import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig, buildInternalPath } from '../__fixtures__';
import { pfs } from '../__helpers__';
import {
  PathTreeObject,
  PathTreeOrBlobObject,
} from '../../src/RepositoryPrimitives/updateOrAppendObject';
import { TreeObject, createInternalPath } from '../../src';
import headTree from '../../src/RepositoryPrimitives/headTree';
import { writeBlob } from '../../src/RepositoryPrimitives/writeBlob';
import { removeFromTreeByPath } from '../../src/RepositoryPrimitives/removeFromTreeByPath';

describe(removeFromTreeByPath, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns PathTreeObject[]', async () => {
    const root = (await headTree(config)) as TreeObject;
    const tmp = (await writeBlob(config, root, {
      type: 'blob',
      internalPath: buildInternalPath({ path: 'exists' }),
      content: Buffer.from(''),
    })) as PathTreeObject[];
    const internalPath = buildInternalPath({ path: 'remove' });
    const writeResult = (await writeBlob(config, tmp[0][1], {
      type: 'blob',
      internalPath,
      content: Buffer.from(''),
    })) as PathTreeOrBlobObject[];
    const [[, newRoot]] = writeResult.slice(0, -1) as PathTreeObject[];
    const [[, parent]] = writeResult.slice(-2) as PathTreeObject[];

    expect(parent.content.map((item) => item.path)).toMatchObject([
      'exists',
      'remove',
    ]);

    const actual = (await removeFromTreeByPath(
      config,
      newRoot,
      createInternalPath(internalPath).flat(),
    )) as PathTreeObject[];
    expect(actual).not.toBeInstanceOf(Error);

    const [[, newLeaf]] = actual.slice(-1);
    expect(newLeaf.content.map((item) => item.path)).toMatchObject(['exists']);
  });
});
