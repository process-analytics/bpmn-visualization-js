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

import { readdirSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const demoRootDirectory = './build/demo';

const relPathToHtmlPages = 'dev/public';
const pages = readdirSync(join(demoRootDirectory, relPathToHtmlPages));
pages.forEach(page => {
  // eslint-disable-next-line no-console
  console.info('Managing', page);
  // move page out of the public/dev directory
  renameSync(join(demoRootDirectory, relPathToHtmlPages, page), join(demoRootDirectory, page));
});

rmSync(join(demoRootDirectory, 'dev'), { recursive: true });
