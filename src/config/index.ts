import merge from 'lodash.merge';
import { normalize, resolve as resolvePath } from 'path';
import { CkusroConfig } from '../models/ckusroConfig';

const defaultConfig: CkusroConfig = {
  outputDirectory: './out',
  targetDirectories: [
    {
      path: '../trapahi',
      name: 'trapahi',
      innerPath: 'wiki',
    },
  ],
  loaderConfig: {
    extensions: /\.(md|txt)$/,
  },
};

export function mergeConfig(conf: DeepPartial<CkusroConfig>): CkusroConfig {
  const tmp = merge(defaultConfig, conf);

  return {
    ...tmp,
    targetDirectories: tmp.targetDirectories.map((item) => ({
      ...item,
      path: resolvePath(item.path),
      innerPath: normalize(item.innerPath),
    })),
    outputDirectory: resolvePath(tmp.outputDirectory),
  };
}
