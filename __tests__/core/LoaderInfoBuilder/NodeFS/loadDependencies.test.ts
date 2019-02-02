import loadDependencies from '../../../../src/core/LoaderInfoBuilder/NodeFS/loadDependencies';
import {
  FileBuffer,
  FileTypeMarkdown,
} from '../../../../src/models/FileBuffer';
import { buildFileBuffer, buildPlugins } from '../../../__fixtures__';

describe(loadDependencies, () => {
  const plugins = buildPlugins();

  it('assigns dependencies', () => {
    const file: FileBuffer = buildFileBuffer({
      namespace: 'test',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
      content: '[[bar.md]]',
      dependencies: {
        name: [],
        content: [],
      },
    });
    const dep: FileBuffer = buildFileBuffer({
      namespace: 'test',
      path: '/bar.md',
      fileType: FileTypeMarkdown,
      content: '',
    });
    const files: FileBuffer[] = [file, dep];
    const actual = loadDependencies(plugins, file, files);
    const expected: FileBuffer = buildFileBuffer({
      ...file,
      dependencies: {
        name: [dep.id],
        content: [dep.id],
      },
    });

    expect(actual).toEqual(expected);
  });

  it('returns same object when content is false', () => {
    const file: FileBuffer = buildFileBuffer({
      namespace: 'test',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
      content: null,
      dependencies: {
        name: [],
        content: [],
      },
    });
    const actual = loadDependencies(plugins, file, []);

    expect(actual).toEqual(file);
  });
});
