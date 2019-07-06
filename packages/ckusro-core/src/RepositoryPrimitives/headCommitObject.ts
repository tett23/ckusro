import { CommitObject } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import headOid from './headOid';
import fetchByOid from './fetchByOid';

export default async function headCommitObject(
  config: IsomorphicGitConfig,
): Promise<CommitObject | Error> {
  const oid = await headOid(config);
  if (oid instanceof Error) {
    return oid;
  }

  const commit = await fetchByOid(config, oid, 'commit');
  if (commit instanceof Error) {
    return commit;
  }
  if (commit == null) {
    return new Error(`HEAD commit not found. oid=${oid}`);
  }

  return commit;
}
