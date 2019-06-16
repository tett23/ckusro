import * as Git from 'isomorphic-git';
import {
  headCommitObject,
  headOid,
  headRootTree,
  readTree,
} from '../src/Repository';
import { repository } from '../src/Repository';
import { buildCkusroConfig, buildRepoPath } from './__fixtures__';
import { dummyRepo, pfs } from './__helpers__';

describe.skip(repository.name, () => {
  it(headOid.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    await dummyRepo(config, fs, repoPath);

    const expected = await headOid(config, repoPath);

    expect(expected).not.toBe(Error);
  });

  it(headCommitObject.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    await dummyRepo(config, fs, repoPath);

    const expected = await headCommitObject(config, repoPath);

    expect(expected).not.toBe(Error);
  });

  it(headRootTree.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    await dummyRepo(config, fs, repoPath);

    const expected = await headRootTree(config, repoPath);

    expect(expected).not.toBe(Error);
  });
});

it(readTree.name, async () => {
  const config = buildCkusroConfig();
  const core = Git.cores.create(config.coreId);
  const fs = pfs(config);
  core.set('fs', fs);
  const repoPath = buildRepoPath();
  const commits = [
    {
      message: 'init',
      tree: {
        'README.md': 'read me',
        foo: {
          bar: {
            'baz.md': 'baz.md',
          },
        },
      },
    },
  ];
  await dummyRepo(config, fs, repoPath, commits);

  const expected = await headRootTree(config, repoPath);

  expect(expected).not.toBe(Error);
});
