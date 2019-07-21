import { CkusroConfig } from '@ckusro/ckusro-core';
import { State } from '../modules/index';

export type WithConfig<T extends FSAction> = T & {
  meta: {
    config: CkusroConfig;
  };
};

export default function withConfig<T extends FSAction>(
  action: T,
  getState: () => State,
): WithConfig<T> {
  return {
    ...action,
    meta: {
      ...(action.meta || {}),
      config: getState().config,
    },
  };
}
