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

describe('parse bpmn as json for timer non-interrupting boundary event', () => {
  it('json containing one process with a timer non-interrupting boundary event, attached to an activity, defined as empty string, timer non-interrupting boundary event is present', () => {
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
                            "cancelActivity":true,
                            "timerEventDefinition": ""
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

    const model = parseJsonAndExpectOnlyBoundaryEvent(json, ShapeBpmnEventKind.TIMER, 1, true);

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

  it('json containing one process with a timer non-interrupting boundary event, attached to an activity, defined as object, timer non-interrupting boundary event is present', () => {
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
                            "cancelActivity":true,
                            "timerEventDefinition": { "id": "timerEventDefinition_1" }
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

    const model = parseJsonAndExpectOnlyBoundaryEvent(json, ShapeBpmnEventKind.TIMER, 1, true);

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

  it('json containing one process with a timer non-interrupting boundary event, attached to an activity, without cancelActivity attribute, timer non-interrupting boundary event is present', () => {
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
                            "timerEventDefinition": ""
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

    const model = parseJsonAndExpectOnlyBoundaryEvent(json, ShapeBpmnEventKind.TIMER, 1, true);

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

  it('json containing one process with a non-interrupting boundary event, attached to an activity, with timer definition and another definition, timer event is NOT present', () => {
    const json = `{
    "definitions" : {
        "process": {
            "task": { "id":"task_id_0", "name":"task name" },
            "boundaryEvent": { 
                "id":"event_id_0", 
                "attachedToRef":"task_id_0",
                "cancelActivity":true,
                "timerEventDefinition": "", 
                "timerEventDefinition": "" 
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

    parseJsonAndExpectOnlyBoundaryEvent(json, ShapeBpmnEventKind.TIMER, 0);
  });

  it('json containing one process with a non-interrupting boundary event, attached to an activity, with several timer definitions, timer event is NOT present', () => {
    const json = `{
    "definitions" : {
        "process": {
            "task": { "id":"task_id_0", "name":"task name" },
            "boundaryEvent": { 
                "id":"event_id_0", 
                "attachedToRef":"task_id_0",
                "cancelActivity":true,
                "timerEventDefinition": ["", ""] 
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

    parseJsonAndExpectOnlyBoundaryEvent(json, ShapeBpmnEventKind.TIMER, 0);
  });

  it('timer non-interrupting boundary event cannot be attached to anything than an activity', () => {
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
                            "timerEventDefinition": ""
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

    parseJsonAndExpectOnlyBoundaryEvent(json, ShapeBpmnEventKind.TIMER, 0);
  });
});
