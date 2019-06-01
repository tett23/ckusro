import { cloneRepo } from '../src';
import { buildCkusroConfig } from './__fixtures__';
import { pfs } from './__helpers__';

describe('Core', () => {
  it('cloneRepo', async () => {
    const config = buildCkusroConfig();
    const fs = pfs(config);
    const url = 'https://github.com/tett23/ckusro.git';

    const expected = await cloneRepo(fs, config, url);

    expect(expected).toBe(true);
  });
});
