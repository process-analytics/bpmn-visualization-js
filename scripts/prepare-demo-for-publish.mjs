/*
Copyright 2022 Bonitasoft S.A.

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

import { readdirSync, writeFileSync, readFileSync, copyFileSync } from 'node:fs';
import path from 'node:path';

const updateAssetsLoadingFile = filePath => {
  let content = readFileSync(filePath, 'utf8').toString();
  content = content.replaceAll('"/dev/public/assets/', '"assets/');
  writeFileSync(filePath, content);
  // eslint-disable-next-line no-console
  console.info('Content of page updated', filePath);
};

const demoRootDirectory = './build/demo';
const htmlPagesPath = join(demoRootDirectory, 'dev/public');
const pages = readdirSync(htmlPagesPath);
for (const page of pages.filter(file => path.extname(file).toLowerCase() === '.html')) {
  // eslint-disable-next-line no-console
  console.info('Managing', page);

  // change the path of the assets in the current html page
  updateAssetsLoadingFile(path.join(htmlPagesPath, page));
}

// copy ./index.html in build/demo directory, to reproduce the hierarchy on the examples' repo, on the demo preview in GitHub
copyFileSync('./index.html', path.join(demoRootDirectory, 'index.html'));
