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

export function isTargetDirectory(obj: any): obj is TargetDirectory {
  if (!('path' in obj)) {
    return false;
  }
  if (typeof obj.path !== 'string') {
    return false;
  }

  if (!('name' in obj)) {
    return false;
  }
  if (typeof obj.name !== 'string') {
    return false;
  }

  if (!('innerPath' in obj)) {
    return false;
  }
  if (typeof obj.innerPath !== 'string') {
    return false;
  }

  return true;
}

export function isTargetDirectories(obj: any): obj is TargetDirectory[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  return obj.every(isTargetDirectory);
}

export function isLoaderConfig(obj: any): obj is LoaderConfig {
  if (!('extensions' in obj)) {
    return false;
  }
  if (!(obj.extensions instanceof RegExp)) {
    return false;
  }

  return true;
}

export function isCkusroConfig(obj: any): obj is CkusroConfig {
  if (!('outputDirectory' in obj)) {
    return false;
  }
  if (typeof obj.outputDirectory !== 'string') {
    return false;
  }

  if (!('targetDirectories' in obj)) {
    return false;
  }
  if (!isTargetDirectories(obj.targetDirectories)) {
    return false;
  }

  if (!('loaderConfig' in obj)) {
    return false;
  }
  if (!isLoaderConfig(obj.loaderConfig)) {
    return false;
  }

  return true;
}
