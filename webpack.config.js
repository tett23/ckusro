const config = {
  entry: {
    'main': `${__dirname}/src/index.ts`
  },
  output: {
    path: `${__dirname}/lib`,
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'ts-loader',
          'tslint-loader'
        ]
      },
    ]
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx'
    ]
  }
};

module.exports = config;
