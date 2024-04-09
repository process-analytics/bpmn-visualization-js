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

import noticePlugin from "eslint-plugin-notice";
import importPlugin from "eslint-plugin-import";
import unicornPlugin from "eslint-plugin-unicorn";

import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
  {
    // ...eslintPluginImport.configs.recommended, // is not working for now with ESLint v9
    // ...unicornPlugin.configs.recommended, // is not working for now with ESLint v9
    ...eslintPluginPrettierRecommended, // Enables eslint-plugin-prettier, eslint-config-prettier and prettier/prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration.

    plugins: {
      notice: noticePlugin,
      unicorn: unicornPlugin,
      import: importPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
      },
    },
    rules: {
      'notice/notice': ['error', {templateFile: 'config/license-header.js', onNonMatchingHeader: 'replace'}],
      'no-console': ['error', {allow: ['warn', 'error']}],
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            kebabCase: true,
            pascalCase: true,
            snakeCase: true,
          },
        },
      ],
      'import/newline-after-import': ['error', {count: 1}],
      'import/first': 'error',
      'import/order': [
        'error',
        {
          groups: ['type', 'builtin', 'external', 'parent', 'sibling', 'index', 'internal'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'unicorn/prefer-keyboard-event-key': 'off', // 'key' doesn't exist in the used ES version
      'unicorn/prefer-module': 'off', // We don't want to change a working configuration
      'unicorn/prefer-string-replace-all': 'off', // String#replaceAll() doesn't exist in the used ES version
      'unicorn/no-new-array': 'off', // In contradiction with unicorn/new-for-builtins: Use `new Array()` instead of `Array()`
      'unicorn/no-null': 'off', // We don't know the impact on mxGraph code
      'unicorn/no-useless-undefined': 'off', // The "undefined" value is useful where we use it and change some mxGraph code
    },
    ignores: [
      '.github/',
      '.idea/',
      '/build/',
      '/config/',
      '/dist/',
      'node_modules/',
      'scripts/utils/dist/',
      'test/performance/data/',
    ],
  },

  // typescript
  { ...eslint.configs.recommended, files: ['**/*.ts', '**/*.tsx'] },
  ...tseslint.configs.recommended.map(conf => ({ ...conf, files: ['**/*.ts', '**/*.tsx'] })),
  /** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
  {
    ...tseslint.configs.stylistic,
    // ...eslintPluginImport.configs.typescript, // is not working for now with ESLint v9
    ...eslintPluginPrettierRecommended, // Enables eslint-plugin-prettier, eslint-config-prettier and prettier/prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration.

    files: ['*.ts'],
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
          project: '**/tsconfig.json',
        },
      },
    },
    languageOptions: {
      parserOptions: {
        // This setting is required if you want to use rules which require type information
        // https://typescript-eslint.io/packages/parser/#project
        project: ['./tsconfig.json', './tsconfig.test.json', './tsconfig.utils.json'],
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'no-public',
        },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': ['error'],
      // We choose to disable it and choose later if we want to enable it. See https://github.com/process-analytics/bpmn-visualization-js/pull/2821.
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/dot-notation': 'error',

      'require-await': 'off', // disable the base eslint rule as it can report incorrect errors when '@typescript-eslint/require-await' is enabled (see official documentation)
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      '@typescript-eslint/restrict-plus-operands': 'error',

      // The following lines are commented, because they show errors on files other than the demo:
      // '@typescript-eslint/no-base-to-string': 'error',
      // '@typescript-eslint/no-unsafe-assignment': 'error',
      // '@typescript-eslint/no-unsafe-argument': 'error',
      // '@typescript-eslint/no-unsafe-member-access': 'error',
      // '@typescript-eslint/restrict-template-expressions': 'error',
      // '@typescript-eslint/unbound-method': 'error',
    },
  },
];
