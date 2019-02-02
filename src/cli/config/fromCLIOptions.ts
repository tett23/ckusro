import { readFileSync } from 'fs';
import jsyaml from 'js-yaml';
import merge from 'lodash.merge';
import { extname } from 'path';
import { CLIOptions } from '..';
import { CkusroConfig } from '../../models/ckusroConfig';
import { defaultPluginsConfig } from '../../models/DefaultPluginConfig';
import defaultPlugins from '../../models/plugins/defaultPlugins';
import { mergeConfig } from './index';
import toCkusroConfig, {
  isPartializedPrimitiveCkusroConfig,
  PrimitiveCkusroConfig,
} from './toCkusroConfig';

export type Options = {};

export default function fromCLIOptions(
  options: CLIOptions,
): CkusroConfig | Error {
  let configFile: DeepPartial<PrimitiveCkusroConfig> | null = null;
  if (typeof options.config === 'string') {
    const result = loadConfigFile(options.config);
    if (result instanceof Error) {
      return result;
    }

    configFile = result;
  }

  const merged: DeepPartial<PrimitiveCkusroConfig> | Error = merge(
    configFile || {},
    overrides(options),
  );
  if (merged instanceof Error) {
    return merged;
  }

  // FIXME
  merged.plugins = defaultPlugins(defaultPluginsConfig());

  const conf = toCkusroConfig(merged);
  // if (!isCkusroConfig(conf)) {
  //   console.log('err!', conf);
  //   return new Error('Malfolmed config file.');
  // }

  return mergeConfig(conf);
}

export function loadConfigFile(
  path: string,
): DeepPartial<PrimitiveCkusroConfig> | Error {
  let ret: any;
  const ext = extname(path);
  switch (ext) {
    case '.js': {
      ret = require(path);
      break;
    }
    case '.json': {
      const json = readFileSync(path, { encoding: 'utf8' });
      ret = JSON.parse(json);
      break;
    }
    case '.yaml':
    case '.yml': {
      const yaml = readFileSync(path, { encoding: 'utf8' });
      ret = jsyaml.load(yaml);
      break;
    }
    default:
      return new Error('Invalid file');
  }

  if (!isPartializedPrimitiveCkusroConfig(ret)) {
    return new Error('Marfolmed config file.');
  }

  return ret;
}

function overrides(
  options: CLIOptions,
): DeepPartial<PrimitiveCkusroConfig> | Error {
  const ret: DeepPartial<PrimitiveCkusroConfig> = {};

  if (options.outputDirectory != null) {
    ret.outputDirectory = options.outputDirectory;
  }
  if (options.targetDirectories != null) {
    ret.targetDirectories = options.targetDirectories;
  }
  if (options.enable != null) {
    ret.loaderConfig = merge(ret.loaderConfig, {
      enable: options.enable,
    });
  }

  if (!isPartializedPrimitiveCkusroConfig(ret)) {
    return new Error('Marfolmed config file.');
  }

  return ret;
}
