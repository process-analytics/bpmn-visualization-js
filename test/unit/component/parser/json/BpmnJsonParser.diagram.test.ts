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
import { parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { ShapeBpmnElementKind } from '../../../../../src/bpmn-visualization';
import { BpmnJsonModel } from '../../../../../src/model/bpmn/json/BPMN20';

describe('parse bpmn as json for diagram', () => {
  const jsonModelWithoutBPMNDiagram: BpmnJsonModel = {
    definitions: {
      targetNamespace: '',
      collaboration: {
        participant: [
          { id: 'Participant_1', processRef: 'Process_1' },
          { id: 'Participant_2', processRef: 'Process_2' },
        ],
      },
      process: [
        {
          id: 'Process_1',
          name: 'Process 1',
          isExecutable: false,
          startEvent: {
            id: 'Process_1_startEvent_1',
            name: 'Start Event 1',
          },
        },
        {
          id: 'Process_2',
          name: 'Process 2',
          isExecutable: false,
          startEvent: {
            id: 'Process_2_startEvent_1',
            name: 'Start Event 2',
          },
        },
      ],
    },
  };

  it(`no BPMNDiagram`, () => {
    parseJsonAndExpectOnlyFlowNodes(jsonModelWithoutBPMNDiagram, 0);
  });

  it(`single BPMNDiagram and 2 processes`, () => {
    const jsonModel = jsonModelWithoutBPMNDiagram;
    jsonModel.definitions.BPMNDiagram = {
      id: 'BPMNDiagram_1',
      name: 'Pool process 1',
      BPMNPlane: {
        BPMNShape: [
          {
            id: 'Shape_Process_1_startEvent_1',
            bpmnElement: 'Process_1_startEvent_1',
            Bounds: { x: 362, y: 232, width: 36, height: 45 },
          },
        ],
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(jsonModel, 1);
    verifyShape(model.flowNodes[0], {
      shapeId: 'Shape_Process_1_startEvent_1',
      parentId: 'Participant_1',
      bpmnElementId: 'Process_1_startEvent_1',
      bpmnElementName: 'Start Event 1',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it(`several BPMNDiagrams and 2 processes, only retrieve the first BPMNDiagram`, () => {
    const jsonModel = jsonModelWithoutBPMNDiagram;
    jsonModel.definitions.BPMNDiagram = [
      {
        id: 'BPMNDiagram_2',
        name: 'Pool process 2',
        BPMNPlane: {
          BPMNShape: [
            {
              id: 'Shape_Process_2_startEvent_1',
              bpmnElement: 'Process_2_startEvent_1',
              Bounds: { x: 80, y: 80, width: 32, height: 32 },
            },
          ],
        },
      },
      {
        id: 'BPMNDiagram_1',
        name: 'Pool process 1',
        BPMNPlane: {
          BPMNShape: [
            {
              id: 'Shape_Process_1_startEvent_1',
              bpmnElement: 'Process_1_startEvent_1',
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
          ],
        },
      },
    ];

    const model = parseJsonAndExpectOnlyFlowNodes(jsonModel, 1);
    verifyShape(model.flowNodes[0], {
      shapeId: 'Shape_Process_2_startEvent_1',
      parentId: 'Participant_2',
      bpmnElementId: 'Process_2_startEvent_1',
      bpmnElementName: 'Start Event 2',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      bounds: {
        x: 80,
        y: 80,
        width: 32,
        height: 32,
      },
    });
  });
});
