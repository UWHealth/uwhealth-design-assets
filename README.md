# [uwhealth-design-assets](https://uwhealth.github.io/uwhealth-design-assets/tests.html)
A central location for uwhealth.org design assets

[Graphics and icon samples →](https://uwhealth.github.io/uwhealth-design-assets/tests.html)

---

## Usage and intent
Any icon or graphic in this repo should be considered final or nearly final. That said, the goal is to use this repository as a way to version control design assets and allow for easier distribution of changes as they come up.

### Usage as a node module

**Importing**
On install, all SVGs are copied to a `./svg/` folder. They can be accessed using one of the following: 

```js
// ES Module
import svgName from 'uwhealth-design-assets/svg/svg_name.svg';

//Common JS (note the use of .default)
const svgName = require('uwhealth-design-assets/svg/svg_name.svg').default
```

**Next JS configuration**
Since this repo exports raw `.svg` files, you will need a way to instruct next and webpack on how to import them. This repo contains a `next-plugin.js` file that you can import and apply to your `next.config.js`.

```js
// Your project's next.config.js
const withDesignAssets = require('uwhealth-design-assets/next-plugin.js');
//...
module.exports = () => withDesignAssets({
    // Rest of your next config
});

```

## Development

### SVG development
SVGs should be categorized under **graphics** or **icons**. Graphics being for general use, with icons following a strict grid, intended to be displayed along with text.

SVGs should be hand-optimized for clarity and size. Use a combination of groups and class names to clarify the intention of shapes in the SVGs so they can be manipulated by others later. It should be assumed that the SVGs will be machine-optimized (via SVGO or something similar) later.

For instance:
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <g class="gfx-arrow">
        <rect class="gfx-arrow__line"
           y="30.5"
           width="54" height="3" 
        />
        <polygon class="gfx-arrow__head" 
          points="37.91 14.19 36 16.5 53.57 32 36 47.5 37.91 49.81 61.13 32 37.91 14.19"
        />
    </g>
</svg>
```
Note that the arrow is in a group, with a class name. Children shapes indicate what part of the graphic they are. Also note that the attributes are grouped on their own lines to improve readability.

Were someone to need to make an arrow with a slightly longer line, it would be relatively simple from here.

### Tests

Under `build/tests.html` is a pre-processed html file that allows for quick inclusion of graphics. Using `npm run build`, this file will be processed and added to the root of the project as `tests.html`.

For continuous development: `npm start` will watch all files for changes and build `tests.html` whenever something changes.

### Repo releases
This repo uses [github-action-npm-release](https://github.com/justincy/github-action-npm-release) to automate releases. To trigger this action, the `package.json` version of this repo needs to be updated as part of a push.

To maintain consistency, please use `npm version [patch|minor|major]`([docs](https://docs.npmjs.com/cli/version)) to update the version number.
