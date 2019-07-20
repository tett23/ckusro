import { GitObject, InternalPathEntry } from '@ckusro/ckusro-core';
import {
  createObjectManager,
  ObjectManager,
  createEmptyObjectManager,
} from '../models/ObjectManager';
import { createRefManager, Ref, RefManager } from '../models/RefManager';
import { updateState, UpdateState } from './actions/shared';
import { createStageManager, StageManager } from '../models/StageEntryManager';

export type DomainState = {
  refManager: RefManager;
  objectManager: ObjectManager;
  stageManager: StageManager;
};

export function initialDomainState(): DomainState {
  return {
    refManager: {
      refs: {},
    },
    objectManager: createEmptyObjectManager(),
    stageManager: {
      headOid: null,
      internalPathEntries: [],
    },
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
      // TODO: optimization
      return {
        ...state,
        refManager: createRefManager(state.refManager).addRef(action.payload),
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
        stageManager: createStageManager(state.stageManager).updateHeadOid(
          action.payload,
        ),
      };
    }
    case UpdateStageEntries: {
      return {
        ...state,
        stageManager: createStageManager(state.stageManager).update(
          action.payload,
        ),
      };
    }
    case ClearStageManager:
      return {
        ...state,
        stageManager: { headOid: null, internalPathEntries: [] },
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
