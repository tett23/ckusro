import normalizePath from '../../src/utils/normalizePath';

describe(normalizePath, () => {
  it('returns string', () => {
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('//')).toBe('/');
    expect(normalizePath('/..')).toBe('/');
    expect(normalizePath('/foo')).toBe('/foo');
    expect(normalizePath('/../foo')).toBe('/foo');
    expect(normalizePath('/../foo/..')).toBe('/');
    expect(normalizePath('/../foo/.')).toBe('/foo');
    expect(normalizePath('/foo/bar')).toBe('/foo/bar');
    expect(normalizePath('/foo/../bar')).toBe('/bar');
    expect(normalizePath('/../foo/./bar')).toBe('/foo/bar');
  });
});
