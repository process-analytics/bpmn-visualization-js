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

// const defaultPlugins = {
//   tailwindcss: {},
//   autoprefixer: {},
// };
//
// // TODO manage development/production
// const isDevelopment = true;
// const plugins = isDevelopment
//   ? defaultPlugins
//   : {
//       ...defaultPlugins,
//       cssnano: {
//         preset: 'default',
//       },
//     };
// module.exports = { plugins };

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // TODO restore the cssnano dependency and active the following only when building the demo
    cssnano: {
      preset: 'default',
    },
  },
};
