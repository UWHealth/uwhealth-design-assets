module.exports = (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {

        webpack: (config, options) => {
            if (!options.defaultLoaders) {
                throw new Error(
                    'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
                )
            }
            nextConfig = Object.assign({
                assetPrefix: "",
                basePath: ""
            }, nextConfig);

            const { isServer } = options;

            config.module.rules.push({
                test: /\.svg$/i,
                include: [/(uwhealth-design-assets)/i, /(\@uwhealth[\\/]design-assets)/i],
                issuer: /\.\w+(?<!(s?c|sa)ss)$/i, // Next already includes a way to handle css/scss svgs
                loader: 'file-loader',
                options: {
                    emitFile: true,
                    publicPath: `${nextConfig.assetPrefix || nextConfig.basePath}/_next/static/images/`,
                    outputPath: `${isServer ? "../" : ""}static/images/`,
                    name: '[name].svg'
                }
            });

            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options)
            }

            return config;
        }
    })
};
