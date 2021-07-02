/**
 * Copyright 2021 Bonitasoft S.A.
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

/** @type {import('snowpack/lib/types').SnowpackConfig} */
module.exports = {
  buildOptions: {
    out: 'build/snowpack',
    sourcemap: false, // TODO still generate sourcemap with snowpack@3.5.6, require manual clean when build demo
  },
  devOptions: {
    open: 'none',
    port: 10001,
    tailwindConfig: './tailwind.config.js',
  },
  plugins: ['@snowpack/plugin-postcss'],
  mount: {
    'dev/public': { url: '/', static: false }, // static must be false, otherwise postcss is not triggered
    src: { url: '/lib' },
    'dev/ts': { url: '/lib/dev' },
    // TODO this should be only mount when running tests (otherwise we may have it when building the demo)
    // use the extends options and a dedicated file
    // Type: string
    // Inherit from a separate "base" config.
    // Can be a relative file path, an npm package, or a file within an npm package. Your configuration will be merged on top of the extended base config.
    'test/fixtures/bpmn': { url: '/static/diagrams', static: true },
  },
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018', // TODO review the targeted ES version
  },
};
