import FS from 'fs';
import { CkusroConfig } from './models/CkusroConfig';
import { parser } from './Parser';
import { repositories } from './Repositories';
import stage from './Stage';

export type CkusroCore = ReturnType<typeof ckusroCore>;

export default function ckusroCore(config: CkusroConfig, fs: typeof FS) {
  return {
    repositories: () => repositories(config, fs),
    parser: () => parser(config),
    stage: () => stage(fs, config),
  };
}
