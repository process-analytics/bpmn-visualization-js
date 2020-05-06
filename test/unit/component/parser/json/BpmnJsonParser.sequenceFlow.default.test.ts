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
import { parseJsonAndExpectOnlyEdgesAndFlowNodes, verifyEdge } from './JsonTestUtils';
import { SequenceFlowKind } from '../../../../../src/model/bpmn/edge/SequenceFlowKind';

describe('parse bpmn as json for default sequence flow', () => {
  it('json containing one process with a default sequence flow & a sequence flow', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "task": { "id": "task_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": [{
                        "id": "sequenceFlow_id_0",
                        "name": "label 1",
                        "sourceRef": "task_id_0",
                        "targetRef": "targetRef_RLk"
                    }, {
                        "id": "sequenceFlow_id_1",
                        "sourceRef": "task_id_0",
                        "targetRef": "targetRef_2"
                    }
                  ]
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_task_id_0",
                          "bpmnElement":"task_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": [{
                            "id": "edge_sequenceFlow_id_0",
                            "bpmnElement": "sequenceFlow_id_0"
                        }, {
                            "id": "edge_sequenceFlow_id_1",
                            "bpmnElement": "sequenceFlow_id_1"
                        }
                      ]
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 2, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: 'label 1',
      bpmnElementSourceRefId: 'task_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementKind: SequenceFlowKind.DEFAULT,
    });
    verifyEdge(model.edges[1], {
      edgeId: 'edge_sequenceFlow_id_1',
      bpmnElementId: 'sequenceFlow_id_1',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'task_id_0',
      bpmnElementTargetRefId: 'targetRef_2',
      bpmnElementKind: SequenceFlowKind.NORMAL,
    });
  });

  it('json containing one process with a sequence flow defined as default in a exclusive gateway', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "exclusiveGateway": { "id": "gateway_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "gateway_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_gateway_id_0",
                          "bpmnElement":"gateway_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'gateway_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementKind: SequenceFlowKind.DEFAULT,
    });
  });

  it('json containing one process with a sequence flow defined as default in a inclusive gateway', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "inclusiveGateway": { "id": "gateway_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "gateway_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_gateway_id_0",
                          "bpmnElement":"gateway_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'gateway_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementKind: SequenceFlowKind.DEFAULT,
    });
  });

  // TODO: To uncomment when we support complex gateway
  /*
  it('json containing one process with a sequence flow defined as default in a complex gateway', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "complexGateway": { "id": "gateway_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "gateway_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_gateway_id_0",
                          "bpmnElement":"gateway_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'gateway_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnIsDefault: true,
    });
  });
*/

  it('json containing one process with a sequence flow defined as default in a task', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "task": { "id": "activity_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "activity_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_activity_id_0",
                          "bpmnElement":"activity_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'activity_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementKind: SequenceFlowKind.DEFAULT,
    });
  });

  it('json containing one process with a sequence flow defined as default in a user task', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "userTask": { "id": "activity_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "activity_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_activity_id_0",
                          "bpmnElement":"activity_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'activity_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementKind: SequenceFlowKind.DEFAULT,
    });
  });

  it('json containing one process with a sequence flow defined as default in a service task', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "serviceTask": { "id": "activity_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "activity_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_activity_id_0",
                          "bpmnElement":"activity_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'activity_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementKind: SequenceFlowKind.DEFAULT,
    });
  });

  // TODO: To uncomment when we support manualTask
  /*
  it('json containing one process with a sequence flow defined as default in a manual task', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "manualTask": { "id": "activity_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "activity_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_activity_id_0",
                          "bpmnElement":"activity_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'activity_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnIsDefault: true,
    });
  });
*/

  // TODO: To uncomment when we support receiveTask
  /*
  it('json containing one process with a sequence flow defined as default in a receive task', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "receiveTask": { "id": "activity_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "activity_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_activity_id_0",
                          "bpmnElement":"activity_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'activity_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnIsDefault: true,
    });
  });
*/

  // TODO: To uncomment when we support scriptTask
  /*
  it('json containing one process with a sequence flow defined as default in a script task', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "scriptTask": { "id": "activity_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "activity_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_activity_id_0",
                          "bpmnElement":"activity_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'activity_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnIsDefault: true,
    });
  });
*/

  // TODO: To uncomment when we support sendTask
  /*
  it('json containing one process with a sequence flow defined as default in a send task', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "sendTask": { "id": "activity_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "activity_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_activity_id_0",
                          "bpmnElement":"activity_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'activity_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnIsDefault: true,
    });
  });
*/

  // TODO: To uncomment when we support businessRuleTask
  /*
  it('json containing one process with a sequence flow defined as default in a business rule task', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "businessRuleTask": { "id": "activity_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "activity_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_activity_id_0",
                          "bpmnElement":"activity_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'activity_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnIsDefault: true,
    });
  });
*/

  // TODO: To uncomment when we support callActivity
  /*
  it('json containing one process with a sequence flow defined as default in a call activity', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "callActivity": { "id": "activity_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "activity_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_activity_id_0",
                          "bpmnElement":"activity_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'activity_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnIsDefault: true,
    });
  });
*/

  // TODO: To uncomment when we support subProcess
  /*
  it('json containing one process with a sequence flow defined as default in a subProcess', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "subProcess": { "id": "activity_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "activity_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_activity_id_0",
                          "bpmnElement":"activity_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'activity_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnIsDefault: true,
    });
  });
*/

  it('json containing one process with a sequence flow can not be default for parallel gateway', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "parallelGateway": { "id": "gateway_id_0", "default": "sequenceFlow_id_0"},
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "sourceRef": "gateway_id_0",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNShape": {
                          "id":"shape_gateway_id_0",
                          "bpmnElement":"gateway_id_0",
                          "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                      },
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'gateway_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementKind: SequenceFlowKind.NORMAL,
    });
  });
});
