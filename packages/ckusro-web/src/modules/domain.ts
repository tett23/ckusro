import { Repository } from '../models/Repository';

export type DomainState = {
  repositories: Repository[];
};

export function initialDomainState(): DomainState {
  return {
    repositories: [
      {
        type: 'git',
        name: 'ckusro-web',
        url: 'git+https://github.com/tett23/ckusro.git',
        directory: '/packages/ckusro-web',
      },
    ],
  };
}

const AddRepository: 'Domain/AddRepository' = 'Domain/AddRepository';

export function addRepository(repository: Repository) {
  return {
    type: AddRepository,
    payload: repository,
  };
}

export type DomainActions = ReturnType<typeof addRepository>;

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
    default:
      return state;
  }
}
