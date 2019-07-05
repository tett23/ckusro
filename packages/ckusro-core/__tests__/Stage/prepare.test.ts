import * as Git from 'isomorphic-git';
import * as FS from 'fs';
import {
  prepare,
  initRepository,
  prepareStageDirectory,
  prepareStageRepository,
} from '../../src/Stage/prepare';
import { buildCkusroConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';

describe(prepare, () => {
  const config = buildCkusroConfig();
  let fs: typeof FS;
  beforeEach(() => {
    const core = Git.cores.create(config.coreId);
    fs = pfs(config);
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

describe(initRepository, () => {
  const config = buildCkusroConfig();
  beforeEach(() => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
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
  const config = buildCkusroConfig();
  let fs: typeof FS;
  beforeEach(() => {
    const core = Git.cores.create(config.coreId);
    fs = pfs(config);
    core.set('fs', fs);
  });

  it('returns true', async () => {
    const actual = await prepareStageDirectory(config, fs);

    expect(actual).toBe(true);
    expect(() => fs.statSync(config.stage)).not.toBeInstanceOf(Error);
  });

  it('returns true', async () => {
    fs.mkdirSync(config.stage);
    const actual = await prepareStageDirectory(config, fs);

    expect(actual).toBe(true);
  });
});

describe(prepareStageRepository, () => {
  const config = buildCkusroConfig();
  beforeEach(() => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
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
