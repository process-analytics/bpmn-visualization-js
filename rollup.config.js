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
import copyWatch from 'rollup-plugin-copy-watch';
import { terser } from 'rollup-plugin-terser';

import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import json from '@rollup/plugin-json';

import parseArgs from 'minimist';

import * as fs from 'fs';
import path from 'path';

function readFileSync(relPathToSourceFile, encoding = 'utf8') {
  return fs.readFileSync(path.join(__dirname, relPathToSourceFile), encoding);
}

const devLiveReloadMode = process.env.devLiveReloadMode;
const devMode = devLiveReloadMode ? true : process.env.devMode;
const demoMode = process.env.demoMode;

// parse command line arguments
const argv = parseArgs(process.argv.slice(2)); // start with 'node rollup' so drop them
// for the 'config-xxx' syntax, see https://github.com/rollup/rollup/issues/1662#issuecomment-395382741
const serverPort = process.env.SERVER_PORT || argv['config-server-port'] || 10001;
const buildBundles = argv['config-build-bundles'] || false;

const sourceMap = !demoMode;
const tsDeclarationFiles = !demoMode || buildBundles;

const tsconfigOverride = { compilerOptions: { declaration: tsDeclarationFiles } };

const plugins = [
  typescript({
    typescript: require('typescript'),
    tsconfigOverride: tsconfigOverride,
  }),
];
const pluginsNoDeps = [...plugins];

plugins.push(resolve());
plugins.push(commonjs());
plugins.push(json());

pluginsNoDeps.push(json());

// Copy static resources to dist
if (devMode || demoMode) {
  const copyTargets = [];
  copyTargets.push({ src: 'src/*.html', dest: 'dist/' });
  copyTargets.push({ src: 'src/static', dest: 'dist' });
  copyTargets.push({ src: 'node_modules/mxgraph/javascript/mxClient.min.js', dest: 'dist/static/js/' });
  let copyPlugin;
  if (devLiveReloadMode) {
    copyPlugin = copyWatch({
      watch: ['src/static/**', 'src/*.html'],
      targets: copyTargets,
    });
  } else {
    copyPlugin = copy({
      targets: copyTargets,
    });
  }
  plugins.push(copyPlugin);
}

if (devMode) {
  // Create a server for dev mode
  plugins.push(serve({ contentBase: 'dist', port: serverPort }));

  if (devLiveReloadMode) {
    // Allow to livereload on any update
    plugins.push(livereload({ watch: 'dist', verbose: true }));
  }
}

const minify = demoMode || buildBundles;
const pluginsNoDepsNoMin = [...pluginsNoDeps];
if (minify) {
  plugins.push(
    terser({
      ecma: 6,
    }),
  );
  pluginsNoDeps.push(
    terser({
      ecma: 6,
    }),
  );
}

const libInput = 'src/bpmn-visualization.ts';
let rollupConfigs;

if (!buildBundles) {
  // internal lib development
  rollupConfigs = [
    {
      input: libInput,
      output: [
        {
          file: 'dist/index.es.js',
          format: 'es',
          sourcemap: sourceMap,
        },
      ],
      external: [...Object.keys(pkg.peerDependencies || {})],
      plugins: plugins,
    },
  ];
} else {
  const configIife = {
    input: libInput,
    output: {
      // hack to have the mxGraph configuration prior the load of the mxGraph lib
      banner: readFileSync('src/static/js/configureMxGraphGlobals.js') + '\n' + readFileSync('node_modules/mxgraph/javascript/mxClient.min.js'),
      file: pkg.browser,
      name: 'bpmnvisu',
      format: 'iife',
    },
    // TODO we may use this plugin configuration instead resolve({browser: true})
    // If true, instructs the plugin to use the "browser" property in package.json files to specify alternative files to load for bundling. This is useful when bundling for a browser environment.
    plugins: plugins,
  };
  const configEsmMin = {
    input: libInput,
    output: {
      file: pkg.module.replace('.js', '.min.js'),
      format: 'es',
    },
    // TODO check the possibility to use pkg.dependencies
    external: ['entities/lib/decode', 'fast-xml-parser/src/parser'],
    plugins: pluginsNoDeps,
  };
  const configEsm = { ...configEsmMin, plugins: pluginsNoDepsNoMin, output: { file: pkg.module, format: 'es' } };
  rollupConfigs = [configIife, configEsm, configEsmMin];
}

export default rollupConfigs;
