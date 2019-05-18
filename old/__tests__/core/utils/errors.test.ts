import { separateErrors } from '../../../src/core/utils/errors';

describe(separateErrors, () => {
  it('judges type', () => {
    const data: Array<[Array<number | Error>, [number, number]]> = [
      [[new Error(), 1], [1, 1]],
      [[new Error()], [0, 1]],
      [[1], [1, 0]],
    ];

    data.forEach(([arr, [tCount, errCount]]) => {
      const [actualT, actualErr] = separateErrors(arr);

      expect(actualT.length).toBe(tCount);
      expect(actualErr.length).toBe(errCount);
    });
  });
});
