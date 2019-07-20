import { SharedActions, UpdateState } from '../../actions/shared';
import { RepositoryInfo, InternalPathEntry } from '@ckusro/ckusro-core';

export type RepositoryViewTabTypes = 'Stage' | 'CommitLogs';

export type RepositoryViewState = {
  repositoryInfo: RepositoryInfo | null;
  selectedTab: RepositoryViewTabTypes;
  selectedStageEntry: InternalPathEntry | null;
};

export function initialRepoPathState(): RepositoryViewState {
  return {
    repositoryInfo: null,
    selectedTab: 'Stage',
    selectedStageEntry: null,
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

const UpdateSelectedStageEntry = 'UI/MainView/RepositoryView/UpdateSelectedStageEntry' as const;

export function updateSelectedStageEntry(
  internalPathEntry: InternalPathEntry | null,
) {
  return {
    type: UpdateSelectedStageEntry,
    payload: internalPathEntry,
  };
}

export type RepositoryViewActions =
  | ReturnType<typeof updateRepoPath>
  | ReturnType<typeof updateSelectedTab>
  | ReturnType<typeof updateSelectedStageEntry>
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
    case UpdateSelectedStageEntry:
      return {
        ...state,
        selectedStageEntry: action.payload,
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
