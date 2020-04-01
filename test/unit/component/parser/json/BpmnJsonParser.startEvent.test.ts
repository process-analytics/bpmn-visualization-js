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
import { parseJson, parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';

describe('parse bpmn as json for start event', () => {
  it('json containing one process with a single start event', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "startEvent": {
                            "id":"event_id_0",
                            "name":"event name"
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_startEvent_id_0",
                                "bpmnElement":"event_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_startEvent_id_0',
      bpmnElementId: 'event_id_0',
      bpmnElementName: 'event name',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process declared as array with a single start event', () => {
    const json = `{
                "definitions": {
                    "process": [
                        {
                            "startEvent": {
                                "id":"event_id_1",
                                "name":"event name"
                            }
                        }
                    ],
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_startEvent_id_1",
                                "bpmnElement":"event_id_1",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_startEvent_id_1',
      bpmnElementId: 'event_id_1',
      bpmnElementName: 'event name',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process with an array of start events with name & without name', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "startEvent": [
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
                                "id":"shape_startEvent_id_0",
                                "bpmnElement":"event_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }, {
                                "id":"shape_startEvent_id_1",
                                "bpmnElement":"event_id_1",
                                "Bounds": { "x": 365, "y": 235, "width": 35, "height": 46 }
                              }
                            ]
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_startEvent_id_0',
      bpmnElementId: 'event_id_0',
      bpmnElementName: 'event name',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_startEvent_id_1',
      bpmnElementId: 'event_id_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      boundsX: 365,
      boundsY: 235,
      boundsWidth: 35,
      boundsHeight: 46,
    });
  });

  it('json containing one process with an array of start events, some are not NONE event', () => {
    const json = `{
  "definitions": {
    "process": {
      "startEvent": [
        { "id": "event_id_0", "name": "none start event" },
        { "id": "event_id_1", "conditionalEventDefinition": {} },
        { "id": "event_id_2", "messageEventDefinition": {} },
        { "id": "event_id_3", "signalEventDefinition": {} },
        { "id": "event_id_4", "timerEventDefinition": {} }
      ]
    },
    "BPMNDiagram": {
      "name": "process 0",
      "BPMNPlane": {
        "BPMNShape": [
          {
            "id": "shape_startEvent_id_0", "bpmnElement": "event_id_0",
            "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
          },
          {
            "id": "shape_startEvent_id_1", "bpmnElement": "event_id_1",
            "Bounds": { "x": 362, "y": 332, "width": 36, "height": 45 }
          },
          {
            "id": "shape_startEvent_id_2", "bpmnElement": "event_id_2",
            "Bounds": { "x": 362, "y": 432, "width": 36, "height": 45 }
          },
          {
            "id": "shape_startEvent_id_3", "bpmnElement": "event_id_3",
            "Bounds": { "x": 362, "y": 532, "width": 36, "height": 45 }
          },
          {
            "id": "shape_startEvent_id_4", "bpmnElement": "event_id_4",
            "Bounds": { "x": 362, "y": 632, "width": 36, "height": 45 }
          }
        ]
      }
    }
  }
}`;

    const model = parseJson(json);

    expect(model.flowNodes).toHaveLength(1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_startEvent_id_0',
      bpmnElementId: 'event_id_0',
      bpmnElementName: 'none start event',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });
});
