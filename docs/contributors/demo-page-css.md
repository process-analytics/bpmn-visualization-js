## CSS for Demo
The project demo page uses [tailwindcss](https://tailwindcss.com/docs).

To process the CSS rules and get an output `tailwind.css` file, which is used in demo page:
run: `npm run demo`

Sub job `demo:css` does the trick, it uses postcss. Feel free to preview config files:
- [postcss.config.js](postcss.config.js)
- [tailwind.config.js](tailwind.config.js)

The Rollup build is updated to handle livereload, there are 2 scripts in [package.json](../../package.json) that permits that: \
1. Build the output tailwind.css file: `demo:css`
2. Watch for the changes in html and styles.css. `watch:css`
