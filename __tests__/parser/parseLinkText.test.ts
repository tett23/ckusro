import { FileBuffer, FileTypeDirectory } from '../../src/models/FileBuffer';
import parseLinkText, {
  determineLinkFile,
  IncompletenessLink,
  Link,
} from '../../src/parser/parseLinkText';
import { buildFileBuffer } from '../__fixtures__';

describe(parseLinkText, () => {
  it('parses page', () => {
    const actual = parseLinkText('test', '/foo');
    const expected: IncompletenessLink = {
      namespace: 'test',
      name: '/foo',
      anchor: null,
    };

    expect(actual).toEqual(expected);
  });

  it('parses namespace', () => {
    const actual = parseLinkText('test', 'foo:/bar');
    const expected: IncompletenessLink = {
      namespace: 'foo',
      name: '/bar',
      anchor: null,
    };

    expect(actual).toEqual(expected);
  });

  it('parses anchor', () => {
    const actual = parseLinkText('test', 'foo:/bar#baz');
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
    const files: FileBuffer[] = [
      buildFileBuffer({
        id: '/foo',
        namespace: 'test',
        path: '/foo',
        fileType: FileTypeDirectory,
        content: null,
      }),
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
    const files: FileBuffer[] = [
      buildFileBuffer({
        id: '/foo',
        namespace: 'test',
        path: '/foo',
        fileType: FileTypeDirectory,
        content: null,
      }),
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
    const files: FileBuffer[] = [
      buildFileBuffer({
        id: '/foo',
        namespace: 'test',
        path: '/foo',
        fileType: FileTypeDirectory,
        content: null,
      }),
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
