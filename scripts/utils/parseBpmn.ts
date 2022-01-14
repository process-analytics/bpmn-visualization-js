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
import * as path from 'path';
import clipboardy from 'clipboardy';
import parseArgs from 'minimist';
import type BpmnModel from '../../src/model/bpmn/internal/BpmnModel';
import type { BpmnJsonModel } from '../../src/model/bpmn/json/BPMN20';
import BpmnXmlParser from '../../src/component/parser/xml/BpmnXmlParser';
import { newBpmnJsonParser } from '../../src/component/parser/json/BpmnJsonParser';
import { ParsingMessageCollector } from '../../src/component/parser/parsing-messages';
import { readFileSync } from '../../test/helpers/file-helper';

const __dirname = path.resolve();
const argv = parseArgs(process.argv.slice(2));
const bpmnFilePath = argv._[0];
const outputType = argv['output'] || 'json';

if (!bpmnFilePath) {
  throw new Error('you must provide file path as 1st parameter for example: test/fixtures/bpmn/parser-test.bpmn');
}
if (['json', 'model'].indexOf(outputType) == -1) {
  throw new Error('--output parameter must be one of: json | model');
}

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
clipboardy.writeSync(result);
// eslint-disable-next-line no-console
console.log(result);
