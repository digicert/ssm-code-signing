const path = require('path');

module.exports = {
  entry: './index.ts',
  target: "node",
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
  mode: "production",
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: path.resolve(__dirname, "./node_modules"),
            use: 'ts-loader'
        }
    ]
}
}