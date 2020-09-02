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

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const fse = require('fs-extra');
const Asciidoctor = require('asciidoctor');

const docsOutput = 'build/docs';

// eslint-disable-next-line no-console
console.info('Building bpmn-visualization html documentation');

// clean existing docs
fse.removeSync(docsOutput);

// build html docs
Asciidoctor().convert(fs.readFileSync('docs/index.adoc'), {
  base_dir: 'docs',
  to_file: `../${docsOutput}/index.html`,
  // to_file: '../build/docs/index.html',
  standalone: true,
  mkdirs: true,
  safe: 'unsafe', // needed because we want to generate the html outside of the directory that stores the source files
});

// copy images
fse.ensureDirSync(`${docsOutput}/images`);

fse.copySync('docs/architecture/images', `${docsOutput}/images`);

// eslint-disable-next-line no-console
console.info(`Documentation is now available in ${docsOutput}`);
