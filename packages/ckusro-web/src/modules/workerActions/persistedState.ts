import { PersistedState } from '../../models/PersistedState';
import { CkusroConfig } from '@ckusro/ckusro-core';

export const WritePersistedState = 'PersistWorkerWorker/WritePersistedState' as const;

export function writePersistedState(state: PersistedState) {
  return {
    type: WritePersistedState,
    payload: state,
  };
}

export const ReadPersistedState = 'PersistWorkerWorker/ReadPersistedState' as const;

export function readPersistedState() {
  return {
    type: ReadPersistedState,
    payload: null,
  };
}

export const WriteConfig = 'PersistWorkerWorker/WriteConfig' as const;

export function writeConfig(config: CkusroConfig) {
  return {
    type: WriteConfig,
    payload: config,
  };
}

export const ReadConfig = 'PersistWorkerWorker/ReadConfig' as const;

export function readConfig() {
  return {
    type: ReadConfig,
    payload: null,
  };
}

export const InitializePersistedState = 'PersistWorkerWorker/InitializePersistedState' as const;

export function initializePersistedState() {
  return {
    type: InitializePersistedState,
    payload: null,
  };
}

export type PersistStateWorkerActions =
  | ReturnType<typeof writePersistedState>
  | ReturnType<typeof readPersistedState>
  | ReturnType<typeof writeConfig>
  | ReturnType<typeof readConfig>
  | ReturnType<typeof initializePersistedState>;
