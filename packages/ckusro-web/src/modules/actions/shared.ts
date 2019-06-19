import { GitObjectTypes } from '@ckusro/ckusro-core';
import { State } from '../';

export const UpdateCurrentOid = 'Shared/UpdateCurrentOid' as const;

export function updateCurrentOid(
  oid: string | null,
  objectType?: GitObjectTypes,
) {
  return {
    type: UpdateCurrentOid,
    payload: oid,
    meta: {
      objectType,
    },
  };
}

export const UpdateState = 'Shared/UpdateState' as const;

export function updateState(partialState: DeepPartial<State>) {
  return {
    type: UpdateState,
    payload: partialState,
  };
}

export type SharedActions =
  | ReturnType<typeof updateCurrentOid>
  | ReturnType<typeof updateState>;
