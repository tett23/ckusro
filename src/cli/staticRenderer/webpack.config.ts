import { join } from 'path';
import webpack from 'webpack';

const srcPath = join(__dirname, '../../src');
// const modelsPath = join(srcPath, 'models');
// const parserInstancePath = join(srcPath, 'parserInstance');
// const assetsPath = join(srcPath, 'staticRenderer', 'assets');
const assetsPath = join(
  srcPath,
  'staticRenderer',
  'assets',
  'components',
  'index',
);
// const entries = [modelsPath, assetsPath, parserInstancePath];
const entries = [assetsPath];

const nodeMModulesPath = join(__dirname, '../../node_modules');

const config: webpack.Configuration = {
  entry: ['@babel/polyfill', 'core-js', ...entries],
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
    modules: [nodeMModulesPath],
  },
};

export default config;
