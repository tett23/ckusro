import { CkusroConfig, convertColorScheme } from '@ckusro/ckusro-core';

export type ConfigState = CkusroConfig;

export function initialConfigState(): CkusroConfig {
  return {
    base: '/repositories',
    colorScheme: convertColorScheme({
      main: 'B22E42',
      accent: 'A4CE50',
      text: '090C02',
      // background: 'DDE2C6',
      background: 'F6F7F4',
      base: 'BBC5AA',
    }),
  };
}

export function configReducer(
  state: ConfigState = initialConfigState(),
  _: any,
): ConfigState {
  return state;
}
