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
import BpmnXmlParser from '../../../../../src/component/parser/xml/BpmnXmlParser';
import { TProcess } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/rootElement/rootElement';
import { readFileSync } from '../../../../helpers/file-helper';
import { TSubProcess } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/flowNode/activity/activity';
import { ensureIsArray } from '../../../../../src/component/parser/json/converter/ConverterUtil';
import { TStartEvent } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/flowNode/event';

describe('parse bpmn as xml for Trisotech BPMN Modeler 6.2.0', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const a40Process = readFileSync('../fixtures/bpmn/xml-parsing/trisotech-bpmn-modeler-6.2.0_A.4.0-export.bpmn');

    const json = new BpmnXmlParser().parse(a40Process);

    expect(json).toMatchObject({
      definitions: {
        name: 'A.4.0-export',
      },
    });

    const process: TProcess = json.definitions.process as TProcess[];
    expect(process).toHaveLength(2);
    const subProcess1 = process[0] as TSubProcess;
    expect(subProcess1.task).toHaveLength(2);
    const subProcess1StartEvents: TStartEvent[] = ensureIsArray(subProcess1.startEvent);
    expect(subProcess1StartEvents).toHaveLength(1);
    expect(subProcess1StartEvents[0].name).toBe('Start Event 2');
  });
});
