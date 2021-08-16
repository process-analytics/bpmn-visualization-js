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
import { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import { BPMNDiagram } from '../../../../../src/model/bpmn/json/BPMNDI';
import { readFileSync } from '../../../../helpers/file-helper';

describe('parse bpmn as xml for Activiti Designer 5.14.1', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const a20Process = readFileSync('../fixtures/bpmn/xml-parsing/activiti-5_14_1-miwg-A.2.0.export.bpmn');

    const json = new BpmnXmlParser().parse(a20Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          id: 'myProcess',
          name: 'My process',
          startEvent: {
            id: 'startevent1',
            name: 'Start',
          },
          endEvent: {
            id: 'endevent1',
            name: 'End',
          },
          userTask: expect.arrayContaining([expect.anything()]),
          exclusiveGateway: expect.arrayContaining([expect.anything()]),
          sequenceFlow: expect.arrayContaining([expect.anything()]),
          textAnnotation: expect.anything(),
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: expect.arrayContaining([expect.anything()]),
            BPMNEdge: expect.arrayContaining([{ id: 'BPMNEdge_flow9', bpmnElement: 'flow9', waypoint: [expect.anything(), expect.anything(), expect.anything()] }]),
          },
        },
      },
    });

    const process: TProcess = json.definitions.process as TProcess;
    expect(process.userTask).toHaveLength(4);
    expect(process.exclusiveGateway).toHaveLength(2);
    expect(process.sequenceFlow).toHaveLength(9);

    const bpmnDiagram: BPMNDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    expect(bpmnDiagram.BPMNPlane.BPMNShape).toHaveLength(9);
    expect(bpmnDiagram.BPMNPlane.BPMNEdge).toHaveLength(9);
  });
});
