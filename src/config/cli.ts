import { readFileSync } from 'fs';
import jsyaml from 'js-yaml';
import merge from 'lodash.merge';
import { extname } from 'path';
import yargs, { Argv } from 'yargs';
import { CkusroConfig, TargetDirectory } from '../models/ckusroConfig';
import { mergeConfig } from './index';

export type Options = {};

export type IncompletenessOptions = {
  config: DeepPartial<CkusroConfig> | undefined;
  outputDirectory: string | undefined;
  targetDirectories: TargetDirectory[] | undefined;
  extensions: RegExp | undefined;
};

export function parser(): Argv<IncompletenessOptions> {
  return yargs
    .option('config', {
      alias: 'c',
      description: 'path to config file',
      coerce: (v: string) => {
        return loadConfigFile(v);
      },
    })
    .option('outputDirectory', {
      alias: 'o',
      description: 'output directory',
      type: 'string',
    })
    .option('extensions', {
      coerce: (v) => new RegExp(v),
    })
    .option('targetDirectories', {
      coerce: (): TargetDirectory[] => {
        return [];
      },
    });
}

export default function cli(args: string[]): CkusroConfig {
  const options = parser().parse(args);

  return mergeConfig(merge(options.config, overrides(options)));
}

const regexpPattern = /\/(.+)\/([a-z]?)/;

function jsonReviver(_: any, value: any) {
  if (typeof value === 'string') {
    if (regexpPattern.test(value)) {
      const [__, pattern, flags] = regexpPattern.exec(value) as RegExpExecArray;

      return new RegExp(pattern, flags);
    }
  }

  return value;
}

export function loadConfigFile(path: string): CkusroConfig {
  const ext = extname(path);
  switch (ext) {
    case '.js':
      return require(path);
    case '.json': {
      const json = readFileSync(path, { encoding: 'utf8' });
      return JSON.parse(json, jsonReviver);
    }
    case '.yaml':
    case '.yml': {
      const yaml = readFileSync(path, { encoding: 'utf8' });
      return jsyaml.load(yaml);
    }
    default:
      throw new Error('Invalid file');
  }
}

function overrides(options: IncompletenessOptions): DeepPartial<CkusroConfig> {
  const ret: DeepPartial<CkusroConfig> = { loaderConfig: {} };

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

  return ret;
}
