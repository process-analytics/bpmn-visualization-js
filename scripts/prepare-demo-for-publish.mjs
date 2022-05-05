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

import * as fs from 'fs';
import { join } from 'path';

const demoRootDirectory = './build/demo';

const updateAssetsLoadingFile = path => {
  let content = fs.readFileSync(path, 'utf8').toString();
  content = content.replaceAll('"/assets/', '"assets/');
  fs.writeFileSync(path, content);
  // eslint-disable-next-line no-console
  console.info('Content of page updated', path);
};

// TODO for seamless maintenance, find the html files in the directory
const pages = ['index.html', 'elements-identification.html'];
pages.forEach(page => {
  // eslint-disable-next-line no-console
  console.info('Managing', page);
  // move page out of the public/dev directory
  fs.renameSync(join(demoRootDirectory, 'dev/public', page), join(demoRootDirectory, page));
  updateAssetsLoadingFile(join(demoRootDirectory, page));
});

// TODO remove the whole dev folder
fs.rmdirSync(join(demoRootDirectory, 'dev/public'));
