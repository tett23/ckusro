export type MiscState = {
  fetchingOids: string[];
  isEnablePersistedState: boolean;
};

export function initialMiscState(): MiscState {
  return {
    fetchingOids: [],
    isEnablePersistedState: false,
  };
}

const AddFetchingOids = 'FetchingObjects/AddFetchingOids' as const;

export function addFetchingOids(oids: string[]) {
  return {
    type: AddFetchingOids,
    payload: oids,
  };
}

const RemoveFetchingOids = 'FetchingObjects/RemoveOids' as const;

export function removeFetchingOids(oids: string[]) {
  return {
    type: RemoveFetchingOids,
    payload: oids,
  };
}

const EnablePersistedState = 'FetchingObjects/EnablePersistedState' as const;

export function enablePersistedState() {
  return {
    type: EnablePersistedState,
    payload: null,
  };
}

const DisablePersistedState = 'FetchingObjects/DisablePersistedState' as const;

export function disablePersistedState() {
  return {
    type: DisablePersistedState,
    payload: null,
  };
}

export type MiscActions =
  | ReturnType<typeof addFetchingOids>
  | ReturnType<typeof removeFetchingOids>
  | ReturnType<typeof enablePersistedState>
  | ReturnType<typeof disablePersistedState>;

export function miscReducer(
  state: MiscState = initialMiscState(),
  action: MiscActions,
): MiscState {
  switch (action.type) {
    case AddFetchingOids:
      return {
        ...state,
        fetchingOids: [...state.fetchingOids, ...action.payload],
      };
    case RemoveFetchingOids:
      return {
        ...state,
        fetchingOids: state.fetchingOids.filter(
          (oid) => !action.payload.includes(oid),
        ),
      };
    case EnablePersistedState:
      return {
        ...state,
        isEnablePersistedState: true,
      };
    case DisablePersistedState:
      return {
        ...state,
        isEnablePersistedState: true,
      };
    default:
      return state;
  }
}
