import FS from 'fs';
import * as Git from 'isomorphic-git';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import writeRef from '../RepositoryPrimitives/writeRef';
import { UnpersistedCommitObject, toTreeEntry } from '../models/GitObject';
import { writeObject } from '../RepositoryPrimitives/writeObject';
import isExistFileOrDirectory from '../utils/isExistFileOrDirectory';

export async function prepare(
  fs: typeof FS,
  config: IsomorphicGitConfig,
): Promise<true | Error> {
  if (await isInitialized(fs, config)) {
    return true;
  }

  const result = await prepareStageDirectory(fs, config);
  if (result instanceof Error) {
    return result;
  }

  const result2 = await prepareStageRepository(fs, config);
  if (result2 instanceof Error) {
    return result2;
  }

  const result3 = await initRepository(fs, config);
  if (result3 instanceof Error) {
    return result3;
  }

  return true;
}

export async function isInitialized(
  fs: typeof FS,
  config: IsomorphicGitConfig,
) {
  return isExistFileOrDirectory(fs, config.gitdir);
}

export async function initRepository(
  fs: typeof FS,
  config: IsomorphicGitConfig,
): Promise<true | Error> {
  const blob = await writeObject(fs, config, {
    type: 'blob',
    content: Buffer.from(''),
  }).catch((err: Error) => err);
  if (blob instanceof Error) {
    return blob;
  }

  const tree = await writeObject(fs, config, {
    type: 'tree',
    content: [toTreeEntry('.gitkeep', blob)],
  }).catch((err: Error) => err);
  if (tree instanceof Error) {
    return tree;
  }

  const author = {
    ...config.git.user,
    timestamp: 1,
    timezoneOffset: 0,
  };
  const unpersistedCommitObject: UnpersistedCommitObject = {
    type: 'commit',
    content: {
      message: 'test',
      tree: tree.oid,
      parent: [],
      author,
      committer: author,
    },
  };

  const commit = await writeObject(fs, config, unpersistedCommitObject).catch(
    (err: Error) => err,
  );
  if (commit instanceof Error) {
    return commit;
  }

  const writeRefResult = await writeRef(fs, config, 'HEAD', commit, {
    force: true,
  });
  if (writeRefResult instanceof Error) {
    return writeRefResult;
  }

  return true;
}

export async function prepareStageDirectory(
  fs: typeof FS,
  config: IsomorphicGitConfig,
): Promise<true | Error> {
  const statResult = await fs.promises
    .stat(config.gitdir)
    .catch((err: Error) => err);
  if (!(statResult instanceof Error)) {
    return true;
  }

  const mkdirResult = await fs.promises
    .mkdir(config.gitdir, { recursive: true })
    .catch((err: Error) => err);
  if (mkdirResult instanceof Error) {
    return mkdirResult;
  }

  return true;
}

export async function prepareStageRepository(
  fs: typeof FS,
  config: IsomorphicGitConfig,
): Promise<true | Error> {
  const initResult = await Git.init({
    ...config,
    fs,
    bare: true,
  }).catch((err: Error) => err);
  if (initResult instanceof Error) {
    return initResult;
  }

  return true;
}
