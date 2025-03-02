/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import commonjs from '@rollup/plugin-commonjs'; // at least, needed to bundle mxGraph which is only available as a CommonJS module
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
// eslint-disable-next-line import/no-unresolved -- The package is malformed. So, the rule doesn't resolve it.
import externals from 'rollup-plugin-node-externals';
import sizes from 'rollup-plugin-sizes';
import typescript from 'rollup-plugin-typescript2';

import packageJson from './package.json' with { type: 'json' };
import { computeBanner } from './scripts/shared/banner.mjs';

const input = 'src/bpmn-visualization.ts';
const pluginsBundleIIFE = [
  typescriptPlugin(),
  // the 'resolve' and 'commonjs' plugins ensure we can bundle commonjs dependencies
  resolve(),
  commonjs(),
  // to have sizes of dependencies listed at the end of build log
  sizes(),
];
const iifeMinifiedBundleFile = 'dist/bpmn-visualization.min.js';
/**
 * @type {import('rollup').OutputOptions}
 */
const outputIIFE = {
  file: iifeMinifiedBundleFile.replace('.min.js', '.js'),
  name: 'bpmnvisu',
  format: 'iife',
  banner: computeBanner(),
};

/**
 * @type {import('rollup').RollupOptions}
 */
const configIIFE = {
  input,
  output: outputIIFE,
  plugins: withCleanup(pluginsBundleIIFE),
};
/**
 * @type {import('rollup').RollupOptions}
 */
const configIIFEMinified = {
  input: input,
  output: {
    ...outputIIFE,
    file: iifeMinifiedBundleFile,
  },
  plugins: withMinification(
    pluginsBundleIIFE,
    `/* bpmn-visualization v${packageJson.version} | Copyright (c) 2020-${new Date().getFullYear()}, Bonitasoft SA | Apache 2.0 license */`,
  ),
};

/**
 * @type {import('rollup').RollupOptions}
 */
const configESM = {
  input: input,
  plugins: withCleanup([
    typescriptPlugin(),
    // ensure we do not bundle dependencies
    externals({ devDeps: true }),
    // to have sizes of dependencies listed at the end of build log
    sizes(),
  ]),
  output: {
    file: packageJson.module,
    format: 'es',
    banner: computeBanner(),
  },
};

export default [configIIFE, configIIFEMinified, configESM];

// =====================================================================================================================
// helpers
// =====================================================================================================================

function typescriptPlugin() {
  return typescript({
    tsconfig: './tsconfig.npm-package.json',
  });
}

function withMinification(plugins, banner) {
  return [
    ...plugins,
    terser({
      ecma: 2015,
      format: {
        preamble: banner,
      },
    }),
  ];
}

function withCleanup(plugins) {
  return [
    ...plugins,
    cleanup({
      comments: 'none',
      extensions: ['js', 'ts'],
    }),
  ];
}
