import * as Git from 'isomorphic-git';
import FS from 'fs';
import { RepoPath, CkusroConfig } from '../../src';
import { initRepository } from '../../src/Stage/prepare';
import {
  toIsomorphicGitConfig,
  stageIsomorphicGitConfig,
} from '../../src/models/IsomorphicGitConfig';
import { pfs } from '../__helpers__';
import { repository } from '../../src/Repository';
import stage from '../../src/Stage';
import { writeObject } from '../../src/RepositoryPrimitives/writeObject';

type DummyRepositoryOptions = {
  fs: typeof FS;
};

export async function buildDummyRepository(
  config: CkusroConfig,
  repoPath: RepoPath,
  options: Partial<DummyRepositoryOptions>,
) {
  const { fs } = { ...dummyRepositoryDefaultOptions(), ...options };
  const isoConfig = toIsomorphicGitConfig(config, repoPath);
  const core = Git.cores.create(isoConfig.core);
  core.set('fs', fs);

  await initRepository(isoConfig);

  const repo = repository(isoConfig, repoPath);
  const rootTree = await writeObject(isoConfig, { type: 'tree', content: [] });
  if (rootTree instanceof Error) {
    return rootTree;
  }
  const commit = await repo.commit(rootTree, 'init');
  if (commit instanceof Error) {
    return commit;
  }
  const writeRefResult = await repo.writeRef('HEAD', commit, {
    force: true,
  });
  if (writeRefResult instanceof Error) {
    return writeRefResult;
  }

  return {
    isoConfig,
    repoPath,
    fs,
    repository: repo,
  };
}

export async function buildDummyStage(
  config: CkusroConfig,
  options: Partial<DummyRepositoryOptions>,
) {
  const { fs } = { ...dummyRepositoryDefaultOptions(), ...options };
  const isoConfig = stageIsomorphicGitConfig(config);
  const core = Git.cores.create(isoConfig.core + 'aa');
  core.set('fs', fs);

  const repo = await stage(config, fs);
  if (repo instanceof Error) {
    throw new Error('');
  }

  return {
    isoConfig,
    fs,
    repository: repo,
  };
}

function dummyRepositoryDefaultOptions(): DummyRepositoryOptions {
  return {
    fs: pfs(),
  };
}
