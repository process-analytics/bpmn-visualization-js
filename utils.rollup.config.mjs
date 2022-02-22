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
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';
import externals from 'rollup-plugin-node-externals';
import ts from 'typescript';

const plugins = [
  typescript({
    typescript: ts,
  }),
  // rollup-plugin-node-externals declares NodeJS built-in modules as external
  externals({
    exclude: ['path', 'entities'],
  }),
  resolve(),
  commonjs(),
  json(),
];
export default {
  input: 'scripts/utils/parseBpmn.ts',
  output: {
    file: 'scripts/utils/dist/utils.mjs',
    format: 'es',
  },
  plugins: plugins,
};
