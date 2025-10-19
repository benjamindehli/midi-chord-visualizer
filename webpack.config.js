const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/main.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "docs"),
        clean: true // Clears /docs before each build
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "main.css"
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html", // use your HTML as a base
            filename: "index.html", // output file in /docs
            inject: "body" // inject scripts before </body>
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    optimization: {
        minimizer: [`...`, new CssMinimizerPlugin()]
    },
    devServer: {
        static: [
            {
                directory: path.join(__dirname, "public")
            },
            {
                directory: path.join(__dirname, "src"),
                publicPath: "/src/"
            }
        ],
        compress: true,
        port: 9000
    }
};
