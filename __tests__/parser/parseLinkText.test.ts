import { CkusroFile, FileTypeDirectory } from '../../src/loader';
import parseLinkText, { determineLinkFile, Link } from '../../src/parser/parseLinkText';

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

describe(determineLinkFile, () => {
  it('returns CkusroFile when page is absolute path', () => {
    const files: CkusroFile[] = [
      {
        id: '/foo',
        namespace: 'test',
        name: 'foo',
        path: '/foo',
        fileType: FileTypeDirectory,
        isLoaded: false,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
    ];
    const link: Link = {
      namespace: 'test',
      page: '/foo',
      anchor: null,
    };
    const actual = determineLinkFile(link, files);

    expect(actual).toEqual(files[0]);
  });

  it('returns CkusroFile when page is name', () => {
    const files: CkusroFile[] = [
      {
        id: '/foo',
        namespace: 'test',
        name: 'foo',
        path: '/foo',
        fileType: FileTypeDirectory,
        isLoaded: false,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
    ];
    const link: Link = {
      namespace: 'test',
      page: 'foo',
      anchor: null,
    };
    const actual = determineLinkFile(link, files);

    expect(actual).toEqual(files[0]);
  });

  it('returns null when page does not exist', () => {
    const files: CkusroFile[] = [
      {
        id: '/foo',
        namespace: 'test',
        name: 'foo',
        path: '/foo',
        fileType: FileTypeDirectory,
        isLoaded: false,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
    ];
    const link: Link = {
      namespace: 'test',
      page: 'bar',
      anchor: null,
    };
    const actual = determineLinkFile(link, files);

    expect(actual).toBe(null);
  });
});
