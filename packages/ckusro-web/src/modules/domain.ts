import { GitObject } from '@ckusro/ckusro-core';
import { createObjectManager, ObjectManager } from '../models/ObjectManager';
import { createRefManager, Ref, RefManager } from '../models/RefManager';
import { Repository } from '../models/Repository';

export type DomainState = {
  repositories: Repository[];
  refManager: RefManager;
  objectManager: ObjectManager;
};

export function initialDomainState(): DomainState {
  return {
    repositories: [
      {
        type: 'git',
        name: 'ckusro-web',
        url: 'https://github.com/tett23/ckusro.git',
        directory: '/packages/ckusro-web',
      },
      {
        type: 'git',
        name: 'trapahi',
        url: 'https://github.com/tett23/trapahi.git',
        directory: '/',
      },
    ],
    refManager: {
      refs: {},
    },
    objectManager: {},
  };
}

const AddRepository = 'Domain/AddRepository' as const;

export function addRepository(repository: Repository) {
  return {
    type: AddRepository,
    payload: repository,
  };
}

const AddRef = 'Domain/AddRef' as const;

export function addRef(ref: Ref) {
  return {
    type: AddRef,
    payload: ref,
  };
}

const AddObject = 'Domain/AddObject' as const;

export function addObject(object: GitObject) {
  return {
    type: AddObject,
    payload: object,
  };
}

export type DomainActions =
  | ReturnType<typeof addRepository>
  | ReturnType<typeof addRef>
  | ReturnType<typeof addObject>;

export function domainReducer(
  state: DomainState = initialDomainState(),
  action: DomainActions,
): DomainState {
  switch (action.type) {
    case AddRepository:
      return {
        ...state,
        repositories: [...state.repositories, action.payload],
      };
    case AddRef:
      return {
        ...state,
        refManager: createRefManager(state.refManager).addRef(action.payload),
      };
    case AddObject:
      return {
        ...state,
        objectManager: createObjectManager(state.objectManager).addObject(
          action.payload,
        ),
      };
    default:
      return state;
  }
}
