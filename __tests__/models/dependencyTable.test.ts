import { FileTypeMarkdown } from '../../src/models/CkusroFile';
import {
  allDepdendencies,
  buildDependencyTable,
  DependencyTable,
  invert,
  isDependency,
} from '../../src/models/DependencyTable';
import { buildDependency } from '../__fixtures__';
import '../__matchers__/toValidTypes';

describe(isDependency, () => {
  it('judges types', () => {
    expect([
      [[{ name: [], content: [] }], true],
      [[{ name: [] }], false],
      [[{ content: [] }], false],
      [[{}], false],
      [[undefined], false],
      [[null], false],
      [[true], false],
      [[1], false],
      [[[]], false],
      [[() => {}], false], // tslint:disable-line no-empty
    ]).toValidatePair(isDependency);
  });
});

describe(buildDependencyTable, () => {
  it('returns FileTypeDirectory when statType is StatTypeDirectory', () => {
    const actual = buildDependencyTable([
      {
        id: '1',
        namespace: 'foo',
        path: '/foo.md',
        fileType: FileTypeMarkdown,
        content: null,
        dependencies: {
          name: ['2'],
          content: ['3'],
        },
        variables: [],
      },
      {
        id: '2',
        namespace: 'foo',
        path: '/foo.md',
        fileType: FileTypeMarkdown,
        content: null,
        dependencies: {
          name: [],
          content: [],
        },
        variables: [],
      },
      {
        id: '3',
        namespace: 'foo',
        path: '/foo.md',
        fileType: FileTypeMarkdown,
        content: null,
        dependencies: {
          name: [],
          content: [],
        },
        variables: [],
      },
    ]);
    const expected: DependencyTable = {
      '1': {
        name: ['2'],
        content: ['3'],
      },
      '2': {
        name: [],
        content: [],
      },
      '3': {
        name: [],
        content: [],
      },
    };

    expect(actual).toEqual(expected);
  });
});

describe(invert, () => {
  it('returns inverted DepencencyTable', () => {
    const table: DependencyTable = {
      '1': {
        name: ['2'],
        content: ['3'],
      },
      '2': {
        name: [],
        content: [],
      },
      '3': {
        name: [],
        content: [],
      },
    };
    const actual = invert(table);
    const expected: DependencyTable = {
      '1': {
        name: [],
        content: [],
      },
      '2': {
        name: ['1'],
        content: [],
      },
      '3': {
        name: [],
        content: ['1'],
      },
    };

    expect(actual).toEqual(expected);
  });
});

describe(allDepdendencies, () => {
  it('concat all dependencies', () => {
    const dependency = buildDependency({ name: ['1'], content: ['2'] });
    const actual = allDepdendencies(dependency);
    const expected = ['1', '2'];

    expect(actual).toEqual(expected);
  });
});
