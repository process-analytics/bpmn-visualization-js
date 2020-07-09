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
import { parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';

describe.each([
  ['task', ShapeBpmnElementKind.TASK],
  ['serviceTask', ShapeBpmnElementKind.TASK_SERVICE],
  ['userTask', ShapeBpmnElementKind.TASK_USER],
])('parse bpmn as json for %s', (bpmnKind: string, expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
  const processJsonAsObjectWithTaskJsonAsObject = `{
                        "${bpmnKind}": {
                            "id":"${bpmnKind}_id_0",
                            "name":"${bpmnKind} name"
                        }
                    }`;

  it.each([
    ['object', `${processJsonAsObjectWithTaskJsonAsObject}`],
    ['array', `[${processJsonAsObjectWithTaskJsonAsObject}]`],
  ])(`should convert as Shape, when a ${bpmnKind} is an attribute (as object) of 'process' (as %s)`, (title: string, processJson: string) => {
    const json = `{
                "definitions" : {
                    "process": ${processJson},
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_${bpmnKind}_id_0",
                                "bpmnElement":"${bpmnKind}_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_${bpmnKind}_id_0`,
      bpmnElementId: `${bpmnKind}_id_0`,
      bpmnElementName: `${bpmnKind} name`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it(`should convert as Shape, when a ${bpmnKind} (with/without name) is an attribute (as array) of 'process'`, () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "${bpmnKind}": [
                          {
                              "id":"${bpmnKind}_id_0",
                              "name":"${bpmnKind} name"
                          }, {
                              "id":"${bpmnKind}_id_1"
                          }
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                "id":"shape_${bpmnKind}_id_0",
                                "bpmnElement":"${bpmnKind}_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }, {
                                "id":"shape_${bpmnKind}_id_1",
                                "bpmnElement":"${bpmnKind}_id_1",
                                "Bounds": { "x": 365, "y": 235, "width": 35, "height": 46 }
                              }
                            ]
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_${bpmnKind}_id_0`,
      bpmnElementId: `${bpmnKind}_id_0`,
      bpmnElementName: `${bpmnKind} name`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
    verifyShape(model.flowNodes[1], {
      shapeId: `shape_${bpmnKind}_id_1`,
      bpmnElementId: `${bpmnKind}_id_1`,
      bpmnElementName: undefined,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 365,
        y: 235,
        width: 35,
        height: 46,
      },
    });
  });
});
