import {
  CkusroFile,
  FileTypeDirectory,
  FileTypeDoesNotExist,
} from '../../src/models/ckusroFile';
import { defaultPluginsConfig } from '../../src/models/pluginConfig';
import defaultPlugins from '../../src/models/plugins/defaultPlugins';
import { buildAst, determineDependency } from '../../src/parser';
import { buildFile, buildLocalLoaderContext } from '../__fixtures__';

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

  it('returns CkusroIds', () => {
    const context = buildLocalLoaderContext({ name: 'test', path: '/test' });
    const rootNode = buildAst(plugins, '[[test:foo]]');
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
    const context = buildLocalLoaderContext({ name: 'test', path: '/test' });
    const rootNode = buildAst(plugins, '[[test:does_not_exist]]');
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
