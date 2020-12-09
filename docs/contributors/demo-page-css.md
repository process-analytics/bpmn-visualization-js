## CSS for Demo
The project demo page uses [tailwindcss](https://tailwindcss.com/docs).

To process the CSS rules and get an output tailwind.css file, which is used in demo page:
run: `npm run demo`

sub job demo:css does the trick, it uses postcss
feel free to preview config files:
- [postcss.config.js](postcss.config.js)
- [tailwind.config.js](tailwind.config.js)

rollup build is updated to handle livereload, there are 2 scripts in [package.json](package.json) that permits that: \
1. Build the output tailwind.css file. \
```"demo:css": "postcss src/static/css/styles.css -o src/static/css/tailwind.css"```

2. Watch for the changes in html and styles.css. \
```"watch:css": "chokidar \"src/static/css/styles.css\" \"src/*.html\" --command \"npm run demo:css\" --verbose"```
