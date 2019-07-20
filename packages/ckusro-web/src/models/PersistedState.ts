import ckusroCore, { convertColorScheme } from '@ckusro/ckusro-core';
import LightningFs from '@isomorphic-git/lightning-fs';
import { ENOENT } from 'constants';
import FS from 'fs';
import { State } from '../modules/index';
import { splitError } from '../utils';
import {
  createObjectManager,
  createEmptyObjectManager,
  SerializedObjectManager,
} from './ObjectManager';

export type PersistedState = Pick<State, 'config' | 'ui'> & {
  objectManager: SerializedObjectManager;
};

export const PersistedStatePath = '/state.json';

const DefaultConfig = {
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

export async function readPersistedState(
  coreId: string,
  fs: typeof FS,
): Promise<DeepPartial<State> | Error> {
  if (coreId == null || coreId === '') {
    return new Error('');
  }

  const stateJson = await fs.promises
    .readFile(PersistedStatePath, 'utf8')
    .catch((err: Error) => err);
  if (stateJson instanceof Error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((stateJson as any).code === ENOENT) {
      return { config: DefaultConfig };
    }

    return stateJson;
  }

  const persistedState: PersistedState = JSON.parse(stateJson);
  return await toState(fs, persistedState);
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

export async function getFsInstance(
  coreId: string,
): Promise<typeof FS | Error> {
  return (async () => new LightningFs(coreId))().catch((err: Error) => err);
}

export function serializeState(state: State): PersistedState {
  return {
    config: state.config,
    ui: state.ui,
    objectManager: createObjectManager(state.domain.objectManager).serialize(),
  };
}

export async function toState(
  fs: typeof FS,
  persistedState: PersistedState,
): Promise<DeepPartial<State> | Error> {
  const core = ckusroCore(persistedState.config, fs);
  const ps = persistedState.objectManager.oids.map(
    core.repositories().fetchObject,
  );
  const objects = await Promise.all(ps).catch((err: Error) => err);
  if (objects instanceof Error) {
    return objects;
  }

  const [gitObjects] = splitError(objects);
  const objectManager = createObjectManager(
    createEmptyObjectManager(),
  ).addObjects(gitObjects);

  return {
    config: persistedState.config,
    domain: {
      objectManager,
    },
    ui: persistedState.ui,
  };
}
