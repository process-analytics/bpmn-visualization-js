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

describe('parse bpmn as xml for ADONIS NP 8.0', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const a21Process = readFileSync('../fixtures/bpmn/xml-parsing/adonis-np-8_0-miwg-A.2.1-export.bpmn');

    const json = new BpmnXmlParser().parse(a21Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          id: 'process_49bb2d82-cd27-4d9f-a3b7-58edc4d60bce',
          name: 'A.2.1',
          processType: 'None',
          extensionElements: {
            modelattributes: {
              attribute: expect.anything(),
              record: expect.anything(),
            },
          },
          startEvent: {
            id: '_56a03e72-acf0-4522-adeb-ad954c847612',
            name: 'Start Event',
            extensionElements: {
              instance: {
                attribute: expect.anything(),
                record: expect.anything(),
              },
            },
            outgoing: '_ab1dbc48-3851-440e-bee0-ef1af884a1a5',
          },
          endEvent: {
            id: '_e8302d6f-0ef9-4b95-9b23-96de2c175589',
            name: 'End Event',
            extensionElements: expect.anything(),
            incoming: ['_91a75c3f-7a0d-44a4-a1ba-ba6064187a9f', '_eeddf2a4-a7f0-415b-b154-a98f64d411c2'],
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
                id: 'BPMN_Edge_107fb1c6-cf96-45a1-934e-e9a74f0ccb0c',
                bpmnElement: '_107fb1c6-cf96-45a1-934e-e9a74f0ccb0c',
                waypoint: [expect.anything(), expect.anything(), expect.anything()],
                BPMNLabel: {
                  Bounds: {
                    height: 0,
                    width: 0,
                    x: 398,
                    y: 340,
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
    expect(process.sequenceFlow).toHaveLength(11);

    const bpmnDiagram: BPMNDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    expect(bpmnDiagram.BPMNPlane.BPMNShape).toHaveLength(8);
    expect(bpmnDiagram.BPMNPlane.BPMNEdge).toHaveLength(11);
  });
});
