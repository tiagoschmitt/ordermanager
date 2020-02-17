module.exports = {
    outputDir: '../cartridges/bm_saletracker/cartridge/static/default',
    devServer: {
        proxy: {
            '/comments': {
                target: 'https://jsonplaceholder.typicode.com/comments',
                changeOrigin: true
            }
        }
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.splitChunks = false;
        }

        config.entry = {
            'main' : [
                './src/main.js'
            ]
        };
    },
    chainWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.plugins.delete('html');
            config.plugins.delete('preload');
            config.plugins.delete('prefetch');
            config.plugins.delete('copy');
        }

        config
            .output
            .filename('js/[name].js');

        if (process.env.NODE_ENV === 'production') {
            config
                .plugin('extract-css')
                .tap((args) => {
                    return [{
                        filename: 'css/[name].css',
                        chunkFilename: 'css/[id].css'
                    }];
                });
        }
    }
};

