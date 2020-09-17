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
import BpmnXmlParser from '../../src/component/parser/xml/BpmnXmlParser';
import { readFileSync } from '../helpers/file-helper';
import * as path from 'path';
import { defaultBpmnJsonParser } from '../../src/component/parser/json/BpmnJsonParser';
import { BpmnJsonModel } from '../../src/component/parser/xml/bpmn-json-model/BPMN20';
import BpmnModel from '../../src/model/bpmn/BpmnModel';

const __dirname = path.resolve();
const myArgs = process.argv.slice(2);
const bpmnFilePath = myArgs[0];
const parsingType = myArgs[1] || 'json';

if (!bpmnFilePath) {
  throw new Error('you must provide file path as 1st parameter for example: test/fixtures/bpmn/parser-test.bpmn');
}
if (['json', 'bpmn'].indexOf(parsingType) == -1) {
  throw new Error('2nd parameter must be one of: json | bpmn');
}

const xmlParser = new BpmnXmlParser();
const json = xmlParser.parse(readFileSync(bpmnFilePath, 'utf-8', __dirname));
const prettyString = (object: BpmnJsonModel | BpmnModel): string => JSON.stringify(object, null, 2);

let result = '';
if (parsingType === 'json') {
  result = prettyString(json);
} else {
  result = prettyString(defaultBpmnJsonParser().parse(json));
}
// eslint-disable-next-line no-console
console.log(result);
