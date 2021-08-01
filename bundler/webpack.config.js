const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const postcssPresetEnv = require('postcss-preset-env')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirClient = path.join(__dirname, '../src')
const dirStatic = path.join(__dirname, '../static')
const dirNode = 'node_modules'

module.exports =
{
  target: 'web',
  entry: [ path.join(dirClient, 'index.js') ],
  resolve:
  {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    modules:
    [
      dirClient,
      dirStatic,
      dirNode
    ]
  },
  plugins:
  [
    new webpack.DefinePlugin({ IS_DEVELOPMENT }),
    new CopyWebpackPlugin
    ({
      patterns:
      [
        {
          from: path.resolve(__dirname, '../static'),
          to: ''
        }
      ]
    }),
    new MiniCssExtractPlugin
    ({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new ImageMinimizerPlugin
    ({
      minimizerOptions:
      {
        plugins:
        [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
        ],
      },
    })
  ],
  module:
  {
    rules:
    [
      {
        test: /\.js$/,
        use:
        {
          loader: 'babel-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.(ts|tsx)?$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: ["module:metro-react-native-babel-preset"],
              plugins: ["react-native-web"],
            },
          },
          {
            loader: "awesome-typescript-loader",
          },
        ],
      },
      {
        test: /\.jsx$/,
        use:
        {
          loader: "babel-loader",
        },
        exclude: [/node_modules/, /public/]
      },
      {
        test: /\.styl$/,
        use:
        [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'stylus-loader' }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use:
        [
          {
            loader: 'file-loader',
            options: {
              name (file)
              {
                if (IS_DEVELOPMENT)
                {
                  return '[path][name].[ext]'
                }
                return '[hash].[ext]'
              },
              outputPath: 'assets/images/'
            }
          },
          {
            loader: ImageMinimizerPlugin.loader,
            options:
            {
              severityError: 'warning',
              minimizerOptions:
              {
                plugins: ['gifsicle'],
              },
            },
          },
        ],
      },
      {
        test: /\.(ttf|otf|woff|woff2|eot)$/,
        use: [{ loader: 'file-loader' }]
      },
      // Glsl files
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  },
  // Optimization
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  externals: {
    "react-native": true,
  }
}
