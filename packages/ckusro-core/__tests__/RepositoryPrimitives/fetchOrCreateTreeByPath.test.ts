import FS from 'fs';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { fetchOrCreateTreeByPath } from '../../src/RepositoryPrimitives/fetchOrCreateTreeByPath';
import { PathTreeObject } from '../../src/models/PathTreeObject';
import headTree from '../../src/RepositoryPrimitives/headTree';
import { TreeObject } from '../../src';

describe(fetchOrCreateTreeByPath, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns TreeObject', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const actual = (await fetchOrCreateTreeByPath(
      fs,
      config,
      root,
      '/foo/bar/baz',
    )) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject([
      '',
      'foo',
      'bar',
      'baz',
    ]);
  });

  it('returns TreeObject', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const actual = (await fetchOrCreateTreeByPath(
      fs,
      config,
      root,
      '/a/b/c/d/e/f/g',
    )) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject([
      '',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
    ]);
  });

  it('returns TreeObject', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const result = await fetchOrCreateTreeByPath(
      fs,
      config,
      root,
      '/foo/bar/baz',
    );
    expect(result).not.toBeInstanceOf(Error);

    const actual = (await fetchOrCreateTreeByPath(
      fs,
      config,
      root,
      '/foo/bar/baz',
    )) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject([
      '',
      'foo',
      'bar',
      'baz',
    ]);
  });

  it('returns TreeObject', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const actual = (await fetchOrCreateTreeByPath(
      fs,
      config,
      root,
      '/',
    )) as PathTreeObject[];

    expect(actual.length).toBe(1);
  });

  it('returns TreeObject', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const expected = (await fetchOrCreateTreeByPath(
      fs,
      config,
      root,
      '/foo',
    )) as PathTreeObject[];
    const actual = (await fetchOrCreateTreeByPath(
      fs,
      config,
      expected[0][1],
      '/foo',
    )) as PathTreeObject[];

    expect(actual.length).toBe(2);
    expect(expected.length).toBe(2);
    expect(actual[1][1].oid).toBe(expected[1][1].oid);
  });

  it('returns TreeObject when path does not normalized', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const actual = (await fetchOrCreateTreeByPath(
      fs,
      config,
      root,
      '//foo/./bar/..',
    )) as PathTreeObject[];

    expect(actual.length).toBe(2);
    expect(actual.map(([item]) => item)).toMatchObject(['', 'foo']);
  });
});
