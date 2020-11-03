const path = require('path');

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

    // Necessary until webpack 5, where we can use module subpath resolution
    webpackConfig.resolve.alias['uwhealth-design-assets'] = path.resolve(
        path.dirname(
            path.resolve('uwhealth-design-assets')
        ),
        'svg'
    );
};
