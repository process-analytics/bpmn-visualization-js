import { expect } from 'chai';
import BpmnJsonParser from '../../../../src/component/parser/json/BpmnJsonParser';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';

describe('parse bpmn as json', () => {
  describe('start event', () => {
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

      const model = BpmnJsonParser.parse(JSON.parse(json));

      expect(model.shapes).to.have.lengthOf(1, 'shapes');
      expect(model.shapes[0].id).to.be.equal('shape_startEvent_id_0', 'shape id');

      const bpmnElement = model.shapes[0].bpmnElement;
      expect(bpmnElement.id).to.be.equal('event_id_0', 'bpmn element id');
      expect(bpmnElement.name).to.be.equal('event name', 'bpmn element name');
      expect(bpmnElement.kind).to.be.equal(ShapeBpmnElementKind.EVENT_START, 'bpmn element kind');

      const bounds = model.shapes[0].bounds;
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

      const model = BpmnJsonParser.parse(JSON.parse(json));

      expect(model.shapes).to.have.lengthOf(1, 'shapes');
      expect(model.shapes[0].id).to.be.equal('shape_startEvent_id_1', 'shape id');

      const bpmnElement = model.shapes[0].bpmnElement;
      expect(bpmnElement.id).to.be.equal('event_id_1', 'bpmn element id');
      expect(bpmnElement.name).to.be.equal('event name', 'bpmn element name');
      expect(bpmnElement.kind).to.be.equal(ShapeBpmnElementKind.EVENT_START, 'bpmn element kind');

      const bounds = model.shapes[0].bounds;
      expect(bounds.x).to.be.equal(362, 'bounds x');
      expect(bounds.y).to.be.equal(232, 'bounds y');
      expect(bounds.width).to.be.equal(36, 'bounds width');
      expect(bounds.height).to.be.equal(45, 'bounds height');
    });

    it('json containing one process with an array of start events', () => {
      const json = `{
                "definitions" : {
                    "process": {
                        "startEvent": [
                          {
                              "id":"event_id_0",
                              "name":"event name"
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
                              }
                            ]
                        }
                    }
                }
            }`;

      const model = BpmnJsonParser.parse(JSON.parse(json));

      expect(model.shapes).to.have.lengthOf(1, 'shapes');
      expect(model.shapes[0].id).to.be.equal('shape_startEvent_id_0', 'shape id');

      const bpmnElement = model.shapes[0].bpmnElement;
      expect(bpmnElement.id).to.be.equal('event_id_0', 'bpmn element id');
      expect(bpmnElement.name).to.be.equal('event name', 'bpmn element name');
      expect(bpmnElement.kind).to.be.equal(ShapeBpmnElementKind.EVENT_START, 'bpmn element kind');

      const bounds = model.shapes[0].bounds;
      expect(bounds.x).to.be.equal(362, 'bounds x');
      expect(bounds.y).to.be.equal(232, 'bounds y');
      expect(bounds.width).to.be.equal(36, 'bounds width');
      expect(bounds.height).to.be.equal(45, 'bounds height');
    });
  });
  describe('user task', () => {
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

      const model = BpmnJsonParser.parse(JSON.parse(json));

      expect(model.shapes).to.have.lengthOf(1, 'shapes');
      expect(model.shapes[0].id).to.be.equal('shape_userTask_id_0', 'shape id');

      const bpmnElement = model.shapes[0].bpmnElement;
      expect(bpmnElement.id).to.be.equal('userTask_id_0', 'bpmn element id');
      expect(bpmnElement.name).to.be.equal('userTask name', 'bpmn element name');
      expect(bpmnElement.kind).to.be.equal(ShapeBpmnElementKind.TASK_USER, 'bpmn element kind');

      const bounds = model.shapes[0].bounds;
      expect(bounds.x).to.be.equal(362, 'bounds x');
      expect(bounds.y).to.be.equal(232, 'bounds y');
      expect(bounds.width).to.be.equal(36, 'bounds width');
      expect(bounds.height).to.be.equal(45, 'bounds height');
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

      const model = BpmnJsonParser.parse(JSON.parse(json));

      expect(model.shapes).to.have.lengthOf(1, 'shapes');
      expect(model.shapes[0].id).to.be.equal('shape_userTask_id_1', 'shape id');

      const bpmnElement = model.shapes[0].bpmnElement;
      expect(bpmnElement.id).to.be.equal('userTask_id_1', 'bpmn element id');
      expect(bpmnElement.name).to.be.equal('userTask name', 'bpmn element name');
      expect(bpmnElement.kind).to.be.equal(ShapeBpmnElementKind.TASK_USER, 'bpmn element kind');

      const bounds = model.shapes[0].bounds;
      expect(bounds.x).to.be.equal(362, 'bounds x');
      expect(bounds.y).to.be.equal(232, 'bounds y');
      expect(bounds.width).to.be.equal(36, 'bounds width');
      expect(bounds.height).to.be.equal(45, 'bounds height');
    });

    it('json containing one process with an array of user tasks', () => {
      const json = `{
                "definitions" : {
                    "process": {
                        "userTask": [
                          {
                              "id":"userTask_id_0",
                              "name":"userTask name"
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
                              }
                            ]
                        }
                    }
                }
            }`;

      const model = BpmnJsonParser.parse(JSON.parse(json));

      expect(model.shapes).to.have.lengthOf(1, 'shapes');
      expect(model.shapes[0].id).to.be.equal('shape_userTask_id_0', 'shape id');

      const bpmnElement = model.shapes[0].bpmnElement;
      expect(bpmnElement.id).to.be.equal('userTask_id_0', 'bpmn element id');
      expect(bpmnElement.name).to.be.equal('userTask name', 'bpmn element name');
      expect(bpmnElement.kind).to.be.equal(ShapeBpmnElementKind.TASK_USER, 'bpmn element kind');

      const bounds = model.shapes[0].bounds;
      expect(bounds.x).to.be.equal(362, 'bounds x');
      expect(bounds.y).to.be.equal(232, 'bounds y');
      expect(bounds.width).to.be.equal(36, 'bounds width');
      expect(bounds.height).to.be.equal(45, 'bounds height');
    });
  });
});
