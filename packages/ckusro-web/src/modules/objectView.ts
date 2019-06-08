export type ObjectViewState = {
  currentOid: string | null;
};

export function initialObjectViewState(): ObjectViewState {
  return {
    currentOid: null,
  };
}
const UpdateCurrentOid = 'ObjectView/UpdateCurrentOid' as const;

export function updateCurrentOid(oid: string | null) {
  return {
    type: UpdateCurrentOid,
    payload: oid,
  };
}

export type ObjectViewActions = ReturnType<typeof updateCurrentOid>;

export function objectViewReducer(
  state: ObjectViewState = initialObjectViewState(),
  action: ObjectViewActions,
): ObjectViewState {
  switch (action.type) {
    case UpdateCurrentOid:
      return {
        ...state,
        currentOid: action.payload,
      };
    default:
      return state;
  }
}
