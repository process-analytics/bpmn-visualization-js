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

describe('parse bpmn as json for user task', () => {
  it('json containing one process with a single user task', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "userTask": {
                            "id":"userTask_id_0",
                            "name":"userTask name"
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_userTask_id_0",
                                "bpmnElement":"userTask_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_userTask_id_0',
      bpmnElementId: 'userTask_id_0',
      bpmnElementName: 'userTask name',
      bpmnElementKind: ShapeBpmnElementKind.TASK_USER,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process declared as array with a single user task', () => {
    const json = `{
                "definitions": {
                    "process": [
                        {
                            "userTask": {
                                "id":"userTask_id_1",
                                "name":"userTask name"
                            }
                        }
                    ],
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_userTask_id_1",
                                "bpmnElement":"userTask_id_1",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_userTask_id_1',
      bpmnElementId: 'userTask_id_1',
      bpmnElementName: 'userTask name',
      bpmnElementKind: ShapeBpmnElementKind.TASK_USER,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process with an array of user tasks  with name & without name', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "userTask": [
                          {
                              "id":"userTask_id_0",
                              "name":"userTask name"
                          },{
                              "id":"userTask_id_1"
                          }
                          
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                "id":"shape_userTask_id_0",
                                "bpmnElement":"userTask_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }, {
                                "id":"shape_userTask_id_1",
                                "bpmnElement":"userTask_id_1",
                                "Bounds": { "x": 365, "y": 235, "width": 35, "height": 46 }
                              }
                            ]
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_userTask_id_0',
      bpmnElementId: 'userTask_id_0',
      bpmnElementName: 'userTask name',
      bpmnElementKind: ShapeBpmnElementKind.TASK_USER,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_userTask_id_1',
      bpmnElementId: 'userTask_id_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.TASK_USER,
      boundsX: 365,
      boundsY: 235,
      boundsWidth: 35,
      boundsHeight: 46,
    });
  });
});
