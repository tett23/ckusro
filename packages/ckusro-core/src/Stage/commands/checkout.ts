import FS from 'fs';
import { GitObject, TreeObject } from '../../models/GitObject';
import {
  IsomorphicGitConfig,
  toIsomorphicGitConfig,
  stageIsomorphicGitConfig,
} from '../../models/IsomorphicGitConfig';
import { repository, Repository } from '../../Repository';
import replaceTreeNode from '../../RepositoryPrimitives/internal/replaceTreeNode';
import { RepoPath, createRepoPath } from '../../models/RepoPath';
import { RepositoryPrimitives } from '../../RepositoryPrimitives';
import batchWriteObjects from '../../RepositoryPrimitives/batchWriteObjects';
import separateErrors from '../../utils/separateErrors';
import { isErrors } from '../../utils/types';
import wrapError from '../../utils/wrapError';
import { fetchOrCreateTreeByPath } from '../../RepositoryPrimitives/fetchOrCreateTreeByPath';
import headTree from '../../RepositoryPrimitives/headTree';
import { CkusroConfig } from '../../models/CkusroConfig';
import { PathTreeEntry } from '../../models/PathTreeEntry';

export type CheckoutResult = {
  root: TreeObject;
  tree: TreeObject;
};

export default async function checkout(
  fs: typeof FS,
  config: CkusroConfig,
  repoPath: RepoPath,
  ref: string,
): Promise<CheckoutResult | Error> {
  const stageConfig = stageIsomorphicGitConfig(config);
  const repoConfig = toIsomorphicGitConfig(config, repoPath);
  const repo = repository(fs, repoConfig, repoPath);
  const copyResult = await copyTree(fs, stageConfig, repo, ref);
  if (copyResult instanceof Error) {
    return wrapError(copyResult);
  }

  const head = await headTree(fs, stageConfig);
  if (head instanceof Error) {
    return wrapError(head);
  }

  const fetchOrCreateResult = await fetchOrCreateTreeByPath(
    fs,
    stageConfig,
    head,
    createRepoPath(repoPath).join(),
  );
  if (fetchOrCreateResult instanceof Error) {
    return wrapError(fetchOrCreateResult);
  }

  const tree = await revTree(repo, ref);
  if (tree instanceof Error) {
    return wrapError(tree);
  }

  const [[, root]] = fetchOrCreateResult;
  const replaceTreeNodeResult = await replaceTreeNode(
    fs,
    stageConfig,
    createRepoPath(repoPath).join(),
    tree,
    { root },
  );
  if (replaceTreeNodeResult instanceof Error) {
    return wrapError(replaceTreeNodeResult);
  }

  const newRoot = replaceTreeNodeResult[0][1];
  if (newRoot == null) {
    return new Error();
  }

  const newTree = replaceTreeNodeResult[replaceTreeNodeResult.length - 1][1];
  if (newTree == null) {
    return new Error();
  }

  return {
    root: newRoot,
    tree: newTree,
  };
}

async function copyTree(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  repository: Repository,
  ref: string,
): Promise<true | Error> {
  const tree = await revTree(repository, ref);
  if (tree instanceof Error) {
    return wrapError(tree);
  }

  const entries = await repository.lsFilesByTree(tree);
  if (entries instanceof Error) {
    return wrapError(entries);
  }

  const ps = entries.map(([, item]: PathTreeEntry) =>
    repository.fetchByOid(item.oid),
  );
  const fetchResults = await Promise.all(ps);
  const [nullable, errors] = separateErrors(fetchResults);
  if (isErrors(errors)) {
    return wrapError(errors[0]);
  }

  const objects = nullable.filter((item): item is GitObject => item != null);
  const batchWriteResult = await batchWriteObjects(fs, config, objects);
  if (batchWriteResult instanceof Error) {
    return wrapError(batchWriteResult);
  }

  return true;
}

async function revTree(
  repo: RepositoryPrimitives,
  ref: string,
): Promise<TreeObject | Error> {
  const oid = await repo.revParse(ref);
  if (oid instanceof Error) {
    return wrapError(oid);
  }

  const commit = await repo.fetchByOid(oid, 'commit');
  if (commit instanceof Error) {
    return wrapError(commit);
  }
  if (commit == null) {
    return new Error();
  }

  const tree = await repo.fetchByOid(commit.content.tree, 'tree');
  if (tree instanceof Error) {
    return wrapError(tree);
  }
  if (tree == null) {
    return new Error();
  }

  return tree;
}
