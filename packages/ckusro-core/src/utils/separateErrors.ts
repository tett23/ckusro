export type TOrError<T> = [T[], Error[]];

export default function separateErrors<T>(
  items: Array<T | Error>,
): TOrError<T> {
  return items.reduce(
    (acc: TOrError<T>, item) => {
      if (item instanceof Error) {
        acc[1].push(item);
      } else {
        acc[0].push(item);
      }

      return acc;
    },
    [[], []],
  );
}
