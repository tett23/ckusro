declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
  namespace jest {
    interface Matchers<R> {
      toValidatePair(validator: AnyFunction): CustomMatcherResult;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;
type ValidateData<F extends AnyFunction> = Array<
  [Parameters<F>, ReturnType<F>]
>;

export function toValidatePair<F extends AnyFunction>(
  this: jest.MatcherUtils,
  received: ValidateData<F>,
  validator: F,
) {
  return {
    message: () => {
      const failed = received.filter(
        ([args, result]) => validator(...args) !== result,
      );
      if (failed.length === 0) {
        return 'hogehoge';
      }

      return failed
        .map(([args, expected]) => {
          return `expected ${JSON.stringify(args)} ${expected}`;
        })
        .join('\n');
    },
    pass: received.every(([args, result]) => validator(...args) === result),
  };
}

expect.extend({
  toValidatePair,
});
