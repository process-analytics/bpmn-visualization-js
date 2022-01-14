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
import { parseJsonAndExpectOnlyEdges, verifyEdge } from './JsonTestUtils';
import { Waypoint } from '../../../../../src/model/bpmn/internal/edge/edge';
import type { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';

describe('parse bpmn as json for sequence flow', () => {
  const processWithSequenceFlowAsObject = {
    sequenceFlow: {
      id: 'sequenceFlow_id_0',
      name: 'label 1',
      sourceRef: 'sourceRef_id_xsdas',
      targetRef: 'targetRef_RLk',
    },
  } as TProcess;

  it.each([
    ['object', processWithSequenceFlowAsObject],
    ['array', [processWithSequenceFlowAsObject]],
  ])(`should convert as Edge, when a sequence flow is an attribute (as object) of 'process' (as %s)`, (title: string, processJson: TProcess) => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: processJson,
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNEdge: {
              id: 'edge_sequenceFlow_id_0',
              bpmnElement: 'sequenceFlow_id_0',
              waypoint: [{ x: 10, y: 10 }],
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: 'label 1',
      bpmnElementSourceRefId: 'sourceRef_id_xsdas',
      bpmnElementTargetRefId: 'targetRef_RLk',
      waypoints: [new Waypoint(10, 10)],
    });
  });

  it(`should convert as Edge, when a sequence flow (with/without name) is an attribute (as array) of 'process'`, () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          id: 'Process_1',
          sequenceFlow: [
            {
              id: 'sequenceFlow_id_0',
              name: 'label 1',
              sourceRef: 'sourceRef_id_xsdas',
              targetRef: 'targetRef_RLk',
            },
            {
              id: 'sequenceFlow_id_1',
              sourceRef: 'sequenceFlow_id_1',
              targetRef: 'targetRef_1',
            },
          ],
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: [
              {
                id: 'edge_sequenceFlow_id_0',
                bpmnElement: 'sequenceFlow_id_0',
                waypoint: [{ x: 10, y: 10 }],
              },
              {
                id: 'edge_sequenceFlow_id_1',
                bpmnElement: 'sequenceFlow_id_1',
                waypoint: [{ x: 10, y: 10 }],
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: 'label 1',
      bpmnElementSourceRefId: 'sourceRef_id_xsdas',
      bpmnElementTargetRefId: 'targetRef_RLk',
      waypoints: [new Waypoint(10, 10)],
    });
    verifyEdge(model.edges[1], {
      edgeId: 'edge_sequenceFlow_id_1',
      bpmnElementId: 'sequenceFlow_id_1',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sequenceFlow_id_1',
      bpmnElementTargetRefId: 'targetRef_1',
      waypoints: [new Waypoint(10, 10)],
    });
  });

  it(`should convert as Edge, when a sequence flow (with 2 & several waypoints) is an attribute (as array) of 'process'`, () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          id: 'Process_1',
          sequenceFlow: [
            {
              id: 'sequenceFlow_id_0',
              sourceRef: 'sourceRef_id_xsdas',
              targetRef: 'targetRef_RLk',
            },
            {
              id: 'sequenceFlow_id_1',
              sourceRef: 'sequenceFlow_id_1',
              targetRef: 'targetRef_1',
            },
          ],
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: [
              {
                id: 'edge_sequenceFlow_id_0',
                bpmnElement: 'sequenceFlow_id_0',
                waypoint: [
                  { x: 1, y: 1 },
                  { x: 2, y: 2 },
                ],
              },
              {
                id: 'edge_sequenceFlow_id_1',
                bpmnElement: 'sequenceFlow_id_1',
                waypoint: [
                  { x: 2, y: 2 },
                  { x: 3, y: 3 },
                  { x: 4, y: 4 },
                ],
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id_xsdas',
      bpmnElementTargetRefId: 'targetRef_RLk',
      waypoints: [new Waypoint(1, 1), new Waypoint(2, 2)],
    });
    verifyEdge(model.edges[1], {
      edgeId: 'edge_sequenceFlow_id_1',
      bpmnElementId: 'sequenceFlow_id_1',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sequenceFlow_id_1',
      bpmnElementTargetRefId: 'targetRef_1',
      waypoints: [new Waypoint(2, 2), new Waypoint(3, 3), new Waypoint(4, 4)],
    });
  });
});
