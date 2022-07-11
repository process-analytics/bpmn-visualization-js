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

import type { TEventDefinition } from '../../../../../src/model/bpmn/json/baseElement/rootElement/eventDefinition';
import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '../../../../../src/model/bpmn/internal';
import { BoundaryEventNotAttachedToActivityWarning, ShapeUnknownBpmnElementWarning } from '../../../../../src/component/parser/json/warnings';

import { expectAsWarning, parseJsonAndExpectEvent, parseJsonAndExpectOnlyFlowNodes, parsingMessageCollector } from '../../../helpers/JsonTestUtils';
import type { ExpectedBoundaryEventShape, ExpectedEventShape } from '../../../helpers/bpmn-model-expect';
import { verifyShape } from '../../../helpers/bpmn-model-expect';
import type { BuildDefinitionParameter, BuildEventParameter } from '../../../helpers/JsonBuilder';
import { buildDefinitions, EventDefinitionOn } from '../../../helpers/JsonBuilder';
import { getEventShapes } from '../../../helpers/TestUtils';

type OmitExpectedEventShape = Omit<ExpectedEventShape, 'shapeId' | 'bpmnElementId' | 'bounds'> | Omit<ExpectedBoundaryEventShape, 'shapeId' | 'bpmnElementId' | 'bounds'>;

function testMustConvertShapes(buildEventParameter: BuildEventParameter | BuildEventParameter[], omitExpectedShape: OmitExpectedEventShape, processIsArray = false): void {
  const process = { event: buildEventParameter, task: {} };
  const json = buildDefinitions({ process: processIsArray ? [process] : process });

  const model = parseJsonAndExpectEvent(json, omitExpectedShape.eventDefinitionKind, Array.isArray(buildEventParameter) ? buildEventParameter.length : 1);

  const shapes = getEventShapes(model);
  shapes.forEach((shape, index) => {
    const expectedShape: ExpectedEventShape = {
      ...omitExpectedShape,
      shapeId: `shape_event_id_0_${index}`,
      bpmnElementId: `event_id_0_${index}`,
      bounds: { x: 362, y: 232, width: 36, height: 45 },
    };
    verifyShape(shape, expectedShape);
  });
}

function testMustNotConvertEvent(buildEventParameter: BuildEventParameter): void {
  const json = buildDefinitions({ process: { event: buildEventParameter, task: {} } });

  const bpmnModel = parseJsonAndExpectOnlyFlowNodes(json, 1, 1);

  expect(getEventShapes(bpmnModel)).toHaveLength(0);

  const warning = expectAsWarning<ShapeUnknownBpmnElementWarning>(parsingMessageCollector.getWarnings()[0], ShapeUnknownBpmnElementWarning);
  expect(warning.bpmnElementId).toBe('event_id_0_0');
}

function testMustNotConvertBoundaryEvent(definitionParameter: BuildDefinitionParameter, numberOfExpectedFlowNodes = 1): void {
  const json = buildDefinitions(definitionParameter);

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

function executeEventCommonTests(buildEventParameter: BuildEventParameter, omitExpectedShape: OmitExpectedEventShape, titleSuffix = ''): void {
  it.each([
    ['object', 'object'],
    ['object', 'array'],
    ['array', 'object'],
    ['array', 'array'],
  ])(`should convert as Shape, when 'process' (as %s) has '${buildEventParameter.bpmnKind}' (as %s)${titleSuffix}`, (processParameterType: string, eventParameterType: string) => {
    testMustConvertShapes(eventParameterType === 'array' ? [buildEventParameter, buildEventParameter] : buildEventParameter, omitExpectedShape, processParameterType === 'array');
  });

  it.each([
    ["'name'", 'event name'],
    ["no 'name'", undefined],
  ])(`should convert as Shape, when '${buildEventParameter.bpmnKind}' has %s${titleSuffix}`, (title: string, eventName: string) => {
    testMustConvertShapes({ ...buildEventParameter, name: eventName }, { ...omitExpectedShape, bpmnElementName: eventName });
  });

  if (omitExpectedShape.eventDefinitionKind !== ShapeBpmnEventDefinitionKind.NONE) {
    it(`should NOT convert, when there are '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' and another 'EventDefinition' in the same element${titleSuffix}`, () => {
      testMustNotConvertEvent({
        ...buildEventParameter,
        eventDefinitionParameter: { ...buildEventParameter.eventDefinitionParameter, withDifferentDefinition: true },
      });
    });

    it(`should NOT convert, when there are several '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' in the same element${titleSuffix}`, () => {
      testMustNotConvertEvent({
        ...buildEventParameter,
        eventDefinitionParameter: { ...buildEventParameter.eventDefinitionParameter, withMultipleDefinitions: true },
      });
    });

    it(`should NOT convert, when 'definitions' has ${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition and '${buildEventParameter.bpmnKind}' has ${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition & eventDefinitionRef${titleSuffix}`, () => {
      testMustNotConvertEvent({
        ...buildEventParameter,
        eventDefinitionParameter: { ...buildEventParameter.eventDefinitionParameter, eventDefinitionOn: EventDefinitionOn.BOTH },
      });
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
            testMustConvertShapes(
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
        const json = buildDefinitions({
          process: {
            event: [
              {
                // id: `none_${bpmnKind}_id`,
                name: `none ${bpmnKind}`,
                bpmnKind: bpmnKind,
                eventDefinitionParameter: { eventDefinitionOn: EventDefinitionOn.NONE },
              },
              {
                bpmnKind: bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: 'message',
                  eventDefinitionOn: EventDefinitionOn.EVENT,
                  withDifferentDefinition: true,
                },
              },
              {
                bpmnKind: bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: 'message',
                  eventDefinitionOn: EventDefinitionOn.DEFINITIONS,
                  withDifferentDefinition: true,
                },
              },
              {
                bpmnKind: bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: 'message',
                  eventDefinitionOn: EventDefinitionOn.BOTH,
                  withDifferentDefinition: true,
                },
              },

              ...allDefinitionKinds.map(definitionKind => ({
                // id: `${definitionKind}_${bpmnKind}_id_${index}`
                bpmnKind: bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: definitionKind,
                  eventDefinitionOn: EventDefinitionOn.EVENT,
                },
              })),
            ],
          },
        });

        const model = parseJsonAndExpectEvent(json, ShapeBpmnEventDefinitionKind.NONE, 1);

        verifyShape(model.flowNodes[0], {
          // shapeId: `shape_none_${bpmnKind}_id`,
          //  bpmnElementId: `none_${bpmnKind}_id`,
          shapeId: `shape_event_id_0_0`,
          bpmnElementId: `event_id_0_0`,
          bpmnElementName: `none ${bpmnKind}`,
          bpmnElementKind: expectedShapeBpmnElementKind,
          parentId: '0',
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
          const buildEventParameter: BuildEventParameter = {
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
              testMustConvertShapes(
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
            testMustNotConvertBoundaryEvent({
              process: {
                event: { ...buildEventParameter, attachedToRef: 'not_activity_id_0' },
                exclusiveGateway: {
                  id: 'not_activity_id_0',
                },
              },
            });
          });

          it(`should NOT convert, when 'boundaryEvent' is ${isInterruptingTitle} & attached to unexisting activity, ${titleForEventDefinitionIsAttributeOf}`, () => {
            testMustNotConvertBoundaryEvent(
              {
                process: {
                  event: { ...buildEventParameter, attachedToRef: 'unexisting_activity_id_0' },
                },
              },
              0,
            );
          });
        });
      });
    });
  });
});
