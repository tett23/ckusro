import yargs, { Argv } from 'yargs';
import fromCLIOptions from '../cli/config/fromCLIOptions';
import { isErrors } from '../core/utils/types';
import { TargetDirectory } from '../models/ckusroConfig';
import { FileBuffersState } from '../models/FileBuffersState';
import {
  GlobalState,
  newGlobalState,
  reloadFiles,
} from '../models/GlobalState';
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
      type: 'string',
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

export default async function cli(argv: string[]): Promise<Error[] | void> {
  const options = parser().parse(argv);
  const command = options._[options._.length - 1];
  if (!isCLICommands(command)) {
    return [new Error('Invalid command.')];
  }

  const conf = fromCLIOptions(options);
  if (conf instanceof Error) {
    return [conf];
  }
  const globalState = await newGlobalState(conf);
  const fileBuffersState = await reloadFiles(globalState);
  if (isErrors(fileBuffersState)) {
    return fileBuffersState;
  }

  return run(command, globalState, fileBuffersState);
}

export async function run(
  command: CLICommands,
  globalState: GlobalState,
  fileBuffersState: FileBuffersState,
) {
  switch (command) {
    case CLICommandBuild:
      return await buildHandler(globalState, fileBuffersState);
    case CLICommandWatch:
      return await watchHandler(globalState, fileBuffersState);
  }
}
