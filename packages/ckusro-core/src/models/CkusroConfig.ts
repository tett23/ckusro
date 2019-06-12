export type CkusroConfig = {
  base: string;
  colorScheme: ColorScheme;
};

export type ColorScheme = {
  main: number;
  accent: number;
  background: number;
  base: number;
  text: number;
};

export type ColorSchemeText = { [K in keyof ColorScheme]: string };

export function convertColorScheme(colorScheme: ColorSchemeText): ColorScheme {
  return (Object.entries(colorScheme) as Array<
    [keyof ColorScheme, string]
  >).reduce(
    (acc, [key, value]) => {
      acc[key] = parseInt(value.replace(/^#/, ''), 16);

      return acc;
    },
    {} as ColorScheme,
  );
}
