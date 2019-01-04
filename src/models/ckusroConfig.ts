export type TargetDirectory = {
  path: string;
  name: string;
  innerPath: string;
};

export type CkusroConfig = {
  outputDirectory: string;
  targetDirectories: TargetDirectory[];
  loaderConfig: {
    extensions: RegExp;
  };
};
