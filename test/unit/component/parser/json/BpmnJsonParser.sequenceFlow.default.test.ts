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
import { parseJsonAndExpectOnlyEdgesAndFlowNodes, verifyEdge } from './JsonTestUtils';
import { SequenceFlowKind } from '../../../../../src/model/bpmn/edge/SequenceFlowKind';
import each from 'jest-each';

describe('parse bpmn as json for default sequence flow', () => {
  it('json containing one process with a default sequence flow & a sequence flow', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "task": { "id": "task_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": [{
                        "id": "sequenceFlow_id_0",
                        "name": "label 1",
                        "sourceRef": "task_id_0",
                        "targetRef": "targetRef_RLk"
                    }, {
                        "id": "sequenceFlow_id_1",
                        "sourceRef": "task_id_0",
                        "targetRef": "targetRef_2"
                    }
                  ]
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_task_id_0",
                          "bpmnElement":"task_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": [{
                            "id": "edge_sequenceFlow_id_0",
                            "bpmnElement": "sequenceFlow_id_0"
                        }, {
                            "id": "edge_sequenceFlow_id_1",
                            "bpmnElement": "sequenceFlow_id_1"
                        }
                      ]
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 2, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: 'label 1',
      bpmnElementSourceRefId: 'task_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementKind: SequenceFlowKind.DEFAULT,
    });
    verifyEdge(model.edges[1], {
      edgeId: 'edge_sequenceFlow_id_1',
      bpmnElementId: 'sequenceFlow_id_1',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'task_id_0',
      bpmnElementTargetRefId: 'targetRef_2',
      bpmnElementKind: SequenceFlowKind.NORMAL,
    });
  });

  each([
    ['exclusiveGateway'],
    ['inclusiveGateway'],
    ['task'],
    ['userTask'],
    ['serviceTask'],
    ['callActivity'],
    ['receiveTask'],
    ['subProcess'],
    // TODO: To uncomment when we support complex gateway
    //['complexGateway'],
    // TODO: To uncomment when we support manualTask
    //['manualTask'],
    // TODO: To uncomment when we support scriptTask
    //['scriptTask'],
    // TODO: To uncomment when we support sendTask
    //['sendTask'],
    // TODO: To uncomment when we support businessRuleTask
    //['businessRuleTask'],
  ]).it('json containing one process with a sequence flow defined as default in a %s', sourceKind => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "${sourceKind}": { "id": "source_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "source_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_source_id_0",
                          "bpmnElement":"source_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'source_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementKind: SequenceFlowKind.DEFAULT,
    });
  });

  it('json containing one process with a flow node who define a sequence flow as default, but not possible in BPMN Semantic', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "parallelGateway": { "id": "gateway_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "gateway_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_gateway_id_0",
                          "bpmnElement":"gateway_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'gateway_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementKind: SequenceFlowKind.NORMAL,
    });
  });
});
