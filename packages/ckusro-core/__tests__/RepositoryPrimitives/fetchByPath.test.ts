import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { isBlobObject, GitObject, TreeObject, isTreeObject } from '../../src';
import { fetchByPath } from '../../src/RepositoryPrimitives/fetchByPath';
import { headTree } from '../../src/RepositoryPrimitives/headTree';
import { fetchOrCreateTreeByPath } from '../../src/RepositoryPrimitives/fetchOrCreateTreeByPath';
import { PathTreeObject } from '../../src/RepositoryPrimitives/updateOrAppendObject';

describe(fetchByPath, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns GitObject', async () => {
    const root = (await headTree(config)) as TreeObject;
    const actual = await fetchByPath(config, root, '/.gitkeep');

    expect(isBlobObject(actual as GitObject)).toBe(true);
  });

  it('returns GitObject', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeResult = (await fetchOrCreateTreeByPath(
      config,
      root,
      '/foo/bar/baz',
    )) as PathTreeObject[];
    expect(writeResult).not.toBeInstanceOf(Error);
    const [[, newRoot]] = writeResult;

    const actual = await fetchByPath(config, newRoot, '/foo/bar/baz');

    expect(isTreeObject(actual as GitObject)).toBe(true);
  });

  it('returns null', async () => {
    const root = (await headTree(config)) as TreeObject;
    const actual = await fetchByPath(config, root, '/does_not_exist');

    expect(actual).toBe(null);
  });

  it('returns TreeObject when path does not normalized', async () => {
    const root = (await headTree(config)) as TreeObject;
    const actual = await fetchByPath(config, root, '/a/../.gitkeep////');

    expect(isBlobObject(actual as GitObject)).toBe(true);
  });
});
