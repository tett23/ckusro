export const CLICommandBuild: 'build' = 'build';
export const CLICommandWatch: 'watch' = 'watch';
// TODO: build-assets
// TODO: build-all

export type CLICommands = typeof CLICommandBuild | typeof CLICommandWatch;

export const validCLICommands: CLICommands[] = [
  CLICommandBuild,
  CLICommandWatch,
];

export function isCLICommands(value: any): value is CLICommands {
  return validCLICommands.includes(value);
}
