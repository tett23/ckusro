import { CkusroConfig, GitConfig } from './CkusroConfig';
import { RepoPath, gitDir } from './RepoPath';

export type IsomorphicGitConfig = {
  core: string;
  gitdir: string;
  corsProxy?: string | null;
  authentication: {
    github: string | null;
  };
  git: GitConfig;
};

export function toIsomorphicGitConfig(
  config: CkusroConfig,
  repoPath: RepoPath,
): IsomorphicGitConfig {
  return {
    core: config.coreId,
    gitdir: gitDir(config.base, repoPath),
    corsProxy: config.corsProxy,
    authentication: {
      github: config.authentication.github,
    },
    git: config.git,
  };
}

export function stageIsomorphicGitConfig(
  config: CkusroConfig,
): IsomorphicGitConfig {
  return {
    core: config.coreId,
    gitdir: config.stage,
    corsProxy: config.corsProxy,
    authentication: {
      github: config.authentication.github,
    },
    git: config.git,
  };
}
