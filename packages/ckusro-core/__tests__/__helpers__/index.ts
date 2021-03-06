import FS from 'fs';
import * as Git from 'isomorphic-git';
import { Volume } from 'memfs';
import { join } from 'path';
import pify from 'pify';
import { Union } from 'unionfs';
import { CkusroConfig } from '../../src/models/CkusroConfig';
import { RepoPath, toPath } from '../../src/models/RepoPath';

export function pfs(): typeof FS {
  const volume = Volume.fromJSON({});

  const ufs = new Union();
  ufs.use(volume);

  ufs.promises = pify(ufs);

  return ufs;
}

type DummyTree = {
  [entry: string]: string | Buffer | DummyTree;
};

type DummyCommit = {
  message: string;
  tree: DummyTree;
};

export async function dummyRepo(
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
    fs,
    dir: repoRoot,
  });

  const ps = commits.map(async ({ message, tree }) => {
    const parent = [''];
    await createDummyTree(config, fs, repoRoot, parent, tree);

    const result = await Git.commit({
      fs,
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
  config: CkusroConfig,
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
      createDummyTree(config, fs, repoRoot, parent, content);
      parent.pop();
    }

    const result = await Git.add({
      fs,
      dir: repoRoot,
      filepath: entryPath,
    }).catch((err) => err);
    if (result instanceof Error) {
      throw result;
    }
  });
  await Promise.all(ps);
}
