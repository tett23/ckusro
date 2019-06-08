import { createRefManager, Ref, RefManager } from '../models/RefManager';
import { Repository } from '../models/Repository';

export type DomainState = {
  repositories: Repository[];
  refManager: RefManager;
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
    ],
    refManager: {
      refs: {},
    },
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

export type DomainActions =
  | ReturnType<typeof addRepository>
  | ReturnType<typeof addRef>;

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
    default:
      return state;
  }
}
