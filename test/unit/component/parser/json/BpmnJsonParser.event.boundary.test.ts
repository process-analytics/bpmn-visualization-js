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
import { parseJsonAndExpectOnlyBoundaryEvent, verifyShape } from './JsonTestUtils';
import { ShapeBpmnEventKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnEventKind';

describe.each([
  ['message', ShapeBpmnEventKind.MESSAGE],
  ['timer', ShapeBpmnEventKind.TIMER],
  ['signal', ShapeBpmnEventKind.SIGNAL],
])('parse bpmn as json for %s events', (eventKind: string, shapeBpmnEventKind: ShapeBpmnEventKind) => {
  describe.each([
    ['interrupting', true],
    ['non-interrupting', false],
  ])(`parse bpmn as json for ${eventKind} %s boundary event`, (boundaryEventKind: string, isInterrupting: boolean) => {
    it(`json containing one process with a ${eventKind} ${boundaryEventKind} boundary event, attached to an activity, defined as empty string, ${eventKind} ${boundaryEventKind} boundary event is present`, () => {
      const json = `{
                "definitions" : {
                    "process": {
                        "task": {
                            "id":"task_id_0",
                            "name":"task name"
                        },
                        "boundaryEvent": {
                            "id":"event_id_0",
                            "name":"event name",
                            "attachedToRef":"task_id_0",
                            "cancelActivity":${isInterrupting},
                            "${eventKind}EventDefinition": ""
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                  "id":"shape_task_id_0",
                                  "bpmnElement":"task_id_0",
                                  "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              },
                              {
                                  "id":"shape_boundaryEvent_id_0",
                                  "bpmnElement":"event_id_0",
                                  "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }
                            ]
                        }
                    }
                }
            }`;

      const model = parseJsonAndExpectOnlyBoundaryEvent(json, shapeBpmnEventKind, 1, isInterrupting);

      verifyShape(model.flowNodes[1], {
        shapeId: 'shape_boundaryEvent_id_0',
        parentId: 'task_id_0',
        bpmnElementId: 'event_id_0',
        bpmnElementName: 'event name',
        bpmnElementKind: ShapeBpmnElementKind.EVENT_BOUNDARY,
        bounds: {
          x: 362,
          y: 232,
          width: 36,
          height: 45,
        },
      });
    });

    it(`json containing one process with a ${eventKind} ${boundaryEventKind} boundary event, attached to an activity, defined as object, ${eventKind} ${boundaryEventKind} boundary event is present`, () => {
      const json = `{
                "definitions" : {
                    "process": {
                        "task": {
                            "id":"task_id_0",
                            "name":"task name"
                        },
                        "boundaryEvent": {
                            "id":"event_id_0",
                            "name":"event name",
                            "attachedToRef":"task_id_0",
                            "cancelActivity":${isInterrupting},
                            "${eventKind}EventDefinition": { "id": "${eventKind}EventDefinition_1" }
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                  "id":"shape_task_id_0",
                                  "bpmnElement":"task_id_0",
                                  "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              },
                              {
                                  "id":"shape_boundaryEvent_id_0",
                                  "bpmnElement":"event_id_0",
                                  "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }
                            ]
                        }
                    }
                }
            }`;

      const model = parseJsonAndExpectOnlyBoundaryEvent(json, shapeBpmnEventKind, 1, isInterrupting);

      verifyShape(model.flowNodes[1], {
        shapeId: 'shape_boundaryEvent_id_0',
        parentId: 'task_id_0',
        bpmnElementId: 'event_id_0',
        bpmnElementName: 'event name',
        bpmnElementKind: ShapeBpmnElementKind.EVENT_BOUNDARY,
        bounds: {
          x: 362,
          y: 232,
          width: 36,
          height: 45,
        },
      });
    });

    if (isInterrupting) {
      it(`json containing one process with a ${eventKind} ${boundaryEventKind} boundary event, attached to an activity, without cancelActivity attribute, ${eventKind} ${boundaryEventKind} boundary event is present`, () => {
        const json = `{
                "definitions" : {
                    "process": {
                        "task": {
                            "id":"task_id_0",
                            "name":"task name"
                        },
                        "boundaryEvent": {
                            "id":"event_id_0",
                            "name":"event name",
                            "attachedToRef":"task_id_0",
                            "${eventKind}EventDefinition": ""
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                  "id":"shape_task_id_0",
                                  "bpmnElement":"task_id_0",
                                  "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              },
                              {
                                  "id":"shape_boundaryEvent_id_0",
                                  "bpmnElement":"event_id_0",
                                  "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }
                            ]
                        }
                    }
                }
            }`;

        const model = parseJsonAndExpectOnlyBoundaryEvent(json, shapeBpmnEventKind, 1, isInterrupting);

        verifyShape(model.flowNodes[1], {
          shapeId: 'shape_boundaryEvent_id_0',
          parentId: 'task_id_0',
          bpmnElementId: 'event_id_0',
          bpmnElementName: 'event name',
          bpmnElementKind: ShapeBpmnElementKind.EVENT_BOUNDARY,
          bounds: {
            x: 362,
            y: 232,
            width: 36,
            height: 45,
          },
        });
      });
    }

    it(`json containing one process with a ${boundaryEventKind} boundary event, attached to an activity, with ${eventKind} definition and another definition, ${eventKind} event is NOT present`, () => {
      const json = `{
    "definitions" : {
        "process": {
            "task": { "id":"task_id_0", "name":"task name" },
            "boundaryEvent": {
                "id":"event_id_0",
                "attachedToRef":"task_id_0",
                "cancelActivity":${isInterrupting},
                "${eventKind}EventDefinition": "",
                "conditionalEventDefinition": ""
            }
        },
        "BPMNDiagram": {
            "name":"process 0",
            "BPMNPlane": {
                "BPMNShape": [
                    {
                        "id":"shape_task_id_0",
                        "bpmnElement":"task_id_0",
                        "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                    },
                    {
                         "id":"shape_boundaryEvent_id_0",
                         "bpmnElement":"event_id_0",
                         "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                    }
                ]
            }
        }
    }
}`;

      parseJsonAndExpectOnlyBoundaryEvent(json, shapeBpmnEventKind, 0);
    });

    it(`json containing one process with a ${boundaryEventKind} boundary event, attached to an activity, with several ${eventKind} definitions, ${eventKind} event is NOT present`, () => {
      const json = `{
    "definitions" : {
        "process": {
            "task": { "id":"task_id_0", "name":"task name" },
            "boundaryEvent": {
                "id":"event_id_0",
                "attachedToRef":"task_id_0",
                "cancelActivity":${isInterrupting},
                "${eventKind}EventDefinition": ["", ""]
            }
        },
        "BPMNDiagram": {
            "name":"process 0",
            "BPMNPlane": {
                "BPMNShape": [
                    {
                        "id":"shape_task_id_0",
                        "bpmnElement":"task_id_0",
                        "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                    },
                    {
                         "id":"shape_boundaryEvent_id_0",
                         "bpmnElement":"event_id_0",
                         "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                    }
                ]
            }
        }
    }
}`;

      parseJsonAndExpectOnlyBoundaryEvent(json, shapeBpmnEventKind, 0);
    });

    it(`${eventKind} ${boundaryEventKind} boundary event cannot be attached to anything than an activity`, () => {
      const json = `{
                "definitions" : {
                    "process": {
                        "startEvent": {
                            "id":"not_task_id_0"
                        },
                        "boundaryEvent": {
                            "id":"event_id_0",
                            "name":"event name",
                            "attachedToRef":"not_task_id_0",
                            "${eventKind}EventDefinition": ""
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                  "id":"shape_task_id_0",
                                  "bpmnElement":"task_id_0",
                                  "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              },
                              {
                                  "id":"shape_boundaryEvent_id_0",
                                  "bpmnElement":"event_id_0",
                                  "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }
                            ]
                        }
                    }
                }
            }`;

      parseJsonAndExpectOnlyBoundaryEvent(json, shapeBpmnEventKind, 0);
    });
  });
});
