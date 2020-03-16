import { expect } from 'chai';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
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

    const model = parseJsonAndExpectOnlyFlowNodes(json);

    expect(model.flowNodes).to.have.lengthOf(1, 'flow nodes');

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_parallelGateway_id_0',
      bpmnElementId: 'parallelGateway_id_0',
      bpmnElementName: 'parallelGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_PARALLEL,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
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

    const model = parseJsonAndExpectOnlyFlowNodes(json);

    expect(model.flowNodes).to.have.lengthOf(1, 'flow nodes');

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_parallelGateway_id_1',
      bpmnElementId: 'parallelGateway_id_1',
      bpmnElementName: 'parallelGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_PARALLEL,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
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

    const model = parseJsonAndExpectOnlyFlowNodes(json);

    expect(model.flowNodes).to.have.lengthOf(2, 'flow nodes');
    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_parallelGateway_id_0',
      bpmnElementId: 'parallelGateway_id_0',
      bpmnElementName: 'parallelGateway name',
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_PARALLEL,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_parallelGateway_id_1',
      bpmnElementId: 'parallelGateway_id_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.GATEWAY_PARALLEL,
      boundsX: 365,
      boundsY: 235,
      boundsWidth: 35,
      boundsHeight: 46,
    });
  });
});
