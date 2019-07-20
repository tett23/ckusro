import { SharedActions, UpdateState } from '../../actions/shared';
import { RepoPath } from '@ckusro/ckusro-core';

export type RepositoryViewState = {
  repoPath: RepoPath | null;
};

export function initialRepoPathState(): RepositoryViewState {
  return {
    repoPath: null,
  };
}

const UpdateRepoPath = 'ObjectView/UpdateCurrentAst' as const;

export function updateRepoPath(repoPath: RepoPath | null) {
  return {
    type: UpdateRepoPath,
    payload: repoPath,
  };
}

export type RepositoryViewActions =
  | ReturnType<typeof updateRepoPath>
  | SharedActions;

export default function repositoryViewReducer(
  state: RepositoryViewState = initialRepoPathState(),
  action: RepositoryViewActions,
): RepositoryViewState {
  switch (action.type) {
    case UpdateRepoPath:
      return {
        ...state,
        repoPath: action.payload,
      };
    case UpdateState:
      if (
        action.payload.ui == null ||
        action.payload.ui.mainView == null ||
        action.payload.ui.mainView.repositoryView == null
      ) {
        return state;
      }

      return {
        ...state,
        ...((action.payload.ui.mainView.repositoryView ||
          {}) as RepositoryViewState),
      };
    default:
      return state;
  }
}
