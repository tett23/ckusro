import ckusroCore, { convertColorScheme } from '@ckusro/ckusro-core';
import LightningFs from '@isomorphic-git/lightning-fs';
import { ENOENT } from 'constants';
import FS from 'fs';
import { State } from '../modules/index';
import { splitError } from '../utils';
import { ObjectManager } from './ObjectManager';

export type PersistedState = Pick<
  State,
  'config' | 'objectView' | 'gitObjectList'
> & {
  oids: string[];
};

const PersistedStatePath = '/state.json';

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

export async function getFsInstance(
  coreId: string,
): Promise<typeof FS | Error> {
  return (async () => new LightningFs(coreId))().catch((err: Error) => err);
}

export function serializeState(state: State): PersistedState {
  const oids = Object.keys(state.domain.objectManager);

  return {
    config: state.config,
    oids,
    objectView: state.objectView,
    gitObjectList: state.gitObjectList,
  };
}

export async function toState(
  fs: typeof FS,
  persistedState: PersistedState,
): Promise<DeepPartial<State> | Error> {
  const core = ckusroCore(persistedState.config, fs);
  const ps = persistedState.oids.map(core.repositories.fetchObject);
  const objects = await Promise.all(ps).catch((err: Error) => err);
  if (objects instanceof Error) {
    return objects;
  }
  const [gitObjects] = splitError(objects);

  const objectManager = gitObjects.reduce(
    (acc, item) => {
      acc[item.oid] = item;
      return acc;
    },
    {} as ObjectManager,
  );

  return {
    config: persistedState.config,
    domain: {
      objectManager,
    },
    objectView: persistedState.objectView,
    gitObjectList: persistedState.gitObjectList,
  };
}
