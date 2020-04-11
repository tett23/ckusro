import fetchParents from '../../../src/RepositoryPrimitives/internal/fetchParents';
import { buildCkusroConfig, buildRepoPath } from '../../__fixtures__';
import { TreeObject } from '../../../src';
import { PathTreeObject } from '../../../src/models/PathTreeObject';
import {
  buildDummyRepository,
  DummyRepositoryResult,
} from '../../__fixtures__/buildDummyRepository';

describe(fetchParents, () => {
  const config = buildCkusroConfig();
  const repoPath = buildRepoPath();

  it('returns TreeObject', async () => {
    const findPath = '/foo/bar/baz';
    const { repository, isoConfig, fs } = (await buildDummyRepository(
      config,
      repoPath,
    )) as DummyRepositoryResult;
    const root = (await repository.headTreeObject()) as TreeObject;
    const actual = (await fetchParents(fs, isoConfig, root, findPath, {
      create: true,
    })) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject(['', 'foo', 'bar']);
  });

  it('returns TreeObject', async () => {
    const findPath = '/foo/bar/baz';
    const { repository, isoConfig, fs } = (await buildDummyRepository(
      config,
      repoPath,
    )) as DummyRepositoryResult;
    const root = (await repository.headTreeObject()) as TreeObject;

    const [[, newRoot]] = (await fetchParents(fs, isoConfig, root, findPath, {
      create: true,
    })) as PathTreeObject[];

    const actual = (await fetchParents(fs, isoConfig, newRoot, findPath, {
      create: true,
    })) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject(['', 'foo', 'bar']);
  });

  it('returns TreeObject', async () => {
    const findPath = '/foo/bar/baz';
    const { repository, isoConfig, fs } = (await buildDummyRepository(
      config,
      repoPath,
      {
        initialTree: {
          'foo/bar/baz': 'hoge',
        },
      },
    )) as DummyRepositoryResult;
    const root = (await repository.headTreeObject()) as TreeObject;

    const actual = (await fetchParents(
      fs,
      isoConfig,
      root,
      findPath,
    )) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject(['', 'foo', 'bar']);
  });

  it('returns TreeObject', async () => {
    const findPath = '/';
    const { repository, isoConfig, fs } = (await buildDummyRepository(
      config,
      repoPath,
      {
        initialTree: {
          'foo/bar/baz': '',
        },
      },
    )) as DummyRepositoryResult;
    const root = (await repository.headTreeObject()) as TreeObject;

    const actual = (await fetchParents(
      fs,
      isoConfig,
      root,
      findPath,
    )) as PathTreeObject[];

    expect(actual).toMatchObject([['', root]]);
  });

  it('returns TreeObject', async () => {
    const findPath = '';
    const { repository, isoConfig, fs } = (await buildDummyRepository(
      config,
      repoPath,
      {
        initialTree: {
          'foo/bar/baz': '',
        },
      },
    )) as DummyRepositoryResult;
    const root = (await repository.headTreeObject()) as TreeObject;
    const actual = (await fetchParents(
      fs,
      isoConfig,
      root,
      findPath,
    )) as PathTreeObject[];

    expect(actual).toMatchObject([['', root]]);
  });

  it('returns Error when object does not exists', async () => {
    const findPath = '/foo/bar';
    const { repository, isoConfig, fs } = (await buildDummyRepository(
      config,
      repoPath,
    )) as DummyRepositoryResult;
    const root = (await repository.headTreeObject()) as TreeObject;
    const actual = await fetchParents(fs, isoConfig, root, findPath);

    expect(actual).toBeInstanceOf(Error);
  });
});
