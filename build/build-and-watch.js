const { WATCH } = require('./build-constants.js');
const { buildHtml, buildSVGs } = require('./build.js');

function watchFiles() {
    const choki_opts = {
        ignoreInitial: true,
        followSymlinks: false,
    };

    require('chokidar')
        .watch(WATCH, choki_opts)
        .on('all', (event, path) => {
            console.log(event, path);
            buildHtml();
            buildSVGs();
        })
        .on('error', error => {
            console.error(`Watcher error: ${error}`);
            process.exit(0);
        });
    console.info('Watching files...')
}

watchFiles();
