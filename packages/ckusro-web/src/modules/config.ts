import { CkusroConfig, convertColorScheme } from '@ckusro/ckusro-core';

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

export function configReducer(
  state: ConfigState = initialConfigState(),
  _: any,
): ConfigState {
  return state;
}
