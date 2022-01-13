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
import sizes from 'rollup-plugin-sizes';
import autoExternal from 'rollup-plugin-auto-external';
import execute from 'rollup-plugin-execute';

import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import json from '@rollup/plugin-json';

import parseArgs from 'minimist';

const devLiveReloadMode = process.env.devLiveReloadMode;
const devMode = devLiveReloadMode ? true : process.env.devMode;
const demoMode = process.env.demoMode;

// parse command line arguments
const argv = parseArgs(process.argv.slice(2)); // start with 'node rollup' so drop them
// for the 'config-xxx' syntax, see https://github.com/rollup/rollup/issues/1662#issuecomment-395382741
const serverPort = process.env.SERVER_PORT || argv['config-server-port'] || 10001;
const buildBundles = argv['config-build-bundles'] || false;

const outputDir = demoMode ? 'build/demo' : 'build/public';
let rollupConfigs;

// internal lib development
if (!buildBundles) {
  const sourceMap = !demoMode;
  rollupConfigs = [
    {
      input: 'dev/ts/internal-dev-bundle-index.ts',
      output: [
        {
          file: `${outputDir}/index.es.js`,
          format: 'es',
          sourcemap: sourceMap,
        },
      ],
      external: [...Object.keys(pkg.peerDependencies || {})],
      plugins: pluginsForDevelopment(),
    },
  ];
} else {
  const libInput = 'src/bpmn-visualization.ts';
  const pluginsBundleIIFE = [typescriptPlugin(), resolve(), commonjs(), json()];
  const outputIIFE = {
    file: pkg.browser.replace('.min.js', '.js'),
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
      file: pkg.browser,
    },
    plugins: withMinification(pluginsBundleIIFE),
  };

  // ensure we do not bundle dependencies
  const pluginsBundles = [typescriptPlugin(), json(), autoExternal()];

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
    // except these 'custom specified' dependencies, rest of them is treated by the plugin: autoExternal
    external: ['entities/lib/decode', 'fast-xml-parser/src/parser'],
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
  rollupConfigs = [configIIFE, configIIFEMinified, configBundles, configBundlesMinified];
}

export default rollupConfigs;

// =====================================================================================================================
// helpers
// =====================================================================================================================

function typescriptPlugin() {
  const tsDeclarationFiles = !demoMode || buildBundles;
  const tsSourceMap = !demoMode && !buildBundles; // TODO logic duplicated with build selection
  const tsconfigOverride = { compilerOptions: { sourceMap: tsSourceMap, declaration: tsDeclarationFiles } };

  if (devMode) {
    tsconfigOverride.include = ['src/**/*', 'dev/ts/**/*'];
  }

  return typescript({
    typescript: require('typescript'),
    tsconfigOverride: tsconfigOverride,
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

function pluginsForDevelopment() {
  const plugins = [typescriptPlugin(), resolve(), commonjs(), json()];

  // Copy static resources
  if (devMode || demoMode) {
    plugins.push(execute('npm run demo:css', true)); // sync to ensure the execution is linked to the main rollup process
    if (devLiveReloadMode) {
      plugins.push(execute('npm run demo:css -- --watch --verbose'));
    }

    const copyTargets = [];
    copyTargets.push({ src: 'dev/public/*.html', dest: `${outputDir}/` });
    copyTargets.push({ src: 'dev/public/static', dest: outputDir });
    let copyPlugin;
    if (devLiveReloadMode) {
      copyPlugin = copyWatch({
        watch: ['dev/public/static/**', 'dev/public/*.html'],
        targets: copyTargets,
      });
    } else {
      copyPlugin = copy({
        targets: copyTargets,
      });
    }
    plugins.push(copyPlugin);

    // to have sizes of dependencies listed at the end of build log
    plugins.push(sizes());
  }

  if (devMode) {
    // Create a server for dev mode
    plugins.push(serve({ contentBase: outputDir, port: serverPort }));

    if (devLiveReloadMode) {
      // Allow to livereload on any update
      plugins.push(livereload({ watch: outputDir, verbose: true }));
    }
  }

  if (demoMode) {
    return withMinification(plugins);
  }

  return plugins;
}
