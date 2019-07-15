import { RepoPath, createRepoPath } from '../../models/RepoPath';
import { InternalPath } from '../../models/InternalPath';
import normalizePath from '../../utils/normalizePath';
import { join } from 'path';

export default function pathToInternalPath(
  repoPaths: RepoPath[],
  path: string,
): InternalPath | null {
  const repoPath = repoPaths.find((item) => {
    return path.startsWith(createRepoPath(item).join());
  });
  if (repoPath == null) {
    return null;
  }

  const newPath = join(
    '/',
    normalizePath(path).slice(createRepoPath(repoPath).join().length),
  );

  return {
    repoPath,
    path: newPath,
  };
}
