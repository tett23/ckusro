import { resolve as resolvePath } from 'path';
import { CkusroConfig } from '../models/ckusroConfig';

const defaultConfig: CkusroConfig = {
  targetDirectory: '../trapahi/wiki',
  outputDirectory: './out',
  loader: {
    extensions: /\.(md|txt)$/,
  },
};

export function mergeConfig(conf: Partial<CkusroConfig>): CkusroConfig {
  const tmp = { ...defaultConfig, ...conf };

  return {
    ...tmp,
    targetDirectory: resolvePath(tmp.targetDirectory),
    outputDirectory: resolvePath(tmp.outputDirectory),
  };
}
