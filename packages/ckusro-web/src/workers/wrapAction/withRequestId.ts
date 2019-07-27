import sequenceGenerator from '../../utils/sequenceGenerator';

export type WithRequestId<T extends FSAction> = T & {
  meta: { requestId: number };
};

const requestIdGen = sequenceGenerator();

export default function withRequestId<T extends FSAction>(
  action: T,
): WithRequestId<T> {
  return (() => {
    return {
      ...action,
      meta: {
        ...(action.meta || {}),
        requestId: requestIdGen.next().value,
      },
    };
  })();
}
