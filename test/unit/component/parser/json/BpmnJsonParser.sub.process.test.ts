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

import { parseJson, parseJsonAndExpectOnlySubProcess, verifySubProcess } from '../../../helpers/JsonTestUtils';
import { getEventShapes } from '../../../helpers/TestUtils';
import type { ExpectedShape } from '../../../helpers/bpmn-model-expect';
import { verifyEdge, verifyShape } from '../../../helpers/bpmn-model-expect';

import type { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import type BpmnModel from '../../../../../src/model/bpmn/internal/BpmnModel';
import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind, ShapeBpmnMarkerKind, ShapeBpmnSubProcessKind } from '../../../../../src/model/bpmn/internal';
import type { ShapeBpmnEvent } from '../../../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import type Shape from '../../../../../src/model/bpmn/internal/shape/Shape';

function expectNoPoolLane(model: BpmnModel): void {
  expect(model.lanes).toHaveLength(0);
  expect(model.pools).toHaveLength(0);
}

function expectNoEdgePoolLane(model: BpmnModel): void {
  expectNoPoolLane(model);
  expect(model.edges).toHaveLength(0);
}

function verifyEventShape(shape: Shape, expectedShape: ExpectedShape, expectedEventDefinitionKind: ShapeBpmnEventDefinitionKind): void {
  verifyShape(shape, expectedShape);
  expect((shape.bpmnElement as ShapeBpmnEvent).eventDefinitionKind).toEqual(expectedEventDefinitionKind);
}

