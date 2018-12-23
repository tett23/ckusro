import { resolve as resolvePath } from 'path';

export type CkusroConfig = {
  targetDirectory: string;
  outputDirectory: string;
  loader: {
    extensions: RegExp;
  };
};

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
