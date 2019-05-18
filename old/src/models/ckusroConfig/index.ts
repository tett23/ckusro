import { isNonNullObject, isPropertyValidTypeOf } from '../../core/utils/types';
import { ContextTypes, isValidContextType } from '../loaderContext';
import { isPlugins, Plugins } from '../plugins';
import { isLoaderConfig, LoaderConfig } from './LoaderConfig';

export type TargetDirectory = {
  type: ContextTypes;
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

export function isTargetDirectory(obj: unknown): obj is TargetDirectory {
  if (!isNonNullObject(obj)) {
    return false;
  }

  const cast = obj as TargetDirectory;

  return (
    isPropertyValidTypeOf(cast, 'type', isValidContextType) &&
    isPropertyValidTypeOf(cast, 'path', 'string') &&
    isPropertyValidTypeOf(cast, 'name', 'string') &&
    isPropertyValidTypeOf(cast, 'innerPath', 'string')
  );
}

export function isTargetDirectories(obj: unknown): obj is TargetDirectory[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  return obj.every(isTargetDirectory);
}

export function isCkusroConfig(obj: unknown): obj is CkusroConfig {
  if (!isNonNullObject(obj)) {
    return false;
  }

  const cast = obj as CkusroConfig;

  return (
    isPropertyValidTypeOf(cast, 'outputDirectory', 'string') &&
    isPropertyValidTypeOf(cast, 'targetDirectories', isTargetDirectories) &&
    isPropertyValidTypeOf(cast, 'loaderConfig', isLoaderConfig) &&
    isPropertyValidTypeOf(cast, 'plugins', isPlugins)
  );
}
