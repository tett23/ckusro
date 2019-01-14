import { isNonNullObject } from '../../utils/types';
import { isPlugins, Plugins } from '../plugins';
import { isLoaderConfig, LoaderConfig } from './LoaderConfig';

export type TargetDirectory = {
  path: string;
  name: string;
  innerPath: string;
};

export type CkusroConfig = {
  outputDirectory: string;
  targetDirectories: TargetDirectory[];
  loaderConfig: LoaderConfig;
  plugins: Plugins;
};

export function isTargetDirectory(obj: any): obj is TargetDirectory {
  if (!isNonNullObject(obj)) {
    return false;
  }

  if (typeof obj.path !== 'string') {
    return false;
  }

  if (typeof obj.name !== 'string') {
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

export function isCkusroConfig(obj: any): obj is CkusroConfig {
  if (!isNonNullObject(obj)) {
    return false;
  }

  if (typeof obj.outputDirectory !== 'string') {
    return false;
  }

  if (!isTargetDirectories(obj.targetDirectories)) {
    return false;
  }

  if (!isLoaderConfig(obj.loaderConfig)) {
    return false;
  }

  if (!isPlugins(obj.plugins)) {
    return false;
  }

  return true;
}
