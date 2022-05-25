/**
 * Copyright 2022 Bonitasoft S.A.
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

import { resolve } from 'path';

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  base: './', // Base public path when served in development or production. https://vitejs.dev/config/#base
  server: {
    port: 10001,
  },

  // Configuration to build the demo
  build: {
    outDir: 'build/demo',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'dev/public/index.html'),
        'elements-identification': resolve(__dirname, 'dev/public/elements-identification.html'),
      },
      // No hash in asset names. We make the demo publicly available via the examples repository and served by statically.io
      // New versions are accessed using tags. The master branch is cachecd by statically.io and updated once a day.
      // see https://github.com/vitejs/vite/issues/378#issuecomment-768816653
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  preview: {
    port: 10002,
  },
};

export default config;
