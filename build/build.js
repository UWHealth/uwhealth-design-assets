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
const DIST = `${process.cwd()}/dist/`;

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
    let didError = false;
    const imports = [];
    const svgFiles = fg.sync(SVGs);

    const files = svgFiles.map((file) => {
        const fileName = path.basename(file, '.svg');
        if (!fileName) { return; }

        const importName = fileName
                .replace(/([_\- \.])(\w)/g, (m, p1, p2) => p2.toUpperCase())
                .replace(/(^\w|\s\w)/g, m => m.toUpperCase()); //first letter-uppercase

        return {
            src: file,
            fileName,
            importName,
        }
    });

    // Write out SVG files to DIST
    files.forEach(({ src, fileName, importName }) => {
        const outPath = path.resolve(DIST, `${fileName}.svg`);
        // Add imports to import array
        imports.push(`export * as ${importName} from "./${fileName}.svg"`);

        return fs.copySync(src, outPath, null, (err) => {
            if (err) { console.error(err); didError = true; }
        })
    });

    // Write out index.js that imports all svgs
    fs.outputFileSync(
        path.resolve(DIST, 'index.js'),
        imports.join("\n")
    );

    if (!didError) {
        return console.info(colors.green(`Successfully wrote ${files.length} SVGs!`));
    }
    return console.info(colors.red(`Error writing out SVGs.`))
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
