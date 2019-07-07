import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildTreeEntry, buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import {
  PathTreeObject,
  PathTreeOrBlobObject,
} from '../../src/RepositoryPrimitives/updateOrAppendObject';
import { TreeObject, createWriteInfo } from '../../src';
import headTree from '../../src/RepositoryPrimitives/headTree';
import { removeFromTree } from '../../src/RepositoryPrimitives/removeFromTree';
import { writeBlob } from '../../src/RepositoryPrimitives/writeBlob';

describe(removeFromTree, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns TreeEntry[]', async () => {
    const root = (await headTree(config)) as TreeObject;
    const tmp = (await writeBlob(config, root, {
      type: 'blob',
      path: '/foo/exists',
      content: Buffer.from(''),
    })) as PathTreeObject[];
    const writeResult = (await writeBlob(config, tmp[0][1], {
      type: 'blob',
      path: '/foo/remove',
      content: Buffer.from(''),
    })) as PathTreeOrBlobObject[];
    const parents = writeResult.slice(0, -1) as PathTreeObject[];
    const removeEntry = buildTreeEntry({
      path: 'remove',
    });

    expect(
      parents.slice(-1)[0][1].content.map((item) => item.path),
    ).toMatchObject(['exists', 'remove']);

    const actual = (await removeFromTree(
      config,
      parents,
      removeEntry.path,
    )) as PathTreeObject[];
    expect(actual).not.toBeInstanceOf(Error);

    const [[, leaf]] = actual.slice(-1);
    expect(leaf.content.map((item) => item.path)).toMatchObject(['exists']);
  });

  it('returns Error when parents is empty', async () => {
    const removeEntry = buildTreeEntry({
      path: '/test',
    });

    const actual = await removeFromTree(config, [], removeEntry.path);
    expect(actual).toBeInstanceOf(Error);
  });

  it('returns Error when TreeEntry does not exists', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeResult = (await writeBlob(
      config,
      root,
      createWriteInfo('blob', '/test', Buffer.from('')),
    )) as PathTreeOrBlobObject[];
    const parents = writeResult.slice(0, -1) as PathTreeObject[];
    const removeEntry = buildTreeEntry({
      path: 'does_not_exist',
    });

    const actual = await removeFromTree(config, parents, removeEntry.path);
    expect(actual).toBeInstanceOf(Error);
  });
});
