import path from "path"
import { Configuration as WebpackConfig, DefinePlugin } from "webpack"
import { Configuration as WebpackServerConfig } from 'webpack-dev-server'

interface Configuration extends WebpackConfig {
  devServer?: WebpackServerConfig
}

const config: Configuration = {
  entry: "./src/index.ts",
  plugins: [
    new DefinePlugin({
      'process.env.PROJECT': JSON.stringify(process.env.PROJECT)
   }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.(wav|mp3)$/,
        type: 'asset/resource',
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    historyApiFallback: {
      index: 'index.html'
    }
  },
}

export default config
