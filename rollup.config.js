/**
 * Copyright 2020 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';

import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import json from '@rollup/plugin-json';

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
  json(),
];

if (devMode) {
  // Create a server for dev mode
  plugins.push(serve({ contentBase: 'dist', port: 10001 }));
  // Allow to livereload on any update
  plugins.push(livereload({ watch: 'dist', verbose: true }));
  // Copy index.html to dist
  plugins.push(
    copy({
      targets: [
        { src: 'src/index.html', dest: 'dist/' },
        { src: 'src/static/css/main.css', dest: 'dist/static/css/' },
      ],
    }),
  );
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
