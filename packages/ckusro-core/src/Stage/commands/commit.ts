import {
  TreeObject,
  UnpersistedCommitObject,
  CommitObject,
} from '../../models/GitObject';
import { IsomorphicGitConfig } from '../../models/IsomorphicGitConfig';
import { writeObject } from '../../RepositoryPrimitives/writeObject';
import writeRef from '../../RepositoryPrimitives/writeRef';

export default async function commit(
  config: IsomorphicGitConfig,
  root: TreeObject,
  message: string,
): Promise<CommitObject | Error> {
  const author = {
    ...config.git.user,
    timestamp: new Date().getTime(),
    timezoneOffset: 0,
  };

  const unpersistedCommitObject: UnpersistedCommitObject = {
    type: 'commit',
    content: {
      message,
      tree: root.oid,
      parent: [],
      author,
      committer: author,
    },
  };

  const commit = await writeObject(config, unpersistedCommitObject);
  if (commit instanceof Error) {
    return commit;
  }

  const refResult = await writeRef(config, 'HEAD', commit, { force: true });
  if (refResult instanceof Error) {
    return refResult;
  }

  return commit;
}
