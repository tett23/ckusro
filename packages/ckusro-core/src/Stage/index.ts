import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import add from './commands/add';
import { prepare } from './prepare';
import { stageIsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import headTree from '../RepositoryPrimitives/headTree';
import { GlobalBlobWriteInfo } from '../models/GlobalWriteInfo';
import repositoryPrimitives from '../RepositoryPrimitives';
import lsFiles from './lsFiles';
import clearStage from './clearStage';
import { RepoPath } from '../models/RepoPath';
import checkout from './commands/checkout';

export type Stage = PromiseThen<ReturnType<typeof stage>>;

export default async function stage(fs: typeof FS, config: CkusroConfig) {
  const gitConfig = stageIsomorphicGitConfig(config);

  const prepareResult = await prepare(fs, gitConfig);
  if (prepareResult instanceof Error) {
    return prepareResult;
  }

  const root = await headTree(fs, gitConfig);
  if (root instanceof Error) {
    return root;
  }

  const repoPaths = config.repositories.map((item) => item.repoPath);

  return {
    ...repositoryPrimitives(fs, gitConfig),
    prepare: () => prepare(fs, gitConfig),
    clear: () => clearStage(fs, config),
    lsFiles: () => lsFiles(fs, gitConfig, repoPaths),
    add: (writeInfo: GlobalBlobWriteInfo) =>
      add(fs, gitConfig, root, writeInfo),
    checkout: (repoPath: RepoPath, ref: string) =>
      checkout(fs, config, repoPath, ref),
    config: () => gitConfig,
  };
}
