import FS from 'fs';
import * as Git from 'isomorphic-git';
import { join } from 'path';
import { CkusroConfig } from '../src/models/CkusroConfig';
import { RepoPath, toPath } from '../src/models/RepoPath';
import {
  headCommitObject,
  headOid,
  headRootTree,
  readTree,
} from '../src/Repository';
import { repository } from '../src/Repository';
import { buildCkusroConfig, buildRepoPath } from './__fixtures__';
import { pfs } from './__helpers__';

type DummyTree = {
  [entry: string]: string | Buffer | DummyTree;
};

type DummyCommit = {
  message: string;
  tree: DummyTree;
};

async function dummyRepo(
  config: CkusroConfig,
  fs: typeof FS,
  repoPath: RepoPath,
  commits: DummyCommit[] = [
    { message: 'init', tree: { 'README.md': 'read me' } },
  ],
) {
  const repoRoot = toPath(config.base, repoPath);

  fs.mkdirSync(repoRoot, { recursive: true });
  await Git.init({
    core: 'test',
    dir: repoRoot,
  });

  const ps = commits.map(async ({ message, tree }) => {
    const parent = [''];
    await createDummyTree(fs, repoRoot, parent, tree);

    const result = await Git.commit({
      core: 'test',
      dir: repoRoot,
      message,
      author: {
        name: 'tett23',
        email: 'tett23@example.com',
      },
    }).catch((err) => err);
    if (result instanceof Error) {
      throw result;
    }
  });
  await Promise.all(ps);
}

async function createDummyTree(
  fs: typeof FS,
  repoRoot: string,
  parent: string[],
  tree: DummyTree,
) {
  const ps = Object.entries(tree).map(async ([name, content]) => {
    const entryPath = join(...parent, name);

    if (typeof content === 'string' || content instanceof Buffer) {
      fs.writeFileSync(join(repoRoot, entryPath), content);
    } else {
      fs.mkdirSync(join(repoRoot, entryPath));

      parent.push(name);
      createDummyTree(fs, repoRoot, parent, content);
      parent.pop();
    }

    const result = await Git.add({
      core: 'test',
      dir: repoRoot,
      filepath: entryPath,
    }).catch((err) => err);
    if (result instanceof Error) {
      throw result;
    }
  });
  await Promise.all(ps);
}

describe.skip(repository.name, () => {
  it(headOid.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create('test');
    const fs = pfs(config);
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    await dummyRepo(config, fs, repoPath);

    const expected = await headOid(config, 'test', repoPath);

    expect(expected).not.toBe(Error);
  });

  it(headCommitObject.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create('test');
    const fs = pfs(config);
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    await dummyRepo(config, fs, repoPath);

    const expected = await headCommitObject(config, 'test', repoPath);

    expect(expected).not.toBe(Error);
  });

  it(headRootTree.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create('test');
    const fs = pfs(config);
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    await dummyRepo(config, fs, repoPath);

    const expected = await headRootTree(config, 'test', repoPath);

    expect(expected).not.toBe(Error);
  });
});

it(readTree.name, async () => {
  const config = buildCkusroConfig();
  const core = Git.cores.create('test');
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

  const expected = await headRootTree(config, 'test', repoPath);

  expect(expected).not.toBe(Error);
});
