import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import add from './commands/add';
import { prepare } from './prepare';
import { stageIsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import headTree from '../RepositoryPrimitives/headTree';
import { GlobalWriteInfo } from '../models/GlobalWriteInfo';
import repositoryPrimitives from '../RepositoryPrimitives';
import lsFiles from './lsFiles';
import clearStage from './clearStage';

export type Stage = PromiseThen<ReturnType<typeof stage>>;

export default async function stage(config: CkusroConfig, fs: typeof FS) {
  const gitConfig = stageIsomorphicGitConfig(config);

  const prepareResult = await prepare(gitConfig, fs);
  if (prepareResult instanceof Error) {
    return prepareResult;
  }

  const root = await headTree(gitConfig);
  if (root instanceof Error) {
    return root;
  }

  const repoPaths = config.repositories.map((item) => item.repoPath);

  return {
    ...repositoryPrimitives(gitConfig),
    prepare: () => prepare(gitConfig, fs),
    clear: () => clearStage(config, fs),
    lsFiles: () => lsFiles(gitConfig, repoPaths),
    add: (writeInfo: GlobalWriteInfo) => add(gitConfig, root, writeInfo),
    config: () => gitConfig,
  };
}
