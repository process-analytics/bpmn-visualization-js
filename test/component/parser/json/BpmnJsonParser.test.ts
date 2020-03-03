import { expect } from 'chai';
import BpmnJsonParser from '../../../../src/component/parser/json/BpmnJsonParser';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';

describe('parse bpmn as json', () => {
  describe('start event', () => {
    // TODO json part BPMNDiagram is currently untested in the json parser
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
                                "bpmnElement":"event_id_0"
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
                                "bpmnElement":"event_id_1"
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
                                "bpmnElement":"event_id_0"
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
    });
  });
});
