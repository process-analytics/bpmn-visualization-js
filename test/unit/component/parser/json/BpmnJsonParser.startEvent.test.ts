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

  // TODO to implement
  it('json containing one process with an array of start events which are not NONE event', () => {
    /*

    {
      "definitions": {
        "id": "Definitions_0185lyd",
        "targetNamespace": "http://modeler.example.com/schema/bpmn",
        "process": {
          "id": "Process_1",
          "isExecutable": false,
          "startEvent": {
            "id": "StartEvent_1",
            "name": "message start event",
            "outgoing": "Flow_1",
            "messageEventDefinition": {
              "id": "MessageEventDefinition_1"
            }
          },
          "task": {
            "id": "Task_1",
            "name": "task1",
            "incoming": "Flow_1",
            "outgoing": "Flow_2"
          },
          "sequenceFlow": [
            {
              "id": "Flow_1",
              "sourceRef": "StartEvent_1",
              "targetRef": "Task_1"
            },
            {
              "id": "Flow_2",
              "sourceRef": "Task_1",
              "targetRef": "EndEvent_1"
            }
          ],
          "endEvent": {
            "id": "EndEvent_1",
            "name": "message end event",
            "incoming": "Flow_2",
            "messageEventDefinition": {
              "id": "MessageEventDefinition_2"
            }
          }
        },
        "BPMNDiagram": {
          "id": "BPMNDiagram_1",
          "BPMNPlane": {
            "id": "BPMNPlane_1",
            "bpmnElement": "Process_1",
            "BPMNEdge": [
              {
                "id": "edge_Flow_1",
                "bpmnElement": "Flow_1",
                "waypoint": [
                  {
                    "x": 192,
                    "y": 149
                  },
                  {
                    "x": 290,
                    "y": 149
                  }
                ]
              },
              {
                "id": "edge_Flow_2",
                "bpmnElement": "Flow_2",
                "waypoint": [
                  {
                    "x": 390,
                    "y": 149
                  },
                  {
                    "x": 492,
                    "y": 149
                  }
                ]
              }
            ],
            "BPMNShape": [
              {
                "id": "shape_StartEvent_1",
                "bpmnElement": "StartEvent_1",
                "Bounds": {
                  "x": 156,
                  "y": 131,
                  "width": 36,
                  "height": 36
                },
                "BPMNLabel": {
                  "Bounds": {
                    "x": 138,
                    "y": 86,
                    "width": 71,
                    "height": 27
                  }
                }
              },
              {
                "id": "Task_1_di",
                "bpmnElement": "Task_1",
                "Bounds": {
                  "x": 290,
                  "y": 109,
                  "width": 100,
                  "height": 80
                }
              },
              {
                "id": "Event_1by852b_di",
                "bpmnElement": "EndEvent_1",
                "Bounds": {
                  "x": 492,
                  "y": 131,
                  "width": 36,
                  "height": 36
                },
                "BPMNLabel": {
                  "Bounds": {
                    "x": 477,
                    "y": 174,
                    "width": 67,
                    "height": 27
                  }
                }
              }
            ]
          }
        }
      }
    }


    */

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

    // TODO rename EVENT_START into EVENT_START_NONE for clarity?
    const noneStartEvents = model.flowNodes.filter(shape => shape.bpmnElement.kind == ShapeBpmnElementKind.EVENT_START);
    expect(noneStartEvents).toHaveLength(0);
  });
});
