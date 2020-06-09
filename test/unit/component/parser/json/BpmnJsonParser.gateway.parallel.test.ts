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

describe('parse bpmn as json for parallel gateway', () => {
  it('json containing one process with a single parallel gateway', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "parallelGateway": {
                            "id":"parallelGateway_id_0",
                            "name":"parallelGateway name"
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_parallelGateway_id_0",
                                "bpmnElement":"parallelGateway_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_parallelGateway_id_0',
      bpmnElementId: 'parallelGateway_id_0',
      bpmnElementName: 'parallelGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_PARALLEL,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it('json containing one process declared as array with a single parallel gateway', () => {
    const json = `{
                "definitions": {
                    "process": [
                        {
                            "parallelGateway": {
                                "id":"parallelGateway_id_1",
                                "name":"parallelGateway name"
                            }
                        }
                    ],
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_parallelGateway_id_1",
                                "bpmnElement":"parallelGateway_id_1",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_parallelGateway_id_1',
      bpmnElementId: 'parallelGateway_id_1',
      bpmnElementName: 'parallelGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_PARALLEL,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it('json containing one process with an array of parallel gateways with name & without name', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "parallelGateway": [
                          {
                              "id":"parallelGateway_id_0",
                              "name":"parallelGateway name"
                          }, {
                              "id":"parallelGateway_id_1"
                          }
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                "id":"shape_parallelGateway_id_0",
                                "bpmnElement":"parallelGateway_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }, {
                                "id":"shape_parallelGateway_id_1",
                                "bpmnElement":"parallelGateway_id_1",
                                "Bounds": { "x": 365, "y": 235, "width": 35, "height": 46 }
                              }
                            ]
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_parallelGateway_id_0',
      bpmnElementId: 'parallelGateway_id_0',
      bpmnElementName: 'parallelGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_PARALLEL,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_parallelGateway_id_1',
      bpmnElementId: 'parallelGateway_id_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_PARALLEL,
      bounds: {
        x: 365,
        y: 235,
        width: 35,
        height: 46,
      },
    });
  });
});
