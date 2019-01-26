import {
  statType,
  StatTypeBlockDevice,
  StatTypeCharacterDevice,
  StatTypeDirectory,
  StatTypeFIFO,
  StatTypeFile,
  StatTypes,
  StatTypeSocket,
  StatTypeSymbolicLink,
} from '../../src/models/StatType';

describe(statType, () => {
  it('returns StatType', () => {
    const data: Array<[number, StatTypes]> = [
      [0o060000, StatTypeBlockDevice],
      [0o020000, StatTypeCharacterDevice],
      [0o040000, StatTypeDirectory],
      [0o010000, StatTypeFIFO],
      [0o100000, StatTypeFile],
      [0o140000, StatTypeSocket],
      [0o120000, StatTypeSymbolicLink],
    ];
    const S_IFMT = 0o170000;

    data.forEach(([mode, type]) => {
      const m = S_IFMT & mode; // tslint:disable-line no-bitwise

      expect(statType(m)).toBe(type);
    });
  });

  it('returns Error when mode is unknown value', () => {
    const actual = () => statType(0x9999999);

    expect(actual).toThrowError();
  });
});
