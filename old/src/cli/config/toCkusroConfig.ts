import merge from 'lodash.merge';
import { isNonNullObject } from '../../core/utils/types';
import { CkusroConfig, isTargetDirectories } from '../../models/ckusroConfig';
import { LoaderConfig } from '../../models/ckusroConfig/LoaderConfig';

export type PrimitiveLoaderConfig = Omit<LoaderConfig, 'enable' | 'ignore'> & {
  enable: string | RegExp;
  ignore: Array<string | RegExp>;
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

  if (obj.loaderConfig != null && !isValidLoaderConfig(obj.loaderConfig)) {
    return false;
  }

  if (
    obj.targetDirectories != null &&
    !isValidTargetDirectories(obj.targetDirectories)
  ) {
    return false;
  }

  if (
    obj.outputDirectory != null &&
    !isValidOutputDirectory(obj.outputDirectory)
  ) {
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

  if (!isValidEnable(obj.enable)) {
    return false;
  }

  return true;
}

function isValidEnable(value: any): boolean {
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
  const { enable, ignore, ...rest } = conf;
  const ret: DeepPartial<LoaderConfig> = {
    ...rest,
  };

  if (isRegExpOrString(enable)) {
    ret.enable = toRegExp(enable);
  }

  if (ignore != null) {
    ret.ignore = (ignore || [])
      .map(
        (item: string | DeepPartial<RegExp>): RegExp | null => {
          if (!isRegExpOrString(item)) {
            return null;
          }

          return toRegExp(item);
        },
      )
      .filter((item): item is RegExp => item != null);
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
