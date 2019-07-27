import { GitObject } from '@ckusro/ckusro-core';
import { ENOENT } from 'constants';
import FS from 'fs';
import { State, initialState } from '../modules/index';
import { splitError } from '../utils';
import {
  createObjectManager,
  createEmptyObjectManager,
  SerializedObjectManager,
} from './ObjectManager';
import { getWorkers } from '../Workers';

export type PersistedState = Pick<State, 'config' | 'ui' | 'misc'> & {
  objectManager: SerializedObjectManager;
};

export const PersistedStatePath = '/state.json';

type ErrorWithCode = Error & {
  code?: number;
};

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
  const coreId = state.config.coreId;
  if (coreId == null || coreId === '') {
    return new Error('');
  }

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
    config: state.config,
    ui: state.ui,
    misc: state.misc,
    objectManager: createObjectManager(state.domain.objectManager).serialize(),
  };
}

export async function deserializeState(
  persistedState: PersistedState,
): Promise<DeepPartial<State> | Error> {
  const workers = await (async () => getWorkers())().catch((err: Error) => err);
  if (workers instanceof Error) {
    return new Error('');
  }

  const objects = await workers.fetchObjects(persistedState.objectManager.oids);
  if (objects instanceof Error) {
    return objects;
  }
  if (objects == null) {
    return new Error('');
  }

  const [gitObjects] = splitError(objects);
  const objectManager = createObjectManager(
    createEmptyObjectManager(),
  ).addObjects(gitObjects.filter((item): item is GitObject => item != null));

  return {
    config: persistedState.config,
    domain: {
      objectManager,
    },
    ui: persistedState.ui,
  };
}
