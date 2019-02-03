import treeBuilder, {
  Root,
} from '../../../../../../../src/cli/renderers/staticRenderer/assets/components/TreeViewContainer/treeBuilder';
import { buildFileBuffer } from '../../../../../../__fixtures__';

describe(treeBuilder, () => {
  it('returns Root[]', () => {
    const fileBuffers = [
      buildFileBuffer({ id: 'ns1:/', namespace: 'ns1', path: '/' }),
      buildFileBuffer({ id: 'ns1:/foo', namespace: 'ns1', path: '/foo' }),
      buildFileBuffer({
        id: 'ns1:/foo/bar',
        namespace: 'ns1',
        path: '/foo/bar',
      }),
      buildFileBuffer({ id: 'ns1:/hoge', namespace: 'ns1', path: '/hoge' }),
      buildFileBuffer({ id: 'ns2:/', namespace: 'ns2', path: '/' }),
      buildFileBuffer({ id: 'ns2:/foo', namespace: 'ns2', path: '/foo' }),
      buildFileBuffer({ id: 'ns3:/', namespace: 'ns3', path: '/' }),
      buildFileBuffer({ id: 'ns4:/foo', namespace: 'ns4', path: '/foo' }),
    ];
    const actual = treeBuilder(fileBuffers);
    const expected: Root[] = [
      {
        type: 'root',
        id: 'ns1:/',
        children: [
          {
            type: 'node',
            id: 'ns1:/foo',
            children: [
              {
                type: 'leaf',
                id: 'ns1:/foo/bar',
              },
            ],
          },
          {
            type: 'leaf',
            id: 'ns1:/hoge',
          },
        ],
      },
      {
        type: 'root',
        id: 'ns2:/',
        children: [
          {
            type: 'leaf',
            id: 'ns2:/foo',
          },
        ],
      },
      {
        type: 'root',
        id: 'ns3:/',
        children: [],
      },
    ];

    expect(actual).toEqual(expected);
  });

  it('root', () => {
    const fileBuffers = [
      buildFileBuffer({ id: 'ns1:/', namespace: 'ns1', path: '/' }),
      buildFileBuffer({ id: 'ns2:/', namespace: 'ns2', path: '/' }),
    ];
    const actual = treeBuilder(fileBuffers);
    const expected: Root[] = [
      {
        type: 'root',
        id: 'ns1:/',
        children: [],
      },
      {
        type: 'root',
        id: 'ns2:/',
        children: [],
      },
    ];

    expect(actual).toEqual(expected);
  });

  it('root children', () => {
    const fileBuffers = [
      buildFileBuffer({ id: 'ns1:/', namespace: 'ns1', path: '/' }),
      buildFileBuffer({ id: 'ns1:/foo', namespace: 'ns1', path: '/foo' }),
    ];
    const actual = treeBuilder(fileBuffers);
    const expected: Root[] = [
      {
        type: 'root',
        id: 'ns1:/',
        children: [
          {
            type: 'leaf',
            id: 'ns1:/foo',
          },
        ],
      },
    ];

    expect(actual).toEqual(expected);
  });

  it('', () => {
    const fileBuffers = [
      buildFileBuffer({ id: 'ns1:/', namespace: 'ns1', path: '/' }),
      buildFileBuffer({ id: 'ns1:/foo', namespace: 'ns1', path: '/foo' }),
      buildFileBuffer({
        id: 'ns1:/foo/bar',
        namespace: 'ns1',
        path: '/foo/bar',
      }),
    ];
    const actual = treeBuilder(fileBuffers);
    const expected: Root[] = [
      {
        type: 'root',
        id: 'ns1:/',
        children: [
          {
            type: 'node',
            id: 'ns1:/foo',
            children: [
              {
                type: 'leaf',
                id: 'ns1:/foo/bar',
              },
            ],
          },
        ],
      },
    ];

    expect(actual).toEqual(expected);
  });
});
