import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';

describe('parse bpmn as json for task', () => {
  it('json containing one process with a single task', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "task": {
                            "id":"task_id_0",
                            "name":"task name"
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_task_id_0",
                                "bpmnElement":"task_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_task_id_0',
      bpmnElementId: 'task_id_0',
      bpmnElementName: 'task name',
      bpmnElementKind: ShapeBpmnElementKind.TASK,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process declared as array with a single task', () => {
    const json = `{
                "definitions": {
                    "process": [
                        {
                            "task": {
                                "id":"task_id_1",
                                "name":"task name"
                            }
                        }
                    ],
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_task_id_1",
                                "bpmnElement":"task_id_1",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_task_id_1',
      bpmnElementId: 'task_id_1',
      bpmnElementName: 'task name',
      bpmnElementKind: ShapeBpmnElementKind.TASK,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process with an array of tasks  with name & without name', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "task": [
                          {
                              "id":"task_id_0",
                              "name":"task name"
                          },{
                              "id":"task_id_1"
                          }
                          
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                "id":"shape_task_id_0",
                                "bpmnElement":"task_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }, {
                                "id":"shape_task_id_1",
                                "bpmnElement":"task_id_1",
                                "Bounds": { "x": 365, "y": 235, "width": 35, "height": 46 }
                              }
                            ]
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_task_id_0',
      bpmnElementId: 'task_id_0',
      bpmnElementName: 'task name',
      bpmnElementKind: ShapeBpmnElementKind.TASK,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_task_id_1',
      bpmnElementId: 'task_id_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.TASK,
      boundsX: 365,
      boundsY: 235,
      boundsWidth: 35,
      boundsHeight: 46,
    });
  });
});
