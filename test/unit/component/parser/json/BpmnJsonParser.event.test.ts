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

import type { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import type { TEventDefinition } from '../../../../../src/model/bpmn/json/baseElement/rootElement/eventDefinition';
import type { TCatchEvent, TThrowEvent } from '../../../../../src/model/bpmn/json/baseElement/flowNode/event';
import type { BpmnJsonModel } from '../../../../../src/model/bpmn/json/BPMN20';
import type { BPMNShape } from '../../../../../src/model/bpmn/json/BPMNDI';
import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '../../../../../src/model/bpmn/internal';
import { BoundaryEventNotAttachedToActivityWarning, ShapeUnknownBpmnElementWarning } from '../../../../../src/component/parser/json/warnings';

import { expectAsWarning, parseJsonAndExpectEvent, parseJsonAndExpectOnlyFlowNodes, parsingMessageCollector } from '../../../helpers/JsonTestUtils';
import type { ExpectedBoundaryEventShape, ExpectedEventShape } from '../../../helpers/bpmn-model-expect';
import { verifyShape } from '../../../helpers/bpmn-model-expect';
import type { BuildEventDefinitionParameter, BuildEventParameter } from '../../../helpers/JsonBuilder';
import { buildDefinitions, EventDefinitionOn } from '../../../helpers/JsonBuilder';
import { getEventShapes } from '../../../helpers/TestUtils';

type OmitExpectedEventShape = Omit<ExpectedEventShape, 'shapeId' | 'bpmnElementId' | 'bounds'> | Omit<ExpectedBoundaryEventShape, 'shapeId' | 'bpmnElementId' | 'bounds'>;

function buildDefinitionsWithEventAndTask(event: BuildEventParameter | BuildEventParameter[], processIsArray = false): BpmnJsonModel {
  const process = {
    event,
    task: {},
  };
  return buildDefinitions({
    process: processIsArray ? [process] : process,
  });
}

function parseAndExpectNoEvents(json: BpmnJsonModel, numberOfExpectedFlowNodes = 1): void {
  const bpmnModel = parseJsonAndExpectOnlyFlowNodes(json, numberOfExpectedFlowNodes, 1);
  expect(getEventShapes(bpmnModel)).toHaveLength(0);
  const warning = expectAsWarning<ShapeUnknownBpmnElementWarning>(parsingMessageCollector.getWarnings()[0], ShapeUnknownBpmnElementWarning);
  expect(warning.bpmnElementId).toBe('event_id_0_0');
}

function parseAndExpectNoBoundaryEvents(json: BpmnJsonModel, numberOfExpectedFlowNodes = 1): void {
  const bpmnModel = parseJsonAndExpectOnlyFlowNodes(json, numberOfExpectedFlowNodes, 2);
  expect(getEventShapes(bpmnModel)).toHaveLength(0);
  const warnings = parsingMessageCollector.getWarnings();

  const warning0 = expectAsWarning<BoundaryEventNotAttachedToActivityWarning>(warnings[0], BoundaryEventNotAttachedToActivityWarning);
  expect(warning0.bpmnElementId).toBe('event_id_0_0');
  expect(warning0.attachedToRef).toEqual(numberOfExpectedFlowNodes == 0 ? 'unexisting_activity_id_0' : 'not_activity_id_0');
  expect(warning0.attachedToKind).toEqual(numberOfExpectedFlowNodes == 0 ? undefined : ShapeBpmnElementKind.GATEWAY_EXCLUSIVE);

  const warning1 = expectAsWarning<ShapeUnknownBpmnElementWarning>(warnings[1], ShapeUnknownBpmnElementWarning);
  expect(warning1.bpmnElementId).toBe('event_id_0_0');
}

function testMustConvertOneShape(buildEventParameter: BuildEventParameter, omitExpectedShape: OmitExpectedEventShape, processIsArray = false): void {
  const json = buildDefinitionsWithEventAndTask(buildEventParameter, processIsArray);

  const model = parseJsonAndExpectEvent(json, omitExpectedShape.eventDefinitionKind, 1);

  const shapes = getEventShapes(model);
  verifyShape(shapes[0], {
    ...omitExpectedShape,
    shapeId: `shape_event_id_0_0`,
    bpmnElementId: `event_id_0_0`,
    bounds: { x: 362, y: 232, width: 36, height: 45 },
  });
}

function executeEventCommonTests(buildEventParameter: BuildEventParameter, omitExpectedShape: OmitExpectedEventShape, titleSuffix = ''): void {
  it.each([['object'], ['array']])(`should convert as Shape, when 'process' (as %s) has '${buildEventParameter.bpmnKind}' (as object)${titleSuffix}`, (title: string) => {
    testMustConvertOneShape(buildEventParameter, omitExpectedShape, title === 'array');
  });

  it.each([['object'], ['array']])(`should convert as Shape, when 'process' (as %s) has '${buildEventParameter.bpmnKind}' (as array)${titleSuffix}`, (title: string) => {
    const json = buildDefinitionsWithEventAndTask([buildEventParameter, buildEventParameter], title === 'array');

    const model = parseJsonAndExpectEvent(json, omitExpectedShape.eventDefinitionKind, 2);

    const shapes = getEventShapes(model);
    verifyShape(shapes[0], {
      ...omitExpectedShape,
      shapeId: `shape_event_id_0_0`,
      bpmnElementId: 'event_id_0_0',
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
    verifyShape(shapes[1], {
      ...omitExpectedShape,
      shapeId: `shape_event_id_0_1`,
      bpmnElementId: 'event_id_0_1',
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it.each([
    ["'name'", 'event name'],
    ["no 'name'", undefined],
  ])(`should convert as Shape, when '${buildEventParameter.bpmnKind}' has %s${titleSuffix}`, (title: string, eventName: string) => {
    testMustConvertOneShape({ ...buildEventParameter, name: eventName }, { ...omitExpectedShape, bpmnElementName: eventName });
  });

  if (omitExpectedShape.eventDefinitionKind !== ShapeBpmnEventDefinitionKind.NONE) {
    it(`should NOT convert, when there are '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' and another 'EventDefinition' in the same element${titleSuffix}`, () => {
      const json = buildDefinitionsWithEventAndTask({
        ...buildEventParameter,
        eventDefinitionParameter: { ...buildEventParameter.eventDefinitionParameter, withDifferentDefinition: true },
      });

      parseAndExpectNoEvents(json);
    });

    it(`should NOT convert, when there are several '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' in the same element${titleSuffix}`, () => {
      const json = buildDefinitionsWithEventAndTask({
        ...buildEventParameter,
        eventDefinitionParameter: { ...buildEventParameter.eventDefinitionParameter, withMultipleDefinitions: true },
      });

      parseAndExpectNoEvents(json);
    });

    it(`should NOT convert, when 'definitions' has ${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition and '${buildEventParameter.bpmnKind}' has ${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition & eventDefinitionRef${titleSuffix}`, () => {
      const json = buildDefinitionsWithEventAndTask({
        ...buildEventParameter,
        eventDefinitionParameter: { ...buildEventParameter.eventDefinitionParameter, eventDefinitionOn: EventDefinitionOn.BOTH },
      });

      parseAndExpectNoEvents(json);
    });
  }
}

describe('parse bpmn as json for all events', () => {
  const eventDefinitionsParameters: [string, ShapeBpmnEventDefinitionKind][] = [
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

  describe.each([
    ['startEvent', ['message', 'timer', 'conditional', 'signal'], ShapeBpmnElementKind.EVENT_START],
    ['endEvent', ['message', 'error', 'escalation', 'cancel', 'compensate', 'signal', 'terminate'], ShapeBpmnElementKind.EVENT_END],
    ['intermediateCatchEvent', ['message', 'timer', 'conditional', 'link', 'signal'], ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
    ['intermediateThrowEvent', ['message', 'escalation', 'compensate', 'link', 'signal'], ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW],
  ])('for %ss', (bpmnKind: string, allDefinitionKinds: string[], expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
    describe.each(eventDefinitionsParameters)(`for %s ${bpmnKind}`, (eventDefinitionKind: string, expectedEventDefinitionKind: ShapeBpmnEventDefinitionKind) => {
      if (
        (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_START &&
          (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ERROR ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ESCALATION ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CANCEL ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.COMPENSATION ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.LINK ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TERMINATE)) ||
        (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH &&
          (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.NONE ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ERROR ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ESCALATION ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CANCEL ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.COMPENSATION ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TERMINATE)) ||
        (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW &&
          (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TIMER ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ERROR ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CANCEL ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CONDITIONAL ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TERMINATE)) ||
        (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_END &&
          (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TIMER ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CONDITIONAL ||
            expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.LINK))
      ) {
        // Not supported in BPMN specification
        return;
      }

      const titlesForEventDefinitionIsAttributeOf: [string, EventDefinitionOn][] = [
        [`'${bpmnKind}' has '${eventDefinitionKind}EventDefinition' & no 'eventDefinitionRef'`, EventDefinitionOn.EVENT],
        [
          `'definitions' has '${eventDefinitionKind}EventDefinition' and '${bpmnKind}' has no '${eventDefinitionKind}EventDefinition' & 'eventDefinitionRef'`,
          EventDefinitionOn.DEFINITIONS,
        ],
      ];
      describe.each(titlesForEventDefinitionIsAttributeOf)(`when %s`, (titleForEventDefinitionIsAttributeOf: string, eventDefinitionOn: EventDefinitionOn) => {
        executeEventCommonTests(
          { bpmnKind, eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn } },
          {
            parentId: '0',
            bpmnElementKind: expectedShapeBpmnElementKind,
            bpmnElementName: undefined,
            eventDefinitionKind: expectedEventDefinitionKind,
          },
          titleForEventDefinitionIsAttributeOf,
        );

        it.each([
          ['empty string', ''],
          ['object', { id: `${eventDefinitionKind}EventDefinition_1` }],
        ])(
          `should convert as Shape, when '${eventDefinitionKind}EventDefinition' is %s, ${titleForEventDefinitionIsAttributeOf}`,
          (title: string, eventDefinition: string | TEventDefinition) => {
            testMustConvertOneShape(
              {
                bpmnKind,
                eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn, eventDefinition },
              },
              {
                parentId: '0',
                bpmnElementKind: expectedShapeBpmnElementKind,
                bpmnElementName: undefined,
                eventDefinitionKind: expectedEventDefinitionKind,
              },
            );
          },
        );
      });
    });

    describe(`for none ${bpmnKind}`, () => {
      // Only for events that support the NONE event kind
      if (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH) {
        // Not supported in BPMN specification
        return;
      }

      executeEventCommonTests(
        { bpmnKind, eventDefinitionParameter: { eventDefinitionKind: 'none', eventDefinitionOn: EventDefinitionOn.NONE }, attachedToRef: '0' },
        {
          parentId: '0',
          bpmnElementKind: expectedShapeBpmnElementKind,
          bpmnElementName: undefined,
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
        },
        `'${bpmnKind}' has no 'eventDefinition' & no 'eventDefinitionRef'`,
      );

      it(`should convert as NONE Shape only the '${bpmnKind}' without 'eventDefinition' & without 'eventDefinitionRef', when an array of '${bpmnKind}' (without/with one or several event definition) is an attribute of 'process'`, () => {
        const json = {
          definitions: {
            targetNamespace: '',
            messageEventDefinition: { id: 'message_event_definition_id' },
            timerEventDefinition: { id: 'timer_event_definition_id' },
            process: {},
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: `shape_none_${bpmnKind}_id`,
                    bpmnElement: `none_${bpmnKind}_id`,
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: `shape_multiple_${bpmnKind}_id`,
                    bpmnElement: `multiple_${bpmnKind}_id`,
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        };
        (json.definitions.process as TProcess)[bpmnKind] = [
          { id: `none_${bpmnKind}_id`, name: `none ${bpmnKind}` },
          {
            id: `multiple_${bpmnKind}_with_event_definitions_id`,
            name: `multiple ${bpmnKind} with event definitions`,
            messageEventDefinition: {},
            timerEventDefinition: {},
          },
          {
            id: `multiple_${bpmnKind}_with_eventDefinitionRefs_id`,
            name: `multiple ${bpmnKind} with eventDefinitionRefs`,
            eventDefinitionRef: ['message_event_definition_id', 'timer_event_definition_id'],
          },
          {
            id: `multiple_${bpmnKind}_with_event_definition_and_eventDefinitionRef_id`,
            name: `multiple ${bpmnKind} with event definition and eventDefinitionRef`,
            messageEventDefinition: {},
            eventDefinitionRef: 'timer_event_definition_id',
          },
        ];

        allDefinitionKinds.forEach((definitionKind, index) => {
          const event: TCatchEvent | TThrowEvent = { id: `${definitionKind}_${bpmnKind}_id_${index}` };
          event[`${definitionKind}EventDefinition`] = {};
          (json.definitions.process as TProcess)[bpmnKind].push(event);

          const shape = {
            id: `shape_${definitionKind}_${bpmnKind}_id_${index}`,
            bpmnElement: `${definitionKind}_${bpmnKind}_id_${index}`,
            Bounds: { x: 362, y: 232, width: 36, height: 45 },
          };
          (json.definitions.BPMNDiagram.BPMNPlane.BPMNShape as BPMNShape[]).push(shape);
        });

        const model = parseJsonAndExpectEvent(json, ShapeBpmnEventDefinitionKind.NONE, 1);

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
    });
  });

  describe.each([['boundaryEvent', ShapeBpmnElementKind.EVENT_BOUNDARY]])('for %ss', (bpmnKind: string, expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
    describe.each(eventDefinitionsParameters)(`for %s ${bpmnKind}`, (eventDefinitionKind: string, expectedEventDefinitionKind: ShapeBpmnEventDefinitionKind) => {
      if (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.LINK || expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TERMINATE) {
        // Not supported in BPMN specification
        return;
      }

      describe.each([[true], [false]])(`for %s ${eventDefinitionKind} intermediate boundary events`, (isInterrupting: boolean) => {
        if (
          (!isInterrupting && expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ERROR) ||
          expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CANCEL ||
          expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.COMPENSATION
        ) {
          // Not supported in BPMN specification
          return;
        }

        const titlesForEventDefinitionIsAttributeOf: [string, EventDefinitionOn][] = [
          [`'${bpmnKind}' has '${eventDefinitionKind}EventDefinition' & no 'eventDefinitionRef'`, EventDefinitionOn.EVENT],
          [
            `'definitions' has '${eventDefinitionKind}EventDefinition' and '${bpmnKind}' has no '${eventDefinitionKind}EventDefinition' & 'eventDefinitionRef'`,
            EventDefinitionOn.DEFINITIONS,
          ],
        ];
        describe.each(titlesForEventDefinitionIsAttributeOf)(`when %s`, (titleForEventDefinitionIsAttributeOf: string, eventDefinitionOn: EventDefinitionOn) => {
          const buildEventParameter = {
            bpmnKind,
            eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn },
            isInterrupting,
            attachedToRef: 'task_id_0_0',
          };

          const isInterruptingTitle = isInterrupting ? 'interrupting' : 'non-interrupting';

          executeEventCommonTests(
            buildEventParameter,
            {
              parentId: 'task_id_0_0',
              bpmnElementKind: expectedShapeBpmnElementKind,
              bpmnElementName: undefined,
              eventDefinitionKind: expectedEventDefinitionKind,
              isInterrupting,
            },
            `, 'boundaryEvent' is ${isInterruptingTitle} & attached to an 'activity', (${titleForEventDefinitionIsAttributeOf})`,
          );

          if (isInterrupting) {
            it(`should convert as Shape, when 'boundaryEvent' has no 'cancelActivity' & is attached to an 'activity', ${titleForEventDefinitionIsAttributeOf}'`, () => {
              /*    const json = buildDefinitionsWithEventAndTask({ ...buildEventParameter, isInterrupting: undefined });

              const model = parseJsonAndExpectEvent(json, expectedEventDefinitionKind, 1);

              const shapes = getEventShapes(model);
              verifyShape(shapes[0], {
                shapeId: `shape_event_id_0_0`,
                bpmnElementId: 'event_id_0_0',
                parentId: 'task_id_0_0',
                bpmnElementKind: expectedShapeBpmnElementKind,
                bpmnElementName: undefined,
                eventDefinitionKind: expectedEventDefinitionKind,
                isInterrupting,
                bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
                isInterrupting: isInterrupting,
              });*/

              testMustConvertOneShape(
                { ...buildEventParameter, isInterrupting: undefined },
                {
                  parentId: 'task_id_0_0',
                  bpmnElementKind: expectedShapeBpmnElementKind,
                  bpmnElementName: undefined,
                  eventDefinitionKind: expectedEventDefinitionKind,
                  isInterrupting,
                },
              );
            });
          }

          it(`should NOT convert, when 'boundaryEvent' is ${isInterruptingTitle} & attached to anything than an 'activity', ${titleForEventDefinitionIsAttributeOf}`, () => {
            const json = buildDefinitions({
              process: {
                event: { ...buildEventParameter, attachedToRef: 'not_activity_id_0' },
                exclusiveGateway: {
                  id: 'not_activity_id_0',
                },
              },
            });

            parseAndExpectNoBoundaryEvents(json);
          });

          it(`should NOT convert, when 'boundaryEvent' is ${isInterruptingTitle} & attached to unexisting activity, ${titleForEventDefinitionIsAttributeOf}`, () => {
            const json = buildDefinitions({
              process: {
                event: { ...buildEventParameter, attachedToRef: 'unexisting_activity_id_0' },
              },
            });

            parseAndExpectNoBoundaryEvents(json, 0);
          });
        });
      });
    });
  });
});
