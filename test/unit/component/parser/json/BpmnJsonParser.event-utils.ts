/*
Copyright 2023 Bonitasoft S.A.

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

import type { ExpectedBoundaryEventShape, ExpectedEventShape, ExpectedShape } from '../../../helpers/bpmn-model-expect';
import type { BuildEventsParameter } from '../../../helpers/JsonBuilder';

import { verifyShape } from '../../../helpers/bpmn-model-expect';
import { buildDefinitions, EventDefinitionOn } from '../../../helpers/JsonBuilder';
import {
  expectAsWarning,
  parseJsonAndExpectEvent,
  parseJsonAndExpectOnlyEdgesAndFlowNodes,
  parseJsonAndExpectOnlyFlowNodes,
  parsingMessageCollector,
} from '../../../helpers/JsonTestUtils';
import { getEventShapes } from '../../../helpers/TestUtils';

import { ShapeUnknownBpmnElementWarning } from '@lib/component/parser/json/warnings';
import { ShapeBpmnEventDefinitionKind } from '@lib/model/bpmn/internal';

/*
  eslint-disable jest/no-export
*/

export type OmitExpectedEventShape = Omit<ExpectedEventShape, 'shapeId' | 'bpmnElementId' | 'bounds'> | Omit<ExpectedBoundaryEventShape, 'shapeId' | 'bpmnElementId' | 'bounds'>;

export const expectedBounds = { x: 362, y: 232, width: 36, height: 45 };

export function testMustConvertShapes(buildEventParameter: BuildEventsParameter | BuildEventsParameter[], omitExpectedShape: OmitExpectedEventShape, processIsArray = false): void {
  const process = { event: buildEventParameter, task: {} };
  const json = buildDefinitions({ process: processIsArray ? [process] : process });

  const model = parseJsonAndExpectEvent(json, omitExpectedShape.eventDefinitionKind, Array.isArray(buildEventParameter) ? buildEventParameter.length : 1);

  const shapes = getEventShapes(model);
  for (const [index, shape] of shapes.entries()) {
    const expectedShape: ExpectedEventShape = {
      ...omitExpectedShape,
      shapeId: `shape_event_id_0_${index}`,
      bpmnElementId: `event_id_0_${index}`,
      bounds: expectedBounds,
    };
    verifyShape(shape, expectedShape);
  }
}

export function testMustNotConvertEvent(buildEventParameter: BuildEventsParameter): void {
  const json = buildDefinitions({ process: { event: buildEventParameter, task: {} } });

  const bpmnModel = parseJsonAndExpectOnlyFlowNodes(json, 1, 1);

  expect(getEventShapes(bpmnModel)).toHaveLength(0);

  const warning = expectAsWarning<ShapeUnknownBpmnElementWarning>(parsingMessageCollector.getWarnings()[0], ShapeUnknownBpmnElementWarning);
  expect(warning.bpmnElementId).toBe('event_id_0_0');
}

