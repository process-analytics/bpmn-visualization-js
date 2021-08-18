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

describe('parse bpmn as xml for Bizagi Modeler 2.8.0.8', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const a20Process = readFileSync('../fixtures/bpmn/xml-parsing/bizagi-modeler-2_8_0_8-A.2.0-export.bpmn');

    const json = new BpmnXmlParser().parse(a20Process);

    expect(json).toMatchObject({
      definitions: {
        process: [
          {
            id: 'WFP-6-',
            isExecutable: false,
            startEvent: {
              id: '_6b5db6a9-037a-49ad-9201-09201e2aaa97',
              name: 'Start Event',
              extensionElements: {
                BizagiExtensions: {
                  BizagiProperties: {
                    BizagiProperty: [
                      { name: 'bgColor', value: 'White' },
                      { name: 'borderColor', value: 'Black' },
                    ],
                  },
                },
              },
              outgoing: '_b50f530c-3450-4e1a-b81f-ea346dc6e1cb',
            },
            endEvent: {
              id: '_258f51eb-b764-4a71-b681-3a01cca14143',
              name: 'End Event',
              extensionElements: expect.anything(),
              incoming: ['_a3d40a56-9b7f-417e-911e-d39e7f18b90c', '_d4ce87c6-1373-45d6-a3b4-fbb2a04ee2e5'],
            },
            task: expect.arrayContaining([expect.anything()]),
            exclusiveGateway: expect.arrayContaining([expect.anything()]),
            sequenceFlow: expect.arrayContaining([expect.anything()]),
          },
          expect.anything(),
        ],
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: expect.arrayContaining([expect.anything()]),
            BPMNEdge: expect.arrayContaining([
              {
                id: 'DiagramElement_59ed7a00-ed2f-4885-bba7-ccc9367a9459',
                bpmnElement: '_b50f530c-3450-4e1a-b81f-ea346dc6e1cb',
                waypoint: [expect.anything(), expect.anything(), expect.anything()],
                BPMNLabel: {
                  Bounds: {
                    height: 0,
                    width: 0,
                    x: 0,
                    y: 0,
                  },
                  extension: '',
                  id: 'DiagramElement_57656087-6f6b-4463-883b-790befbab240',
                  labelStyle: 'Style_ddf6fbe3-d40d-4a94-a95a-71741047bfc6',
                },
                extension: '',
              },
            ]),
          },
          BPMNLabelStyle: expect.arrayContaining([
            { id: 'Style_6b41969d-9f3b-4d41-be89-6b5b6a905a1d', Font: { name: 'Arial', size: 8, isBold: false, isItalic: false, isStrikeThrough: false, isUnderline: false } },
          ]),
        },
      },
    });

    const process: TProcess = (json.definitions.process as TProcess[])[0];
    expect(process.task).toHaveLength(4);
    expect(process.exclusiveGateway).toHaveLength(2);
    expect(process.sequenceFlow).toHaveLength(9);

    const bpmnDiagram: BPMNDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    expect(bpmnDiagram.BPMNPlane.BPMNShape).toHaveLength(10);
    expect(bpmnDiagram.BPMNPlane.BPMNEdge).toHaveLength(9);
    expect(bpmnDiagram.BPMNLabelStyle).toHaveLength(17);
  });
});
