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

import autoExternal from 'rollup-plugin-auto-external';
import { terser } from 'rollup-plugin-terser';
import sizes from 'rollup-plugin-sizes';

import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs'; // at least, needed to bundle mxGraph which is only available as a CommonJS module
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const libInput = 'src/bpmn-visualization.ts';
const pluginsBundleIIFE = [
  typescriptPlugin(),
  // the 'resolve' and 'commonjs' plugins ensure we can bundle commonjs dependencies
  resolve(),
  commonjs(),
  // to have sizes of dependencies listed at the end of build log
  sizes(),
];
const iifeBundleFile = 'dist/bpmn-visualization.min.js';
const outputIIFE = {
  file: iifeBundleFile.replace('.min.js', '.js'),
  name: 'bpmnvisu',
  format: 'iife',
};

const configIIFE = {
  input: libInput,
  output: outputIIFE,
  plugins: pluginsBundleIIFE,
};
const configIIFEMinified = {
  input: libInput,
  output: {
    ...outputIIFE,
    file: iifeBundleFile,
  },
  plugins: withMinification(pluginsBundleIIFE),
};

const pluginsBundles = [
  typescriptPlugin(),
  // ensure we do not bundle dependencies
  autoExternal(),
  // to have sizes of dependencies listed at the end of build log
  sizes(),
];

const configBundlesMinified = {
  input: libInput,
  output: [
    {
      file: pkg.module.replace('.js', '.min.js'),
      format: 'es',
    },
    {
      file: pkg.main.replace('.js', '.min.js'),
      format: 'cjs',
    },
  ],

  plugins: withMinification(pluginsBundles),
};
const configBundles = {
  ...configBundlesMinified,
  plugins: pluginsBundles,
  output: [
    { file: pkg.module, format: 'es' },
    { file: pkg.main, format: 'cjs' },
  ],
};

export default [configIIFE, configIIFEMinified, configBundles, configBundlesMinified];

// =====================================================================================================================
// helpers
// =====================================================================================================================

function typescriptPlugin() {
  return typescript({
    typescript: require('typescript'),
    tsconfig: './tsconfig.npm-package.json',
  });
}

function withMinification(plugins) {
  return [
    ...plugins,
    terser({
      ecma: 6,
    }),
  ];
}
