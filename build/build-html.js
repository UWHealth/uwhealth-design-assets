const fs = require('fs-extra')
const posthtml = require('posthtml');
const colors = require('colors/safe');

const {BUILD, HTML_IN, HTML_OUT, WATCH} = require('./build-constants');

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

function processHtml() {
    posthtml([
        require('posthtml-modules')(posthtml_opts.modules), // modules
        require('posthtml-inline-svg')(posthtml_opts.inlineSvg), // inline svg
        require('posthtml-inline-assets')(posthtml_opts.inlineAssets) //inline css
    ])
    .process(fs.readFileSync(HTML_IN, 'utf8'))
    .then((result) => {
        fs.writeFileSync(HTML_OUT, result.html);
        console.info(colors.green(`Successfully wrote ${HTML_OUT}!\n`))
    })
    .catch(e => console.error(e, e.stack));
}

processHtml();

module.exports = processHtml;
