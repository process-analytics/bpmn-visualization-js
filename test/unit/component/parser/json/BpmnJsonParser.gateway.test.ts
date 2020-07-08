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

describe.each([
  ['exclusive', ShapeBpmnElementKind.GATEWAY_EXCLUSIVE],
  ['inclusive', ShapeBpmnElementKind.GATEWAY_INCLUSIVE],
  ['parallel', ShapeBpmnElementKind.GATEWAY_PARALLEL],
])('parse bpmn as json for %s gateways', (bpmnKind: string, expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
  it(`json containing one process with a single ${bpmnKind} gateway`, () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "${bpmnKind}Gateway": {
                            "id":"${bpmnKind}Gateway_id_0",
                            "name":"${bpmnKind}Gateway name"
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_${bpmnKind}Gateway_id_0",
                                "bpmnElement":"${bpmnKind}Gateway_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_${bpmnKind}Gateway_id_0`,
      bpmnElementId: `${bpmnKind}Gateway_id_0`,
      bpmnElementName: `${bpmnKind}Gateway name`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it(`json containing one process declared as array with a single ${bpmnKind} gateway`, () => {
    const json = `{
                "definitions": {
                    "process": [
                        {
                            "${bpmnKind}Gateway": {
                                "id":"${bpmnKind}Gateway_id_1",
                                "name":"${bpmnKind}Gateway name"
                            }
                        }
                    ],
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_${bpmnKind}Gateway_id_1",
                                "bpmnElement":"${bpmnKind}Gateway_id_1",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_${bpmnKind}Gateway_id_1`,
      bpmnElementId: `${bpmnKind}Gateway_id_1`,
      bpmnElementName: `${bpmnKind}Gateway name`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it(`json containing one process with an array of ${bpmnKind} gateways with name & without name`, () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "${bpmnKind}Gateway": [
                          {
                              "id":"${bpmnKind}Gateway_id_0",
                              "name":"${bpmnKind}Gateway name"
                          }, {
                              "id":"${bpmnKind}Gateway_id_1"
                          }
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                "id":"shape_${bpmnKind}Gateway_id_0",
                                "bpmnElement":"${bpmnKind}Gateway_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }, {
                                "id":"shape_${bpmnKind}Gateway_id_1",
                                "bpmnElement":"${bpmnKind}Gateway_id_1",
                                "Bounds": { "x": 365, "y": 235, "width": 35, "height": 46 }
                              }
                            ]
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_${bpmnKind}Gateway_id_0`,
      bpmnElementId: `${bpmnKind}Gateway_id_0`,
      bpmnElementName: `${bpmnKind}Gateway name`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
    verifyShape(model.flowNodes[1], {
      shapeId: `shape_${bpmnKind}Gateway_id_1`,
      bpmnElementId: `${bpmnKind}Gateway_id_1`,
      bpmnElementName: undefined,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 365,
        y: 235,
        width: 35,
        height: 46,
      },
    });
  });
});
