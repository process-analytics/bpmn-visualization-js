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
import { resolve as resolvePath } from 'node:path';
import clipboardy from 'clipboardy';
import parseArgs from 'minimist';
import type BpmnModel from '../../src/model/bpmn/internal/BpmnModel';
import type { BpmnJsonModel } from '../../src/model/bpmn/json/BPMN20';
import BpmnXmlParser from '../../src/component/parser/xml/BpmnXmlParser';
import { newBpmnJsonParser } from '../../src/component/parser/json/BpmnJsonParser';
import { ParsingMessageCollector } from '../../src/component/parser/parsing-messages';
import { readFileSync } from '../../test/helpers/file-helper';

const __dirname = resolvePath();
const argv = parseArgs(process.argv.slice(2));
const bpmnFilePath = argv._[0];
const outputType = argv['output'] || 'json';

// eslint-disable-next-line no-console
console.info('Generating BPMN in the "%s" output type', outputType);
if (!bpmnFilePath) {
  throw new Error('You must provide file path as 1st parameter for example: test/fixtures/bpmn/simple-start-task-end.bpmn ');
}
if (['json', 'model'].indexOf(outputType) == -1) {
  throw new Error('--output parameter must be one of: json | model');
}
// eslint-disable-next-line no-console
console.info('Use BPMN diagram located at "%s"', bpmnFilePath);

const xmlParser = new BpmnXmlParser();
const json = xmlParser.parse(readFileSync(bpmnFilePath, 'utf-8', __dirname));
const prettyString = (object: BpmnJsonModel | BpmnModel): string => JSON.stringify(object, null, 2);

let result = '';
if (outputType === 'json') {
  result = prettyString(json);
} else {
  result = prettyString(newBpmnJsonParser(new ParsingMessageCollector()).parse(json));
}

// copy to clipboard
// disabling the copy is not officially supported, it currently fails on GitHub actions when running on Ubuntu 20.04. So disabling it only in this case.
// file:///home/runner/work/bpmn-visualization-js/bpmn-visualization-js/node_modules/clipboardy/lib/linux.js:16
// 		error = new Error('Couldn\'t find the `xsel` binary and fallback didn\'t work. On Debian/Ubuntu you can install xsel with: sudo apt install xsel');
// Error: Couldn't find the `xsel` binary and fallback didn't work. On Debian/Ubuntu you can install xsel with: sudo apt install xsel
// CI env variable when running on GitHub Actions: https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
const isRunningOnCIWithLinuxOS = process.env.CI === 'true' && process.platform.startsWith('linux');
if (!isRunningOnCIWithLinuxOS) {
  clipboardy.writeSync(result);
} else {
  console.warn('No clipboard copy, as it is not supported in this environment');
}

/* eslint-disable no-console */
console.info('Output generated');
console.info(result);
