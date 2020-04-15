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
import { parseJsonAndExpectOnlyEvent, verifyShape } from './JsonTestUtils';
import { ShapeBpmnEventKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnEventKind';

describe('parse bpmn as json for end event', () => {
  it('json containing one process with a single end event', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "endEvent": {
                            "id":"event_id_0",
                            "name":"event name"
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_endEvent_id_0",
                                "bpmnElement":"event_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyEvent(json, ShapeBpmnEventKind.NONE, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_endEvent_id_0',
      bpmnElementId: 'event_id_0',
      bpmnElementName: 'event name',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process declared as array with a single end event', () => {
    const json = `{
                "definitions": {
                    "process": [
                        {
                            "endEvent": {
                                "id":"event_id_1",
                                "name":"event name"
                            }
                        }
                    ],
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_endEvent_id_1",
                                "bpmnElement":"event_id_1",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyEvent(json, ShapeBpmnEventKind.NONE, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_endEvent_id_1',
      bpmnElementId: 'event_id_1',
      bpmnElementName: 'event name',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process with an array of end events with name & without name', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "endEvent": [
                          {
                              "id":"event_id_0",
                              "name":"event name"
                          }, {
                              "id":"event_id_1"
                          }
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                "id":"shape_endEvent_id_0",
                                "bpmnElement":"event_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }, {
                                "id":"shape_endEvent_id_1",
                                "bpmnElement":"event_id_1",
                                "Bounds": { "x": 365, "y": 235, "width": 35, "height": 46 }
                              }
                            ]
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyEvent(json, ShapeBpmnEventKind.NONE, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_endEvent_id_0',
      bpmnElementId: 'event_id_0',
      bpmnElementName: 'event name',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_endEvent_id_1',
      bpmnElementId: 'event_id_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
      boundsX: 365,
      boundsY: 235,
      boundsWidth: 35,
      boundsHeight: 46,
    });
  });

  it('json containing one process with an array of end events, some are not NONE event', () => {
    const json = `{
  "definitions": {
    "process": {
      "endEvent": [
        { "id": "event_id_0", "name": "none end event" },
        { "id": "event_id_1", "cancelEventDefinition": {} },
        { "id": "event_id_2", "compensationEventDefinition": {} },
        { "id": "event_id_3", "errorEventDefinition": {} },
        { "id": "event_id_4", "escalationEventDefinition": {} },
        { "id": "event_id_5", "messageEventDefinition": {} },
        { "id": "event_id_6", "signalEventDefinition": {} },
        { "id": "event_id_7", "terminateEventDefinition": {} }
      ]
    },
    "BPMNDiagram": {
      "name": "process 0",
      "BPMNPlane": {
        "BPMNShape": [
          {
            "id": "shape_endEvent_id_0", "bpmnElement": "event_id_0",
            "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
          },
          {
            "id": "shape_endEvent_id_1", "bpmnElement": "event_id_1",
            "Bounds": { "x": 362, "y": 332, "width": 36, "height": 45 }
          },
          {
            "id": "shape_endEvent_id_2", "bpmnElement": "event_id_2",
            "Bounds": { "x": 362, "y": 432, "width": 36, "height": 45 }
          },
          {
            "id": "shape_endEvent_id_3", "bpmnElement": "event_id_3",
            "Bounds": { "x": 362, "y": 532, "width": 36, "height": 45 }
          },
          {
            "id": "shape_endEvent_id_4", "bpmnElement": "event_id_4",
            "Bounds": { "x": 362, "y": 632, "width": 36, "height": 45 }
          },
          {
            "id": "shape_endEvent_id_5", "bpmnElement": "event_id_5",
            "Bounds": { "x": 362, "y": 732, "width": 36, "height": 45 }
          },
          {
            "id": "shape_endEvent_id_6", "bpmnElement": "event_id_6",
            "Bounds": { "x": 362, "y": 832, "width": 36, "height": 45 }
          },
          {
            "id": "shape_endEvent_id_7", "bpmnElement": "event_id_7",
            "Bounds": { "x": 362, "y": 932, "width": 36, "height": 45 }
          }
        ]
      }
    }
  }
}`;

    const model = parseJsonAndExpectOnlyEvent(json, ShapeBpmnEventKind.NONE, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_endEvent_id_0',
      bpmnElementId: 'event_id_0',
      bpmnElementName: 'none end event',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });
});
