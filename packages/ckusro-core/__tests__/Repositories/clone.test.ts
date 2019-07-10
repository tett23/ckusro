import * as Git from 'isomorphic-git';
import clone from '../../src/Repositories/clone';
import { buildCkusroConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { Repository } from '../../src/Repository';

describe(clone, () => {
  it.skip(clone.name, async () => {
    const config = buildCkusroConfig({
      corsProxy: 'https://cors.isomorphic-git.org',
    });
    const core = Git.cores.create(config.coreId);
    const fs = pfs();
    core.set('fs', fs);
    const url = 'https://github.com/tett23/ckusro.git';

    const expected = (await clone(config, fs, url)) as Repository;

    expect(expected).not.toBeInstanceOf(Error);
  });
});
