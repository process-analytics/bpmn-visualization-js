import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';

describe('parse bpmn as json for exclusive gateway', () => {
  it('json containing one process with a single exclusive gateway', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "exclusiveGateway": {
                            "id":"exclusiveGateway_id_0",
                            "name":"exclusiveGateway name"
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_exclusiveGateway_id_0",
                                "bpmnElement":"exclusiveGateway_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_exclusiveGateway_id_0',
      bpmnElementId: 'exclusiveGateway_id_0',
      bpmnElementName: 'exclusiveGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process declared as array with a single exclusive gateway', () => {
    const json = `{
                "definitions": {
                    "process": [
                        {
                            "exclusiveGateway": {
                                "id":"exclusiveGateway_id_1",
                                "name":"exclusiveGateway name"
                            }
                        }
                    ],
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_exclusiveGateway_id_1",
                                "bpmnElement":"exclusiveGateway_id_1",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_exclusiveGateway_id_1',
      bpmnElementId: 'exclusiveGateway_id_1',
      bpmnElementName: 'exclusiveGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process with an array of exclusive gateways with name & without name', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "exclusiveGateway": [
                          {
                              "id":"exclusiveGateway_id_0",
                              "name":"exclusiveGateway name"
                          }, {
                              "id":"exclusiveGateway_id_1"
                          }
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                "id":"shape_exclusiveGateway_id_0",
                                "bpmnElement":"exclusiveGateway_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }, {
                                "id":"shape_exclusiveGateway_id_1",
                                "bpmnElement":"exclusiveGateway_id_1",
                                "Bounds": { "x": 365, "y": 235, "width": 35, "height": 46 }
                              }
                            ]
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_exclusiveGateway_id_0',
      bpmnElementId: 'exclusiveGateway_id_0',
      bpmnElementName: 'exclusiveGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_exclusiveGateway_id_1',
      bpmnElementId: 'exclusiveGateway_id_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
      boundsX: 365,
      boundsY: 235,
      boundsWidth: 35,
      boundsHeight: 46,
    });
  });
});
