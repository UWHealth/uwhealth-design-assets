const path = require('path');

const BASE = path.resolve(__dirname, '../');
const BUILD = path.resolve(__dirname);
const WATCH = ['./build/*.*', './graphics/**/*.*', './icons/**/*.*'];
const HTML_IN = path.resolve(BUILD, 'tests.html');
const HTML_OUT = path.resolve(BASE, 'tests.html');
const SVGS_IN = ['./graphics/**/*.svg', './icons/**/*.svg'];
const SVGS_OUT = path.resolve(`${BASE}/svg/`);

module.exports = {
    BASE,
    BUILD,
    HTML_IN,
    HTML_OUT,
    WATCH,
    SVGS_IN,
    SVGS_OUT,
}
