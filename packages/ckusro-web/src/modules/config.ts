import { CkusroConfig, convertColorScheme } from '@ckusro/ckusro-core';
import { updateState, UpdateState } from './actions/shared';

export type ConfigState = CkusroConfig;

export function initialConfigState(): CkusroConfig {
  return {
    base: '/repositories',
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

export type ConfigActions =
  | ReturnType<typeof updateCorsProxy>
  | ReturnType<typeof updateAuthenticationGithub>
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
