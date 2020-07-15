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
import Waypoint from '../../../../../src/model/bpmn/edge/Waypoint';
import { MessageVisibleKind } from '../../../../../src/model/bpmn/edge/MessageVisibleKind';

describe('parse bpmn as json for message flow', () => {
  it('json containing a collaboration with a single message flow without waypoint', () => {
    const json = `{
          "definitions": {
              "collaboration": {
                  "id": "collaboration_id_0",
                  "messageFlow": {
                    "id": "messageFlow_id_0",
                    "name": "Message Flow 0",
                    "sourceRef": "sourceRef_id",
                    "targetRef": "targetRef_id"
                  }
              },
              "process":"",
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNEdge": {
                          "id": "edge_messageFlow_id_0",
                          "bpmnElement": "messageFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_messageFlow_id_0',
      bpmnElementId: 'messageFlow_id_0',
      bpmnElementName: 'Message Flow 0',
      bpmnElementSourceRefId: 'sourceRef_id',
      bpmnElementTargetRefId: 'targetRef_id',
    });
  });

  it('json containing a collaboration with an array of message flows with name & without name', () => {
    const json = `{
          "definitions": {
              "collaboration": {
                  "id": "collaboration_id_0",
                  "messageFlow": [{
                    "id": "messageFlow_id_0",
                    "name": "Message Flow 0",
                    "sourceRef": "sourceRef_id",
                    "targetRef": "targetRef_id"
                  },{
                      "id": "messageFlow_id_1",
                      "sourceRef": "messageFlow_id_1",
                      "targetRef": "targetRef_id_1"
                  }]
              },
              "process":"",
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNEdge": [{
                          "id": "edge_messageFlow_id_0",
                          "bpmnElement": "messageFlow_id_0"
                      },{
                          "id": "edge_messageFlow_id_1",
                          "bpmnElement": "messageFlow_id_1"
                      }]
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_messageFlow_id_0',
      bpmnElementId: 'messageFlow_id_0',
      bpmnElementName: 'Message Flow 0',
      bpmnElementSourceRefId: 'sourceRef_id',
      bpmnElementTargetRefId: 'targetRef_id',
    });
    verifyEdge(model.edges[1], {
      edgeId: 'edge_messageFlow_id_1',
      bpmnElementId: 'messageFlow_id_1',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'messageFlow_id_1',
      bpmnElementTargetRefId: 'targetRef_id_1',
    });
  });

  it('json containing a collaboration with an array of message flows with one & several waypoints', () => {
    const json = `{
          "definitions": {
              "collaboration": {
                  "id": "collaboration_id_0",
                  "messageFlow": [{
                    "id": "messageFlow_id_0",
                    "sourceRef": "sourceRef_id",
                    "targetRef": "targetRef_id"
                  },{
                      "id": "messageFlow_id_1",
                      "sourceRef": "sourceRef_id_1",
                      "targetRef": "targetRef_id_1"
                  }]
              },
              "process":"",
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNEdge": [{
                          "id": "edge_messageFlow_id_0",
                          "bpmnElement": "messageFlow_id_0",
                          "waypoint": {
                            "x":1,
                            "y":1
                          }
                      },{
                          "id": "edge_messageFlow_id_1",
                          "bpmnElement": "messageFlow_id_1",
                          "waypoint": [{
                            "x":2,
                            "y":2
                          }, {
                            "x":3,
                            "y":3
                          }]
                      }]
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_messageFlow_id_0',
      bpmnElementId: 'messageFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id',
      bpmnElementTargetRefId: 'targetRef_id',
      waypoints: [new Waypoint(1, 1)],
    });
    verifyEdge(model.edges[1], {
      edgeId: 'edge_messageFlow_id_1',
      bpmnElementId: 'messageFlow_id_1',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id_1',
      bpmnElementTargetRefId: 'targetRef_id_1',
      waypoints: [new Waypoint(2, 2), new Waypoint(3, 3)],
    });
  });

  it('json containing a collaboration with none/initiating/non-initiating message flows', () => {
    const json = `{
          "definitions": {
              "collaboration": {
                  "id": "collaboration_id_0",
                  "messageFlow": [{
                    "id": "messageFlow_id_0",
                    "sourceRef": "sourceRef_id",
                    "targetRef": "targetRef_id"
                  },{
                      "id": "messageFlow_id_1",
                      "sourceRef": "sourceRef_id_1",
                      "targetRef": "targetRef_id_1"
                  },{
                      "id": "messageFlow_id_2",
                      "sourceRef": "sourceRef_id_2",
                      "targetRef": "targetRef_id_2"
                  },{
                      "id": "messageFlow_id_3",
                      "sourceRef": "sourceRef_id_3",
                      "targetRef": "targetRef_id_3"
                  }]
              },
              "process":"",
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNEdge": [{
                          "id": "edge_messageFlow_id_0",
                          "bpmnElement": "messageFlow_id_0"
                      },{
                          "id": "edge_messageFlow_id_1",
                          "bpmnElement": "messageFlow_id_1",
                          "messageVisibleKind":""
                      },{
                          "id": "edge_messageFlow_id_2",
                          "bpmnElement": "messageFlow_id_2",
                          "messageVisibleKind":"initiating"
                      },{
                          "id": "edge_messageFlow_id_3",
                          "bpmnElement": "messageFlow_id_3",
                          "messageVisibleKind":"non_initiating"
                      }]
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdges(json, 4);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_messageFlow_id_0',
      bpmnElementId: 'messageFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id',
      bpmnElementTargetRefId: 'targetRef_id',
      messageVisibleKind: MessageVisibleKind.NONE,
    });
    verifyEdge(model.edges[1], {
      edgeId: 'edge_messageFlow_id_1',
      bpmnElementId: 'messageFlow_id_1',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id_1',
      bpmnElementTargetRefId: 'targetRef_id_1',
      messageVisibleKind: MessageVisibleKind.NONE,
    });
    verifyEdge(model.edges[2], {
      edgeId: 'edge_messageFlow_id_2',
      bpmnElementId: 'messageFlow_id_2',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id_2',
      bpmnElementTargetRefId: 'targetRef_id_2',
      messageVisibleKind: MessageVisibleKind.INITIATING,
    });
    verifyEdge(model.edges[3], {
      edgeId: 'edge_messageFlow_id_3',
      bpmnElementId: 'messageFlow_id_3',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id_3',
      bpmnElementTargetRefId: 'targetRef_id_3',
      messageVisibleKind: MessageVisibleKind.NON_INITIATING,
    });
  });
});
