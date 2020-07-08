const path = require('path')
const fs = require('fs')
const posthtml = require('posthtml');
const colors = require('colors/safe');

const BASE = path.resolve(__dirname, '../');
const BUILD = path.resolve(__dirname);
const IN = path.resolve(BUILD, 'tests.html');
const OUT = path.resolve(BASE, 'tests.html');
const WATCH = ['./build/*.*', './graphics/**/*.*', './icons/**/*.*'];

const posthtml_opts = {
    inlineSvg: {
        cwd: BUILD,
        tag: 'Asset',
        attr: 'src',
    },
    modules: {
        root: BUILD,
        from: BUILD,
        tag: 'Include',
    }
};
const choki_opts = { 
    ignoreInitial: true,
    followSymlinks: false,
};

function processHtml() {
    posthtml([
        require('posthtml-modules')(posthtml_opts.modules),
        require('posthtml-inline-svg')(posthtml_opts.inlineSvg)
    ])
    .process(fs.readFileSync(IN, 'utf8'))
    .then((result) => {
        fs.writeFileSync(OUT, result.html);
        console.info(colors.green(`Successfully wrote to ${OUT}!\n`))
    })
    .catch(e => console.error(e, e.stack));
}

function watchFiles() {
    require('chokidar')
        .watch(WATCH, choki_opts)
        .on('all', (event, path) => {
            console.log(event, path);
            processHtml();
        })
        .on('error', error => {
            console.error(`Watcher error: ${error}`);
            process.exit(0);
        });
    console.info('Watching files...')
}

processHtml();

module.exports = {
    processHtml,
    watchFiles
}