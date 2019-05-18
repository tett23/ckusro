import MemoryFileSystem from 'memory-fs';
import { WriteInfo } from '../../../../src/cli/models/WriteInfo';
import assetsRenderer, {
  buildWriteInfos,
  fetchEntries,
} from '../../../../src/cli/renderers/assetsRenderer';
import { buildGlobalState } from '../../../__fixtures__';

describe(assetsRenderer, () => {
  beforeEach(() => {
    jest.setTimeout(20000);
  });
  afterEach(() => {
    jest.setTimeout(5000);
  });

  it('', async () => {
    const globalState = buildGlobalState();
    const actual = await assetsRenderer(globalState);

    expect(actual).toHaveLength(1);
    expect(actual).not.toBeInstanceOf(Error);
  });
});

describe(buildWriteInfos, () => {
  it('returns FileInfo[]', async () => {
    const fs = new MemoryFileSystem();
    const entries = ['/foo.js', '/bar.css'];
    entries.map((item) => {
      fs.writeFileSync(item, item);
    });

    const readFile = fs.readFile.bind(fs);
    const actual = await buildWriteInfos(readFile as any, entries, '/assets');
    const expected: WriteInfo[] = [
      {
        path: '/assets/foo.js',
        content: Buffer.from('/foo.js'),
      },
      {
        path: '/assets/bar.css',
        content: Buffer.from('/bar.css'),
      },
    ];

    expect(actual).toEqual(expected);
  });

  it('returns Error when file does not exists', async () => {
    const fs = new MemoryFileSystem();
    const readFile = fs.readFile.bind(fs);
    const actual = await buildWriteInfos(
      readFile as any,
      ['/foo.js'],
      '/assets',
    );

    expect(actual).toHaveLength(1);
    expect(actual[0]).toBeInstanceOf(Error);
  });
});

describe(fetchEntries, () => {
  it('returns file paths', async () => {
    const fs = new MemoryFileSystem();
    const entries = ['/foo.js', '/bar.css'];
    entries.map((item) => {
      fs.writeFileSync(item, item);
    });

    const readdir = fs.readdir.bind(fs);
    const actual = await fetchEntries(readdir);

    expect(actual).toEqual(entries);
  });

  it('returns empty array when fs is empty', async () => {
    const fs = new MemoryFileSystem();
    const readdir = fs.readdir.bind(fs);
    const actual = await fetchEntries(readdir);

    expect(actual).toHaveLength(0);
  });
});
