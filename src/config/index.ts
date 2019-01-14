import merge from 'lodash.merge';
import { normalize, resolve as resolvePath } from 'path';
import { CkusroConfig, isCkusroConfig } from '../models/ckusroConfig';
import { defaultPluginsConfig } from '../models/pluginConfig';
import defaultPlugins from '../models/plugins/defaultPlugins';

export const defaultConfig: Omit<
  CkusroConfig,
  'outputDirectory' | 'plugins'
> = {
  targetDirectories: [],
  loaderConfig: {
    extensions: /\.(md|txt)$/,
    ignore: [/\.git/, /node_modules/],
  },
};

export function mergeConfig(conf: DeepPartial<CkusroConfig>): CkusroConfig {
  const tmp = merge(defaultConfig, conf);
  tmp.plugins = merge(defaultPlugins(defaultPluginsConfig()), tmp.plugins);

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
