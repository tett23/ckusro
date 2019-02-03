import filterFileBuffers, {
  filterNamespace,
  filterWritable,
} from '../../../../src/cli/renderers/staticRenderer/filterFileBuffers';
import {
  FileTypeDirectory,
  FileTypeMarkdown,
} from '../../../../src/models/FileBuffer';
import { buildFileBuffer, buildNamespace } from '../../../__fixtures__';

describe.skip(filterFileBuffers, () => {});

describe(filterNamespace, () => {
  it('returns [FileBuffer] when match namespace', () => {
    const fileBuffers = [buildFileBuffer({ namespace: 'ns' })];
    const namespaces = [buildNamespace({ name: 'ns' })];
    const actual = filterNamespace(fileBuffers, namespaces);

    expect(actual).toEqual(fileBuffers);
  });

  it('returns [] when does not match namespace', () => {
    const fileBuffers = [buildFileBuffer({ namespace: 'does_not_exist' })];
    const namespaces = [buildNamespace({ name: 'ns' })];
    const actual = filterNamespace(fileBuffers, namespaces);

    expect(actual).toEqual([]);
  });
});

describe(filterWritable, () => {
  it('returns [FileBuffer] when the FileBuffer is writable', () => {
    const fileBuffers = [
      buildFileBuffer({
        fileType: FileTypeMarkdown,
        content: 'test file',
      }),
    ];
    const actual = filterWritable(fileBuffers);

    expect(actual).toEqual(fileBuffers);
  });

  it('returns [] when fileType is not writable type', () => {
    const fileBuffers = [buildFileBuffer({ fileType: FileTypeDirectory })];
    const actual = filterWritable(fileBuffers);

    expect(actual).toEqual([]);
  });

  it('returns [] when content is null', () => {
    const fileBuffers = [buildFileBuffer({ content: null })];
    const actual = filterWritable(fileBuffers);

    expect(actual).toEqual([]);
  });
});
