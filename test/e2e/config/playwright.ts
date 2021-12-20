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
import debugLogger from 'debug';
import 'jest-playwright-preset';

// Allow getting browser console logs
// this is from https://playwright.dev/docs/api/class-page#pageonconsole
// see https://github.com/microsoft/playwright/issues/4498 and https://github.com/microsoft/playwright/issues/4125
const browserLog = debugLogger('bv:test:browser');
page.on('console', msg => browserLog('<%s> %s', msg.type(), msg.text()));
