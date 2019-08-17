import { buildCkusroConfig, buildInternalPath } from '../../__fixtures__';
import {
  buildDummyRepository,
  buildDummyStage,
  DummyRepositoryResult,
  DummyStageResult,
} from '../../__fixtures__/buildDummyRepository';
import remove from '../../../src/ReconcileWithStage/commands/remove';
import { WithStageParents, PathTreeObject } from '../../../src';

describe(remove, () => {
  const config = buildCkusroConfig();

  it('returns WithStageParents', async () => {
    const internalPath = buildInternalPath({ path: '/foo/bar/baz.txt' });
    const repoPath = internalPath.repoPath;
    const initialCommit = {
      [internalPath.path]: '',
      '/foo/bar/a.txt': '',
    };
    const { repository, fs } = (await buildDummyRepository(config, repoPath, {
      initialCommit,
    })) as DummyRepositoryResult;
    if (repository instanceof Error) {
      throw repository;
    }
    const currentHeadOid = await repository.headOid();

    const { repository: stage } = (await buildDummyStage(config, {
      fs,
      initialCommit: [[repoPath, initialCommit]],
    })) as DummyStageResult;
    if (stage instanceof Error) {
      throw stage;
    }
    const currentStageOid = await stage.headOid();

    const actual = (await remove(
      repository,
      stage,
      internalPath,
    )) as WithStageParents;
    expect(actual).not.toBeInstanceOf(Error);

    const newRepo = actual.repository as PathTreeObject[];
    expect(newRepo[0][1].oid).not.toBe(currentHeadOid);
    expect(
      newRepo[newRepo.length - 1][1].content.map((item) => item.path),
    ).toEqual(['a.txt']);

    const newStage = actual.repository as PathTreeObject[];
    expect(newStage[0][1].oid).not.toBe(currentStageOid);
    expect(
      newStage[newStage.length - 1][1].content.map((item) => item.path),
    ).toEqual(['a.txt']);
  });

  it('returns WithStageParents when root children removed', async () => {
    const internalPath = buildInternalPath({ path: '/foo/bar/baz.txt' });
    const repoPath = internalPath.repoPath;
    const initialCommit = {
      [internalPath.path]: '',
      '/foo/bar/a.txt': '',
    };
    const { repository, fs } = (await buildDummyRepository(config, repoPath, {
      initialCommit,
    })) as DummyRepositoryResult;
    if (repository instanceof Error) {
      throw repository;
    }
    const currentHeadOid = await repository.headOid();

    const { repository: stage } = (await buildDummyStage(config, {
      fs,
      initialCommit: [[repoPath, initialCommit]],
    })) as DummyStageResult;
    if (stage instanceof Error) {
      throw stage;
    }
    const currentStageOid = await stage.headOid();

    const actual = (await remove(
      repository,
      stage,
      buildInternalPath({ repoPath, path: '/foo' }),
    )) as WithStageParents;
    expect(actual).not.toBeInstanceOf(Error);

    const newRepo = actual.repository as PathTreeObject[];
    expect(newRepo[0][1].oid).not.toBe(currentHeadOid);
    expect(newRepo[newRepo.length - 1][1].content).toEqual([]);

    const newStage = actual.repository as PathTreeObject[];
    expect(newStage[0][1].oid).not.toBe(currentStageOid);
    expect(newRepo[newRepo.length - 1][1].content).toEqual([]);
  });

  it('returns Error when called with `/`', async () => {
    const internalPath = buildInternalPath({ path: '/foo/bar/baz.txt' });
    const repoPath = internalPath.repoPath;
    const initialCommit = {
      [internalPath.path]: '',
      '/foo/bar/a.txt': '',
    };
    const { repository, fs } = (await buildDummyRepository(config, repoPath, {
      initialCommit,
    })) as DummyRepositoryResult;
    if (repository instanceof Error) {
      throw repository;
    }

    const { repository: stage } = (await buildDummyStage(config, {
      fs,
      initialCommit: [[repoPath, initialCommit]],
    })) as DummyStageResult;
    if (stage instanceof Error) {
      throw stage;
    }

    const actual = (await remove(
      repository,
      stage,
      buildInternalPath({ repoPath, path: '/' }),
    )) as WithStageParents;
    expect(actual).toBeInstanceOf(Error);
  });

  it('returns Error when the item does not exists', async () => {
    const internalPath = buildInternalPath({ path: '/foo/bar/baz.txt' });
    const repoPath = internalPath.repoPath;
    const initialCommit = {
      [internalPath.path]: '',
    };
    const { repository, fs } = (await buildDummyRepository(config, repoPath, {
      initialCommit,
    })) as DummyRepositoryResult;
    if (repository instanceof Error) {
      throw repository;
    }

    const { repository: stage } = (await buildDummyStage(config, {
      fs,
      initialCommit: [[repoPath, initialCommit]],
    })) as DummyStageResult;
    if (stage instanceof Error) {
      throw stage;
    }

    const actual = (await remove(
      repository,
      stage,
      buildInternalPath({ repoPath, path: '/does_not_exists' }),
    )) as WithStageParents;
    expect(actual).toBeInstanceOf(Error);
  });
});
