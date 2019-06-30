import { State } from '../';
import { BufferInfo } from '../../models/BufferInfo';

export const SelectBufferInfo = 'Shared/SelectBufferInfo' as const;

export function selectBufferInfo(bufferInfo: BufferInfo) {
  return {
    type: SelectBufferInfo,
    payload: bufferInfo,
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
  | ReturnType<typeof selectBufferInfo>
  | ReturnType<typeof updateState>;
