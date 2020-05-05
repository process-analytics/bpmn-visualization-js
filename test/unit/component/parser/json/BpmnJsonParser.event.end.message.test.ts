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

describe('parse bpmn as json for Message end event', () => {
  it('json containing one process with an Message end event defined as empty string, Message end event is present', () => {
    const json = `{
  "definitions": {
    "process": {
      "endEvent": [
        { "id": "event_id_7", "messageEventDefinition": "" }
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

    const model = parseJsonAndExpectOnlyEvent(json, ShapeBpmnEventKind.MESSAGE, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_endEvent_id_7',
      bpmnElementId: 'event_id_7',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
      boundsX: 362,
      boundsY: 932,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process with an Message end event defined as object, Message end event is present', () => {
    const json = `{
  "definitions": {
    "process": {
      "endEvent": [
        { "id": "event_id_7", "messageEventDefinition": {} }
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

    const model = parseJsonAndExpectOnlyEvent(json, ShapeBpmnEventKind.MESSAGE, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_endEvent_id_7',
      bpmnElementId: 'event_id_7',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
      boundsX: 362,
      boundsY: 932,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process with an end event with terminate definition and another definition, Message end event is NOT present', () => {
    const json = `{
  "definitions": {
    "process": {
      "endEvent": [
        { "id": "event_id_7", "messageEventDefinition": "", "signalEventDefinition": "" }
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

  it('json containing one process with an end event with several terminate definition, Message end event is NOT present', () => {
    const json = `{
  "definitions": {
    "process": {
      "endEvent": [
        { "id": "event_id_7", "messageEventDefinition": ["", ""] }
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

  it('json containing one process with an end event with terminate definition as simple <semantic:escalationEventDefinition/>', () => {
    const json = `{
  "definitions": {
    "process": {
      "endEvent": [
        { "id": "event_id_7", "messageEventDefinition": "" }
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

    parseJsonAndExpectOnlyEvent(json, ShapeBpmnEventKind.MESSAGE, 1);
  });
});
