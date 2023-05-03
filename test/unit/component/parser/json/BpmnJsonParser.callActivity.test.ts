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

import type { BuildCallActivityParameter, BuildGatewayKind, BuildTaskKind, OtherBuildEventKind, BpmnGlobalTaskKind } from '../../../helpers/JsonBuilder';
import { buildDefinitions, EventDefinitionOn } from '../../../helpers/JsonBuilder';
import { parseJsonAndExpect, parseJsonAndExpectOnlyEdgesAndFlowNodes, parseJsonAndExpectOnlyFlowNodes } from '../../../helpers/JsonTestUtils';
import type { ExpectedShape } from '../../../helpers/bpmn-model-expect';
import { verifyEdge, verifyShape } from '../../../helpers/bpmn-model-expect';

import type { GlobalTaskKind } from '../../../../../src/model/bpmn/internal';
import { ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnMarkerKind } from '../../../../../src/model/bpmn/internal';
import type { BpmnJsonModel } from '../../../../../src/model/bpmn/json/BPMN20';
import type { TFlowNode } from '../../../../../src/model/bpmn/json/baseElement/flowElement';

describe('parse bpmn as json for callActivity', () => {
  describe('parse bpmn as json for callActivity calling process', () => {
    describe.each([
      ['expanded', true, []],
      ['collapsed', false, [ShapeBpmnMarkerKind.EXPAND]],
    ])('parse bpmn as json for %s callActivity calling process', (expandedKind: string, isExpanded: boolean, expectedBpmnElementMarkers: ShapeBpmnMarkerKind[]) => {
      const callActivityJson: BuildCallActivityParameter = {
        id: `call_activity_id_0`,
        name: `call activity name`,
        calledElement: 'process_1',
        isExpanded: isExpanded,
      };
      it.each([
        ['object', callActivityJson],
        ['array', [callActivityJson]],
      ])(
        `should convert as Shape, when a process contains a ${expandedKind} call activity calling another existing process`,
        (title, callActivity: BuildCallActivityParameter | BuildCallActivityParameter[]) => {
          const json: BpmnJsonModel = buildDefinitions({
            process: [
              {
                id: 'process 1',
                callActivity: callActivity,
              },
              { id: 'process_2_id' },
            ],
          });

          const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

          verifyShape(model.flowNodes[0], {
            shapeId: 'shape_call_activity_id_0',
            bpmnElementId: 'call_activity_id_0',
            bpmnElementName: 'call activity name',
            bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
            bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
            bpmnElementMarkers: expectedBpmnElementMarkers,
            bounds: { x: 346, y: 856, width: 45, height: 56 },
          });
        },
      );

      it(`should convert as Shape, when a process contains a ${expandedKind} call activity with name`, () => {
        const json = buildDefinitions({
          process: [
            { id: 'process_1' },
            {
              id: 'process_2',
              callActivity: { id: `call_activity_id_0`, name: 'call activity name', calledElement: 'process_1', isExpanded },
            },
          ],
        });

        const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_call_activity_id_0`,
          bpmnElementId: `call_activity_id_0`,
          bpmnElementName: 'call activity name',
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bpmnElementMarkers: expectedBpmnElementMarkers,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
        });
      });

      it(`should convert as Shape, when a process contains a ${expandedKind} call activity without name'`, () => {
        const json = buildDefinitions({
          process: [
            { id: 'process_1' },
            {
              id: 'process_2',
              callActivity: { id: `call_activity_id_1`, calledElement: 'process_1', isExpanded },
            },
          ],
        });

        const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_call_activity_id_1`,
          bpmnElementId: `call_activity_id_1`,
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bpmnElementMarkers: expectedBpmnElementMarkers,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
        });
      });

      it(`should convert as Shape, when a process contains a ${expandedKind} call activity calling a process without participant`, () => {
        const json: BpmnJsonModel = buildDefinitions({
          process: [
            { id: 'process_1' },
            {
              id: 'process_2',
              callActivity: {
                id: `call_activity_id_0`,
                calledElement: 'process_1',
                isExpanded,
              },
            },
          ],
        });

        const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: 'shape_call_activity_id_0',
          bpmnElementId: 'call_activity_id_0',
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bpmnElementMarkers: expectedBpmnElementMarkers,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
        });
      });

      it(`should convert as Shape, when a process contains a ${expandedKind} call activity calling a process with participant`, () => {
        const json: BpmnJsonModel = buildDefinitions({
          process: [
            { withParticipant: true, id: 'participant_1' },
            {
              id: 'process_2',
              callActivity: {
                id: `call_activity_id_0`,
                calledElement: 'process_participant_1',
                isExpanded,
              },
            },
          ],
        });

        const model = parseJsonAndExpect(json, 1, 0, 1, 0);

        expect(model.pools[0].bpmnElement.parentId).toBe('call_activity_id_0');
        verifyShape(model.flowNodes[0], {
          shapeId: 'shape_call_activity_id_0',
          bpmnElementId: 'call_activity_id_0',
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bpmnElementMarkers: expectedBpmnElementMarkers,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
        });
      });

      it(`should convert as Shape, when a process contains a ${expandedKind} call activity calling a process containing a lane`, () => {
        const json: BpmnJsonModel = buildDefinitions({
          process: [
            {
              id: 'process_1',
              lane: { id: 'lane' },
            },
            {
              id: 'process_2',
              callActivity: {
                id: `call_activity_id_0`,
                calledElement: 'process_1',
                isExpanded,
              },
            },
          ],
        });

        const model = parseJsonAndExpect(json, 0, 1, 1, 0);

        expect(model.lanes[0].bpmnElement.parentId).toBe('call_activity_id_0');
        verifyShape(model.flowNodes[0], {
          shapeId: 'shape_call_activity_id_0',
          bpmnElementId: 'call_activity_id_0',
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bpmnElementMarkers: expectedBpmnElementMarkers,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
        });
      });

      it.each([ShapeBpmnElementKind.EVENT_START, ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW])(
        `should convert as Shape, when a process contains a ${expandedKind} call activity calling a process with %s`,
        (expectedBpmnElementKind: ShapeBpmnElementKind) => {
          const json: BpmnJsonModel = buildDefinitions({
            process: [
              {
                id: 'process_1',
                event: {
                  id: `${expectedBpmnElementKind}_id`,
                  bpmnKind: expectedBpmnElementKind as OtherBuildEventKind | 'startEvent',
                  eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT },
                },
              },
              {
                id: 'process_2',
                callActivity: {
                  id: `call_activity_id_0`,
                  calledElement: 'process_1',
                  isExpanded,
                },
              },
            ],
          });

          const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

          expect(model.flowNodes[0].bpmnElement.parentId).toBe('call_activity_id_0');
          verifyShape(model.flowNodes[1], {
            shapeId: 'shape_call_activity_id_0',
            bpmnElementId: 'call_activity_id_0',
            bpmnElementName: undefined,
            bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
            bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
            bpmnElementMarkers: expectedBpmnElementMarkers,
            bounds: { x: 346, y: 856, width: 45, height: 56 },
          });
        },
      );

      it.each([
        ShapeBpmnElementKind.TASK,
        ShapeBpmnElementKind.TASK_BUSINESS_RULE,
        ShapeBpmnElementKind.TASK_MANUAL,
        ShapeBpmnElementKind.TASK_SCRIPT,
        ShapeBpmnElementKind.TASK_RECEIVE,
        ShapeBpmnElementKind.TASK_SEND,
        ShapeBpmnElementKind.TASK_SERVICE,
        ShapeBpmnElementKind.TASK_USER,
      ])(`should convert as Shape, when a process contains a ${expandedKind} call activity calling a process containing a %s`, (expectedBpmnElementKind: ShapeBpmnElementKind) => {
        const json: BpmnJsonModel = buildDefinitions({
          process: [
            {
              id: 'process_1',
              task: {
                id: `${expectedBpmnElementKind}_id`,
                bpmnKind: expectedBpmnElementKind as BuildTaskKind,
              },
            },
            {
              id: 'process_2',
              callActivity: {
                id: `call_activity_id_0`,
                calledElement: 'process_1',
                isExpanded,
              },
            },
          ],
        });

        const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

        expect(model.flowNodes[0].bpmnElement.parentId).toBe('call_activity_id_0');
        verifyShape(model.flowNodes[1], {
          shapeId: 'shape_call_activity_id_0',
          bpmnElementId: 'call_activity_id_0',
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bpmnElementMarkers: expectedBpmnElementMarkers,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
        });
      });

      it.each([ShapeBpmnElementKind.GATEWAY_EVENT_BASED, ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, ShapeBpmnElementKind.GATEWAY_INCLUSIVE, ShapeBpmnElementKind.GATEWAY_PARALLEL])(
        `should convert as Shape, when a process contains a ${expandedKind} call activity calling a process with %s`,
        (expectedBpmnElementKind: ShapeBpmnElementKind) => {
          const json: BpmnJsonModel = buildDefinitions({
            process: [
              {
                id: 'process_1',
                gateway: {
                  id: `${expectedBpmnElementKind}_id`,
                  bpmnKind: expectedBpmnElementKind as BuildGatewayKind,
                },
              },
              {
                id: 'process_2',
                callActivity: {
                  id: `call_activity_id_0`,
                  calledElement: 'process_1',
                  isExpanded,
                },
              },
            ],
          });

          const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

          expect(model.flowNodes[0].bpmnElement.parentId).toBe('call_activity_id_0');
          verifyShape(model.flowNodes[1], {
            shapeId: 'shape_call_activity_id_0',
            bpmnElementId: 'call_activity_id_0',
            bpmnElementName: undefined,
            bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
            bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
            bpmnElementMarkers: expectedBpmnElementMarkers,
            bounds: { x: 346, y: 856, width: 45, height: 56 },
          });
        },
      );

      it(`should convert as Shape, when a process contains a ${expandedKind} call activity calling a process containing a subprocess`, () => {
        const json: BpmnJsonModel = buildDefinitions({
          process: [
            {
              id: 'process_1',
              subProcess: { id: 'sub_process_id' },
            },
            {
              id: 'process_2',
              callActivity: {
                id: `call_activity_id_0`,
                calledElement: 'process_1',
                isExpanded,
              },
            },
          ],
        });

        const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

        expect(model.flowNodes[0].bpmnElement.parentId).toBe('call_activity_id_0');
        verifyShape(model.flowNodes[1], {
          shapeId: 'shape_call_activity_id_0',
          bpmnElementId: 'call_activity_id_0',
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bpmnElementMarkers: expectedBpmnElementMarkers,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
        });
      });

      it(`should convert as Shape, when a process contains a ${expandedKind} call activity calling a process containing a boundary event`, () => {
        const json: BpmnJsonModel = buildDefinitions({
          process: [
            {
              id: 'process_1',
              event: {
                bpmnKind: ShapeBpmnElementKind.EVENT_BOUNDARY,
                isInterrupting: true,
                attachedToRef: 'task_id_0',
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT },
              },
              task: { id: 'task_id_0' },
            },
            {
              id: 'process_2',
              callActivity: {
                id: `call_activity_id_0`,
                calledElement: 'process_1',
                isExpanded,
              },
            },
          ],
        });

        const model = parseJsonAndExpectOnlyFlowNodes(json, 3);

        expect(model.flowNodes[0].bpmnElement.parentId).toBe('call_activity_id_0');
        expect(model.flowNodes[1].bpmnElement.parentId).toBe('call_activity_id_0');
        verifyShape(model.flowNodes[2], {
          shapeId: 'shape_call_activity_id_0',
          bpmnElementId: 'call_activity_id_0',
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bpmnElementMarkers: expectedBpmnElementMarkers,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
        });
      });

      it(`should convert as Shape, when a process contains a ${expandedKind} call activity calling a process containing a sequence flow`, () => {
        const json = buildDefinitions({
          process: [
            { id: 'process_1', sequenceFlow: { id: 'flow_2_id', sourceRef: 'event_2_id', targetRef: 'task_2_id' } },
            {
              id: 'process_2',
              callActivity: {
                id: `call_activity_id_0`,
                calledElement: 'process_1',
                isExpanded,
              },
            },
          ],
        });

        const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: 'shape_call_activity_id_0',
          bpmnElementId: 'call_activity_id_0',
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bpmnElementMarkers: expectedBpmnElementMarkers,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
        });

        verifyEdge(model.edges[0], {
          edgeId: 'edge_flow_2_id',
          bpmnElementId: 'flow_2_id',
          bpmnElementSourceRefId: 'event_2_id',
          bpmnElementTargetRefId: 'task_2_id',
          waypoints: [
            { x: 45, y: 78 },
            { x: 51, y: 78 },
          ],
        });
      });

      it(`should convert as Shape, when a process contains a ${expandedKind} call activity calling a not existing process`, () => {
        const json: BpmnJsonModel = buildDefinitions({
          process: [
            {
              id: 'process_1',
              callActivity: {
                id: `call_activity_id_0`,
                calledElement: 'process_2',
                isExpanded,
              },
            },
          ],
        });

        const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: 'shape_call_activity_id_0',
          bpmnElementId: 'call_activity_id_0',
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bpmnElementMarkers: expectedBpmnElementMarkers,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
        });
      });

      describe(`incoming/outgoing management for ${expandedKind} call activity`, () => {
        it.each`
          title       | input         | expectedAttribute
          ${'string'} | ${'incoming'} | ${'bpmnElementIncomingIds'}
          ${'array'}  | ${'incoming'} | ${'bpmnElementIncomingIds'}
          ${'string'} | ${'outgoing'} | ${'bpmnElementOutgoingIds'}
          ${'array'}  | ${'outgoing'} | ${'bpmnElementOutgoingIds'}
        `(
          `should convert as Shape, when a process contains a ${expandedKind} call activity with $input attribute as $title`,
          ({ title, input, expectedAttribute }: { title: string; input: keyof TFlowNode; expectedAttribute: keyof ExpectedShape }) => {
            const json = buildDefinitions({
              process: [
                { id: 'process_1' },
                {
                  id: 'process_2',
                  callActivity: {
                    id: `call_activity_id_0`,
                    [input]: title === 'array' ? [`flow_${input}_1`, `flow_${input}_2`] : `flow_${input}_1`,
                    calledElement: 'process_1',
                    isExpanded,
                  },
                },
              ],
            });

            const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

            verifyShape(model.flowNodes[0], {
              shapeId: `shape_call_activity_id_0`,
              bpmnElementId: `call_activity_id_0`,
              bpmnElementName: undefined,
              bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
              bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
              bpmnElementMarkers: expectedBpmnElementMarkers,
              bounds: { x: 346, y: 856, width: 45, height: 56 },
              [expectedAttribute]: title === 'array' ? [`flow_${input}_1`, `flow_${input}_2`] : [`flow_${input}_1`],
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
          `should convert as Shape, when a process contains a ${expandedKind} call activity with $title $flowKind`,
          ({ title, flowKind, expectedAttribute }: { title: string; flowKind: keyof TFlowNode; expectedAttribute: keyof ExpectedShape }) => {
            const json = buildDefinitions({
              process: [
                { id: 'process_1' },
                {
                  id: 'process_2',
                  callActivity: { id: `call_activity_id_0`, calledElement: 'process_1', isExpanded },
                  [flowKind]: {
                    id: `flow_${title}`,
                    sourceRef: title === 'incoming' ? 'unknown' : 'call_activity_id_0',
                    targetRef: title === 'incoming' ? 'call_activity_id_0' : 'unknown',
                  },
                },
              ],
            });

            const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

            verifyShape(model.flowNodes[0], {
              shapeId: `shape_call_activity_id_0`,
              bpmnElementId: `call_activity_id_0`,
              bpmnElementName: undefined,
              bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
              bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
              bpmnElementMarkers: expectedBpmnElementMarkers,
              bounds: { x: 346, y: 856, width: 45, height: 56 },
              [expectedAttribute]: [`flow_${title}`],
            });
          },
        );

        it.each`
          title         | expectedAttribute
          ${'incoming'} | ${'bpmnElementIncomingIds'}
          ${'outgoing'} | ${'bpmnElementOutgoingIds'}
        `(
          `should convert as Shape, when a process contains a ${expandedKind} call activity with $title message flow`,
          ({ title, expectedAttribute }: { title: string; expectedAttribute: keyof ExpectedShape }) => {
            const json = buildDefinitions({
              process: [
                { id: 'process_1' },
                {
                  id: 'process_2',
                  callActivity: { id: `call_activity_id_0`, calledElement: 'process_1', isExpanded },
                },
              ],
              messageFlows: {
                id: `flow_${title}`,
                sourceRef: title === 'incoming' ? 'unknown' : 'call_activity_id_0',
                targetRef: title === 'incoming' ? 'call_activity_id_0' : 'unknown',
              },
            });
            json.definitions.globalTask = { id: 'task_id' };

            const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

            verifyShape(model.flowNodes[0], {
              shapeId: `shape_call_activity_id_0`,
              bpmnElementId: `call_activity_id_0`,
              bpmnElementName: undefined,
              bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
              bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
              bpmnElementMarkers: expectedBpmnElementMarkers,
              bounds: { x: 346, y: 856, width: 45, height: 56 },
              [expectedAttribute]: [`flow_${title}`],
            });
          },
        );

        it(`should convert as Shape, when a process contains a ${expandedKind} call activity with incoming/outgoing attributes and incoming/outgoing flows`, () => {
          const json = buildDefinitions({
            process: [
              { id: 'process_1' },
              {
                id: 'process_2',
                callActivity: { id: `call_activity_id_0`, incoming: 'flow_in_1', outgoing: ['flow_out_1', 'flow_out_2'], calledElement: 'process_1', isExpanded },
                sequenceFlow: [
                  { id: 'flow_in_1', sourceRef: 'unknown', targetRef: 'call_activity_id_0' },
                  { id: 'flow_out_2', sourceRef: 'call_activity_id_0', targetRef: 'unknown' },
                ],
                association: [{ id: 'flow_out_3', sourceRef: 'call_activity_id_0', targetRef: 'unknown' }],
              },
            ],
            messageFlows: { id: 'flow_in_2', sourceRef: 'unknown', targetRef: 'call_activity_id_0' },
          });

          const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 4, 1);

          verifyShape(model.flowNodes[0], {
            shapeId: `shape_call_activity_id_0`,
            bpmnElementId: `call_activity_id_0`,
            bpmnElementName: undefined,
            bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
            bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
            bpmnElementMarkers: expectedBpmnElementMarkers,
            bounds: { x: 346, y: 856, width: 45, height: 56 },
            bpmnElementIncomingIds: ['flow_in_1', 'flow_in_2'],
            bpmnElementOutgoingIds: ['flow_out_1', 'flow_out_2', 'flow_out_3'],
          });
        });
      });
    });
  });

  describe('parse bpmn as json for callActivity calling global task', () => {
    it.each(['globalTask', 'globalBusinessRuleTask', 'globalManualTask', 'globalScriptTask', 'globalUserTask'] as BpmnGlobalTaskKind[])(
      `should convert, when a call activity (calling %s) is an attribute of 'process'`,
      (bpmnKind: BpmnGlobalTaskKind) => {
        const json = buildDefinitions({
          process: {
            callActivity: { id: `call_activity_id_0`, name: 'call activity name', calledElement: 'task_id' },
          },
          globalTask: { id: 'task_id', bpmnKind },
        });

        const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_call_activity_id_0`,
          bpmnElementId: `call_activity_id_0`,
          bpmnElementName: `call activity name`,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_GLOBAL_TASK,
          bpmnElementGlobalTaskKind: bpmnKind as GlobalTaskKind,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
        });
      },
    );

    describe(`incoming/outgoing management for call activity calling global task`, () => {
      it.each`
        title       | input         | expectedAttribute
        ${'string'} | ${'incoming'} | ${'bpmnElementIncomingIds'}
        ${'array'}  | ${'incoming'} | ${'bpmnElementIncomingIds'}
        ${'string'} | ${'outgoing'} | ${'bpmnElementOutgoingIds'}
        ${'array'}  | ${'outgoing'} | ${'bpmnElementOutgoingIds'}
      `(
        `should convert as Shape, when a process contains a call activity with $input attribute as $title`,
        ({ title, input, expectedAttribute }: { title: string; input: keyof TFlowNode; expectedAttribute: keyof ExpectedShape }) => {
          const json = buildDefinitions({
            process: {
              callActivity: {
                id: `call_activity_id_0`,
                [input]: title === 'array' ? [`flow_${input}_1`, `flow_${input}_2`] : `flow_${input}_1`,
                calledElement: 'task_id',
              },
            },
            globalTask: { id: 'task_id' },
          });

          const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

          verifyShape(model.flowNodes[0], {
            shapeId: `shape_call_activity_id_0`,
            bpmnElementId: `call_activity_id_0`,
            bpmnElementName: undefined,
            bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
            bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_GLOBAL_TASK,
            bpmnElementGlobalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK,
            bounds: { x: 346, y: 856, width: 45, height: 56 },
            [expectedAttribute]: title === 'array' ? [`flow_${input}_1`, `flow_${input}_2`] : [`flow_${input}_1`],
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
        `should convert as Shape, when a process contains a call activity with $title $flowKind`,
        ({ title, flowKind, expectedAttribute }: { title: string; flowKind: keyof TFlowNode; expectedAttribute: keyof ExpectedShape }) => {
          const json = buildDefinitions({
            process: {
              callActivity: { id: `call_activity_id_0`, calledElement: 'task_id' },
              [flowKind]: {
                id: `flow_${title}`,
                sourceRef: title === 'incoming' ? 'unknown' : 'call_activity_id_0',
                targetRef: title === 'incoming' ? 'call_activity_id_0' : 'unknown',
              },
            },
            globalTask: { id: 'task_id' },
          });

          const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

          verifyShape(model.flowNodes[0], {
            shapeId: `shape_call_activity_id_0`,
            bpmnElementId: `call_activity_id_0`,
            bpmnElementName: undefined,
            bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
            bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_GLOBAL_TASK,
            bpmnElementGlobalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK,
            bounds: { x: 346, y: 856, width: 45, height: 56 },
            [expectedAttribute]: [`flow_${title}`],
          });
        },
      );

      it.each`
        title         | expectedAttribute
        ${'incoming'} | ${'bpmnElementIncomingIds'}
        ${'outgoing'} | ${'bpmnElementOutgoingIds'}
      `(
        `should convert as Shape, when a process contains a call activity with $title message flow`,
        ({ title, expectedAttribute }: { title: string; expectedAttribute: keyof ExpectedShape }) => {
          const json = buildDefinitions({
            process: {
              callActivity: { id: `call_activity_id_0`, calledElement: 'task_id' },
            },
            messageFlows: {
              id: `flow_${title}`,
              sourceRef: title === 'incoming' ? 'unknown' : 'call_activity_id_0',
              targetRef: title === 'incoming' ? 'call_activity_id_0' : 'unknown',
            },
            globalTask: { id: 'task_id' },
          });

          const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

          verifyShape(model.flowNodes[0], {
            shapeId: `shape_call_activity_id_0`,
            bpmnElementId: `call_activity_id_0`,
            bpmnElementName: undefined,
            bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
            bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_GLOBAL_TASK,
            bpmnElementGlobalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK,
            bounds: { x: 346, y: 856, width: 45, height: 56 },
            [expectedAttribute]: [`flow_${title}`],
          });
        },
      );

      it(`should convert as Shape, when a process contains a call activity with incoming/outgoing attributes and incoming/outgoing flows`, () => {
        const json = buildDefinitions({
          process: {
            callActivity: { id: `call_activity_id_0`, incoming: 'flow_in_1', outgoing: ['flow_out_1', 'flow_out_2'], calledElement: 'task_id' },
            sequenceFlow: [
              { id: 'flow_in_1', sourceRef: 'unknown', targetRef: 'call_activity_id_0' },
              { id: 'flow_out_2', sourceRef: 'call_activity_id_0', targetRef: 'unknown' },
            ],
            association: [{ id: 'flow_out_3', sourceRef: 'call_activity_id_0', targetRef: 'unknown' }],
          },
          messageFlows: { id: 'flow_in_2', sourceRef: 'unknown', targetRef: 'call_activity_id_0' },
          globalTask: { id: 'task_id' },
        });

        const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 4, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_call_activity_id_0`,
          bpmnElementId: `call_activity_id_0`,
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_GLOBAL_TASK,
          bpmnElementGlobalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK,
          bounds: { x: 346, y: 856, width: 45, height: 56 },
          bpmnElementIncomingIds: ['flow_in_1', 'flow_in_2'],
          bpmnElementOutgoingIds: ['flow_out_1', 'flow_out_2', 'flow_out_3'],
        });
      });
    });
  });
});
