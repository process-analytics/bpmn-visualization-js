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
import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { parseJson, parseJsonAndExpectOnlyEdges, parseJsonAndExpectOnlyEdgesAndFlowNodes, parseJsonAndExpectOnlyFlowNodes, verifyEdge, verifyShape } from './JsonTestUtils';
import each from 'jest-each';
import { SequenceFlowKind } from '../../../../../src/model/bpmn/edge/SequenceFlowKind';
import { Font } from '../../../../../src/model/bpmn/Label';
import Edge from '../../../../../src/model/bpmn/edge/Edge';

describe('parse bpmn as json for label font', () => {
  it('json containing a BPMNShape without label', () => {
    const json = `{
       "definitions": {
          "process": {
             "task": {
                "id": "task_id_0",
                "name": "task name"
             }
          },
          "BPMNDiagram": {
             "id": "BpmnDiagram_1",
             "BPMNPlane": {
                "id": "BpmnPlane_1",
                "BPMNShape": {
                   "id": "BPMNShape_id_0",
                   "bpmnElement": "task_id_0"
                }
             }
          }
       }
    }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    expect(model.flowNodes[0].label).toBeUndefined();
  });

  it('json containing a BPMNEdge without label', () => {
    const json = `{
       "definitions": {
          "BPMNDiagram": {
             "id": "BpmnDiagram_1",
             "BPMNPlane": {
                "id": "BpmnPlane_1",
                "BPMNEdge": {
                   "id": "BPMNEdge_id_0"
                }
             }
          }
       }
    }`;

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    expect(model.edges[0].label).toBeUndefined();
  });
});
