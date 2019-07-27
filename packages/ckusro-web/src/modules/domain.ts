import { GitObject, InternalPathEntry } from '@ckusro/ckusro-core';
import {
  createObjectManager,
  ObjectManager,
  createEmptyObjectManager,
} from '../models/ObjectManager';
import { Ref } from '../models/RefManager';
import { updateState, UpdateState } from './actions/shared';
import {
  RepositoriesManager,
  emptyRepositoriesManager,
  createRepositoriesManager,
} from '../models/RepositoriesManager';

export type DomainState = {
  objectManager: ObjectManager;
  repositories: RepositoriesManager;
};

export function initialDomainState(): DomainState {
  return {
    objectManager: createEmptyObjectManager(),
    repositories: emptyRepositoriesManager(),
  };
}

const AddRef = 'Domain/AddRef' as const;

export function addRef(ref: Ref) {
  return {
    type: AddRef,
    payload: ref,
  };
}

const AddObjects = 'Domain/AddObjects' as const;

export function addObjects(objects: GitObject[]) {
  return {
    type: AddObjects,
    payload: objects,
  };
}

const UpdateStageHead = 'Domain/UpdateStageHead' as const;

export function updateStageHead(oid: string) {
  return {
    type: UpdateStageHead,
    payload: oid,
  };
}

const UpdateStageEntries = 'Domain/UpdateStageEntries' as const;

export function updateStageEntries(entries: InternalPathEntry[]) {
  return {
    type: UpdateStageEntries,
    payload: entries,
  };
}

const ClearStageManager = 'Domain/ClearStageManager' as const;

export function clearStageManager() {
  return {
    type: ClearStageManager,
    payload: null,
  };
}

export type DomainActions =
  | ReturnType<typeof addRef>
  | ReturnType<typeof addObjects>
  | ReturnType<typeof updateStageHead>
  | ReturnType<typeof updateStageEntries>
  | ReturnType<typeof updateState>
  | ReturnType<typeof clearStageManager>;

export function domainReducer(
  state: DomainState = initialDomainState(),
  action: DomainActions,
): DomainState {
  switch (action.type) {
    case AddRef:
      return {
        ...state,
        repositories: createRepositoriesManager(state.repositories).addRef(
          action.payload,
        ),
      };
    case AddObjects: {
      const manager = createObjectManager(state.objectManager);
      if (manager.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        objectManager: manager.addObjects(action.payload),
      };
    }
    case UpdateStageHead: {
      return {
        ...state,
        repositories: createRepositoriesManager(
          state.repositories,
        ).updateStageHead(action.payload),
      };
    }
    case UpdateStageEntries: {
      return {
        ...state,
        repositories: createRepositoriesManager(
          state.repositories,
        ).updateStageEntries(action.payload),
      };
    }
    case ClearStageManager:
      return {
        ...state,
        repositories: createRepositoriesManager(
          state.repositories,
        ).clearStageManager(),
      };
    case UpdateState:
      if (action.payload.domain == null) {
        return state;
      }

      return {
        ...state,
        ...((action.payload.domain || {}) as DomainState),
      };
    default:
      return state;
  }
}
