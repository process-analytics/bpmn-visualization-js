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

import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  // create the environment variable for configuration in the postcss config
  process.env['NODE_ENV'] = mode;

  return {
    server: {
      port: 10001,
    },

    // Configuration to build the demo
    build: {
      outDir: 'build/demo',
      assetsDir: 'build/demo/dev/public/assets',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'dev/public/index.html'),
          'elements-identification': resolve(__dirname, 'dev/public/elements-identification.html'),
        },
        // No hash in asset names. We make the demo publicly available via the examples repository and served by statically.io
        // New versions are accessed using tags. The master branch is cached by statically.io and updated once a day.
        // see https://github.com/vitejs/vite/issues/378#issuecomment-768816653
        output: {
          entryFileNames: `dev/public/assets/[name].js`,
          chunkFileNames: `dev/public/assets/[name].js`,
          assetFileNames: `dev/public/assets/[name].[ext]`,
        },
      },
    },
    preview: {
      port: 10002,
    },
  };
});
