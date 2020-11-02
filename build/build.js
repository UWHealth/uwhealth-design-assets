const path = require('path')
const fs = require('fs-extra')
const posthtml = require('posthtml');
const colors = require('colors/safe');
const fg = require('fast-glob');

const BASE = path.resolve(__dirname, '../');
const BUILD = path.resolve(__dirname);
const IN = path.resolve(BUILD, 'tests.html');
const OUT = path.resolve(BASE, 'tests.html');
const WATCH = ['./build/*.*', './graphics/**/*.*', './icons/**/*.*'];
const SVGs = ['./graphics/**/*.svg', './icons/**/*.svg'];

const posthtml_opts = {
    modules: {
        root: BUILD,
        from: BUILD,
        tag: 'Include',
    },
    inlineSvg: {
        cwd: BUILD,
        tag: 'Asset',
        attr: 'src',
        svgo: {
            full: true,
            plugins: [
                {cleanupAttrs: true},
                {removeComments: true},
                {removeXMLNS: true}
            ]
        }
    },
    inlineAssets: {
        cwd: BUILD,
        transforms: {
            image: false,
            script: false
        }
    }
};
const choki_opts = {
    ignoreInitial: true,
    followSymlinks: false,
};

function collectSVGs() {
    const svgFiles = fg.sync(SVGs);
    const DIST = `${process.cwd()}/dist/`;

    const files = svgFiles.map((file) => {
        const fileName = path.basename(file, '.svg');
        if (!fileName) { return; }

        const importName = fileName
                .replace(/([_\- \.])(\w)/g, (m, p1, p2) => p2.toUpperCase())
                .replace(/(^\w|\s\w)/g, m => m.toUpperCase()); //first letter-uppercase
        // console.log(fileName);

        return {
            src: file,
            fileName,
            importName,
        }
    });

    const imports = [];

    files.forEach(async ({ src, fileName, importName }) => {
        const outPath = path.resolve(DIST, `${fileName}.svg`);
        imports.push(`export * as ${importName} from "./${fileName}.svg"`);
        return await fs.copy(src, outPath).catch(err => { console.error(err); })
    });

    fs.outputFileSync(
        path.resolve(DIST, 'index.js'),
        imports.join("\n")
    );

}

function processHtml() {
    posthtml([
        require('posthtml-modules')(posthtml_opts.modules), // modules
        require('posthtml-inline-svg')(posthtml_opts.inlineSvg), // inline svg
        require('posthtml-inline-assets')(posthtml_opts.inlineAssets) //inline css
    ])
    .process(fs.readFileSync(IN, 'utf8'))
    .then((result) => {
        fs.writeFileSync(OUT, result.html);
        console.info(colors.green(`Successfully wrote ${OUT}!\n`))
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
collectSVGs();

module.exports = {
    processHtml,
    watchFiles
}
