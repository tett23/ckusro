import { PersistedState } from '../../models/PersistedState';

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

export type PersistStateWorkerActions =
  | ReturnType<typeof writePersistedState>
  | ReturnType<typeof readPersistedState>;
