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
import { parseJsonAndExpectOnlySubProcess, verifyShape } from './JsonTestUtils';
import each from 'jest-each';
import { ShapeBpmnSubProcessKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnSubProcessKind';

describe('parse bpmn as json for embedded sub-process', () => {
  each([
    ['expanded', true],
    ['collapsed', false],
  ]).it('json containing one process with a single %s embedded sub-process', (testName, isExpanded: boolean) => {
    const json = `{
                "definitions" : {
                    "process": {
                        "subProcess": {
                            "id":"sub-process_id_0",
                            "name":"sub-process name",
                            "triggeredByEvent":false
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_sub-process_id_0",
                                "bpmnElement":"sub-process_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 },
                                "isExpanded":${isExpanded}
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlySubProcess(json, ShapeBpmnSubProcessKind.EMBEDDED, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_sub-process_id_0',
      bpmnElementId: 'sub-process_id_0',
      bpmnElementName: 'sub-process name',
      bpmnElementKind: ShapeBpmnElementKind.SUB_PROCESS,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
      isExpanded: isExpanded,
    });
  });

  it('json containing one process declared as array with a single embedded sub-process', () => {
    const json = `{
                "definitions": {
                    "process": [
                        {
                            "subProcess": {
                                "id":"sub-process_id_1",
                                "name":"sub-process name",
                                "triggeredByEvent":false
                            }
                        }
                    ],
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_sub-process_id_1",
                                "bpmnElement":"sub-process_id_1",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 },
                                "isExpanded":false
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlySubProcess(json, ShapeBpmnSubProcessKind.EMBEDDED, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_sub-process_id_1',
      bpmnElementId: 'sub-process_id_1',
      bpmnElementName: 'sub-process name',
      bpmnElementKind: ShapeBpmnElementKind.SUB_PROCESS,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
      isExpanded: false,
    });
  });

  it('json containing one process with an array of embedded sub-processes with/without name, triggeredByEvent & isExpanded', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "subProcess": [
                          {
                              "id":"sub-process_id_0",
                              "name":"sub-process name",
                              "triggeredByEvent":false
                          },{
                              "id":"sub-process_id_1"
                          }
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                "id":"shape_sub-process_id_0",
                                "bpmnElement":"sub-process_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 },
                                "isExpanded":false
                              }, {
                                "id":"shape_sub-process_id_1",
                                "bpmnElement":"sub-process_id_1",
                                "Bounds": { "x": 365, "y": 235, "width": 35, "height": 46 }
                              }
                            ]
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlySubProcess(json, ShapeBpmnSubProcessKind.EMBEDDED, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_sub-process_id_0',
      bpmnElementId: 'sub-process_id_0',
      bpmnElementName: 'sub-process name',
      bpmnElementKind: ShapeBpmnElementKind.SUB_PROCESS,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
      isExpanded: false,
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_sub-process_id_1',
      bpmnElementId: 'sub-process_id_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.SUB_PROCESS,
      bounds: {
        x: 365,
        y: 235,
        width: 35,
        height: 46,
      },
      isExpanded: false,
    });
  });
});
