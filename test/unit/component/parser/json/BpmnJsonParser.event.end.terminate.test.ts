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
import { parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { ShapeBpmnEventKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnEventKind';

describe('parse bpmn as json for terminate end event', () => {
  it('json containing one process with an terminate end event, terminate end event is present', () => {
    const json = `{
  "definitions": {
    "process": {
      "endEvent": [
        { "id": "event_id_7", "terminateEventDefinition": {} }
      ]
    },
    "BPMNDiagram": {
      "name": "process 0",
      "BPMNPlane": {
        "BPMNShape": [
          {
            "id": "shape_endEvent_id_7", "bpmnElement": "event_id_7",
            "Bounds": { "x": 362, "y": 932, "width": 36, "height": 45 }
          }
        ]
      }
    }
  }
}`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_endEvent_id_7',
      bpmnElementId: 'event_id_7',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
      bpmnEventKind: ShapeBpmnEventKind.TERMINATE,
      boundsX: 362,
      boundsY: 932,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });
});
