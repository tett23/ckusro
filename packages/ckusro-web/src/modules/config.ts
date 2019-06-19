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

export type ConfigActions = ReturnType<typeof updateState>;

export function configReducer(
  state: ConfigState = initialConfigState(),
  action: ConfigActions,
): ConfigState {
  switch (action.type) {
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
