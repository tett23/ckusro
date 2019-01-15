import { isNonNullObject } from '../../utils/types';

export type LoaderConfig = {
  enable: RegExp;
  ignore: RegExp[];
};

export function isLoaderConfig(obj: any): obj is LoaderConfig {
  if (!isNonNullObject(obj)) {
    return false;
  }

  if (!('enable' in obj)) {
    return false;
  }

  if (!(obj.enable instanceof RegExp)) {
    return false;
  }

  if (!Array.isArray(obj.ignore)) {
    return false;
  }
  const haveDoesNotRegExpItem = obj.ignore.some((item: any) => {
    return !(item instanceof RegExp);
  });
  if (haveDoesNotRegExpItem) {
    return false;
  }

  return true;
}

export function defaultLoaderConfig(): LoaderConfig {
  return {
    enable: /\.(md|txt)$/,
    ignore: [/\.git/, /node_modules/],
  };
}
