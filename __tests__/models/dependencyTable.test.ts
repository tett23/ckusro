import { FileTypeMarkdown } from '../../src/models/ckusroFile';
import {
  buildDependencyTable,
  DependencyTable,
  invert,
} from '../../src/models/dependencyTable';

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
        weakDependencies: ['2'],
        strongDependencies: ['3'],
      },
      '2': {
        weakDependencies: [],
        strongDependencies: [],
      },
      '3': {
        weakDependencies: [],
        strongDependencies: [],
      },
    });
  });
});

describe(invert, () => {
  it('returns inverted DepencencyTable', () => {
    const table: DependencyTable = {
      '1': {
        weakDependencies: ['2'],
        strongDependencies: ['3'],
      },
      '2': {
        weakDependencies: [],
        strongDependencies: [],
      },
      '3': {
        weakDependencies: [],
        strongDependencies: [],
      },
    };
    const actual = invert(table);
    const expected: DependencyTable = {
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
    };

    expect(actual).toEqual(expected);
  });
});
