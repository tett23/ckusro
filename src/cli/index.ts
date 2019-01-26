import yargs, { Argv } from 'yargs';
import fromCLIOptions, { loadConfigFile } from '../cli/config/fromCLIOptions';
import { isErrors } from '../core/utils/types';
import { TargetDirectory } from '../models/ckusroConfig';
import newOldGlobalState, { OldGlobalState } from '../models/OldGlobalState';
import {
  CLICommandBuild,
  CLICommands,
  CLICommandWatch,
  isCLICommands,
} from './cliCommands';
import { buildHandler } from './commandHandlers';
import watchHandler from './commandHandlers/watchHandler';

export type CLIOptions = {
  config: any | undefined;
  outputDirectory: string | undefined;
  targetDirectories: TargetDirectory[] | undefined;
  enable: string | undefined;
};

export function parser(): Argv<CLIOptions> {
  return yargs
    .command('build', 'build HTML files.')
    .command('watch', 'watch and build HTML files.')
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
    .option('enable', {
      type: 'string',
    })
    .option('targetDirectories', {
      coerce: (): TargetDirectory[] => {
        return [];
      },
    });
}

export default async function cli(argv: string[]) {
  const options = parser().parse(argv);
  const command = options._[options._.length - 1];
  if (!isCLICommands(command)) {
    throw new Error('Invalid command.');
  }

  const conf = fromCLIOptions(options);
  const globalState = await newOldGlobalState(conf);
  if (isErrors(globalState)) {
    return globalState;
  }

  return run(command, globalState);
}

export async function run(command: CLICommands, globalState: OldGlobalState) {
  switch (command) {
    case CLICommandBuild:
      return await buildHandler(globalState);
    case CLICommandWatch:
      return await watchHandler(globalState);
  }
}
