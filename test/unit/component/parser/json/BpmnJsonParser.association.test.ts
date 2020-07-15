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
import { parseJsonAndExpectOnlyEdges, verifyEdge } from './JsonTestUtils';

describe('parse bpmn as json for text annotation', () => {
  it('json containing one process with an association', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "association": {
                            "id": "TextAssociation_01",
                            "sourceRef": "Activity_01",
                            "targetRef": "Annotation_01"
                          }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNEdge": {
                              "id": "edge_TextAssociation_01",
                              "bpmnElement": "TextAssociation_01"
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_TextAssociation_01',
      bpmnElementId: 'TextAssociation_01',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'Activity_01',
      bpmnElementTargetRefId: 'Annotation_01',
      bpmnElementSequenceFlowKind: undefined,
    });
  });

  it('json containing  one process declared as array with an association', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "association": {
                            "id": "TextAssociation_01",
                            "sourceRef": "Activity_01",
                            "targetRef": "Annotation_01"
                          }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNEdge": {
                              "id": "edge_TextAssociation_01",
                              "bpmnElement": "TextAssociation_01"
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_TextAssociation_01',
      bpmnElementId: 'TextAssociation_01',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'Activity_01',
      bpmnElementTargetRefId: 'Annotation_01',
      bpmnElementSequenceFlowKind: undefined,
    });
  });

  it('json containing one process with an array of associations', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "association": [{
                              "id": "TextAssociation_01",
                              "sourceRef": "Activity_01",
                              "targetRef": "Annotation_01"
                            },
                            {
                              "id": "TextAssociation_02",
                              "sourceRef": "Activity_02",
                              "targetRef": "Annotation_02"
                            }
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNEdge": [{
                                  "id": "edge_TextAssociation_01",
                                  "bpmnElement": "TextAssociation_01"
                                },
                                {
                                  "id": "edge_TextAssociation_02",
                                  "bpmnElement": "TextAssociation_02"
                                }
                            ]
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_TextAssociation_01',
      bpmnElementId: 'TextAssociation_01',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'Activity_01',
      bpmnElementTargetRefId: 'Annotation_01',
      bpmnElementSequenceFlowKind: undefined,
    });

    verifyEdge(model.edges[1], {
      edgeId: 'edge_TextAssociation_02',
      bpmnElementId: 'TextAssociation_02',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'Activity_02',
      bpmnElementTargetRefId: 'Annotation_02',
      bpmnElementSequenceFlowKind: undefined,
    });
  });
});
