export const CLICommandBuild: 'build' = 'build';

export type CLICommands = typeof CLICommandBuild;

export const validCLICommands: CLICommands[] = [CLICommandBuild];

export function isCLICommands(value: any): value is CLICommands {
  return validCLICommands.includes(value);
}
