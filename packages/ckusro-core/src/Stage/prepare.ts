import FS from 'fs';
import * as Git from 'isomorphic-git';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import writeRef from '../RepositoryPrimitives/writeRef';
import { UnpersistedCommitObject, toTreeEntry } from '../models/GitObject';
import { writeObject } from '../RepositoryPrimitives/writeObject';

export async function prepare(
  config: IsomorphicGitConfig,
  fs: typeof FS,
): Promise<true | Error> {
  const result = await prepareStageDirectory(config, fs);
  if (result instanceof Error) {
    return result;
  }

  const result2 = await prepareStageRepository(config);
  if (result2 instanceof Error) {
    return result2;
  }

  const result3 = await initRepository(config);
  if (result3 instanceof Error) {
    return result3;
  }

  return true;
}

export async function initRepository(
  config: IsomorphicGitConfig,
): Promise<true | Error> {
  const blob = await writeObject(config, {
    type: 'blob',
    content: Buffer.from(''),
  }).catch((err: Error) => err);
  if (blob instanceof Error) {
    return blob;
  }

  const tree = await writeObject(config, {
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

  const commit = await writeObject(config, unpersistedCommitObject).catch(
    (err: Error) => err,
  );
  if (commit instanceof Error) {
    return commit;
  }

  const writeRefResult = await writeRef(config, 'HEAD', commit, {
    force: true,
  });
  if (writeRefResult instanceof Error) {
    return writeRefResult;
  }

  return true;
}

export async function prepareStageDirectory(
  config: IsomorphicGitConfig,
  fs: typeof FS,
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
  config: IsomorphicGitConfig,
): Promise<true | Error> {
  const initResult = await Git.init({
    ...config,
    bare: true,
  }).catch((err: Error) => err);
  if (initResult instanceof Error) {
    return initResult;
  }

  return true;
}
