import * as FS from 'fs';
import {
  prepare,
  initRepository,
  prepareStageDirectory,
  prepareStageRepository,
  isInitialized,
} from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';

describe(prepare, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(() => {
    fs = pfs();
  });

  it('returns true', async () => {
    const actual = await prepare(fs, config);

    expect(actual).toBe(true);
  });

  it('returns true', async () => {
    await prepare(fs, config);
    const actual = await prepare(fs, config);

    expect(actual).toBe(true);
  });
});

describe(isInitialized, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(() => {
    fs = pfs();
  });

  it('returns false when stage does not initialized', async () => {
    const actual = await isInitialized(fs, config);

    expect(actual).toBe(false);
  });

  it('returns true when stage initialized', async () => {
    const prepareResult = await prepare(fs, config);
    expect(prepareResult).not.toBeInstanceOf(Error);

    const actual = await isInitialized(fs, config);

    expect(actual).toBe(true);
  });
});

describe(initRepository, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(() => {
    fs = pfs();
  });

  it('returns true', async () => {
    const actual = await initRepository(fs, config);

    expect(actual).toBe(true);
  });

  it('returns true', async () => {
    await initRepository(fs, config);
    const actual = await initRepository(fs, config);

    expect(actual).toBe(true);
  });
});

describe(prepareStageDirectory, () => {
  const config = buildIsomorphicGitConfig({ gitdir: '/stage' });
  let fs: typeof FS;
  beforeEach(() => {
    fs = pfs();
  });

  it('returns true', async () => {
    const actual = await prepareStageDirectory(fs, config);

    expect(actual).toBe(true);
    expect(() => fs.statSync(config.gitdir)).not.toBeInstanceOf(Error);
  });

  it('returns true', async () => {
    fs.mkdirSync(config.gitdir);
    const actual = await prepareStageDirectory(fs, config);

    expect(actual).toBe(true);
  });
});

describe(prepareStageRepository, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(() => {
    fs = pfs();
  });

  it('returns true', async () => {
    const actual = await prepareStageRepository(fs, config);

    expect(actual).toBe(true);
  });

  it('returns true', async () => {
    await prepareStageRepository(fs, config);
    const actual = await prepareStageRepository(fs, config);

    expect(actual).toBe(true);
  });
});
