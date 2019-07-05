import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildCkusroConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { fetchOrCreateTreeByPath } from '../../src/Stage/fetchOrCreateTreeByPath';
import { PathTreeObject } from '../../src/Stage/updateOrAppendObject';

describe(fetchOrCreateTreeByPath, () => {
  const config = buildCkusroConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns TreeObject', async () => {
    const actual = (await fetchOrCreateTreeByPath(
      config,
      '/foo/bar/baz',
    )) as PathTreeObject[];

    expect(actual.length).toBe(4);
    expect(actual.map(([item]) => item)).toMatchObject([
      '',
      'foo',
      'bar',
      'baz',
    ]);
  });

  it('returns TreeObject', async () => {
    const actual = (await fetchOrCreateTreeByPath(
      config,
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
    const result = await fetchOrCreateTreeByPath(config, '/foo/bar/baz');
    expect(result).not.toBeInstanceOf(Error);

    const actual = (await fetchOrCreateTreeByPath(
      config,
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
    const actual = (await fetchOrCreateTreeByPath(
      config,
      '/',
    )) as PathTreeObject[];

    expect(actual.length).toBe(1);
  });

  it('returns TreeObject', async () => {
    const expected = (await fetchOrCreateTreeByPath(
      config,
      '/foo',
    )) as PathTreeObject[];
    const actual = (await fetchOrCreateTreeByPath(
      config,
      '/foo',
    )) as PathTreeObject[];

    expect(actual.length).toBe(2);
    expect(expected.length).toBe(2);
    expect(actual[1][1].oid).toBe(expected[1][1].oid);
  });

  it('returns TreeObject when path does not normalized', async () => {
    const actual = (await fetchOrCreateTreeByPath(
      config,
      '//foo/./bar/..',
    )) as PathTreeObject[];

    expect(actual.length).toBe(2);
    expect(actual.map(([item]) => item)).toMatchObject(['', 'foo']);
  });
});
