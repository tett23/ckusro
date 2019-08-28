import FS from 'fs';
import * as Git from 'isomorphic-git';
import { CkusroConfig } from './models/CkusroConfig';
import { parser } from './Parser';
import { repositories } from './Repositories';
import stage from './Stage';

export type CkusroCore = ReturnType<typeof ckusroCore>

export default function ckusroCore(config: CkusroConfig, fs: typeof FS) {
  const core = Git.cores.create(config.coreId);
  core.set('fs', fs);

  return {
    repositories: () => repositories(config, fs),
    parser: () => parser(config),
    stage: () => stage(config, fs),
  };
}
