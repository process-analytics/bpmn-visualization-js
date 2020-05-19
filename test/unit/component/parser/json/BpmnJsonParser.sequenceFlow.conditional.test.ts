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

describe('parse bpmn as json for conditional sequence flow', () => {
  each([
    ['exclusiveGateway'],
    ['inclusiveGateway'],
    ['task'],
    ['userTask'],
    ['serviceTask'],
    // TODO: To uncomment when we support complex gateway
    //['complexGateway'],
    // TODO: To uncomment when we support manualTask
    //['manualTask'],
    // TODO: To uncomment when we support receiveTask
    //['receiveTask'],
    // TODO: To uncomment when we support scriptTask
    //['scriptTask'],
    // TODO: To uncomment when we support sendTask
    //['sendTask'],
    // TODO: To uncomment when we support businessRuleTask
    //['businessRuleTask'],
    // TODO: To uncomment when we support callActivity
    //['callActivity'],
    // TODO: To uncomment when we support subProcess
    //['subProcess'],
  ]).it('json containing one process with a sequence flow defined as conditional in a %s', sourceKind => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "${sourceKind}": { "id": "source_id_0" },
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "source_id_0",
                      "targetRef": "targetRef_RLk",
                      "conditionExpression": {
                        "#text": "&quot;Contract to be written&quot;.equals(loanRequested.status)",
                        "evaluatesToTypeRef": "java:java.lang.Boolean"
                      }
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
      bpmnElementKind: SequenceFlowKind.CONDITIONAL,
    });
  });

  it('json containing one process with a flow node who define a sequence flow as conditional, but not possible in BPMN Semantic', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "parallelGateway": { "id": "gateway_id_0" },
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "gateway_id_0",
                      "targetRef": "targetRef_RLk",
                      "conditionExpression": {
                        "#text": "&quot;Contract to be written&quot;.equals(loanRequested.status)",
                        "evaluatesToTypeRef": "java:java.lang.Boolean"
                      }
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
