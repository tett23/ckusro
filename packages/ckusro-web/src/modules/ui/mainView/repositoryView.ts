import { SharedActions, UpdateState } from '../../actions/shared';
import { RepositoryInfo } from '@ckusro/ckusro-core';

export type RepositoryViewTabTypes = 'Stage' | 'CommitLogs';

export type RepositoryViewState = {
  repositoryInfo: RepositoryInfo | null;
  selectedTab: RepositoryViewTabTypes;
};

export function initialRepoPathState(): RepositoryViewState {
  return {
    repositoryInfo: null,
    selectedTab: 'Stage',
  };
}

const UpdateRepoPath = 'UI/MainView/RepositoryView/UpdateCurrentAst' as const;

export function updateRepoPath(value: RepositoryInfo | null) {
  return {
    type: UpdateRepoPath,
    payload: value,
  };
}

const UpdateSelectedTab = 'UI/MainView/RepositoryView/UpdateSelectedTab' as const;

export function updateSelectedTab(value: RepositoryViewTabTypes) {
  return {
    type: UpdateSelectedTab,
    payload: value,
  };
}

export type RepositoryViewActions =
  | ReturnType<typeof updateRepoPath>
  | ReturnType<typeof updateSelectedTab>
  | SharedActions;

export default function repositoryViewReducer(
  state: RepositoryViewState = initialRepoPathState(),
  action: RepositoryViewActions,
): RepositoryViewState {
  switch (action.type) {
    case UpdateRepoPath:
      return {
        ...state,
        repositoryInfo: action.payload,
      };
    case UpdateSelectedTab:
      return {
        ...state,
        selectedTab: action.payload,
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
