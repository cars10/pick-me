const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const dev = process.env.NODE_ENV !== 'production'
const extractCss = !dev || process.env.EXTRACT_CSS
const outputPath = path.resolve(__dirname, 'dist')

const basePlugins = [
    new MiniCssExtractPlugin({
        filename: 'style.css',
        chunkFilename: '[id].css'
    }),
    new CopyWebpackPlugin([
        {from: 'src/sync-pick/i18n/*.js', to: 'i18n/[name].[ext]'}
    ])
]
const devPlugins = basePlugins.concat([
    new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'head'
    }),
    new Serve({ static: outputPath, hmr: false, port: 12345 })
])

module.exports = {
    entry: './src/main.js',
    output: {
        path: outputPath,
        filename: 'sync-pick.js',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    extractCss ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: dev ? devPlugins : basePlugins,
    mode: dev ? 'development' : 'production',
    watch: dev
};
