import { Plugins } from './plugins';

export type CkusroConfig = {
  base: string;
  coreId: string;
  corsProxy: string | null;
  colorScheme: ColorScheme;
  plugins: Plugins;
  authentication: {
    github: string | null;
  };
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
