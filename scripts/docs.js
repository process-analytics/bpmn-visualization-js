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

function log(...data) {
  // eslint-disable-next-line no-console
  console.info(...data);
}

const fs = require('fs');
const fse = require('fs-extra');
const Asciidoctor = require('asciidoctor');

const docsOutput = 'build/docs';

log('Building bpmn-visualization html documentation');

// clean existing docs
fse.removeSync(docsOutput);

// build html docs
Asciidoctor().convert(fs.readFileSync('docs/users/index.adoc'), {
  base_dir: 'docs/users',
  to_file: `../../${docsOutput}/index.html`,
  standalone: true,
  mkdirs: true,
  safe: 'unsafe', // needed because we want to generate the html outside of the directory that stores the source files
});

// copy images
fse.ensureDirSync(`${docsOutput}/images`);

fse.copySync('docs/users/images', `${docsOutput}/images`);
fse.copySync('docs/users/architecture/images', `${docsOutput}/images`);
fse.copySync('dev/static/img/favicon.png', `${docsOutput}/favicon.png`);

log(`Documentation is now available in ${docsOutput}`);
