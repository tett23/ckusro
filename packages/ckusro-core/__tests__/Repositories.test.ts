import * as Git from 'isomorphic-git';
import { clone, repositories } from '../src/Repositories';
import { buildCkusroConfig } from './__fixtures__';
import { pfs } from './__helpers__';

describe(repositories.name, () => {
  it.skip(clone.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create('test');
    const fs = pfs(config);
    core.set('fs', fs);
    const url = 'https://github.com/tett23/ckusro.git';

    const expected = await clone('test', config, url);

    expect(expected).not.toBeInstanceOf(Error);
  });
});
