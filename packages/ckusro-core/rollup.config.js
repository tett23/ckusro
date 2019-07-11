import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: './lib/index.js',
      map: true,
      format: 'esm',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    json(),
    nodeResolve({
      browser: true,
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015',
          moduleResolution: 'node',
          allowJs: false,
          declaration: true,
          esModuleInterop: true,
        },
        include: ['./src/**/*'],
      },
    }),
    babel({
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            loose: true,
            targets: {
              node: '8.10',
              browsers: '> 0.25%, not dead',
            },
            useBuiltIns: 'entry',
            corejs: 3,
          },
        ],
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        ['@babel/plugin-transform-spread', { loose: false }],
        [
          '@babel/plugin-proposal-object-rest-spread',
          {
            loose: true,
            useBuiltIns: true,
          },
        ],
      ],
    }),
  ],
};
