export function splitError<T>(items: Array<T | Error>): [T[], Error[]] {
  return items.reduce(
    (acc, item) => {
      if (item instanceof Error) {
        acc[1].push(item);
        return acc;
      }

      acc[0].push(item);

      return acc;
    },
    [[], []] as [T[], Error[]],
  );
}
