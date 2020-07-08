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
import { parseJsonAndExpectOnlyEvent, parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { ShapeBpmnEventKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnEventKind';

describe.each([
  ['startEvent', ['message', 'timer', 'conditional', 'signal'], ShapeBpmnElementKind.EVENT_START],
  ['endEvent', ['message', 'error', 'escalation', 'cancel', 'compensate', 'signal', 'terminate'], ShapeBpmnElementKind.EVENT_END],
  ['intermediateCatchEvent', ['message', 'timer', 'conditional', 'link', 'signal'], ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
  ['intermediateThrowEvent', ['message', 'escalation', 'compensate', 'link', 'signal'], ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW],
])('parse bpmn as json for %ss', (bpmnKind: string, allDefinitionKinds: string[], expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
  describe.each([
    ['none', ShapeBpmnEventKind.NONE],
    ['message', ShapeBpmnEventKind.MESSAGE],
    ['timer', ShapeBpmnEventKind.TIMER],
    ['terminate', ShapeBpmnEventKind.TERMINATE],
    ['signal', ShapeBpmnEventKind.SIGNAL],

    // TODO To uncomment when an element is supported
    // ['cancel', ShapeBpmnEventKind.CANCEL],
    // ['compensate', ShapeBpmnEventKind.COMPENSATION],
    // ['conditional', ShapeBpmnEventKind.CONDITIONAL],
    // ['error', ShapeBpmnEventKind.ERROR],
    // ['escalation', ShapeBpmnEventKind.ESCALATION],
    // ['link', ShapeBpmnEventKind.LINK],
  ])(`parse bpmn as json for %s ${bpmnKind}`, (eventDefinitionKind: string, expectedShapeBpmnEventKind: ShapeBpmnEventKind) => {
    if (
      (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_START &&
        (expectedShapeBpmnEventKind === ShapeBpmnEventKind.ERROR ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.ESCALATION ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.CANCEL ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.COMPENSATION ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.LINK ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.TERMINATE)) ||
      (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH &&
        (expectedShapeBpmnEventKind === ShapeBpmnEventKind.NONE ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.ERROR ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.ESCALATION ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.CANCEL ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.COMPENSATION ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.TERMINATE)) ||
      (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW &&
        (expectedShapeBpmnEventKind === ShapeBpmnEventKind.TIMER ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.ERROR ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.CANCEL ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.CONDITIONAL ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.TERMINATE)) ||
      (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_END &&
        (expectedShapeBpmnEventKind === ShapeBpmnEventKind.TIMER ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.CONDITIONAL ||
          expectedShapeBpmnEventKind === ShapeBpmnEventKind.LINK))
    ) {
      // Not supported in BPMN specification
      return;
    }

    const eventDefinitionJson = expectedShapeBpmnEventKind === ShapeBpmnEventKind.NONE ? '' : `, \n\t\t"${eventDefinitionKind}EventDefinition": ""`;

    it(`json containing one process with a single ${eventDefinitionKind} ${bpmnKind}`, () => {
      const json = `{
                "definitions" : {
                    "process": {
                        "${bpmnKind}": {
                            "id":"event_id_0",
                            "name":"event name"${eventDefinitionJson}
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_${bpmnKind}_id_0",
                                "bpmnElement":"event_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

      const model = parseJsonAndExpectOnlyEvent(json, expectedShapeBpmnEventKind, 1);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_${bpmnKind}_id_0`,
        bpmnElementId: 'event_id_0',
        bpmnElementName: 'event name',
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 362,
          y: 232,
          width: 36,
          height: 45,
        },
      });
    });

    it(`json containing one process declared as array with a single ${eventDefinitionKind} ${bpmnKind}`, () => {
      const json = `{
                "definitions": {
                    "process": [
                        {
                            "${bpmnKind}": {
                                "id":"event_id_1",
                                "name":"event name"${eventDefinitionJson}
                            }
                        }
                    ],
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_${bpmnKind}_id_1",
                                "bpmnElement":"event_id_1",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

      const model = parseJsonAndExpectOnlyEvent(json, expectedShapeBpmnEventKind, 1);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_${bpmnKind}_id_1`,
        bpmnElementId: 'event_id_1',
        bpmnElementName: 'event name',
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 362,
          y: 232,
          width: 36,
          height: 45,
        },
      });
    });

    it(`json containing one process with an array of ${eventDefinitionKind} ${bpmnKind}s with name & without name`, () => {
      const json = `{
                "definitions" : {
                    "process": {
                        "${bpmnKind}": [
                          {
                              "id":"event_id_0",
                              "name":"event name"${eventDefinitionJson}
                          }, {
                              "id":"event_id_1"${eventDefinitionJson}
                          }
                        ]
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": [
                              {
                                "id":"shape_${bpmnKind}_id_0",
                                "bpmnElement":"event_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                              }, {
                                "id":"shape_${bpmnKind}_id_1",
                                "bpmnElement":"event_id_1",
                                "Bounds": { "x": 365, "y": 235, "width": 35, "height": 46 }
                              }
                            ]
                        }
                    }
                }
            }`;

      const model = parseJsonAndExpectOnlyEvent(json, expectedShapeBpmnEventKind, 2);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_${bpmnKind}_id_0`,
        bpmnElementId: 'event_id_0',
        bpmnElementName: 'event name',
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
        bpmnElementId: 'event_id_1',
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

    if (expectedShapeBpmnEventKind !== ShapeBpmnEventKind.NONE) {
      it(`json containing one process with a ${eventDefinitionKind} ${bpmnKind} defined as empty string, ${eventDefinitionKind} ${bpmnKind} is present`, () => {
        const json = `
      {
         "definitions": {
            "process": {
               "${bpmnKind}": {
                  "id": "event_id_0",
                  "name": "event name",
                  "${eventDefinitionKind}EventDefinition": ""
               }
            },
            "BPMNDiagram": {
               "name": "process 0",
               "BPMNPlane": {
                  "BPMNShape": {
                     "id": "shape_${bpmnKind}_id_0",
                     "bpmnElement": "event_id_0",
                     "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                  }
               }
            }
         }
      }`;

        const model = parseJsonAndExpectOnlyEvent(json, expectedShapeBpmnEventKind, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_${bpmnKind}_id_0`,
          bpmnElementId: 'event_id_0',
          bpmnElementName: 'event name',
          bpmnElementKind: expectedShapeBpmnElementKind,
          bounds: {
            x: 362,
            y: 232,
            width: 36,
            height: 45,
          },
        });
      });

      it(`json containing one process with a ${eventDefinitionKind} ${bpmnKind} defined as object, ${eventDefinitionKind} ${bpmnKind} is present`, () => {
        const json = `
      {
         "definitions": {
            "process": {
               "${bpmnKind}": {
                  "id": "event_id_0",
                  "name": "event name",
                  "${eventDefinitionKind}EventDefinition": { "id": "${eventDefinitionKind}EventDefinition_1" }
               }
            },
            "BPMNDiagram": {
               "name": "process 0",
               "BPMNPlane": {
                  "BPMNShape": {
                     "id": "shape_${bpmnKind}_id_0",
                     "bpmnElement": "event_id_0",
                     "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                  }
               }
            }
         }
      }`;

        const model = parseJsonAndExpectOnlyEvent(json, expectedShapeBpmnEventKind, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_${bpmnKind}_id_0`,
          bpmnElementId: 'event_id_0',
          bpmnElementName: 'event name',
          bpmnElementKind: expectedShapeBpmnElementKind,
          bounds: {
            x: 362,
            y: 232,
            width: 36,
            height: 45,
          },
        });
      });

      it(`json containing one process with a ${bpmnKind} with ${eventDefinitionKind} definition and another definition, ${eventDefinitionKind} event is NOT present`, () => {
        const otherEventDefinition = expectedShapeBpmnEventKind === ShapeBpmnEventKind.SIGNAL ? 'message' : 'signal';
        const json = `
      {
         "definitions": {
            "process": {
               "${bpmnKind}": {
                  "id": "event_id_0",
                  "${eventDefinitionKind}EventDefinition": "",
                  "${otherEventDefinition}EventDefinition": ""
               }
            },
            "BPMNDiagram": {
               "name": "process 0",
               "BPMNPlane": {
                  "BPMNShape": {
                     "id": "shape_${bpmnKind}_id_0",
                     "bpmnElement": "event_id_0",
                     "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                  }
               }
            }
         }
      }`;

        parseJsonAndExpectOnlyFlowNodes(json, 0);
      });

      it(`json containing one process with a ${bpmnKind} with several ${eventDefinitionKind} definitions, ${eventDefinitionKind} event is NOT present`, () => {
        const json = `
      {
         "definitions": {
            "process": {
               "${bpmnKind}": {
                  "id": "event_id_0",
                  "${eventDefinitionKind}EventDefinition": [ "", "" ]
               }
            },
            "BPMNDiagram": {
               "name": "process 0",
               "BPMNPlane": {
                  "BPMNShape": {
                     "id": "shape_${bpmnKind}_id_0",
                     "bpmnElement": "event_id_0",
                     "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                  }
               }
            }
         }
      }`;

        parseJsonAndExpectOnlyFlowNodes(json, 0);
      });
    }
  });

  //TODO We can delete it when all kind of event definition are implemented
  if (expectedShapeBpmnElementKind !== ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH) {
    it(`json containing one process with an array of ${bpmnKind}s, some are not NONE event`, () => {
      let processElements = '';
      let diagramShapes = '';
      allDefinitionKinds.forEach((definitionKind, index) => {
        processElements += `,\n\t\t{ "id": "${definitionKind}_${bpmnKind}_id_${index}", "${definitionKind}EventDefinition": {} }`;
        diagramShapes += `,\n\t\t{
            "id": "shape_${definitionKind}_${bpmnKind}_id_${index}", "bpmnElement": "${definitionKind}_${bpmnKind}_id_${index}",
            "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
          }`;
      });

      const json = `{
  "definitions": {
    "process": {
      "${bpmnKind}": [
        { "id": "none_${bpmnKind}_id", "name": "none ${bpmnKind}" }${processElements},
        { "id": "multiple_${bpmnKind}_id", "name": "multiple ${bpmnKind}", "messageEventDefinition": {}, "timerEventDefinition": {} }
      ]
    },
    "BPMNDiagram": {
      "name": "process 0",
      "BPMNPlane": {
        "BPMNShape": [
          {
            "id": "shape_none_${bpmnKind}_id", "bpmnElement": "none_${bpmnKind}_id",
            "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
          }${diagramShapes},
          {
            "id": "shape_multiple_${bpmnKind}_id", "bpmnElement": "multiple_${bpmnKind}_id",
            "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
          }
        ]
      }
    }
  }
}`;

      const model = parseJsonAndExpectOnlyEvent(json, ShapeBpmnEventKind.NONE, 1);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_none_${bpmnKind}_id`,
        bpmnElementId: `none_${bpmnKind}_id`,
        bpmnElementName: `none ${bpmnKind}`,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 362,
          y: 232,
          width: 36,
          height: 45,
        },
      });
    });
  }
});
