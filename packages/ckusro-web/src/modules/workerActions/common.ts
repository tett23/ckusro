export const ErrorMessage = 'CommonWorker/ErrorMessage' as const;

export function errorMessage(err: Error) {
  return {
    type: ErrorMessage,
    payload: err.message,
  };
}

export const EmptyMessage = 'CommonWorker/EmptyMessage' as const;

export function emptyMessage() {
  return {
    type: EmptyMessage,
    payload: null,
  };
}

export type CommonWorkerActions =
  | ReturnType<typeof errorMessage>
  | ReturnType<typeof emptyMessage>;
