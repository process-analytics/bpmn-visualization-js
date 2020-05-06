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

describe('parse bpmn as json for inclusive gateway', () => {
  it('json containing one process with a single inclusive gateway', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "inclusiveGateway": {
                            "id":"inclusiveGateway_id_0",
                            "name":"inclusiveGateway name"
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_inclusiveGateway_id_0",
                                "bpmnElement":"inclusiveGateway_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_inclusiveGateway_id_0',
      bpmnElementId: 'inclusiveGateway_id_0',
      bpmnElementName: 'inclusiveGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_INCLUSIVE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process declared as array with a single inclusive gateway', () => {
    const json = `{
                "definitions": {
                    "process": [
                        {
                            "inclusiveGateway": {
                                "id":"inclusiveGateway_id_1",
                                "name":"inclusiveGateway name"
                            }
                        }
                    ],
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_inclusiveGateway_id_1",
                                "bpmnElement":"inclusiveGateway_id_1",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_inclusiveGateway_id_1',
      bpmnElementId: 'inclusiveGateway_id_1',
      bpmnElementName: 'inclusiveGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_INCLUSIVE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process with an array of inclusive gateways with name & without name', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "inclusiveGateway": [
                          {
                              "id":"inclusiveGateway_id_0",
                              "name":"inclusiveGateway name"
                          }, {
                              "id":"inclusiveGateway_id_1"
                          }
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                "id":"shape_inclusiveGateway_id_0",
                                "bpmnElement":"inclusiveGateway_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }, {
                                "id":"shape_inclusiveGateway_id_1",
                                "bpmnElement":"inclusiveGateway_id_1",
                                "Bounds": { "x": 365, "y": 235, "width": 35, "height": 46 }
                              }
                            ]
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_inclusiveGateway_id_0',
      bpmnElementId: 'inclusiveGateway_id_0',
      bpmnElementName: 'inclusiveGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_INCLUSIVE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_inclusiveGateway_id_1',
      bpmnElementId: 'inclusiveGateway_id_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_INCLUSIVE,
      boundsX: 365,
      boundsY: 235,
      boundsWidth: 35,
      boundsHeight: 46,
    });
  });
});
