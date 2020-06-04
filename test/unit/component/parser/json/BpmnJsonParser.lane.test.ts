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

    verifyShape(
      model.lanes[0],
      {
        shapeId: 'Lane_1h5yeu4_di',
        bpmnElementId: 'Lane_12u5n6x',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.LANE,
      },
      {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    );
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

    expect(model.lanes).toHaveLength(1);
    verifyShape(
      model.lanes[0],
      {
        shapeId: 'Lane_1h5yeu4_di',
        bpmnElementId: 'Lane_12u5n6x',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.LANE,
      },
      {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    );

    expect(model.flowNodes).toHaveLength(1);
    expect(model.flowNodes[0].bpmnElement.parentId).toEqual('Lane_12u5n6x');
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

    verifyShape(
      model.lanes[0],
      {
        shapeId: 'Lane_1h5yeu4_di',
        bpmnElementId: 'Lane_12u5n6x',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.LANE,
      },
      {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    );
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

    const model = parseJson(json);

    expect(model.lanes).toHaveLength(1);
    verifyShape(
      model.lanes[0],
      {
        shapeId: 'Lane_1h5yeu4_di',
        bpmnElementId: 'Lane_12u5n6x',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.LANE,
      },
      {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    );
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

    expect(model.lanes).toHaveLength(1);
    verifyShape(
      model.lanes[0],
      {
        shapeId: 'Lane_1h5yeu4_di',
        bpmnElementId: 'Lane_12u5n6x',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.LANE,
      },
      {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    );

    expect(model.flowNodes).toHaveLength(1);
    expect(model.flowNodes[0].bpmnElement.parentId).toEqual('Lane_12u5n6x');
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

    verifyShape(
      model.lanes[0],
      {
        shapeId: 'Lane_1h5yeu4_di',
        bpmnElementId: 'Lane_12u5n6x',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.LANE,
      },
      {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    );
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

    verifyShape(
      model.lanes[0],
      {
        shapeId: 'Lane_164yevk_di',
        bpmnElementId: 'Lane_164yevk',
        bpmnElementName: 'Customer',
        bpmnElementKind: ShapeBpmnElementKind.LANE,
      },
      {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    );
    verifyShape(
      model.lanes[1],
      {
        shapeId: 'Lane_12u5n6x_di',
        bpmnElementId: 'Lane_12u5n6x',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.LANE,
      },
      {
        x: 666,
        y: 222,
        width: 22,
        height: 33,
      },
    );
  });
});
