import FS from 'fs';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import fetchByOid from './fetchByOid';
import { CommitObject } from '../models/GitObject';
import revParse from './revParse';

export default async function fetchObjectByRef(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  ref: string,
): Promise<CommitObject | Error> {
  const oid = await revParse(fs, config, ref);
  if (oid instanceof Error) {
    return oid;
  }

  const commit = await fetchByOid(fs, config, oid, 'commit');
  if (commit instanceof Error) {
    return commit;
  }
  if (commit == null) {
    return new Error(`Commit not found. ref=${ref}`);
  }

  return commit;
}
