import {
  CkusroFile,
  FileTypeDirectory,
  FileTypeDoesNotExist,
  LoaderContext,
} from '../../src/loader';
import {
  buildAst,
  buildDoesNotExistFile,
  determineDependency,
} from '../../src/parser';
import { buildFile, buildLoaderContext } from '../__fixtures__';

describe(buildAst, () => {
  it('builds AST', () => {
    const actual = buildAst('# hoge');

    expect(actual).toMatchSnapshot();
  });

  it('paeses wikiLink', () => {
    const actual = buildAst('foo[[foo]]bar');

    expect(actual).toMatchSnapshot();
  });
});

describe(buildDoesNotExistFile, () => {
  const expected: CkusroFile = {
    id: 'test:/does_not_exist',
    namespace: 'test',
    name: 'does_not_exist',
    path: '/does_not_exist',
    fileType: FileTypeDoesNotExist,
    isLoaded: false,
    content: null,
    weakDependencies: [],
    strongDependencies: [],
    variables: [],
  };

  it('returns FileTypeDoesNotExist object', () => {
    const actual = buildDoesNotExistFile('test', '/does_not_exist');

    expect(actual).toEqual(expected);
  });

  it('transforms path into absolute path', () => {
    const actual = buildDoesNotExistFile('test', 'does_not_exist');

    expect(actual).toEqual(expected);
  });
});

describe(determineDependency, () => {
  it('returns CkusroIds', () => {
    const context = buildLoaderContext({ name: 'test', path: '/test' });
    const rootNode = buildAst('[[test:foo]]');
    const files: CkusroFile[] = [
      buildFile({
        namespace: 'test',
        name: 'foo',
        path: '/foo',
        fileType: FileTypeDirectory,
        isLoaded: false,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
      }),
    ];
    const actual = determineDependency(context, rootNode, files);

    expect(actual).toEqual([files[0]]);
  });

  it('returns empty array when file does not exist', () => {
    const context: LoaderContext = {
      name: 'test',
      path: '/test',
    };
    const rootNode = buildAst('[[test:does_not_exist]]');
    const files: CkusroFile[] = [];
    const actual = determineDependency(context, rootNode, files);

    expect(actual).toMatchObject([
      {
        id: 'test:/does_not_exist',
        namespace: 'test',
        name: 'does_not_exist',
        path: '/does_not_exist',
        fileType: FileTypeDoesNotExist,
        isLoaded: false,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
    ]);
  });
});