describe('parse bpmn as json for sub-process', () => {
  describe.each([
    ['embedded', false, ShapeBpmnSubProcessKind.EMBEDDED],
    ['event', true, ShapeBpmnSubProcessKind.EVENT],
  ])('parse bpmn as json for %s sub-process', (bpmnSubProcessKind: string, triggeredByEvent: boolean, expectedShapeBpmnSubProcessKind: ShapeBpmnSubProcessKind) => {
    describe.each([
      ['expanded', true, []],
      ['collapsed', false, [ShapeBpmnMarkerKind.EXPAND]],
    ])(`parse bpmn as json for %s ${bpmnSubProcessKind} sub-process`, (expandedKind: string, isExpanded: boolean, expectedBpmnElementMarkers: ShapeBpmnMarkerKind[]) => {
      const processWithSubProcessAsObject = {} as TProcess;
      processWithSubProcessAsObject['subProcess'] = {
        id: `sub-process_id_0`,
        name: `sub-process name`,
        triggeredByEvent: triggeredByEvent,
      };

      it.each([
        ['object', processWithSubProcessAsObject],
        ['array', [processWithSubProcessAsObject]],
      ])(
        `should convert as Shape, when a ${expandedKind} ${bpmnSubProcessKind} sub-process is an attribute (as object) of 'process' (as %s)`,
        (title: string, processJson: TProcess) => {
          const json = {
            definitions: {
              targetNamespace: '',
              process: processJson,
              BPMNDiagram: {
                name: 'process 0',
                BPMNPlane: {
                  BPMNShape: {
                    id: `shape_sub-process_id_0`,
                    bpmnElement: `sub-process_id_0`,
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                    isExpanded: isExpanded,
                  },
                },
              },
            },
          };

          const model = parseJsonAndExpectOnlySubProcess(json, expectedShapeBpmnSubProcessKind, 1);

          verifyShape(model.flowNodes[0], {
            shapeId: 'shape_sub-process_id_0',
            bpmnElementId: 'sub-process_id_0',
            bpmnElementName: 'sub-process name',
            bpmnElementKind: ShapeBpmnElementKind.SUB_PROCESS,
            bpmnElementMarkers: expectedBpmnElementMarkers,
            bounds: {
              x: 362,
              y: 232,
              width: 36,
              height: 45,
            },
          });
        },
      );
    });

    it(`should convert as Shape, when a ${bpmnSubProcessKind} sub-process (with/without name & isExpanded) is an attribute (as array) of 'process'`, () => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: {
            subProcess: [
              {
                id: 'sub-process_id_0',
                name: 'sub-process name',
                triggeredByEvent: triggeredByEvent,
              },
              {
                id: 'sub-process_id_1',
                triggeredByEvent: triggeredByEvent,
              },
            ],
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_sub-process_id_0',
                  bpmnElement: 'sub-process_id_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  isExpanded: false,
                },
                {
                  id: 'shape_sub-process_id_1',
                  bpmnElement: 'sub-process_id_1',
                  Bounds: { x: 365, y: 235, width: 35, height: 46 },
                },
              ],
            },
          },
        },
      };

      const model = parseJsonAndExpectOnlySubProcess(json, expectedShapeBpmnSubProcessKind, 2);

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
        bpmnElementMarkers: [ShapeBpmnMarkerKind.EXPAND],
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
        bpmnElementMarkers: [ShapeBpmnMarkerKind.EXPAND],
      });
    });

    if (expectedShapeBpmnSubProcessKind === ShapeBpmnSubProcessKind.EMBEDDED) {
      it(`should convert as Shape, when a embedded sub-process (with/without triggeredByEvent) is an attribute (as object) of 'process'`, () => {
        const json = {
          definitions: {
            targetNamespace: '',
            process: {
              subProcess: {
                id: 'sub-process_id_1',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_sub-process_id_1',
                  bpmnElement: 'sub-process_id_1',
                  Bounds: { x: 365, y: 235, width: 35, height: 46 },
                },
              },
            },
          },
        };

        const model = parseJsonAndExpectOnlySubProcess(json, expectedShapeBpmnSubProcessKind, 1);

        verifyShape(model.flowNodes[0], {
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
          bpmnElementMarkers: [ShapeBpmnMarkerKind.EXPAND],
        });
      });
    }

    it(`should convert activities, events, gateways and sequence-flows in sub-process`, () => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: {
            subProcess: {
              id: 'sub-process_id_1',
              collapsed: false,
              triggeredByEvent: triggeredByEvent,
              startEvent: {
                id: 'sub-process_id_1_startEvent_1',
                name: 'SubProcess Start Event',
                timerEventDefinition: {},
              },
              endEvent: {
                id: 'sub-process_id_1_endEvent_1',
                name: 'SubProcess End Event',
                terminateEventDefinition: '',
              },
              userTask: {
                id: 'sub-process_id_1_userTask_1',
                name: 'SubProcess User Task',
              },
              exclusiveGateway: {
                id: 'sub-process_id_1_exclusiveGateway_1',
                name: 'SubProcess Exclusive Gateway',
              },
              sequenceFlow: [
                {
                  id: 'sub-process_id_1_sequenceFlow_1',
                  sourceRef: 'sub-process_id_1_startEvent_1',
                  targetRef: 'sub-process_id_1_userTask_1',
                },
                {
                  id: 'sub-process_id_1_sequenceFlow_2',
                  sourceRef: 'sub-process_id_1_exclusiveGateway_1',
                  targetRef: 'sub-process_id_1_endEvent_1',
                },
              ],
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_sub-process_id_1',
                  bpmnElement: 'sub-process_id_1',
                  Bounds: { x: 365, y: 235, width: 300, height: 200 },
                  isExpanded: true,
                },
                {
                  id: 'shape_sub-process_id_1_startEvent_1',
                  bpmnElement: 'sub-process_id_1_startEvent_1',
                  Bounds: { x: 465, y: 335, width: 10, height: 10 },
                },
                {
                  id: 'shape_sub-process_id_1_userTask_1',
                  bpmnElement: 'sub-process_id_1_userTask_1',
                  Bounds: { x: 465, y: 335, width: 10, height: 10 },
                },
                {
                  id: 'shape_sub-process_id_1_exclusiveGateway_1',
                  bpmnElement: 'sub-process_id_1_exclusiveGateway_1',
                  Bounds: { x: 565, y: 335, width: 20, height: 20 },
                },
                {
                  id: 'shape_sub-process_id_1_endEvent_1',
                  bpmnElement: 'sub-process_id_1_endEvent_1',
                  Bounds: { x: 565, y: 335, width: 20, height: 20 },
                },
              ],
              BPMNEdge: [
                {
                  id: 'edge_sub-process_id_1_sequenceFlow_1',
                  bpmnElement: 'sub-process_id_1_sequenceFlow_1',
                  waypoint: [{ x: 10, y: 10 }],
                },
                {
                  id: 'edge_sub-process_id_1_sequenceFlow_2',
                  bpmnElement: 'sub-process_id_1_sequenceFlow_2',
                  waypoint: [{ x: 20, y: 20 }],
                },
              ],
            },
          },
        },
      };

      const model = parseJson(json);
      expectNoPoolLane(model);

      verifySubProcess(model, expectedShapeBpmnSubProcessKind, 1);
      verifyShape(model.flowNodes[0], {
        shapeId: 'shape_sub-process_id_1',
        bpmnElementId: 'sub-process_id_1',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.SUB_PROCESS,
        bounds: {
          x: 365,
          y: 235,
          width: 300,
          height: 200,
        },
      });

      const eventShapes = getEventShapes(model);
      expect(eventShapes).toHaveLength(2);
      verifyEventShape(
        eventShapes[0],
        {
          shapeId: 'shape_sub-process_id_1_startEvent_1',
          parentId: 'sub-process_id_1',
          bpmnElementId: 'sub-process_id_1_startEvent_1',
          bpmnElementName: 'SubProcess Start Event',
          bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
          bounds: { x: 465, y: 335, width: 10, height: 10 },
        },
        ShapeBpmnEventDefinitionKind.TIMER,
      );
      verifyEventShape(
        eventShapes[1],
        {
          shapeId: 'shape_sub-process_id_1_endEvent_1',
          parentId: 'sub-process_id_1',
          bpmnElementId: 'sub-process_id_1_endEvent_1',
          bpmnElementName: 'SubProcess End Event',
          bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
          bounds: { x: 565, y: 335, width: 20, height: 20 },
        },
        ShapeBpmnEventDefinitionKind.TERMINATE,
      );

      verifyShape(model.flowNodes[2], {
        shapeId: 'shape_sub-process_id_1_userTask_1',
        parentId: 'sub-process_id_1',
        bpmnElementId: 'sub-process_id_1_userTask_1',
        bpmnElementName: 'SubProcess User Task',
        bpmnElementKind: ShapeBpmnElementKind.TASK_USER,
        bounds: { x: 465, y: 335, width: 10, height: 10 },
      });

      verifyShape(model.flowNodes[3], {
        shapeId: 'shape_sub-process_id_1_exclusiveGateway_1',
        parentId: 'sub-process_id_1',
        bpmnElementId: 'sub-process_id_1_exclusiveGateway_1',
        bpmnElementName: 'SubProcess Exclusive Gateway',
        bpmnElementKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
        bounds: { x: 565, y: 335, width: 20, height: 20 },
      });

      const edges = model.edges;
      expect(edges).toHaveLength(2);
      verifyEdge(edges[0], {
        edgeId: 'edge_sub-process_id_1_sequenceFlow_1',
        bpmnElementId: 'sub-process_id_1_sequenceFlow_1',
        bpmnElementSourceRefId: 'sub-process_id_1_startEvent_1',
        bpmnElementTargetRefId: 'sub-process_id_1_userTask_1',
        waypoints: [{ x: 10, y: 10 }],
      });
    });

    if (expectedShapeBpmnSubProcessKind === ShapeBpmnSubProcessKind.EVENT) {
      it(`should convert error start event in '${expectedShapeBpmnSubProcessKind} sub-process'`, () => {
        const errorStartEventName = `${expectedShapeBpmnSubProcessKind} SubProcess Error Event`;
        const json = {
          definitions: {
            targetNamespace: '',
            process: {
              subProcess: {
                id: 'sub-process_id_1',
                collapsed: false,
                triggeredByEvent: triggeredByEvent,
                startEvent: {
                  id: 'sub-process_id_1_errorStartEvent_1',
                  name: errorStartEventName,
                  errorEventDefinition: 'errorEventDefinition_1',
                },
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_sub-process_id_1',
                    bpmnElement: 'sub-process_id_1',
                    Bounds: { x: 365, y: 235, width: 300, height: 200 },
                    isExpanded: true,
                  },
                  {
                    id: 'shape_sub-process_id_1_errorStartEvent_1',
                    bpmnElement: 'sub-process_id_1_errorStartEvent_1',
                    Bounds: { x: 465, y: 335, width: 10, height: 10 },
                  },
                ],
              },
            },
          },
        };

        const model = parseJson(json);
        expectNoEdgePoolLane(model);

        verifySubProcess(model, expectedShapeBpmnSubProcessKind, 1);

        const eventShapes = getEventShapes(model);
        expect(eventShapes).toHaveLength(1);
        const errorStartEvent = eventShapes[0];
        verifyEventShape(
          errorStartEvent,
          {
            shapeId: 'shape_sub-process_id_1_errorStartEvent_1',
            parentId: 'sub-process_id_1',
            bpmnElementId: 'sub-process_id_1_errorStartEvent_1',
            bpmnElementName: errorStartEventName,
            bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
            bounds: { x: 465, y: 335, width: 10, height: 10 },
          },
          ShapeBpmnEventDefinitionKind.ERROR,
        );
      });
    }
  });
});