export function executeEventCommonTests(buildEventParameter: BuildEventsParameter, omitExpectedShape: OmitExpectedEventShape, titleSuffix: string): void {
  it.each([
    ['object', 'object'],
    ['object', 'array'],
    ['array', 'object'],
    ['array', 'array'],
  ])(
    `should convert as Shape, when 'process' (as %s) has '${buildEventParameter.bpmnKind}' (as %s), ${titleSuffix}`,
    (processParameterType: string, eventParameterType: string) => {
      testMustConvertShapes(eventParameterType === 'array' ? [buildEventParameter, buildEventParameter] : buildEventParameter, omitExpectedShape, processParameterType === 'array');
    },
  );

  it.each([
    ["'name'", 'event name'],
    ["no 'name'", undefined],
  ])(`should convert as Shape, when '${buildEventParameter.bpmnKind}' has %s, ${titleSuffix}`, (title: string, eventName: string) => {
    testMustConvertShapes({ ...buildEventParameter, name: eventName }, { ...omitExpectedShape, bpmnElementName: eventName });
  });

  describe(`incoming/outgoing management for ${buildEventParameter.bpmnKind}`, () => {
    it.each`
      title       | inputAttribute | expectedAttribute
      ${'string'} | ${'incoming'}  | ${'bpmnElementIncomingIds'}
      ${'array'}  | ${'incoming'}  | ${'bpmnElementIncomingIds'}
      ${'string'} | ${'outgoing'}  | ${'bpmnElementOutgoingIds'}
      ${'array'}  | ${'outgoing'}  | ${'bpmnElementOutgoingIds'}
    `(
      `should convert as Shape without $inputAttribute attribute calculated from ${buildEventParameter.bpmnKind} attribute as $title`,
      ({ title, inputAttribute, expectedAttribute }: { title: string; inputAttribute: 'incoming' | 'outgoing'; expectedAttribute: keyof ExpectedShape }) => {
        testMustConvertShapes(
          { ...buildEventParameter, [inputAttribute]: title === 'array' ? [`flow_${inputAttribute}_1`, `flow_${inputAttribute}_2`] : `flow_${inputAttribute}_1` },
          {
            ...omitExpectedShape,
            [expectedAttribute]: [], // nothing inferred from flows
          },
        );
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
            event: buildEventParameter,
            task: {},
            [flowKind]: {
              id: `flow_${title}`,
              sourceRef: title === 'incoming' ? 'unknown' : 'event_id_0_0',
              targetRef: title === 'incoming' ? 'event_id_0_0' : 'unknown',
            },
          },
        });

        const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 2);

        verifyShape(model.flowNodes[1], {
          ...omitExpectedShape,
          shapeId: `shape_event_id_0_0`,
          bpmnElementId: `event_id_0_0`,
          bounds: expectedBounds,
          [expectedAttribute]: [`flow_${title}`],
        });
      },
    );

    it.each`
      title         | expectedAttribute
      ${'incoming'} | ${'bpmnElementIncomingIds'}
      ${'outgoing'} | ${'bpmnElementOutgoingIds'}
    `(`should convert as Shape with $title attribute calculated from message flow`, ({ title, expectedAttribute }: { title: string; expectedAttribute: keyof ExpectedShape }) => {
      const json = buildDefinitions({
        process: {
          event: buildEventParameter,
          task: {},
        },
        messageFlows: {
          id: `flow_${title}`,
          sourceRef: title === 'incoming' ? 'unknown' : 'event_id_0_0',
          targetRef: title === 'incoming' ? 'event_id_0_0' : 'unknown',
        },
      });

      const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 2);

      verifyShape(model.flowNodes[1], {
        ...omitExpectedShape,
        shapeId: `shape_event_id_0_0`,
        bpmnElementId: `event_id_0_0`,
        bounds: expectedBounds,
        [expectedAttribute]: [`flow_${title}`],
      });
    });

    it(`should convert as Shape with incoming/outgoing attributes only calculated from flows`, () => {
      const json = buildDefinitions({
        process: {
          event: { ...buildEventParameter, incoming: 'flow_in_1', outgoing: ['flow_out_1', 'flow_out_2'] },
          task: {},
          sequenceFlow: [
            { id: 'flow_in_1', sourceRef: 'unknown', targetRef: 'event_id_0_0' },
            { id: 'flow_out_2', sourceRef: 'event_id_0_0', targetRef: 'unknown' },
          ],
          association: [{ id: 'flow_out_3', sourceRef: 'event_id_0_0', targetRef: 'unknown' }],
        },
        messageFlows: { id: 'flow_in_2', sourceRef: 'unknown', targetRef: 'event_id_0_0' },
      });

      const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 4, 2);

      verifyShape(model.flowNodes[1], {
        ...omitExpectedShape,
        shapeId: `shape_event_id_0_0`,
        bpmnElementId: `event_id_0_0`,
        bounds: expectedBounds,
        bpmnElementIncomingIds: ['flow_in_2', 'flow_in_1'],
        bpmnElementOutgoingIds: ['flow_out_2', 'flow_out_3'], // 'flow_out_1' is in 'outgoing' but is not inferred from the actual flows
      });
    });
  });

  if (omitExpectedShape.eventDefinitionKind !== ShapeBpmnEventDefinitionKind.NONE) {
    it(`should NOT convert, when there are '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' and another 'EventDefinition' in the same element, ${titleSuffix}`, () => {
      testMustNotConvertEvent({
        ...buildEventParameter,
        eventDefinitionParameter: { ...buildEventParameter.eventDefinitionParameter, withDifferentDefinition: true },
      });
    });

    it(`should NOT convert, when there are several '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' in the same element, ${titleSuffix}`, () => {
      testMustNotConvertEvent({
        ...buildEventParameter,
        eventDefinitionParameter: { ...buildEventParameter.eventDefinitionParameter, withMultipleDefinitions: true },
      });
    });

    it(`should NOT convert, when 'definitions' has ${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition and '${buildEventParameter.bpmnKind}' has ${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition & eventDefinitionRef, ${titleSuffix}`, () => {
      testMustNotConvertEvent({
        ...buildEventParameter,
        eventDefinitionParameter: { ...buildEventParameter.eventDefinitionParameter, eventDefinitionOn: EventDefinitionOn.BOTH },
      });
    });
  }
}

export const eventDefinitionsParameters: [string, ShapeBpmnEventDefinitionKind][] = [
  ['message', ShapeBpmnEventDefinitionKind.MESSAGE],
  ['timer', ShapeBpmnEventDefinitionKind.TIMER],
  ['terminate', ShapeBpmnEventDefinitionKind.TERMINATE],
  ['signal', ShapeBpmnEventDefinitionKind.SIGNAL],
  ['link', ShapeBpmnEventDefinitionKind.LINK],
  ['error', ShapeBpmnEventDefinitionKind.ERROR],
  ['compensate', ShapeBpmnEventDefinitionKind.COMPENSATION],
  ['cancel', ShapeBpmnEventDefinitionKind.CANCEL],
  ['conditional', ShapeBpmnEventDefinitionKind.CONDITIONAL],
  ['escalation', ShapeBpmnEventDefinitionKind.ESCALATION],
];

/*
  eslint-enable jest/no-export
*/
