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

module.exports = {
  root: true,
  plugins: ['notice', 'unicorn', 'import'],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:import/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    'notice/notice': ['error', { templateFile: 'config/license-header.js', onNonMatchingHeader: 'replace' }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
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
    'unicorn/prevent-abbreviations': 'error',
    'unicorn/prefer-query-selector': 'error',
    'unicorn/prefer-add-event-listener': 'error',
    'unicorn/no-array-for-each': 'error',
    'unicorn/prefer-dom-node-text-content': 'error',
    'unicorn/prefer-ternary': 'error',
    'unicorn/prefer-logical-operator-over-ternary': 'error',
    'unicorn/consistent-function-scoping': 'error',
    'unicorn/prefer-dom-node-append': 'error',
    'unicorn/prefer-dom-node-remove': 'error',
    'unicorn/no-negated-condition': 'error',
    'unicorn/no-array-callback-reference': 'error',
    'unicorn/no-array-method-this-argument': 'error',
    'unicorn/no-array-push-push': 'error',
    'unicorn/no-array-reduce': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-unreadable-array-destructuring': 'error',
    'unicorn/no-useless-length-check': 'error',
    'unicorn/explicit-length-check': 'error',
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-array-flat': 'error',
    'unicorn/prefer-array-flat-map': 'error',
    'unicorn/prefer-array-index-of': 'error',
    'unicorn/prefer-array-some': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/require-array-join-separator': 'error',
    'unicorn/numeric-separators-style': 'error',
    'unicorn/no-zero-fractions': 'error',
    'unicorn/no-useless-switch-case': 'error',
    'unicorn/prefer-switch': 'error',
    'unicorn/switch-case-braces': 'error',
    'unicorn/prefer-spread': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
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
  },
  overrides: [
    // typescript
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
        'plugin:@typescript-eslint/stylistic',
        'plugin:import/typescript',
      ],
      settings: {
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
            project: '**/tsconfig.json',
          },
        },
      },
      parserOptions: {
        // This setting is required if you want to use rules which require type information
        // https://typescript-eslint.io/packages/parser/#project
        project: ['./tsconfig.json', './tsconfig.test.json', './tsconfig.utils.json'],
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
  ],
};
