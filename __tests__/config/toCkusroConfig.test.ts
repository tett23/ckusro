import toCkusroConfig, {
  isPartializedPrimitiveCkusroConfig,
  isPartializedPrimitiveLoaderConfig,
  isRegExpOrString,
  PrimitiveCkusroConfig,
  PrimitiveLoaderConfig,
  toLoaderConfig,
  toRegExp,
} from '../../src/config/toCkusroConfig';
import { CkusroConfig } from '../../src/models/ckusroConfig';
import { LoaderConfig } from '../../src/models/ckusroConfig/LoaderConfig';

describe(toCkusroConfig, () => {
  it('converts loaderConfig.enable', () => {
    const conf: Partial<PrimitiveCkusroConfig> = {
      loaderConfig: { enable: '/test/', ignore: [] },
    };
    const actual = toCkusroConfig(conf);
    const expected: DeepPartial<CkusroConfig> = {
      loaderConfig: {
        enable: /test/,
        ignore: [],
      },
    };

    expect(actual).toEqual(expected);
  });
});

describe(isPartializedPrimitiveCkusroConfig, () => {
  it('returns true when argument is valid object', () => {
    const data: Array<DeepPartial<PrimitiveCkusroConfig>> = [
      {},
      { outputDirectory: '/test' },
      { targetDirectories: [] },
      { loaderConfig: { enable: '/.md/', ignore: [] } },
    ];
    data.forEach((value) => {
      const actual = isPartializedPrimitiveCkusroConfig(value);

      expect(actual).toBe(true);
    });
  });

  it('returns false when argument is invalid object', () => {
    const data = [
      null,
      undefined,
      1,
      { outputDirectory: 1 },
      { targetDirectories: 1 },
    ];
    data.forEach((value) => {
      const actual = isPartializedPrimitiveCkusroConfig(value);

      expect(actual).toBe(false);
    });
  });
});

describe(isPartializedPrimitiveLoaderConfig, () => {
  it('returns true when argument is valid object', () => {
    const data: Array<Partial<PrimitiveLoaderConfig>> = [{ enable: 'foo' }];
    data.forEach((value) => {
      const actual = isPartializedPrimitiveLoaderConfig(value);

      expect(actual).toBe(true);
    });
  });

  it('returns false when argument is invalid object', () => {
    const data = [null, undefined, 1, { enable: null }];
    data.forEach((value) => {
      const actual = isPartializedPrimitiveLoaderConfig(value);

      expect(actual).toBe(false);
    });
  });
});

describe(toLoaderConfig, () => {
  it('converts RegExp field', () => {
    const actual = toLoaderConfig({
      enable: '/foo/',
      ignore: ['/\\.git/', 'node_modules'],
    });
    const expected: DeepPartial<LoaderConfig> = {
      enable: /foo/,
      ignore: [/\.git/, /node_modules/],
    };

    expect(actual).toEqual(expected);
  });
});

describe(isRegExpOrString, () => {
  it('returns true when argument is RegExp', () => {
    const actual = isRegExpOrString(/test/);

    expect(actual).toBe(true);
  });

  it('returns true when argument is String', () => {
    const actual = isRegExpOrString('test');

    expect(actual).toBe(true);
  });

  it('returns false when argument is other type', () => {
    const data = [1, null, undefined];
    data.forEach((value) => {
      const actual = isRegExpOrString(value);

      expect(actual).toBe(false);
    });
  });
});

describe(toRegExp, () => {
  it('returns RegExp when argument is RegExp', () => {
    const actual = toRegExp(/foo/);

    expect(actual.source).toBe('foo');
    expect(actual.flags).toBe('');
  });

  it('returns RegExp when argument is String', () => {
    const actual = toRegExp('foo');

    expect(actual.source).toBe('foo');
    expect(actual.flags).toBe('');
  });

  it('returns RegExp with flags', () => {
    const actual = toRegExp('/foo/g');

    expect(actual.source).toBe('foo');
    expect(actual.flags).toBe('g');
  });

  it('throw Error when argument is not String', () => {
    const actual = () => toRegExp(1 as any);

    expect(actual).toThrowError();
  });
});
