const path = require('node:path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  console.info(`Building for ${isProduction ? 'production' : 'development'}...`)

  return {
    entry: './src/index.tsx',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'public'),
      publicPath: isProduction ? '${BASE_FOLDER}' : '/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules\/(?!@tanstack\/react-query)/,
          use: [
            'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                ],
                plugins: [['@babel/plugin-transform-runtime']],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(svg|ico)$/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      moduleIds: 'deterministic',
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: false,
            },
          },
        }),
      ],
      splitChunks: false,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@routes': path.resolve(__dirname, 'src/routes'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@controllers': path.resolve(__dirname, 'src/controllers'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@layout': path.resolve(__dirname, 'src/layout'),
        '@lib': path.resolve(__dirname, 'src/lib'),
        '@components/TableAmazon': path.resolve(__dirname, 'src/components/TableAmazon'),
        '@components/ui': path.resolve(__dirname, 'src/components/ui'),
        '@hooks/use-toast': path.resolve(__dirname, 'src/hooks/use-toast'),
        '@components/Charts': path.resolve(__dirname, 'src/components/Charts'),
      },
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env.BASE_FOLDER': JSON.stringify(isProduction ? '${BASE_FOLDER}' : '/'),
      }),
    ],
    devServer: {
      hot: true,
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    mode: isProduction ? 'production' : 'development',
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.temp_cache'), // Diretório específico
      buildDependencies: {
        config: [__filename], // Recompila se o webpack.config.js mudar
      },
    },
    stats: 'minimal',
    infrastructureLogging: {
      level: 'warn',
    },
  }
}
