import { expect } from 'chai';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { parseJson, parseJsonAndExpectOnlyLanes, verifyShape } from './JsonTestUtils';

describe('parse bpmn as json for lane', () => {
  it('json containing one process with a single lane without flowNodeRef', () => {
    const json = `{
                      "definitions":{
                        "process":{
                          "lane": { "id":"Lane_12u5n6x" }
                        },
                        "BPMNDiagram":{
                          "BPMNPlane":{
                            "BPMNShape":
                              {
                                "id":"Lane_1h5yeu4_di",
                                "bpmnElement":"Lane_12u5n6x",
                                "isHorizontal":true,
                                "Bounds": { "x":362, "y":232, "width":36, "height":45 }
                              }
                          }
                        }
                      }
                    }`;

    const model = parseJsonAndExpectOnlyLanes(json, 1);

    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process with a single lane with flowNodeRef as object & flowNode already parsed', () => {
    const json = `{
                      "definitions":{
                        "process":{
                          "lane": { "id":"Lane_12u5n6x", "flowNodeRef":"event_id_0" },
                          "startEvent": { "id":"event_id_0" }
                        },
                        "BPMNDiagram":{
                          "BPMNPlane":{
                            "BPMNShape":[
                              {
                                "id":"Lane_1h5yeu4_di",
                                "bpmnElement":"Lane_12u5n6x",
                                "isHorizontal":true,
                                "Bounds": { "x":362, "y":232, "width":36, "height":45 }
                              },
                              {
                                "id":"event_id_0_di",
                                "bpmnElement":"event_id_0",
                                "Bounds":{ "x":11, "y":11, "width":11, "height":11 }
                              }
                            ]
                          }
                        }
                      }
                    }`;

    const model = parseJson(json);

    expect(model.lanes).to.have.lengthOf(1, 'lanes');
    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });

    expect(model.flowNodes).to.have.lengthOf(1, 'flow nodes');
    expect(model.flowNodes[0].bpmnElement.parentId).to.be.equal('Lane_12u5n6x', 'bpmn element parent');
  });

  it('json containing one process with a single lane with flowNodeRef as object & flowNode not parsed', () => {
    const json = `{
                      "definitions":{
                        "process":{
                          "lane": { "id":"Lane_12u5n6x", "flowNodeRef":"event_id_0" }
                        },
                        "BPMNDiagram":{
                          "BPMNPlane":{
                            "BPMNShape":
                              {
                                "id":"Lane_1h5yeu4_di",
                                "bpmnElement":"Lane_12u5n6x",
                                "isHorizontal":true,
                                "Bounds": { "x":362, "y":232, "width":36, "height":45 }
                              }
                          }
                        }
                      }
                    }`;

    const model = parseJsonAndExpectOnlyLanes(json, 1);

    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process with a single lane with flowNodeRef as array', () => {
    const json = `{
                      "definitions":{
                        "process":{
                          "lane": { "id":"Lane_12u5n6x", "flowNodeRef":["event_id_0"] },
                          "startEvent": { "id":"event_id_0" }
                        },
                        "BPMNDiagram":{
                          "BPMNPlane":{
                            "BPMNShape":[
                              {
                                "id":"Lane_1h5yeu4_di",
                                "bpmnElement":"Lane_12u5n6x",
                                "isHorizontal":true,
                                "Bounds": { "x":362, "y":232, "width":36, "height":45 }
                              },
                              {
                                "id":"event_id_0_di",
                                "bpmnElement":"event_id_0",
                                "Bounds":{ "x":11, "y":11, "width":11, "height":11 }
                              }
                            ]
                          }
                        }
                      }
                    }`;

    const model = parseJson(json);

    expect(model.lanes).to.have.lengthOf(1, 'lanes');
    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });

    expect(model.flowNodes).to.have.lengthOf(1, 'flow nodes');
    expect(model.flowNodes[0].bpmnElement.parentId).to.be.equal('Lane_12u5n6x', 'bpmn element parent');
  });

  it('json containing one process declared as array with a laneset', () => {
    const json = `{
                      "definitions":{
                        "process":[{
                          "laneSet":{
                            "id":"LaneSet_1i59xiy",
                            "lane":{ "id":"Lane_12u5n6x" }
                          }
                        }],
                        "BPMNDiagram":{
                          "BPMNPlane":{
                            "BPMNShape":
                              {
                                "id":"Lane_1h5yeu4_di",
                                "bpmnElement":"Lane_12u5n6x",
                                "isHorizontal":true,
                                "Bounds":{ "x":362, "y":232, "width":36, "height":45 }
                              }
                          }
                        }
                      }
                    }`;

    const model = parseJsonAndExpectOnlyLanes(json, 1);

    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
  });

  it('json containing one process with an array of lanes with & without name', () => {
    const json = `{
                      "definitions":{
                        "process":{
                          "laneSet":{
                            "id":"LaneSet_1i59xiy",
                            "lane":[
                              {
                                "id":"Lane_164yevk",
                                "name":"Customer",
                                "flowNodeRef":"event_id_0"
                              },
                              { "id":"Lane_12u5n6x" }
                            ]
                          },
                          "startEvent": { "id":"event_id_0" }
                        },
                        "BPMNDiagram":{
                          "BPMNPlane":{
                            "BPMNShape":[
                              {
                                "id":"Lane_164yevk_di",
                                "bpmnElement":"Lane_164yevk",
                                "isHorizontal":true,
                                "Bounds":{ "x":362, "y":232, "width":36, "height":45 }
                              },
                              {
                                "id":"Lane_12u5n6x_di",
                                "bpmnElement":"Lane_12u5n6x",
                                "isHorizontal":true,
                                "Bounds":{ "x":666, "y":222, "width":22, "height":33 }
                              }
                            ]
                          }
                        }
                      }
                    }`;

    const model = parseJsonAndExpectOnlyLanes(json, 2);

    verifyShape(model.lanes[0], {
      shapeId: 'Lane_164yevk_di',
      bpmnElementId: 'Lane_164yevk',
      bpmnElementName: 'Customer',
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    verifyShape(model.lanes[1], {
      shapeId: 'Lane_12u5n6x_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      boundsX: 666,
      boundsY: 222,
      boundsWidth: 22,
      boundsHeight: 33,
    });
  });
});
