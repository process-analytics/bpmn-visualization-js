/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { bpmnSubProcessKinds } from '@test/shared/model/bpmn-semantic-utils';
import type { BuildProcessParameter } from '../../../helpers/JsonBuilder';
import { buildDefinitions } from '../../../helpers/JsonBuilder';
import {
  parseJson,
  parseJsonAndExpectOnlyEdgesAndFlowNodes,
  parseJsonAndExpectOnlyFlowNodes,
  parseJsonAndExpectOnlySubProcess,
  verifySubProcess,
} from '../../../helpers/JsonTestUtils';
import { getEventShapes } from '../../../helpers/TestUtils';
import type { ExpectedBounds, ExpectedShape } from '../../../helpers/bpmn-model-expect';
import { verifyEdge, verifyShape } from '../../../helpers/bpmn-model-expect';

import type { BpmnSubProcessKind } from '@lib/model/bpmn/internal';
import type BpmnModel from '@lib/model/bpmn/internal/BpmnModel';
import { Waypoint } from '@lib/model/bpmn/internal/edge/edge';
import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind, ShapeBpmnMarkerKind, ShapeBpmnSubProcessKind } from '@lib/model/bpmn/internal';
import type { ShapeBpmnEvent } from '@lib/model/bpmn/internal/shape/ShapeBpmnElement';
import type Shape from '@lib/model/bpmn/internal/shape/Shape';

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
  describe.each(bpmnSubProcessKinds)('BpmnSubProcessKind: %s', (bpmnSubProcessKind: BpmnSubProcessKind): void => {
    const expectedBounds: ExpectedBounds =
      bpmnSubProcessKind == ShapeBpmnElementKind.SUB_PROCESS ? { x: 67, y: 23, width: 456, height: 123 } : { x: 167, y: 123, width: 456, height: 123 };

    describe.each([
      [ShapeBpmnSubProcessKind.EMBEDDED, false],
      [ShapeBpmnSubProcessKind.EVENT, true],
    ])('ShapeBpmnSubProcessKind: %s', (shapeBpmnSubProcessKind: ShapeBpmnSubProcessKind, triggeredByEvent: boolean) => {
      describe.each([
        ['expanded', true, []],
        ['collapsed', false, [ShapeBpmnMarkerKind.EXPAND]],
      ])('Expansion kind: %s', (expandedKind: string, isExpanded: boolean, expectedBpmnElementMarkers: ShapeBpmnMarkerKind[]) => {
        const processWithSubProcessAsObject = {
          [bpmnSubProcessKind]: {
            id: 'sub_process_id_0',
            name: `sub-process name`,
            triggeredByEvent: triggeredByEvent,
            isExpanded,
          },
        } as BuildProcessParameter;

        it.each([
          ['object', processWithSubProcessAsObject],
          ['array', [processWithSubProcessAsObject]],
        ])(
          `should convert as Shape, when a ${expandedKind} ${shapeBpmnSubProcessKind} sub-process is an attribute (as object) of 'process' (as %s)`,
          (title: string, processParameter: BuildProcessParameter | BuildProcessParameter[]) => {
            const json = buildDefinitions({ process: processParameter });

            const model = parseJsonAndExpectOnlySubProcess(json, shapeBpmnSubProcessKind, 1);

            verifyShape(model.flowNodes[0], {
              shapeId: 'shape_sub_process_id_0',
              bpmnElementId: 'sub_process_id_0',
              bpmnElementName: 'sub-process name',
              bpmnElementKind: bpmnSubProcessKind,
              bpmnElementMarkers: expectedBpmnElementMarkers,
              bounds: expectedBounds,
            });
          },
        );

        describe(`incoming/outgoing management for ${expandedKind} ${shapeBpmnSubProcessKind} sub-process`, () => {
          it.each`
            title       | inputAttribute | expectedAttribute
            ${'string'} | ${'incoming'}  | ${'bpmnElementIncomingIds'}
            ${'array'}  | ${'incoming'}  | ${'bpmnElementIncomingIds'}
            ${'string'} | ${'outgoing'}  | ${'bpmnElementOutgoingIds'}
            ${'array'}  | ${'outgoing'}  | ${'bpmnElementOutgoingIds'}
          `(
            `should convert as Shape with $inputAttribute attribute calculated from ${expandedKind} ${shapeBpmnSubProcessKind} sub-process attribute as $title`,
            ({ title, inputAttribute, expectedAttribute }: { title: string; inputAttribute: 'incoming' | 'outgoing'; expectedAttribute: keyof ExpectedShape }) => {
              const json = buildDefinitions({
                process: {
                  [bpmnSubProcessKind]: {
                    id: 'sub_process_id_0',
                    triggeredByEvent: triggeredByEvent,
                    [inputAttribute]: title === 'array' ? [`flow_${inputAttribute}_1`, `flow_${inputAttribute}_2`] : `flow_${inputAttribute}_1`,
                    isExpanded,
                  },
                },
              });

              const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

              verifyShape(model.flowNodes[0], {
                shapeId: 'shape_sub_process_id_0',
                bpmnElementId: 'sub_process_id_0',
                bpmnElementName: undefined,
                bpmnElementKind: bpmnSubProcessKind,
                bpmnElementMarkers: expectedBpmnElementMarkers,
                bounds: expectedBounds,
                [expectedAttribute]: title === 'array' ? [`flow_${inputAttribute}_1`, `flow_${inputAttribute}_2`] : [`flow_${inputAttribute}_1`],
              });
            },
          );

          it.each`
            title         | flowKind          | expectedAttribute
            ${'incoming'} | ${'sequenceFlow'} | ${'bpmnElementIncomingIds'}
            ${'outgoing'} | ${'sequenceFlow'} | ${'bpmnElementOutgoingIds'}
            ${'incoming'} | ${'association'}  | ${'bpmnElementIncomingIds'}
            ${'outgoing'} | ${'association'}  | ${'bpmnElementOutgoingIds'}
          `(
            `should convert as Shape with $title attribute calculated from $flowKind`,
            ({ title, flowKind, expectedAttribute }: { title: string; flowKind: 'sequenceFlow' | 'association'; expectedAttribute: keyof ExpectedShape }) => {
              const json = buildDefinitions({
                process: {
                  [bpmnSubProcessKind]: { id: 'sub_process_id_0', triggeredByEvent: triggeredByEvent, isExpanded },
                  [flowKind]: {
                    id: `flow_${title}`,
                    sourceRef: title === 'incoming' ? 'unknown' : 'sub_process_id_0',
                    targetRef: title === 'incoming' ? 'sub_process_id_0' : 'unknown',
                  },
                },
              });

              const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

              verifyShape(model.flowNodes[0], {
                shapeId: 'shape_sub_process_id_0',
                bpmnElementId: 'sub_process_id_0',
                bpmnElementName: undefined,
                bpmnElementKind: bpmnSubProcessKind,
                bpmnElementMarkers: expectedBpmnElementMarkers,
                bounds: expectedBounds,
                [expectedAttribute]: [`flow_${title}`],
              });
            },
          );

          it.each`
            title         | expectedAttribute
            ${'incoming'} | ${'bpmnElementIncomingIds'}
            ${'outgoing'} | ${'bpmnElementOutgoingIds'}
          `(
            `should convert as Shape with $title attribute calculated from message flow`,
            ({ title, expectedAttribute }: { title: string; expectedAttribute: keyof ExpectedShape }) => {
              const json = buildDefinitions({
                process: {
                  [bpmnSubProcessKind]: { id: 'sub_process_id_0', triggeredByEvent: triggeredByEvent, isExpanded },
                },
                messageFlows: {
                  id: `flow_${title}`,
                  sourceRef: title === 'incoming' ? 'unknown' : 'sub_process_id_0',
                  targetRef: title === 'incoming' ? 'sub_process_id_0' : 'unknown',
                },
              });

              const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

              verifyShape(model.flowNodes[0], {
                shapeId: 'shape_sub_process_id_0',
                bpmnElementId: 'sub_process_id_0',
                bpmnElementName: undefined,
                bpmnElementKind: bpmnSubProcessKind,
                bpmnElementMarkers: expectedBpmnElementMarkers,
                bounds: expectedBounds,
                [expectedAttribute]: [`flow_${title}`],
              });
            },
          );

          it(`should convert as Shape with incoming/outgoing attributes calculated from ${expandedKind} ${shapeBpmnSubProcessKind} sub-process attributes and from flows`, () => {
            const json = buildDefinitions({
              process: {
                [bpmnSubProcessKind]: { id: 'sub_process_id_0', triggeredByEvent: triggeredByEvent, incoming: 'flow_in_1', outgoing: ['flow_out_1', 'flow_out_2'], isExpanded },
                sequenceFlow: [
                  { id: 'flow_in_1', sourceRef: 'unknown', targetRef: 'sub_process_id_0' },
                  { id: 'flow_out_2', sourceRef: 'sub_process_id_0', targetRef: 'unknown' },
                ],
                association: [{ id: 'flow_out_3', sourceRef: 'sub_process_id_0', targetRef: 'unknown' }],
              },
              messageFlows: { id: 'flow_in_2', sourceRef: 'unknown', targetRef: 'sub_process_id_0' },
            });

            const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 4, 1);

            verifyShape(model.flowNodes[0], {
              shapeId: 'shape_sub_process_id_0',
              bpmnElementId: 'sub_process_id_0',
              bpmnElementName: undefined,
              bpmnElementKind: bpmnSubProcessKind,
              bpmnElementMarkers: expectedBpmnElementMarkers,
              bounds: expectedBounds,
              bpmnElementIncomingIds: ['flow_in_1', 'flow_in_2'],
              bpmnElementOutgoingIds: ['flow_out_1', 'flow_out_2', 'flow_out_3'],
            });
          });
        });
      });

      it(`should convert as Shape, when a ${shapeBpmnSubProcessKind} sub-process (with/without name & isExpanded) is an attribute (as array) of 'process'`, () => {
        const json = buildDefinitions({
          process: {
            [bpmnSubProcessKind]: [
              {
                id: 'sub_process_id_0',
                name: 'sub-process name',
                triggeredByEvent: triggeredByEvent,
                isExpanded: false,
              },
              {
                id: 'sub_process_id_1',
                triggeredByEvent: triggeredByEvent,
              },
            ],
          },
        });

        const model = parseJsonAndExpectOnlySubProcess(json, shapeBpmnSubProcessKind, 2);

        verifyShape(model.flowNodes[0], {
          shapeId: 'shape_sub_process_id_0',
          bpmnElementId: 'sub_process_id_0',
          bpmnElementName: 'sub-process name',
          bpmnElementKind: bpmnSubProcessKind,
          bounds: expectedBounds,
          bpmnElementMarkers: [ShapeBpmnMarkerKind.EXPAND],
        });
        verifyShape(model.flowNodes[1], {
          shapeId: 'shape_sub_process_id_1',
          bpmnElementId: 'sub_process_id_1',
          bpmnElementName: undefined,
          bpmnElementKind: bpmnSubProcessKind,
          bounds: expectedBounds,
          bpmnElementMarkers: [ShapeBpmnMarkerKind.EXPAND],
        });
      });

      if (shapeBpmnSubProcessKind === ShapeBpmnSubProcessKind.EMBEDDED) {
        it(`should convert as Shape, when a embedded sub-process (with/without triggeredByEvent) is an attribute (as object) of 'process'`, () => {
          const json = buildDefinitions({
            process: {
              [bpmnSubProcessKind]: { id: 'sub_process_id_1' },
            },
          });

          const model = parseJsonAndExpectOnlySubProcess(json, shapeBpmnSubProcessKind, 1);

          verifyShape(model.flowNodes[0], {
            shapeId: 'shape_sub_process_id_1',
            bpmnElementId: 'sub_process_id_1',
            bpmnElementName: undefined,
            bpmnElementKind: bpmnSubProcessKind,
            bounds: expectedBounds,
            bpmnElementMarkers: [ShapeBpmnMarkerKind.EXPAND],
          });
        });
      }

      it(`should convert activities, events, gateways, textAnnotation, association and sequence-flows in sub-process`, () => {
        const json = {
          definitions: {
            targetNamespace: '',
            process: {
              [bpmnSubProcessKind]: {
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
                association: {
                  id: 'sub-process_id_association_id_0',
                  sourceRef: 'sub-process_id_1_startEvent_1',
                  targetRef: 'sub-process_id_1_textAnnotation_1',
                },
                textAnnotation: {
                  id: 'sub-process_id_1_textAnnotation_1',
                  text: 'SubProcess Text Annotation',
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
                  {
                    id: 'shape_sub-process_id_1_textAnnotation_1',
                    bpmnElement: 'sub-process_id_1_textAnnotation_1',
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
                  {
                    id: 'edge_sub-process_id_association_id_0',
                    bpmnElement: 'sub-process_id_association_id_0',
                    waypoint: [
                      { x: 45, y: 78 },
                      { x: 51, y: 78 },
                    ],
                  },
                ],
              },
            },
          },
        };

        const model = parseJson(json);
        expectNoPoolLane(model);

        verifySubProcess(model, shapeBpmnSubProcessKind, 1);
        verifyShape(model.flowNodes[0], {
          shapeId: 'shape_sub-process_id_1',
          bpmnElementId: 'sub-process_id_1',
          bpmnElementName: undefined,
          bpmnElementKind: bpmnSubProcessKind,
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
            bpmnElementOutgoingIds: ['sub-process_id_1_sequenceFlow_1', 'sub-process_id_association_id_0'],
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
            bpmnElementIncomingIds: ['sub-process_id_1_sequenceFlow_2'],
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
          bpmnElementIncomingIds: ['sub-process_id_1_sequenceFlow_1'],
        });

        verifyShape(model.flowNodes[3], {
          shapeId: 'shape_sub-process_id_1_exclusiveGateway_1',
          parentId: 'sub-process_id_1',
          bpmnElementId: 'sub-process_id_1_exclusiveGateway_1',
          bpmnElementName: 'SubProcess Exclusive Gateway',
          bpmnElementKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
          bounds: { x: 565, y: 335, width: 20, height: 20 },
          bpmnElementOutgoingIds: ['sub-process_id_1_sequenceFlow_2'],
        });

        verifyShape(model.flowNodes[5], {
          shapeId: 'shape_sub-process_id_1_textAnnotation_1',
          parentId: 'sub-process_id_1',
          bpmnElementId: 'sub-process_id_1_textAnnotation_1',
          bpmnElementName: 'SubProcess Text Annotation',
          bpmnElementKind: ShapeBpmnElementKind.TEXT_ANNOTATION,
          bounds: { x: 565, y: 335, width: 20, height: 20 },
          bpmnElementIncomingIds: ['sub-process_id_association_id_0'],
        });

        const edges = model.edges;
        expect(edges).toHaveLength(3);
        verifyEdge(edges[0], {
          edgeId: 'edge_sub-process_id_1_sequenceFlow_1',
          bpmnElementId: 'sub-process_id_1_sequenceFlow_1',
          bpmnElementSourceRefId: 'sub-process_id_1_startEvent_1',
          bpmnElementTargetRefId: 'sub-process_id_1_userTask_1',
          waypoints: [{ x: 10, y: 10 }],
        });

        verifyEdge(model.edges[2], {
          edgeId: 'edge_sub-process_id_association_id_0',
          bpmnElementId: 'sub-process_id_association_id_0',
          bpmnElementSourceRefId: 'sub-process_id_1_startEvent_1',
          bpmnElementTargetRefId: 'sub-process_id_1_textAnnotation_1',
          waypoints: [new Waypoint(45, 78), new Waypoint(51, 78)],
        });
      });

      if (shapeBpmnSubProcessKind === ShapeBpmnSubProcessKind.EVENT) {
        it(`should convert error start event in '${shapeBpmnSubProcessKind} sub-process'`, () => {
          const errorStartEventName = `${shapeBpmnSubProcessKind} SubProcess Error Event`;
          const json = {
            definitions: {
              targetNamespace: '',
              process: {
                [bpmnSubProcessKind]: {
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

          verifySubProcess(model, shapeBpmnSubProcessKind, 1);

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
});
