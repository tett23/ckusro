import merge from 'lodash.merge';
import { CkusroConfig, isTargetDirectories } from '../models/ckusroConfig';
import { LoaderConfig } from '../models/ckusroConfig/LoaderConfig';
import { isNonNullObject } from '../utils/types';

export type PrimitiveLoaderConfig = Omit<LoaderConfig, 'extensions'> & {
  extensions: string | RegExp;
};
export type PrimitiveCkusroConfig = Omit<CkusroConfig, 'loaderConfig'> & {
  loaderConfig: PrimitiveLoaderConfig;
};

export function isPartializedPrimitiveCkusroConfig(
  obj: any,
): obj is PrimitiveCkusroConfig {
  if (!isNonNullObject(obj)) {
    return false;
  }

  if (!isValidLoaderConfig(obj.loaderConfig)) {
    return false;
  }

  if (!isValidTargetDirectories(obj.targetDirectories)) {
    return false;
  }

  if (!isValidOutputDirectory(obj.outputDirectory)) {
    return false;
  }

  return true;
}

function isValidOutputDirectory(value: any): boolean {
  if (value === undefined) {
    return true;
  }

  return typeof value === 'string';
}

function isValidTargetDirectories(value: any): boolean {
  if (value === undefined) {
    return true;
  }

  return isTargetDirectories(value);
}

function isValidLoaderConfig(value: any): boolean {
  if (value === undefined) {
    return true;
  }

  return isPartializedPrimitiveLoaderConfig(value);
}

export function isPartializedPrimitiveLoaderConfig(
  obj: any,
): obj is DeepPartial<PrimitiveLoaderConfig> {
  if (!isNonNullObject(obj)) {
    return false;
  }

  if (!isValidExtensions(obj.extensions)) {
    return false;
  }

  return true;
}

function isValidExtensions(value: any): boolean {
  if (value === undefined) {
    return true;
  }

  return isRegExpOrString(value);
}

export default function toCkusroConfig(
  conf: DeepPartial<PrimitiveCkusroConfig>,
): DeepPartial<CkusroConfig> {
  const ret: DeepPartial<CkusroConfig> = merge({}, conf, {
    loaderConfig: toLoaderConfig(conf.loaderConfig || {}),
  });

  return ret;
}

export function toLoaderConfig(
  conf: DeepPartial<PrimitiveLoaderConfig>,
): DeepPartial<LoaderConfig> {
  const { extensions, ignore, ...omitExtensions } = conf;
  const ret: DeepPartial<LoaderConfig> = {
    ...omitExtensions,
  };

  if (isRegExpOrString(extensions)) {
    ret.extensions = toRegExp(extensions);
  }

  if (ignore != null) {
    ret.ignore = (ignore || []).flatMap(
      (item): [RegExp] | RegExp | [] => {
        if (!isRegExpOrString(item)) {
          return [];
        }
        if (item instanceof RegExp) {
          return item;
        }

        return toRegExp(item);
      },
    );
  }

  return ret;
}

export function isRegExpOrString(obj: any): obj is RegExp | string {
  return typeof obj === 'string' || obj instanceof RegExp;
}

const regexpPattern = /\/(.+)\/([a-z]?)/;

export function toRegExp(str: string | RegExp): RegExp {
  if (str instanceof RegExp) {
    return str;
  }
  if (!(typeof str === 'string')) {
    throw new Error(`Invalid regexp string. str=${str}`);
  }

  if (!regexpPattern.test(str)) {
    return new RegExp(str);
  }

  const [, pattern, flags] = regexpPattern.exec(str) as RegExpExecArray;

  return new RegExp(pattern, flags);
}
