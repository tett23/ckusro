import FS from 'fs';
import * as Git from 'isomorphic-git';
import { CkusroConfig } from './models/CkusroConfig';
import { parser } from './Parser';
import { repositories } from './Repositories';

export default function ckusroCore(
  config: CkusroConfig,
  coreId: string,
  fs: typeof FS,
) {
  const core = Git.cores.create(coreId);
  core.set('fs', fs);

  return {
    repositories: (() => repositories(config, coreId, fs))(),
    parser: (() => parser(config))(),
  };
}
