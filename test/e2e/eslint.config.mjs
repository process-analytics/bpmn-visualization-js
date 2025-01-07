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
import playwright from 'eslint-plugin-playwright';

export default [
  {
    extends: [
      // Feature of `typescript-eslint` to extend multiple configs: https://typescript-eslint.io/packages/typescript-eslint/#flat-config-extends
      ...playwright.configs['flat/recommended'],
    ],
    rules: {
      /* This rule is for playwright-test and we are using jest-playwright */
      'playwright/no-standalone-expect': 'off',
    },
  },
];
