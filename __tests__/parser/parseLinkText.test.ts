import parseLinkText, { Link } from '../../src/parser/parseLinkText';

describe(parseLinkText, () => {
  it('parses page', () => {
    const actual = parseLinkText({ name: 'test', path: '/test' }, '/foo');
    const expected: Link = {
      namespace: 'test',
      page: '/foo',
      anchor: null,
    };

    expect(actual).toEqual(expected);
  });

  it('parses namespace', () => {
    const actual = parseLinkText({ name: 'test', path: '/test' }, 'foo:/bar');
    const expected: Link = {
      namespace: 'foo',
      page: '/bar',
      anchor: null,
    };

    expect(actual).toEqual(expected);
  });

  it('parses anchor', () => {
    const actual = parseLinkText({ name: 'test', path: '/test' }, 'foo:/bar#baz');
    const expected: Link = {
      namespace: 'foo',
      page: '/bar',
      anchor: 'baz',
    };

    expect(actual).toEqual(expected);
  });
});
