import { ParserInstance } from '../../../../../parserInstance';

export type CommonState = {
  parserInstance: ParserInstance;
};

const UpdateParserInstance: 'Common/UpdateParserInstance' =
  'Common/UpdateParserInstance';

export function updateParserInstance(parserInstance: ParserInstance) {
  return {
    type: UpdateParserInstance,
    payload: parserInstance,
  };
}

export type CommonActions = ReturnType<typeof updateParserInstance>;

export function initialState(): CommonState {
  return {
    parserInstance: null as any,
  };
}

export default function commonReducer(
  state: CommonState = initialState(),
  action: CommonActions,
): CommonState {
  switch (action.type) {
    case UpdateParserInstance:
      return { ...state, parserInstance: action.payload };
    default:
      return state;
  }
}
