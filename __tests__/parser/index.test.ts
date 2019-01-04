import {
  CkusroFile,
  FileTypeDirectory,
  FileTypeDoesNotExist,
} from '../../src/models/ckusroFile';
import { buildAst, determineDependency } from '../../src/parser';
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
    const context = buildLoaderContext({ name: 'test', path: '/test' });
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
