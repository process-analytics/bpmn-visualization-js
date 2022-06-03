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
import type { BPMNDiagram } from '../../../../../src/model/bpmn/json/BPMNDI';
import type { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import { readFileSync } from '../../../../helpers/file-helper';

describe('parse bpmn as xml for MIWG', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const a21Process = readFileSync('../fixtures/bpmn/xml-parsing/miwg-A.2.1.bpmn');

    const json = new BpmnXmlParser().parse(a21Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          id: '_To9ZoTOCEeSknpIVFCxNIQ',
          name: 'A.2.1',
          processType: 'None',
          extensionElements: {
            graphStyle: {
              basic: expect.anything(),
              root: {
                gridVisible: true,
                snapToGrid: true,
                rulerVisible: true,
                snapToGuide: true,
                rulerUnit: 'Pixels',
                Grid: { spacing: expect.anything(), color: expect.anything() },
                VerticalRuler: '',
                HorizontalRuler: '',
              },
            },
          },
          ioSpecification: {
            id: '_cVGqYDOCEeSknpIVFCxNIQ',
            inputSet: { id: '_cVHRcDOCEeSknpIVFCxNIQ' },
            outputSet: { id: '_cVH4gDOCEeSknpIVFCxNIQ' },
          },
          startEvent: {
            id: '_To9ZojOCEeSknpIVFCxNIQ',
            name: 'Start Event',
            isInterrupting: true,
            extensionElements: {
              graphStyle: {
                basic: {
                  background: '109,183,0',
                  foreground: '0,0,0',
                  autoResize: false,
                  borderColor: '100,100,100',
                  collapsed: false,
                },
              },
            },
            outgoing: '_To9Z5DOCEeSknpIVFCxNIQ',
          },
          endEvent: {
            id: '_To9ZsTOCEeSknpIVFCxNIQ',
            name: 'End Event',
            extensionElements: expect.anything(),
            incoming: ['_To9Z7TOCEeSknpIVFCxNIQ', '_To9Z9jOCEeSknpIVFCxNIQ'],
          },
          task: expect.arrayContaining([expect.anything()]),
          exclusiveGateway: expect.arrayContaining([expect.anything()]),
          sequenceFlow: expect.arrayContaining([expect.anything()]),
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: expect.arrayContaining([expect.anything()]),
            BPMNEdge: expect.arrayContaining([
              { id: '_To-AzjOCEeSknpIVFCxNIQ', bpmnElement: '_To9Z8DOCEeSknpIVFCxNIQ', waypoint: [expect.anything(), expect.anything(), expect.anything()] },
            ]),
          },
          BPMNLabelStyle: expect.arrayContaining([{ id: '_cVFcQTOCEeSknpIVFCxNIQ', Font: { name: 'Segoe UI', size: 12 } }]),
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
    expect(bpmnDiagram.BPMNLabelStyle).toHaveLength(10);
  });

  it('bpmn with number attribute, ensure xml number are json number', () => {
    const a10Process = readFileSync('../fixtures/bpmn/xml-parsing/miwg-A.1.0.bpmn');

    const json = new BpmnXmlParser().parse(a10Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          task: [{ startQuantity: 1 }, expect.anything(), expect.anything()],
        },
        BPMNDiagram: {
          BPMNPlane: { BPMNShape: expect.arrayContaining([expect.objectContaining({ Bounds: { x: 186.0, y: 336.0, width: 30.0, height: 30.0 } })]) },
          BPMNLabelStyle: { Font: { size: 11.0 } },
        },
      },
    });
  });

  it('bpmn with boolean attribute, ensure xml boolean are json boolean', () => {
    const a10Process = readFileSync('../fixtures/bpmn/xml-parsing/miwg-A.1.0.bpmn');

    const json = new BpmnXmlParser().parse(a10Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          isExecutable: false,
        },
        BPMNDiagram: { BPMNLabelStyle: { Font: { isBold: false } } },
      },
    });
  });

  it('bpmn with attribute containing french characters', () => {
    const a10Process = readFileSync('../fixtures/bpmn/xml-parsing/miwg-A.1.0_modified_01_french_characters.bpmn');

    const json = new BpmnXmlParser().parse(a10Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          startEvent: { name: 'évènement de début' },
          task: [{ id: 'à_ec59e164-68b4-4f94-98de-ffb1c58a84af' }, expect.anything(), expect.anything()],
        },
        BPMNDiagram: expect.anything(),
      },
    });
  });

  it('bpmn with attribute containing japanese characters', () => {
    const a10Process = readFileSync('../fixtures/bpmn/xml-parsing/miwg-A.1.0_modified_02_japanese_characters.bpmn');

    const json = new BpmnXmlParser().parse(a10Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          startEvent: { name: '開始イベント' },
          task: [{ id: '識別子_ec59e164-68b4-4f94-98de-ffb1c58a84af' }, expect.anything(), expect.anything()],
        },
        BPMNDiagram: expect.anything(),
      },
    });
  });

  it('bpmn with attribute containing entities (known and unknown)', () => {
    const a10Process = readFileSync('../fixtures/bpmn/xml-parsing/miwg-A.1.0_modified_10_entities.bpmn');

    const json = new BpmnXmlParser().parse(a10Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          startEvent: { name: 'Start Event \n(Main) with &unknown; entity' },
          task: [{ id: '_ec59e164-68b4-4f94-98de-ffb1c58a84af ♠' }, expect.anything(), expect.anything()],
        },
        BPMNDiagram: expect.anything(),
      },
    });
  });
});
