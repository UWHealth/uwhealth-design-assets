const path = require('path')
const fs = require('fs-extra');
const colors = require('colors/safe');
const fg = require('fast-glob');
const { SVGS_IN, SVGS_OUT } = require('./build-constants.js');


function collectSVGs() {
    let didError = false;
    const imports = [];
    const svgFiles = fg.sync(SVGS_IN);

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
        const outPath = path.resolve(SVGS_OUT, `${fileName}.svg`);
        // Add imports to import array
        imports.push(`export * as ${importName} from "./${fileName}.svg"`);

        return fs.copySync(src, outPath, null, (err) => {
            if (err) { console.error(err); didError = true; }
        })
    });

    // Write out index.js that imports all svgs
    fs.outputFileSync(
        path.resolve(SVGS_OUT, 'index.js'),
        imports.join("\n")
    );

    if (!didError) {
        return console.info(colors.green(`Successfully wrote ${files.length} SVGs!`));
    }
    return console.info(colors.red(`Error writing out SVGs.`))
}

collectSVGs();

module.exports = collectSVGs;
