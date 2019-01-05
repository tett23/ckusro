export type TargetDirectory = {
  path: string;
  name: string;
  innerPath: string;
};

export type LoaderConfig = {
  extensions: RegExp;
};

export type CkusroConfig = {
  outputDirectory: string;
  targetDirectories: TargetDirectory[];
  loaderConfig: LoaderConfig;
};
