import { FileTypeMarkdown } from '../../src/models/ckusroFile';
import { buildDependencyTable } from '../../src/models/dependencyTable';

describe(buildDependencyTable, () => {
  it('returns FileTypeDirectory when statType is StatTypeDirectory', () => {
    const actual = buildDependencyTable([
      {
        id: '1',
        namespace: 'foo',
        name: 'foo.md',
        path: '/foo.md',
        fileType: FileTypeMarkdown,
        isLoaded: true,
        content: null,
        weakDependencies: ['2'],
        strongDependencies: ['3'],
        variables: [],
      },
      {
        id: '2',
        namespace: 'foo',
        name: 'foo.md',
        path: '/foo.md',
        fileType: FileTypeMarkdown,
        isLoaded: true,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
      {
        id: '3',
        namespace: 'foo',
        name: 'foo.md',
        path: '/foo.md',
        fileType: FileTypeMarkdown,
        isLoaded: true,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
    ]);

    expect(actual).toEqual({
      '1': {
        weakDependencies: [],
        strongDependencies: [],
      },
      '2': {
        weakDependencies: ['1'],
        strongDependencies: [],
      },
      '3': {
        weakDependencies: [],
        strongDependencies: ['1'],
      },
    });
  });
});
