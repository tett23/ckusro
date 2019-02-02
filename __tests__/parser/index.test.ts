import { defaultPluginsConfig } from '../../src/models/DefaultPluginConfig';
import {
  FileBuffer,
  FileTypeDirectory,
  FileTypeDoesNotExist,
} from '../../src/models/FileBuffer';
import defaultPlugins from '../../src/models/plugins/defaultPlugins';
import { buildAst, determineDependency } from '../../src/parser';
import { buildFileBuffer } from '../__fixtures__';

describe(buildAst, () => {
  const plugins = defaultPlugins(defaultPluginsConfig());

  it('builds AST', () => {
    const actual = buildAst(plugins, '# hoge');

    expect(actual).toMatchSnapshot();
  });

  it('paeses wikiLink', () => {
    const actual = buildAst(plugins, 'foo[[foo]]bar');

    expect(actual).toMatchSnapshot();
  });
});

describe(determineDependency, () => {
  const plugins = defaultPlugins(defaultPluginsConfig());

  it('returns FileBufferId', () => {
    const rootNode = buildAst(plugins, '[[test:foo]]');
    const files: FileBuffer[] = [
      buildFileBuffer({
        namespace: 'test',
        path: '/foo',
        fileType: FileTypeDirectory,
        content: null,
      }),
    ];
    const actual = determineDependency('test', rootNode, files);

    expect(actual).toEqual([files[0]]);
  });

  it('returns empty array when file does not exist', () => {
    const rootNode = buildAst(plugins, '[[test:does_not_exist]]');
    const actual = determineDependency('test', rootNode, []);
    const expected: FileBuffer[] = [
      {
        id: 'test:/does_not_exist',
        namespace: 'test',
        path: '/does_not_exist',
        fileType: FileTypeDoesNotExist,
        content: null,
        dependencies: {
          name: [],
          content: [],
        },
        variables: [],
      },
    ];

    expect(actual).toMatchObject(expected);
  });
});
