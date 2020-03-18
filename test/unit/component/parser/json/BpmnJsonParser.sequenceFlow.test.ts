import { parseJsonAndExpectOnlyEdges, verifyEdge } from './JsonTestUtils';

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

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: 'label 1',
      bpmnElementSourceRefId: 'sourceRef_id_xsdas',
      bpmnElementTargetRefId: 'targetRef_RLk',
    });
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

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: 'label 1',
      bpmnElementSourceRefId: 'sourceRef_id_xsdas',
      bpmnElementTargetRefId: 'targetRef_RLk',
    });
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

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: 'label 1',
      bpmnElementSourceRefId: 'sourceRef_id_xsdas',
      bpmnElementTargetRefId: 'targetRef_RLk',
    });
    verifyEdge(model.edges[1], {
      edgeId: 'edge_sequenceFlow_id_1',
      bpmnElementId: 'sequenceFlow_id_1',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sequenceFlow_id_1',
      bpmnElementTargetRefId: 'targetRef_1',
    });
  });
});
