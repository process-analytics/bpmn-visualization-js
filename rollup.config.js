import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';

import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const devMode = process.env.devMode;
const plugins = [
  typescript({
    typescript: require('typescript'),
  }),
  resolve(),
  commonjs({
    namedExports: {
      'node_modules/ts-mxgraph/index.js': ['mxgraph', 'mxgraphFactory'],
    },
  }),
];

if (devMode) {
  // Create a server for dev mode
  plugins.push(serve('dist'));
  // Allow to livereload on any update
  plugins.push(livereload({ watch: 'dist', verbose: true }));
  // Copy index.html to dist
  plugins.push(copy({ targets: [{ src: 'src/index.html', dest: 'dist/' }] }));
}

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: plugins,
};
