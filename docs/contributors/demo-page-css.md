## CSS for Demo
The project demo page uses [tailwindcss](https://tailwindcss.com/docs).

To process the CSS rules and get an output `tailwind.css` file, which is used in demo page:
run: `npm run demo`

The `demo:css` npm script does the trick, it uses postcss. Feel free to preview config files:
- [postcss.config.js](postcss.config.js)
- [tailwind.config.js](tailwind.config.js)

The Rollup build handles the livereload and the html/css resources watch.
