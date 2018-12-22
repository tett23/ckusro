export type CkusroConfig = {
  targetDirectory: string;
  loader: {
    extensions: RegExp;
  };
};

const defaultConfig: CkusroConfig = {
  targetDirectory: '../trapahi/wiki',
  loader: {
    extensions: /\.(md|txt)$/,
  },
};

export function mergeConfig(conf: Partial<CkusroConfig>): CkusroConfig {
  return { ...defaultConfig, ...conf };
}
