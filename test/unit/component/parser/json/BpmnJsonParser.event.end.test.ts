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
import { parseJsonAndExpectOnlyEvent, parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { ShapeBpmnEventKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnEventKind';

describe.each([
  ['message', ShapeBpmnEventKind.MESSAGE],
  ['terminate', ShapeBpmnEventKind.TERMINATE],
])('parse bpmn as json for %s end event', (eventKind: string, shapeBpmnEventKind: ShapeBpmnEventKind) => {
  it(`json containing one process with an ${eventKind} end event defined as empty string, ${eventKind} end event is present`, () => {
    const json = `{
  "definitions": {
    "process": {
      "endEvent": [
        { "id": "event_id_7", "${eventKind}EventDefinition": "" }
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

    const model = parseJsonAndExpectOnlyEvent(json, shapeBpmnEventKind, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_endEvent_id_7',
      bpmnElementId: 'event_id_7',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
      bounds: {
        x: 362,
        y: 932,
        width: 36,
        height: 45,
      },
    });
  });

  it(`json containing one process with an ${eventKind} end event defined as object, ${eventKind} end event is present`, () => {
    const json = `{
  "definitions": {
    "process": {
      "endEvent": [
        { "id": "event_id_7", "${eventKind}EventDefinition": {} }
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

    const model = parseJsonAndExpectOnlyEvent(json, shapeBpmnEventKind, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_endEvent_id_7',
      bpmnElementId: 'event_id_7',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
      bounds: {
        x: 362,
        y: 932,
        width: 36,
        height: 45,
      },
    });
  });

  it(`json containing one process with an end event with ${eventKind} definition and another definition, ${eventKind} end event is NOT present`, () => {
    const json = `{
  "definitions": {
    "process": {
      "endEvent": [
        { "id": "event_id_7", "${eventKind}EventDefinition": "", "escalationEventDefinition": "" }
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

    parseJsonAndExpectOnlyFlowNodes(json, 0);
  });

  it(`json containing one process with an end event with several ${eventKind} definitions, ${eventKind} end event is NOT present`, () => {
    const json = `{
  "definitions": {
    "process": {
      "endEvent": [
        { "id": "event_id_7", "${eventKind}EventDefinition": ["", ""] }
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

    parseJsonAndExpectOnlyFlowNodes(json, 0);
  });
});
