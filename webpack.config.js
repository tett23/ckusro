const config = {
  entry: ["@babel/polyfill", "core-js", "./src/index.ts"],
  output: {
    path: `${__dirname}/lib`,
    filename: '[name].js'
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
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
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
