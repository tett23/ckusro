import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import lsFilesByRef from '../RepositoryPrimitives/lsFilesByRef';
import { RepoPath } from '../models/RepoPath';
import { InternalPathEntry } from '../models/InternalPathEntry';
import pathToInternalPath from './internal/pathToInternalPath';

export default async function lsFiles(
  config: IsomorphicGitConfig,
  repoPaths: RepoPath[],
): Promise<InternalPathEntry[] | Error> {
  const lsResult = await lsFilesByRef(config, 'HEAD');
  if (lsResult instanceof Error) {
    return lsResult;
  }

  return lsResult
    .map(([path, treeEntry]) => {
      const internalPath = pathToInternalPath(repoPaths, path);
      if (internalPath == null) {
        return null;
      }

      return [internalPath, treeEntry] as const;
    })
    .filter((item): item is InternalPathEntry => item != null);
}
