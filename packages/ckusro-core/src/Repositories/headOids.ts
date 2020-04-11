import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import separateErrors from '../utils/separateErrors';
import fetchRepository from './fetchRepository';
import { OidRepoPath } from '../models/OidRepoPath';

export default async function headOids(
  config: CkusroConfig,
  fs: typeof FS,
): Promise<OidRepoPath[] | Error[]> {
  const ps = config.repositories.map(async ({ repoPath }) => {
    const repo = await fetchRepository(fs, config, repoPath);
    if (repo instanceof Error) {
      return null;
    }

    const headOid = await repo.revParse('origin/HEAD');
    if (headOid instanceof Error) {
      return headOid;
    }

    return [headOid, repoPath] as const;
  });

  const [result, errors] = separateErrors(await Promise.all(ps));
  if (errors.length !== 0) {
    return errors;
  }

  const ret = result.filter((item): item is OidRepoPath => item != null);

  return ret;
}
