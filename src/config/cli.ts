import { readFileSync } from 'fs';
import jsyaml from 'js-yaml';
import merge from 'lodash.merge';
import { extname } from 'path';
import { CLIOptions, parser } from '../cli';
import { CkusroConfig } from '../models/ckusroConfig';
import { mergeConfig } from './index';
import toCkusroConfig, {
  isPartializedPrimitiveCkusroConfig,
  PrimitiveCkusroConfig,
} from './toCkusroConfig';

export type Options = {};

export default function cli(args: string[]): CkusroConfig {
  const options = parser().parse(args);
  const merged = merge(options.config, overrides(options));
  const conf = toCkusroConfig(merged);

  return mergeConfig(conf);
}

export function loadConfigFile(
  path: string,
): DeepPartial<PrimitiveCkusroConfig> {
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
      throw new Error('Invalid file');
  }

  if (!isPartializedPrimitiveCkusroConfig(ret)) {
    throw new Error('Marfolmed config file.');
  }

  return ret;
}

function overrides(options: CLIOptions): DeepPartial<PrimitiveCkusroConfig> {
  const ret: DeepPartial<PrimitiveCkusroConfig> = {};

  if (options.outputDirectory != null) {
    ret.outputDirectory = options.outputDirectory;
  }
  if (options.targetDirectories != null) {
    ret.targetDirectories = options.targetDirectories;
  }
  if (options.extensions != null) {
    ret.loaderConfig = merge(ret.loaderConfig, {
      extensions: options.extensions,
    });
  }

  if (!isPartializedPrimitiveCkusroConfig(ret)) {
    throw new Error('Marfolmed config file.');
  }

  return ret;
}
