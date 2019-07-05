import splitPath from '../../src/utils/splitPath';

describe(splitPath, () => {
  it('returns string', () => {
    expect(splitPath('/')).toMatchObject(['/']);
    expect(splitPath('/foo')).toMatchObject(['/', '/foo']);
    expect(splitPath('/foo/bar')).toMatchObject(['/', '/foo', '/foo/bar']);
  });
});
