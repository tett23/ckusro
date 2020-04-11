import FS from 'fs';
import { Stage } from '../../Stage';
import { Repository } from '../../Repository';
import { InternalPath, createInternalPath } from '../../models/InternalPath';
import primitiveFetchParents from '../../RepositoryPrimitives/internal/fetchParents';
import { PathTreeObject, WithStageParents } from '../../models/PathTreeObject';

export default async function fetchParentsByInternalPath(
  fs: typeof FS,
  repository: Repository,
  stage: Stage,
  internalPath: InternalPath,
): Promise<WithStageParents | Error> {
  const repoParents = await repositoryParents(fs, repository, internalPath);
  if (repoParents instanceof Error) {
    return repoParents;
  }

  const sParents = await stageParents(fs, stage, internalPath);
  if (sParents instanceof Error) {
    return sParents;
  }

  return {
    repository: repoParents,
    stage: sParents,
  };
}

async function repositoryParents(
  fs: typeof FS,
  repository: Repository,
  internalPath: InternalPath,
): Promise<PathTreeObject[] | Error> {
  const repoHeadTreeObject = await repository.headTreeObject();
  if (repoHeadTreeObject instanceof Error) {
    return repoHeadTreeObject;
  }

  return primitiveFetchParents(
    fs,
    repository.config(),
    repoHeadTreeObject,
    internalPath.path,
    {
      create: false,
    },
  );
}

async function stageParents(
  fs: typeof FS,
  stage: Stage,
  internalPath: InternalPath,
): Promise<PathTreeObject[] | Error> {
  const repoHeadTreeObject = await stage.headTreeObject();
  if (repoHeadTreeObject instanceof Error) {
    return repoHeadTreeObject;
  }

  return primitiveFetchParents(
    fs,
    stage.config(),
    repoHeadTreeObject,
    createInternalPath(internalPath).flat(),
    {
      create: false,
    },
  );
}
