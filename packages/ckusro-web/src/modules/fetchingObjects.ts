export type FetchingObjectsState = {
  oids: string[];
};

export function initialFetchingObjectsState(): FetchingObjectsState {
  return {
    oids: [],
  };
}

const AddOids = 'FetchingObjects/AddOids' as const;

export function addOids(oids: string[]) {
  return {
    type: AddOids,
    payload: oids,
  };
}

const RemoveOids = 'FetchingObjects/RemoveOids' as const;

export function removeOids(oids: string[]) {
  return {
    type: RemoveOids,
    payload: oids,
  };
}

export type FetchingObjectsActions =
  | ReturnType<typeof addOids>
  | ReturnType<typeof removeOids>;

export function fetchingObjectsReducer(
  state: FetchingObjectsState = initialFetchingObjectsState(),
  action: FetchingObjectsActions,
): FetchingObjectsState {
  switch (action.type) {
    case AddOids:
      return {
        ...state,
        oids: [...state.oids, ...action.payload],
      };
    case RemoveOids:
      return {
        ...state,
        oids: state.oids.filter((oid) => !action.payload.includes(oid)),
      };
    default:
      return state;
  }
}
