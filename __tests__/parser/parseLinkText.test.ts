import { CkusroFile, FileTypeDirectory } from '../../src/loader';
import parseLinkText, {
  determineLinkFile,
  IncompletenessLink,
  Link,
} from '../../src/parser/parseLinkText';

describe(parseLinkText, () => {
  it('parses page', () => {
    const actual = parseLinkText({ name: 'test', path: '/test' }, '/foo');
    const expected: IncompletenessLink = {
      namespace: 'test',
      name: '/foo',
      anchor: null,
    };

    expect(actual).toEqual(expected);
  });

  it('parses namespace', () => {
    const actual = parseLinkText({ name: 'test', path: '/test' }, 'foo:/bar');
    const expected: IncompletenessLink = {
      namespace: 'foo',
      name: '/bar',
      anchor: null,
    };

    expect(actual).toEqual(expected);
  });

  it('parses anchor', () => {
    const actual = parseLinkText(
      { name: 'test', path: '/test' },
      'foo:/bar#baz',
    );
    const expected: IncompletenessLink = {
      namespace: 'foo',
      name: '/bar',
      anchor: 'baz',
    };

    expect(actual).toEqual(expected);
  });
});

describe(determineLinkFile, () => {
  it('returns true when page is absolute path', () => {
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
    const link: IncompletenessLink = {
      namespace: 'test',
      name: '/foo',
      anchor: null,
    };
    const actual = determineLinkFile(link, files);
    const expected: Link = {
      namespace: 'test',
      path: '/foo',
      anchor: null,
      isExist: true,
    };

    expect(actual).toEqual(expected);
  });

  it('returns true when page is name', () => {
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
    const link: IncompletenessLink = {
      namespace: 'test',
      name: 'foo',
      anchor: null,
    };
    const actual = determineLinkFile(link, files);
    const expected: Link = {
      namespace: 'test',
      path: '/foo',
      anchor: null,
      isExist: true,
    };

    expect(actual).toEqual(expected);
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
    const link: IncompletenessLink = {
      namespace: 'test',
      name: 'bar',
      anchor: null,
    };
    const actual = determineLinkFile(link, files);
    const expected: Link = {
      namespace: 'test',
      path: '/bar',
      anchor: null,
      isExist: false,
    };

    expect(actual).toEqual(expected);
  });
});
