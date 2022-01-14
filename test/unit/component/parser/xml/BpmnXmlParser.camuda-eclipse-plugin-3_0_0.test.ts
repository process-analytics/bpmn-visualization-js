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

describe('parse bpmn as xml for Camunda Eclipse Plugin 3.0.0', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const a20Process = readFileSync('../fixtures/bpmn/xml-parsing/camuda-eclipse-plugin-3_0_0-A.2.0-export.bpmn');

    const json = new BpmnXmlParser().parse(a20Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          id: 'Process_1',
          isExecutable: false,
          startEvent: {
            id: 'StartEvent_1',
            name: 'Start Event',
            outgoing: 'SequenceFlow_1',
          },
          endEvent: {
            id: 'EndEvent_1',
            name: 'End Event',
            incoming: ['SequenceFlow_8', 'SequenceFlow_9'],
          },
          task: expect.arrayContaining([expect.anything()]),
          exclusiveGateway: expect.arrayContaining([expect.anything()]),
          sequenceFlow: expect.arrayContaining([expect.anything()]),
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: expect.arrayContaining([expect.anything()]),
            BPMNEdge: expect.arrayContaining([
              {
                id: 'BPMNEdge_SequenceFlow_7',
                bpmnElement: 'SequenceFlow_7',
                sourceElement: '_BPMNShape_Task_7',
                targetElement: '_BPMNShape_ExclusiveGateway_3',
                waypoint: [expect.anything(), expect.anything(), expect.anything(), expect.anything()],
                BPMNLabel: {
                  Bounds: {
                    height: 6.0,
                    width: 6.0,
                    x: 696.0,
                    y: 338.0,
                  },
                },
              },
            ]),
          },
        },
      },
    });

    const process: TProcess = json.definitions.process as TProcess;
    expect(process.task).toHaveLength(4);
    expect(process.exclusiveGateway).toHaveLength(2);
    expect(process.sequenceFlow).toHaveLength(9);

    const bpmnDiagram: BPMNDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    expect(bpmnDiagram.BPMNPlane.BPMNShape).toHaveLength(8);
    expect(bpmnDiagram.BPMNPlane.BPMNEdge).toHaveLength(9);
  });
});
