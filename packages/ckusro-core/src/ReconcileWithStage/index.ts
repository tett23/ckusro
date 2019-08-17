import FS from 'fs';
import remove from './commands/remove';
import Stage from '../Stage';
import { CkusroConfig } from '../models/CkusroConfig';
import { repositories } from '../Repositories';
import { InternalPath } from '../models/InternalPath';

export type Repositories = ReturnType<typeof reconcileWithStage>;

export async function reconcileWithStage(
  config: CkusroConfig,
  internalPath: InternalPath,
  fs: typeof FS,
) {
  const stage = await Stage(config, fs);
  if (stage instanceof Error) {
    return stage;
  }
  const repo = await repositories(config, fs).fetchRepository(
    internalPath.repoPath,
  );
  if (repo instanceof Error) {
    return repo;
  }

  return {
    remove: (internalPath: InternalPath) => remove(repo, stage, internalPath),
  };
}
