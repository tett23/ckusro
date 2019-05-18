import { join } from 'path';
import webpack from 'webpack';

const srcPath = join(__dirname, '../../../');
// const modelsPath = join(srcPath, 'models');
// const parserInstancePath = join(srcPath, 'parserInstance');
// const assetsPath = join(srcPath, 'staticRenderer', 'assets');
const assetsPath = join(
  srcPath,
  'cli',
  'renderers',
  'staticRenderer',
  'assets',
  'components',
  'index',
);
// const entries = [modelsPath, assetsPath, parserInstancePath];
const entries = [assetsPath];

const nodeModulesPath = join(__dirname, '../../../../node_modules');

const config: webpack.Configuration = {
  stats: 'errors-only',
  // entry: ['@babel/polyfill', 'core-js', ...entries],
  entry: [...entries],
  output: {
    path: `${__dirname}/lib`,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [nodeModulesPath],
  },
};

export default config;
