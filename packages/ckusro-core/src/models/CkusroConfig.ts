import { Plugins } from './plugins';
import { RepositoryInfo } from './RepositoryInfo';

export type CkusroConfig = {
  base: string;
  stage: string;
  coreId: string;
  corsProxy: string | null;
  colorScheme: ColorScheme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: Plugins<any, any>;
  authentication: {
    github: string | null;
  };
  repositories: RepositoryInfo[];
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
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    {} as ColorScheme,
  );
}
