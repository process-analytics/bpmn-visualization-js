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
  ['startEvent', ShapeBpmnElementKind.EVENT_START],
  ['endEvent', ShapeBpmnElementKind.EVENT_END],
  ['intermediateCatchEvent', ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
  ['intermediateThrowEvent', ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW],
])('parse bpmn as json for %ss', (bpmnKind: string, expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
  describe.each([
    ['message', ShapeBpmnEventKind.MESSAGE],
    ['timer', ShapeBpmnEventKind.TIMER],
    ['terminate', ShapeBpmnEventKind.TERMINATE],
    ['signal', ShapeBpmnEventKind.SIGNAL],
  ])(`parse bpmn as json for %s ${bpmnKind}`, (eventDefinitionKind: string, expectedShapeBpmnEventKind: ShapeBpmnEventKind) => {
    if (
      (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW && expectedShapeBpmnEventKind === ShapeBpmnEventKind.TIMER) ||
      (expectedShapeBpmnElementKind !== ShapeBpmnElementKind.EVENT_END && expectedShapeBpmnEventKind === ShapeBpmnEventKind.TERMINATE)
    ) {
      // Not supported in BPMN specification
      return;
    }

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
  });
});
