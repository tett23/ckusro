import { ENOENT } from 'constants';
import FS from 'fs';
import { State, initialState } from '../modules/index';
import { getWorkers } from '../Workers';
import { SerializedRepositoriesManager } from './RepositoriesManager/serialize';
import {
  createRepositoriesManager,
  emptyRepositoriesManager,
} from './RepositoriesManager';
import deserializeRepositoriesManager from './RepositoriesManager/deserialize';
import { ErrorWithCode } from './ErrorWithCode';
import { CkusroConfig } from '@ckusro/ckusro-core';

export type PersistedState = Pick<State, 'ui'> & {
  domain: { repositories: SerializedRepositoriesManager };
};

export const PersistedStatePath = '/state.json';

export async function readPersistedState(
  coreId: string,
  fs: typeof FS,
): Promise<PersistedState | Error> {
  if (coreId == null || coreId === '') {
    return new Error('');
  }

  const stateJson = await fs.promises
    .readFile(PersistedStatePath, 'utf8')
    .catch((err: ErrorWithCode) => err);
  if (stateJson instanceof Error) {
    if (stateJson.code === ENOENT) {
      return serializeState(initialState());
    }

    return stateJson;
  }

  return JSON.parse(stateJson);
}

export async function writePersistedState(
  fs: typeof FS,
  state: PersistedState,
): Promise<true | Error> {
  const result = await fs.promises
    .writeFile(PersistedStatePath, JSON.stringify(state), 'utf8')
    .catch((err: Error) => err);
  if (result instanceof Error) {
    return result;
  }

  return true;
}

export async function removePersistedState(
  fs: typeof FS,
): Promise<true | Error> {
  await (async () => fs.promises.unlink(PersistedStatePath))().catch(
    (err: Error) => err,
  );

  return true;
}

export function serializeState(state: State): PersistedState {
  return {
    ui: state.ui,
    domain: {
      repositories: createRepositoriesManager(
        state.domain.repositories,
      ).serialize(),
    },
  };
}

export async function deserializeState(
  config: CkusroConfig,
  persistedState: PersistedState,
): Promise<DeepPartial<State> | Error> {
  const workers = await (async () => getWorkers())().catch((err: Error) => err);
  if (workers instanceof Error) {
    return new Error('');
  }

  let repos;
  if (persistedState.domain.repositories == null) {
    repos = emptyRepositoriesManager();
  } else {
    repos = await deserializeRepositoriesManager(
      persistedState.domain.repositories,
      (oids: string[]) => workers.fetchObjects(config, oids),
    );
    if (repos instanceof Error) {
      return repos;
    }
  }

  return {
    config,
    domain: {
      ...persistedState.domain,
      repositories: repos,
    },
    ui: persistedState.ui,
  };
}
