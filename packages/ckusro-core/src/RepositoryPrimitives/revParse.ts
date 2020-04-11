import FS from 'fs';
import * as Git from 'isomorphic-git';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';

export default async function revParse(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  ref: string,
): Promise<string | Error> {
  const resolved = await (async () =>
    Git.resolveRef({
      ...config,
      fs,
      ref: ref,
    }))().catch((err: Error) => err);
  if (resolved instanceof Error) {
    return resolved;
  }

  return resolved;
}
