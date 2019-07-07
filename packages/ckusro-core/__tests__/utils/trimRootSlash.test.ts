import trimRootSlash from '../../src/utils/trimRootSlash';

describe(trimRootSlash, () => {
  it('returns string', () => {
    expect(trimRootSlash('/')).toBe('');
    expect(trimRootSlash('')).toBe('');
    expect(trimRootSlash('/foo')).toBe('foo');
    expect(trimRootSlash('foo')).toBe('foo');
    expect(trimRootSlash('/foo/../../')).toBe('');
  });
});
