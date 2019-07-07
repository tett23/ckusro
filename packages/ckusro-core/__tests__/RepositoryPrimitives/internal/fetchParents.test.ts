import * as Git from 'isomorphic-git';
import fetchParents from '../../../src/RepositoryPrimitives/internal/fetchParents';
import { buildIsomorphicGitConfig } from '../../__fixtures__';
import { pfs } from '../../__helpers__';
import { initRepository } from '../../../src/Stage/prepare';
import headTree from '../../../src/RepositoryPrimitives/headTree';
import { TreeObject } from '../../../src';
import { PathTreeObject } from '../../../src/RepositoryPrimitives/updateOrAppendObject';

describe(fetchParents, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns TreeObject', async () => {
    const findPath = '/foo/bar/baz';
    const root = (await headTree(config)) as TreeObject;
    const actual = (await fetchParents(config, root, findPath, {
      create: true,
    })) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject(['', 'foo', 'bar']);
  });

  it('returns TreeObject', async () => {
    const findPath = '/foo/bar/baz';
    const root = (await headTree(config)) as TreeObject;

    const [[, newRoot]] = (await fetchParents(config, root, findPath, {
      create: true,
    })) as PathTreeObject[];

    const actual = (await fetchParents(config, newRoot, findPath, {
      create: true,
    })) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject(['', 'foo', 'bar']);
  });

  it('returns TreeObject', async () => {
    const findPath = '/';
    const root = (await headTree(config)) as TreeObject;
    const actual = (await fetchParents(
      config,
      root,
      findPath,
    )) as PathTreeObject[];

    expect(actual).toMatchObject([['', root]]);
  });

  it('returns TreeObject', async () => {
    const findPath = '';
    const root = (await headTree(config)) as TreeObject;
    const actual = (await fetchParents(
      config,
      root,
      findPath,
    )) as PathTreeObject[];

    expect(actual).toMatchObject([['', root]]);
  });

  it('returns Error when object does not exists', async () => {
    const findPath = '/foo/bar';
    const root = (await headTree(config)) as TreeObject;
    const actual = await fetchParents(config, root, findPath);

    expect(actual).toBeInstanceOf(Error);
  });
});
