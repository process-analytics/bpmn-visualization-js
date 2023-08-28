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

import BpmnXmlParser from '@lib/component/parser/xml/BpmnXmlParser';
import type { TProcess } from '@lib/model/bpmn/json/baseElement/rootElement/rootElement';
import type { BPMNDiagram } from '@lib/model/bpmn/json/bpmndi';
import { readFileSync } from '@test/shared/file-helper';

describe('parse bpmn as xml for BPMN+ Composer V.10.4', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const bpmn = readFileSync('../fixtures/bpmn/xml-parsing/bpmn-plus-composer-v_10_4-miwg-A.4.0.export.bpmn');

    const json = new BpmnXmlParser().parse(bpmn);

    const processes = json.definitions.process as TProcess[];
    expect(processes).toHaveLength(2);

    const process: TProcess = processes[0];
    expect(process.name).toBe('A.4.0 Process');
    expect(process.subProcess).toHaveLength(2);
    expect(process.exclusiveGateway).toBeUndefined();
    expect(process.task).toHaveLength(2);
    expect(process.endEvent).toHaveLength(2);
    expect(process.sequenceFlow).toHaveLength(6);

    const bpmnDiagram: BPMNDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    expect(bpmnDiagram.BPMNPlane.BPMNShape).toHaveLength(20);
    expect(bpmnDiagram.BPMNPlane.BPMNEdge).toHaveLength(15);
    expect(bpmnDiagram.BPMNLabelStyle).toHaveLength(37);
  });
});
