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

describe(buildAst, () => {
  it('builds AST', () => {
    const actual = buildAst('# hoge');
    const expected = {
      children: [
        {
          children: [
            {
              position: {
                end: { column: 7, line: 1, offset: 6 },
                indent: [],
                start: { column: 3, line: 1, offset: 2 },
              },
              type: 'text',
              value: 'hoge',
            },
          ],
          depth: 1,
          position: {
            end: { column: 7, line: 1, offset: 6 },
            indent: [],
            start: { column: 1, line: 1, offset: 0 },
          },
          type: 'heading',
        },
      ],
      position: {
        end: { column: 7, line: 1, offset: 6 },
        start: { column: 1, line: 1, offset: 0 },
      },
      type: 'root',
    };

    expect(actual).toEqual(expected);
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
    const context: LoaderContext = {
      name: 'test',
      path: '/test',
    };
    const rootNode = buildAst('[[test:foo]]');
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
