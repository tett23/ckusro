import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import add from './commands/add';
import { prepare } from './prepare';
import { WriteInfo } from '../models/WriteInfo';
import { stageIsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import headTree from '../RepositoryPrimitives/headTree';
import commit from './commands/commit';
import { TreeObject } from '../models/GitObject';

export default async function stage(config: CkusroConfig, fs: typeof FS) {
  const gitConfig = stageIsomorphicGitConfig(config);
  const root = await headTree(gitConfig);
  if (root instanceof Error) {
    return root;
  }

  return {
    prepare: () => prepare(gitConfig, fs),
    add: (writeInfo: WriteInfo) => {
      add(gitConfig, root, writeInfo);
    },
    commit: (root: TreeObject, message: string) =>
      commit(gitConfig, root, message),
  };
}
