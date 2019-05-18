export function separateErrors<T>(items: Array<T | Error>): [T[], Error[]] {
  return items.reduce(
    (acc: [T[], Error[]], item) => {
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
