import {
  CLICommandBuild,
  CLICommands,
  isCLICommands,
} from '../../src/cli/cliCommands';

describe(isCLICommands, () => {
  it('judges type', () => {
    const validData: Array<[CLICommands, boolean]> = [CLICommandBuild].map(
      (v): [CLICommands, boolean] => [v, true],
    );
    const invalidData: Array<[any, boolean]> = [
      [null, false],
      [undefined, false],
      [0, false],
      [true, false],
      [[], false],
      [() => {}, false], // tslint:disable-line no-empty
    ];
    const data: Array<[any, boolean]> = validData.concat(invalidData);
    data.forEach(([value, expected]) => {
      const actual = isCLICommands(value);

      expect(actual).toBe(expected);
    });
  });
});
