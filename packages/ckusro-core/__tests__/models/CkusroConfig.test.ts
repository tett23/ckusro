import { convertColorScheme } from '../../src/models/CkusroConfig';

describe('CkusroConfig', () => {
  describe(convertColorScheme, () => {
    it('returns ColorScheme', () => {
      const actual = convertColorScheme({
        main: 'a1',
        accent: 'a1',
        background: 'a1',
        base: 'a1',
        text: 'a1',
      });

      expect(actual).toEqual({
        main: parseInt('a1', 16),
        accent: parseInt('a1', 16),
        background: parseInt('a1', 16),
        base: parseInt('a1', 16),
        text: parseInt('a1', 16),
      });
    });

    it('returns ColorScheme when the hex string start with #', () => {
      const actual = convertColorScheme({
        main: '#a1',
        accent: '#a1',
        background: '#a1',
        base: '#a1',
        text: '#a1',
      });

      expect(actual).toEqual({
        main: parseInt('a1', 16),
        accent: parseInt('a1', 16),
        background: parseInt('a1', 16),
        base: parseInt('a1', 16),
        text: parseInt('a1', 16),
      });
    });
  });
});
