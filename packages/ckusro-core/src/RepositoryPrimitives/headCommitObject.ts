import FS from 'fs';
import { CommitObject } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import headOid from './headOid';
import fetchByOid from './fetchByOid';

export default async function headCommitObject(
  fs: typeof FS,
  config: IsomorphicGitConfig,
): Promise<CommitObject | Error> {
  const oid = await headOid(fs, config);
  if (oid instanceof Error) {
    return oid;
  }

  const commit = await fetchByOid(fs, config, oid, 'commit');
  if (commit instanceof Error) {
    return commit;
  }
  if (commit == null) {
    return new Error(`HEAD commit not found. oid=${oid}`);
  }

  return commit;
}
