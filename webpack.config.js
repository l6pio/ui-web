const Webpack = require("webpack");
const Path = require("path");
const Merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const Mode = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = Mode;

const Paths = {
    app: Path.join(__dirname, "app"),
    build: Path.join(__dirname, "build")
};

const Common = {
    target: "web",

    entry: {
        fetch: "whatwg-fetch",
        app: Paths.app
    },

    resolve: {
        extensions: [".js", ".jsx"]
    },

    output: {
        filename: "[name].[hash].js",
        path: Paths.build,
        publicPath: "/",
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loaders: ["babel-loader?cacheDirectory"],
                include: Paths.app
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "url-loader"
            },
            {
                test: /\.(woff|woff2)$/,
                loader: "url-loader?mimetype=application/x-font-woff;charset=utf-8"
            },
            {
                test: /\.md$/,
                loader: "raw-loader"
            },
        ]
    },

    optimization: {
        minimize: true,
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2,
                    priority: 0,
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all",
                    enforce: true,
                    priority: 10,
                },
                ui: {
                    test: /[\\/]node_modules[\\/](@material-ui|apexcharts|react.*|elasticlunr)[\\/]/,
                    name: "ui",
                    chunks: "all",
                    enforce: true,
                    priority: 20,
                },
                pic: {
                    name: "pic",
                    test: /\.(svg|png|jpg|gif)$/,
                    chunks: "all",
                    priority: 30,
                }
            }
        }
    }
};

const Config = function (mode) {
    const HotModuleReplacementPlugin = new Webpack.HotModuleReplacementPlugin();

    const plugins = [];
    if (mode === "local") {
        plugins.push(HotModuleReplacementPlugin);
    }

    console.log("Running Mode: " + mode);

    plugins.push(
        new Webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(mode === "local" ? "develop" : "production"),
            }
        }),

        new Webpack.optimize.AggressiveMergingPlugin(),

        new HtmlWebpackPlugin({
            title: "Lollipop",
            template: Paths.app + "/static/index.template.html",
            filename: Paths.build + "/index.html",
            hash: true
        }),

        new CopyWebpackPlugin([
            {
                from: Paths.app + "/static/favicon.png",
                to: Paths.build + "/favicon.png"
            }
        ])
    );

    return {
        devServer: {
            contentBase: Paths.build,
            historyApiFallback: true,
            hot: mode === "local",
            inline: mode === "local",
            progress: mode === "local",
            stats: "errors-only",
            port: 8080,
            proxy: {
                "/api/v1": "http://localhost:1323"
            }
        },
        plugins: plugins
    };
};

module.exports = Merge(Common, Config(Mode));
