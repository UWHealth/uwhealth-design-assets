module.exports = (nextConfig, webpackConfig, isServer) => {
    webpackConfig.module.rules.push(
        {
            test: /\.svg$/i,
            include: [/(uwhealth-design-assets)/i, /(\@uwhealth[\\/]design-assets)/i],
            issuer: /\.js$/i,
            loader: 'file-loader',
            options: {
                emitFile: true,
                publicPath: `${nextConfig.assetPrefix || nextConfig.basePath}/_next/static/images/`,
                outputPath: `${isServer ? "../" : ""}static/images/`,
                name: '[name].svg'
            }
        }
    );
};
