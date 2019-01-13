import yargs, { Argv } from 'yargs';
import { loadConfigFile } from '../config/cli';
import { TargetDirectory } from '../models/ckusroConfig';

export type CLIOptions = {
  command: string;
  config: any | undefined;
  outputDirectory: string | undefined;
  targetDirectories: TargetDirectory[] | undefined;
  extensions: string | undefined;
};

export const CLICommandBuild: 'build' = 'build';

export type CLICommands = typeof CLICommandBuild;

export function parser(): Argv<CLIOptions> {
  return yargs
    .command('build', 'build HTML files.', {
      command: {
        default: CLICommandBuild,
      },
    })
    .option('command', {
      default: 'build',
      choices: [CLICommandBuild],
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
