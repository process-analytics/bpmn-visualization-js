import { expect } from 'chai';
import { parseJsonAndExpectOnlyEdgesAndFlowNodes } from './JsonTestUtils';

describe('parse bpmn as json for sequence flow', () => {
  it('json containing one process with a single sequence flow', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "name": "label 1",
                      "sourceRef": "sourceRef_id_xsdas",
                      "targetRef": "targetRef_RLk"
                  }
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json);

    expect(model.edges).to.have.lengthOf(1, 'edges');
    expect(model.edges[0].id).to.be.equal('edge_sequenceFlow_id_0', 'edges id');

    const bpmnElement = model.edges[0].bpmnElement;
    expect(bpmnElement.id).to.be.equal('sequenceFlow_id_0', 'bpmn element id');
    expect(bpmnElement.name).to.be.equal('label 1', 'bpmn element name');
    expect(bpmnElement.sourceRefId).to.be.equal('sourceRef_id_xsdas', 'bpmn element sourceRef');
    expect(bpmnElement.targetRefId).to.be.equal('targetRef_RLk', 'bpmn element targetRef');
  });

  it('json containing one process declared as array with a single sequence flow', () => {
    const json = `{
          "definitions": {
              "process": [{
                  "id": "Process_1",
                  "sequenceFlow": {
                      "id": "sequenceFlow_id_0",
                      "name": "label 1",
                      "sourceRef": "sourceRef_id_xsdas",
                      "targetRef": "targetRef_RLk"
                  }
              }],
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNEdge": {
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      }
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json);

    expect(model.edges).to.have.lengthOf(1, 'edges');
    expect(model.edges[0].id).to.be.equal('edge_sequenceFlow_id_0', 'edges id');

    const bpmnElement = model.edges[0].bpmnElement;
    expect(bpmnElement.id).to.be.equal('sequenceFlow_id_0', 'bpmn element id');
    expect(bpmnElement.name).to.be.equal('label 1', 'bpmn element name');
    expect(bpmnElement.sourceRefId).to.be.equal('sourceRef_id_xsdas', 'bpmn element sourceRef');
    expect(bpmnElement.targetRefId).to.be.equal('targetRef_RLk', 'bpmn element targetRef');
  });

  it('json containing one process with an array of sequence flows with name & without name', () => {
    const json = `{
          "definitions": {
              "process": {
                  "id": "Process_1",
                  "sequenceFlow": [{
                      "id": "sequenceFlow_id_0",
                      "name": "label 1",
                      "sourceRef": "sourceRef_id_xsdas",
                      "targetRef": "targetRef_RLk"
                  },{
                      "id": "sequenceFlow_id_1",
                      "sourceRef": "sequenceFlow_id_1",
                      "targetRef": "targetRef_1"
                  }]
              },
              "BPMNDiagram": {
                  "id": "BpmnDiagram_1",
                  "BPMNPlane": {
                      "id": "BpmnPlane_1",
                      "BPMNEdge": [{
                          "id": "edge_sequenceFlow_id_0",
                          "bpmnElement": "sequenceFlow_id_0"
                      },{
                          "id": "edge_sequenceFlow_id_1",
                          "bpmnElement": "sequenceFlow_id_1"
                      }]
                  }
              }
          }
      }`;

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json);

    expect(model.edges).to.have.lengthOf(2, 'edges');
    expect(model.edges[0].id).to.be.equal('edge_sequenceFlow_id_0', 'edges id');

    const bpmnElementWithName = model.edges[0].bpmnElement;
    expect(bpmnElementWithName.id).to.be.equal('sequenceFlow_id_0', 'bpmn element id');
    expect(bpmnElementWithName.name).to.be.equal('label 1', 'bpmn element name');
    expect(bpmnElementWithName.sourceRefId).to.be.equal('sourceRef_id_xsdas', 'bpmn element sourceRef');
    expect(bpmnElementWithName.targetRefId).to.be.equal('targetRef_RLk', 'bpmn element targetRef');

    const bpmnElementWithoutName = model.edges[1].bpmnElement;
    expect(bpmnElementWithoutName.id).to.be.equal('sequenceFlow_id_1', 'bpmn element id');
    expect(bpmnElementWithoutName.sourceRefId).to.be.equal('sequenceFlow_id_1', 'bpmn element sourceRef');
    expect(bpmnElementWithoutName.targetRefId).to.be.equal('targetRef_1', 'bpmn element targetRef');
  });
});
