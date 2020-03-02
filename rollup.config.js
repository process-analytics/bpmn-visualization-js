import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';

import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

let devMode = process.env.devMode;
let plugins = [
  typescript({
    typescript: require('typescript'),
  })];

if (devMode) {
  // Create a server for dev mode
  plugins.push(serve('dist'));
  // Allow to livereload on any update
  plugins.push(livereload({watch: 'dist', verbose: true}));
  // Copy index.html to dist
  plugins.push(copy({targets: [{src: 'src/index.html', dest: 'dist/'}]}));
}

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es'
    },
  ],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: plugins
};
