import { FileTypeMarkdown } from '../../src/models/ckusroFile';
import {
  buildDependency,
  buildDependencyTable,
} from '../../src/models/dependencyTable';
import { buildFile } from '../__fixtures__';

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

describe(buildDependency, () => {
  it('returns RefTuple', () => {
    const dep = buildFile();
    const file = buildFile({
      weakDependencies: [dep.id],
      strongDependencies: [dep.id],
    });
    const files = [file, dep];
    const actual = buildDependency(dep.id, files);
    const expected = [dep.id, [file.id], [file.id]];

    expect(actual).toEqual(expected);
  });

  it('returns weak dependencies', () => {
    const weakDep = buildFile();
    const file = buildFile({
      weakDependencies: [weakDep.id],
    });
    const files = [file, weakDep];
    const actual = buildDependency(weakDep.id, files);
    const expected = [weakDep.id, [file.id], []];

    expect(actual).toEqual(expected);
  });

  it('returns strong dependencies', () => {
    const strongDep = buildFile();
    const file = buildFile({
      strongDependencies: [strongDep.id],
    });
    const files = [file, strongDep];
    const actual = buildDependency(strongDep.id, files);
    const expected = [strongDep.id, [], [file.id]];

    expect(actual).toEqual(expected);
  });
});
