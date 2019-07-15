import * as Git from 'isomorphic-git';
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
    const core = Git.cores.create(config.core);
    fs = pfs();
    core.set('fs', fs);
  });

  it('returns true', async () => {
    const actual = await prepare(config, fs);

    expect(actual).toBe(true);
  });

  it('returns true', async () => {
    await prepare(config, fs);
    const actual = await prepare(config, fs);

    expect(actual).toBe(true);
  });
});

describe(isInitialized, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(() => {
    const core = Git.cores.create(config.core);
    fs = pfs();
    core.set('fs', fs);
  });

  it('returns false when stage does not initialized', async () => {
    const actual = await isInitialized(config, fs);

    expect(actual).toBe(false);
  });

  it('returns true when stage initialized', async () => {
    const prepareResult = await prepare(config, fs);
    expect(prepareResult).not.toBeInstanceOf(Error);

    const actual = await isInitialized(config, fs);

    expect(actual).toBe(true);
  });
});

describe(initRepository, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(() => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
  });

  it('returns true', async () => {
    const actual = await initRepository(config);

    expect(actual).toBe(true);
  });

  it('returns true', async () => {
    await initRepository(config);
    const actual = await initRepository(config);

    expect(actual).toBe(true);
  });
});

describe(prepareStageDirectory, () => {
  const config = buildIsomorphicGitConfig({ gitdir: '/stage' });
  let fs: typeof FS;
  beforeEach(() => {
    const core = Git.cores.create(config.core);
    fs = pfs();
    core.set('fs', fs);
  });

  it('returns true', async () => {
    const actual = await prepareStageDirectory(config, fs);

    expect(actual).toBe(true);
    expect(() => fs.statSync(config.gitdir)).not.toBeInstanceOf(Error);
  });

  it('returns true', async () => {
    fs.mkdirSync(config.gitdir);
    const actual = await prepareStageDirectory(config, fs);

    expect(actual).toBe(true);
  });
});

describe(prepareStageRepository, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(() => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
  });

  it('returns true', async () => {
    const actual = await prepareStageRepository(config);

    expect(actual).toBe(true);
  });

  it('returns true', async () => {
    await prepareStageRepository(config);
    const actual = await prepareStageRepository(config);

    expect(actual).toBe(true);
  });
});
