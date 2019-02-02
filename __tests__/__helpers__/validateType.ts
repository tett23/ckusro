export type AnyFunction = (...args: any[]) => any;
export type ValidateData<F extends AnyFunction> = Array<
  [Parameters<F>, ReturnType<F>]
>;

export default function validateType<F extends AnyFunction>(
  func: F,
  data: ValidateData<F>,
) {
  data.forEach(([args, expected]) => {
    const actual = func(...args);

    expect(actual).toBe(expected);
  });
}
