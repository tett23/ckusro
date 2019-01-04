import merge from 'lodash.merge';
import { resolve as resolvePath } from 'path';
import { CkusroConfig } from '../models/ckusroConfig';

const defaultConfig: CkusroConfig = {
  targetDirectory: '../trapahi/wiki',
  outputDirectory: './out',
  loader: {
    extensions: /\.(md|txt)$/,
  },
};

export function mergeConfig(conf: DeepPartial<CkusroConfig>): CkusroConfig {
  const tmp = merge(defaultConfig, conf);

  return {
    ...tmp,
    targetDirectory: resolvePath(tmp.targetDirectory),
    outputDirectory: resolvePath(tmp.outputDirectory),
  };
}
