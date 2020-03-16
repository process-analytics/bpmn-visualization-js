import { expect } from 'chai';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';

describe('parse bpmn as json for start event', () => {
  it('json containing one process with a single start event', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "startEvent": {
                            "id":"event_id_0",
                            "name":"event name"
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_startEvent_id_0",
                                "bpmnElement":"event_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json);

    expect(model.flowNodes).to.have.lengthOf(1, 'flow nodes');
    expect(model.flowNodes[0].id).to.be.equal('shape_startEvent_id_0', 'shape id');

    const bpmnElement = model.flowNodes[0].bpmnElement;
    expect(bpmnElement.id).to.be.equal('event_id_0', 'bpmn element id');
    expect(bpmnElement.name).to.be.equal('event name', 'bpmn element name');
    expect(bpmnElement.kind).to.be.equal(ShapeBpmnElementKind.EVENT_START, 'bpmn element kind');

    const bounds = model.flowNodes[0].bounds;
    expect(bounds.x).to.be.equal(362, 'bounds x');
    expect(bounds.y).to.be.equal(232, 'bounds y');
    expect(bounds.width).to.be.equal(36, 'bounds width');
    expect(bounds.height).to.be.equal(45, 'bounds height');
  });

  it('json containing one process declared as array with a single start event', () => {
    const json = `{
                "definitions": {
                    "process": [
                        {
                            "startEvent": {
                                "id":"event_id_1",
                                "name":"event name"
                            }
                        }
                    ],
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_startEvent_id_1",
                                "bpmnElement":"event_id_1",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json);

    expect(model.flowNodes).to.have.lengthOf(1, 'flow nodes');
    expect(model.flowNodes[0].id).to.be.equal('shape_startEvent_id_1', 'shape id');

    const bpmnElement = model.flowNodes[0].bpmnElement;
    expect(bpmnElement.id).to.be.equal('event_id_1', 'bpmn element id');
    expect(bpmnElement.name).to.be.equal('event name', 'bpmn element name');
    expect(bpmnElement.kind).to.be.equal(ShapeBpmnElementKind.EVENT_START, 'bpmn element kind');

    const bounds = model.flowNodes[0].bounds;
    expect(bounds.x).to.be.equal(362, 'bounds x');
    expect(bounds.y).to.be.equal(232, 'bounds y');
    expect(bounds.width).to.be.equal(36, 'bounds width');
    expect(bounds.height).to.be.equal(45, 'bounds height');
  });

  it('json containing one process with an array of start events with name & without name', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "startEvent": [
                          {
                              "id":"event_id_0",
                              "name":"event name"
                          }, {
                              "id":"event_id_1"
                          }
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                "id":"shape_startEvent_id_0",
                                "bpmnElement":"event_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }, {
                                "id":"shape_startEvent_id_1",
                                "bpmnElement":"event_id_1",
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
      shapeId: 'shape_startEvent_id_0',
      bpmnElementId: 'event_id_0',
      bpmnElementName: 'event name',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_startEvent_id_1',
      bpmnElementId: 'event_id_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      boundsX: 365,
      boundsY: 235,
      boundsWidth: 35,
      boundsHeight: 46,
    });
  });
});
