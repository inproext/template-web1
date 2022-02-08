const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")

const config = {
    mode: 'production' /*Default: production */,
    watch: true,
    watchOptions: {
      aggregateTimeout: 600,
      ignored: ['node_modules'],
    },
    entry: { app: path.resolve(__dirname, './src/index.js' ) },
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve(__dirname, './dist'),
    },
    module : {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            }
        ]
    },
    optimization: {
      minimize: true,
      // minimizer: [new CssMinimizerPlugin()],
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
    },
    plugins: [
        new MiniCSSExtractPlugin({ filename: 'bundle.css' }),
        new CopyPlugin({
            patterns: [
              {
                from: "src/html/*.html",
                to({ context, absoluteFilename }) {
                  return Promise.resolve("html/[name][ext]");
                },
              },
              {
                from: "src/img/",
                to: "img"
              },
              {
                from: "src/audios/",
                to: "audios"
              },
              {
                from: "src/videos/",
                to: "videos"
              },
              {
                from: "src/pdf/",
                to: "pdf"
              },
              {
                from: "src/fonts/",
                to: "fonts"
              }
            ]
        })
    ]
}

module.exports = config