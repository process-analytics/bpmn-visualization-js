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
import type { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import type { BPMNDiagram } from '../../../../../src/model/bpmn/json/BPMNDI';
import { readFileSync } from '../../../../helpers/file-helper';

describe('parse bpmn as xml for OMNITRACKER BPMN 11.5', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const bpmn = readFileSync('../fixtures/bpmn/xml-parsing/omnitracker-bpmn-11_5-miwg-A.4.1.export.bpmn');

    const json = new BpmnXmlParser().parse(bpmn);

    const processes = json.definitions.process as TProcess[];
    expect(processes).toHaveLength(3);

    const process: TProcess = processes[2];
    expect(process.name).toBe('Pool2_Pool');
    expect(process.subProcess).toHaveLength(2);
    expect(process.exclusiveGateway).toBeUndefined();
    expect(process.task).toHaveLength(2);
    expect(process.endEvent).toHaveLength(2);
    expect(process.sequenceFlow).toHaveLength(6);

    const bpmnDiagram: BPMNDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    expect(bpmnDiagram.BPMNPlane.BPMNShape).toHaveLength(22);
    expect(bpmnDiagram.BPMNPlane.BPMNEdge).toHaveLength(15);
  });
});
