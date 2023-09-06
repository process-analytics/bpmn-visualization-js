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

import type { TSequenceFlow } from '@lib/model/bpmn/json/baseElement/flowElement';
import type { TSubProcess } from '@lib/model/bpmn/json/baseElement/flowNode/activity/activity';
import type { TTask } from '@lib/model/bpmn/json/baseElement/flowNode/activity/task';
import type { TStartEvent } from '@lib/model/bpmn/json/baseElement/flowNode/event';
import type { TProcess } from '@lib/model/bpmn/json/baseElement/rootElement/rootElement';

import { ensureIsArray } from '@lib/component/helpers/array-utils';
import BpmnXmlParser from '@lib/component/parser/xml/BpmnXmlParser';
import { readFileSync } from '@test/shared/file-helper';

describe('parse bpmn as xml for Trisotech BPMN Modeler 6.2.0', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const a40Process = readFileSync('../fixtures/bpmn/xml-parsing/trisotech-bpmn-modeler-6.2.0_A.4.0-export.bpmn');

    const json = new BpmnXmlParser().parse(a40Process);

    expect(json).toMatchObject({
      definitions: {
        name: 'A.4.0-export',
      },
    });

    const process = json.definitions.process as TProcess[];
    expect(process).toHaveLength(2);
    const subProcess1 = process[0] as TSubProcess;
    const subProcess1StartEvents: TStartEvent[] = ensureIsArray(subProcess1.startEvent);
    expect(subProcess1StartEvents).toHaveLength(1);
    expect(subProcess1StartEvents[0].name).toBe('Start Event 2');

    const subProcess1Tasks: TTask[] = ensureIsArray(subProcess1.task);
    expect(subProcess1Tasks).toHaveLength(2);
    expect(subProcess1Tasks[0].name).toBe('Task 3');
    expect(subProcess1Tasks[1].name).toBe('Task 5');

    const subProcess1SequenceFlows: TSequenceFlow[] = ensureIsArray(subProcess1.sequenceFlow);
    expect(subProcess1SequenceFlows).toHaveLength(6);
    expect(subProcess1SequenceFlows[0]).toEqual({
      id: '_2cb09ba0-6d1a-40b9-959f-2c885400064c',
      sourceRef: '_0db4187e-a1f6-4f1f-9089-607067907037',
      targetRef: '_7f2b08f8-2042-434c-8181-4fbf1b03a97d',
    });
  });
});
