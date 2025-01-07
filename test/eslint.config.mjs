/*
Copyright 2021 Bonitasoft S.A.

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

const pluginJest = require('eslint-plugin-jest');
const pluginJestExtended = require('eslint-plugin-jest-extended');

module.exports = [
  {
    files: ['**/*.test.ts'],
    extends: [
      // Feature of `typescript-eslint` to extend multiple configs: https://typescript-eslint.io/packages/typescript-eslint/#flat-config-extends
      ...jest.configs['flat/recommended'],
      ...jest.configs['flat/style'],
      ...'jest-extended'.configs['flat/recommended'],
    ],

    plugins: { jest: pluginJest, 'jest-extended': pluginJestExtended },

    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    settings: {
      jest: {
        version: require('jest/package.json').version,
      },
    },
    rules: {
      /* The rule list: https://github.com/jest-community/eslint-plugin-jest#rules */
      'jest/prefer-expect-resolves': 'warn',
      'jest/prefer-spy-on': 'warn',
      'jest/prefer-todo': 'warn',
      /* The rule didn't find the 'expect' in the called methods */
      'jest/expect-expect': 'off',
    },
  },
];
