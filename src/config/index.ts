import merge from 'lodash.merge';
import { normalize, resolve as resolvePath } from 'path';
import { CkusroConfig, isCkusroConfig } from '../models/ckusroConfig';

const defaultConfig: Omit<CkusroConfig, 'outputDirectory'> = {
  targetDirectories: [],
  loaderConfig: {
    extensions: /\.(md|txt)$/,
  },
  plugins: {
    parsers: [],
    components: [],
  },
};

export function mergeConfig(conf: DeepPartial<CkusroConfig>): CkusroConfig {
  const tmp = merge(defaultConfig, conf);
  if (!isCkusroConfig(tmp)) {
    throw new Error('Invalid shape');
  }

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
