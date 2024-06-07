/*
Copyright 2020 Bonitasoft S.A.

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

import { readFileSync } from 'node:fs';

import asciidoctor from '@asciidoctor/core';
// eslint-disable-next-line import/no-unresolved
import { copySync, ensureDirSync, removeSync } from 'fs-extra/esm';

function log(...data) {
  // eslint-disable-next-line no-console
  console.info(...data);
}

const documentationOutput = 'build/docs';

log('Building bpmn-visualization html documentation');

// clean existing docs
removeSync(documentationOutput);

// build html docs
asciidoctor().convert(readFileSync('docs/users/index.adoc'), {
  base_dir: 'docs/users',
  to_file: `../../${documentationOutput}/index.html`,
  standalone: true,
  mkdirs: true,
  safe: 'unsafe', // needed because we want to generate the HTML outside the directory that stores the source files
});

// copy images
ensureDirSync(`${documentationOutput}/images`);

copySync('docs/users/images', `${documentationOutput}/images`);
copySync('docs/users/architecture/images', `${documentationOutput}/images`);
copySync('dev/public/static/img/favicon.svg', `${documentationOutput}/favicon.svg`);

log(`Documentation is now available in ${documentationOutput}`);
