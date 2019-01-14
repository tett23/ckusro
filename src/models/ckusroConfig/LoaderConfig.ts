import { isNonNullObject } from '../../utils/types';

export type LoaderConfig = {
  extensions: RegExp;
  ignore: RegExp[];
};

export function isLoaderConfig(obj: any): obj is LoaderConfig {
  if (!isNonNullObject(obj)) {
    return false;
  }

  if (!('extensions' in obj)) {
    return false;
  }

  if (!(obj.extensions instanceof RegExp)) {
    return false;
  }

  return true;
}

export function defaultLoaderConfig() {
  return {
    extensions: /.md/,
    ignore: [/\.git/, /node_modules/],
  };
}
