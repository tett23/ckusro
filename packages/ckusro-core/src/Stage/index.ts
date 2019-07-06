import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import add from './commands/add';
import { prepare } from './prepare';
import { WriteInfo } from '../models/WriteInfo';

export function stage(config: CkusroConfig, fs: typeof FS) {
  return {
    prepare: () => prepare(config, fs),
    add: (writeInfo: WriteInfo) => add(config, writeInfo),
  };
}
