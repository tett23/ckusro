import * as Git from 'isomorphic-git';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';

export default async function headOid(
  config: IsomorphicGitConfig,
): Promise<string | Error> {
  const headOid = await (async () =>
    Git.resolveRef({
      ...config,
      ref: 'HEAD',
    }))().catch((err: Error) => err);
  if (headOid instanceof Error) {
    return headOid;
  }

  return headOid;
}
