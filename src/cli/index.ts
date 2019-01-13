import yargs, { Argv } from 'yargs';
import fromCLIOptions, { loadConfigFile } from '../config/fromCLIOptions';
import { TargetDirectory } from '../models/ckusroConfig';
import newGlobalState, { GlobalState } from '../models/globalState';
import {
  CLICommandBuild,
  CLICommands,
  CLICommandWatch,
  isCLICommands,
  validCLICommands,
} from './cliCommands';
import { buildHandler, watchHandler } from './commandHandlers';

export type CLIOptions = {
  command: string;
  config: any | undefined;
  outputDirectory: string | undefined;
  targetDirectories: TargetDirectory[] | undefined;
  extensions: string | undefined;
};

export function parser(): Argv<CLIOptions> {
  return yargs
    .command('build', 'build HTML files.', {
      command: {
        default: CLICommandBuild,
      },
    })
    .command('watch', 'watch and build HTML files.', {
      command: {
        default: CLICommandWatch,
      },
    })
    .option('command', {
      default: 'build',
      choices: validCLICommands,
    })
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
  const command = options.command;
  if (!isCLICommands(command)) {
    throw new Error('Invalid command.');
  }

  const conf = fromCLIOptions(options);
  const globalState = await newGlobalState(conf);
  if (globalState instanceof Error) {
    return globalState;
  }

  return run(command, globalState);
}

export async function run(command: CLICommands, globalState: GlobalState) {
  switch (command) {
    case CLICommandBuild:
      return await buildHandler(globalState);
    case CLICommandWatch:
      return await watchHandler(globalState);
  }
}
