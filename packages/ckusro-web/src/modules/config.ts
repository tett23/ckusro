import {
  CkusroConfig,
  convertColorScheme,
  RepositoryInfo,
} from '@ckusro/ckusro-core';
import { updateState, UpdateState } from './actions/shared';

export type ConfigState = CkusroConfig;

export function initialConfigState(): CkusroConfig {
  return {
    base: '/repositories',
    stage: '/stage',
    coreId: 'ckusro-web__dev',
    corsProxy: 'https://cors.isomorphic-git.org',
    authentication: {
      github: null,
    },
    colorScheme: convertColorScheme({
      main: 'B22E42',
      accent: 'A4CE50',
      text: '090C02',
      // background: 'DDE2C6',
      background: 'F6F7F4',
      base: 'BBC5AA',
    }),
    plugins: {
      parsers: [],
      components: [],
    },
    repositories: [
      {
        url: 'https://github.com/tett23/ckusro',
        repoPath: {
          domain: 'github.com',
          user: 'tett23',
          name: 'ckusro',
        },
      },
      {
        url: 'https://github.com/tett23/trapahi',
        repoPath: {
          domain: 'github.com',
          user: 'tett23',
          name: 'trapahi',
        },
      },
    ],
    git: {
      user: {
        name: 'test_user',
        email: 'test_user@example.com',
      },
    },
  };
}

const UpdateCorsProxy = 'Config/UpdateCorsProxy' as const;

export function updateCorsProxy(value: string | null) {
  return {
    type: UpdateCorsProxy,
    payload: value,
  };
}

const UpdateAuthenticationGithub = 'Config/UpdateAuthenticationGithub' as const;

export function updateAuthenticationGithub(value: string | null) {
  return {
    type: UpdateAuthenticationGithub,
    payload: value,
  };
}

const AddRepository = 'Config/AddRepository' as const;

export function addRepository(repositoryInfo: RepositoryInfo) {
  return {
    type: AddRepository,
    payload: repositoryInfo,
  };
}

const ClearRepositories = 'Config/ClearRepositories' as const;

export function clearRepositories() {
  return {
    type: ClearRepositories,
    payload: null,
  };
}

const ReadConfigResult = 'Config/ReadConfigResult' as const;

export function readConfigResult(config: CkusroConfig | null) {
  return {
    type: ReadConfigResult,
    payload: config,
  };
}

export type ConfigActions =
  | ReturnType<typeof updateCorsProxy>
  | ReturnType<typeof updateAuthenticationGithub>
  | ReturnType<typeof addRepository>
  | ReturnType<typeof clearRepositories>
  | ReturnType<typeof readConfigResult>
  | ReturnType<typeof updateState>;

export function configReducer(
  state: ConfigState = initialConfigState(),
  action: ConfigActions,
): ConfigState {
  switch (action.type) {
    case UpdateCorsProxy:
      return { ...state, corsProxy: action.payload };
    case UpdateAuthenticationGithub:
      return {
        ...state,
        authentication: {
          ...state.authentication,
          github: action.payload,
        },
      };
    case AddRepository:
      return {
        ...state,
        repositories: [...state.repositories, action.payload],
      };
    case ClearRepositories:
      return {
        ...state,
        repositories: [],
      };
    case UpdateState:
      if (action.payload.config == null) {
        return state;
      }

      return {
        ...state,
        ...((action.payload.config || {}) as ConfigState),
      };
    default:
      return state;
  }
}
