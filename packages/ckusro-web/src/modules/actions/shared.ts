import { GitObjectTypes } from '@ckusro/ckusro-core';

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

export type SharedActions = ReturnType<typeof updateCurrentOid>;
