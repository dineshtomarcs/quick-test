const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/backend'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.json',
      assets: ['./src/assets', './src/email-templates'],
      optimization: process.env.NODE_ENV === 'production' ? true : false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
