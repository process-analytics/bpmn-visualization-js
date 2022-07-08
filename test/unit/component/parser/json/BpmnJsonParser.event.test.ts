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

interface TestParameter {
  buildEventParameter: BuildEventParameter;
  omitExpectedShape: OmitExpectedEventShape;
  processIsArray?: boolean;
}

function testMustConvertOneShape({ buildEventParameter, omitExpectedShape, processIsArray = false }: TestParameter): void {
  const process = {
    event: buildEventParameter,
    task: {},
  };
  const json = buildDefinitions({
    process: processIsArray ? [process] : process,
  });

  const model = parseJsonAndExpectEvent(json, omitExpectedShape.eventDefinitionKind, 1);

  const shapes = getEventShapes(model);
  verifyShape(shapes[0], {
    ...omitExpectedShape,
    shapeId: `shape_event_id_0_0`,
    bpmnElementId: `event_id_0_0`,
    bounds: { x: 362, y: 232, width: 36, height: 45 },
  });
}

function executeEventCommonTests(buildEventParameter: BuildEventParameter, omitExpectedShape: OmitExpectedEventShape, boundaryEventKind?: string, specificTitle = ''): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let titlesForEventDefinitionIsAttributeOf: any[][];
  if (omitExpectedShape.eventDefinitionKind === ShapeBpmnEventDefinitionKind.NONE) {
    titlesForEventDefinitionIsAttributeOf = [[`'${buildEventParameter.bpmnKind}' has no 'eventDefinition' & no 'eventDefinitionRef'`, EventDefinitionOn.NONE]];
  } else {
    titlesForEventDefinitionIsAttributeOf = [
      [
        `'${buildEventParameter.bpmnKind}' has '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' & no 'eventDefinitionRef'`,
        EventDefinitionOn.EVENT,
      ],
      [
        `'definitions' has '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' and '${buildEventParameter.bpmnKind}' has no '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' & 'eventDefinitionRef'`,
        EventDefinitionOn.DEFINITIONS,
      ],
    ];
  }
  describe.each(titlesForEventDefinitionIsAttributeOf)(`when %s`, (titleForEventDefinitionIsAttributeOf: string, eventDefinitionOn: EventDefinitionOn) => {
    const buildEventDefinitionParameter: BuildEventDefinitionParameter = {
      ...buildEventParameter.eventDefinitionParameter,
      eventDefinitionOn,
    };
    buildEventParameter.eventDefinitionParameter = buildEventDefinitionParameter;

    const testParameter: TestParameter = { buildEventParameter, omitExpectedShape };
    it.each([['object'], ['array']])(
      `should convert as Shape, when 'process' (as %s) has '${buildEventParameter.bpmnKind}' (as object)${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
      (title: string) => {
        testMustConvertOneShape({ ...testParameter, processIsArray: title === 'array' });
      },
    );

    it.each([['object'], ['array']])(
      `should convert as Shape, when 'process' (as %s) has '${buildEventParameter.bpmnKind}' (as array)${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
      (title: string) => {
        const process = {
          event: [buildEventParameter, buildEventParameter],
          task: {},
        };
        const json = buildDefinitions(title === 'object' ? { process } : { process: [process] });

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
      },
    );

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

    it.each([
      ["'name'", 'event name'],
      ["no 'name'", undefined],
    ])(`should convert as Shape, when '${buildEventParameter.bpmnKind}' has %s${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, (title: string, eventName: string) => {
      testMustConvertOneShape({
        ...testParameter,
        buildEventParameter: { ...buildEventParameter, name: eventName },
        omitExpectedShape: { ...omitExpectedShape, bpmnElementName: eventName },
      });
    });

    if (omitExpectedShape.eventDefinitionKind !== ShapeBpmnEventDefinitionKind.NONE) {
      it(`should NOT convert, when there are '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' and another 'EventDefinition' in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, () => {
        const json = buildDefinitions({
          process: {
            event: {
              ...buildEventParameter,
              eventDefinitionParameter: { ...buildEventDefinitionParameter, withDifferentDefinition: true },
            },
            task: {},
          },
        });

        parseAndExpectNoEvents(json);
      });

      it(`should NOT convert, when there are several '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, () => {
        const json = buildDefinitions({
          process: {
            event: [{ ...buildEventParameter, eventDefinitionParameter: { ...buildEventDefinitionParameter, withMultipleDefinitions: true } }],
            task: {},
          },
        });

        parseAndExpectNoEvents(json);
      });

      it(`should NOT convert, when 'definitions' has ${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition and '${buildEventParameter.bpmnKind}' has ${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition & eventDefinitionRef${specificTitle}`, () => {
        const json = buildDefinitions({
          process: {
            event: [{ ...buildEventParameter, eventDefinitionParameter: { ...buildEventDefinitionParameter, eventDefinitionOn: EventDefinitionOn.BOTH } }],
            task: {},
          },
        });

        parseAndExpectNoEvents(json);
      });

      if (omitExpectedShape.bpmnElementKind !== ShapeBpmnElementKind.EVENT_BOUNDARY) {
        it.each([
          ['empty string', ''],
          ['object', { id: `${buildEventDefinitionParameter.eventDefinitionKind}EventDefinition_1` }],
        ])(
          `should convert as Shape, when '${buildEventDefinitionParameter.eventDefinitionKind}EventDefinition' is %s, ${titleForEventDefinitionIsAttributeOf}`,
          (title: string, eventDefinition: string | TEventDefinition) => {
            testMustConvertOneShape({
              ...testParameter,
              buildEventParameter: { ...buildEventParameter, eventDefinitionParameter: { ...buildEventDefinitionParameter, eventDefinition } },
            });
          },
        );
      } else {
        if (buildEventParameter.isInterrupting) {
          it(`should convert as Shape, when 'boundaryEvent' has no 'cancelActivity' & is attached to an 'activity', ${titleForEventDefinitionIsAttributeOf}'`, () => {
            const json = buildDefinitions({
              process: {
                event: [
                  {
                    bpmnKind: 'boundaryEvent',
                    ...buildEventParameter,
                    isInterrupting: undefined,
                    eventDefinitionParameter: buildEventDefinitionParameter,
                  },
                ],
                task: {},
              },
            });

            const model = parseJsonAndExpectEvent(json, omitExpectedShape.eventDefinitionKind, 1);

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
          });
        }

        it(`should NOT convert, when 'boundaryEvent' is ${boundaryEventKind} & attached to anything than an 'activity', ${titleForEventDefinitionIsAttributeOf}`, () => {
          const json = buildDefinitions({
            process: {
              event: [
                {
                  bpmnKind: 'boundaryEvent',
                  ...buildEventParameter,
                  attachedToRef: 'not_activity_id_0',
                  eventDefinitionParameter: buildEventDefinitionParameter,
                },
              ],
              exclusiveGateway: {
                id: 'not_activity_id_0',
              },
            },
          });

          parseAndExpectNoBoundaryEvents(json);
        });

        it(`should NOT convert, when 'boundaryEvent' is ${boundaryEventKind} & attached to unexisting activity, ${titleForEventDefinitionIsAttributeOf}`, () => {
          const json = buildDefinitions({
            process: {
              event: [
                {
                  bpmnKind: 'boundaryEvent',
                  ...buildEventParameter,
                  attachedToRef: 'unexisting_activity_id_0',
                  eventDefinitionParameter: buildEventDefinitionParameter,
                },
              ],
            },
          });
          parseAndExpectNoBoundaryEvents(json, 0);
        });
      }
    }
  });
}

describe('parse bpmn as json for all events', () => {
  describe.each([
    ['startEvent', ['message', 'timer', 'conditional', 'signal'], ShapeBpmnElementKind.EVENT_START],
    ['endEvent', ['message', 'error', 'escalation', 'cancel', 'compensate', 'signal', 'terminate'], ShapeBpmnElementKind.EVENT_END],
    ['intermediateCatchEvent', ['message', 'timer', 'conditional', 'link', 'signal'], ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
    ['intermediateThrowEvent', ['message', 'escalation', 'compensate', 'link', 'signal'], ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW],
    ['boundaryEvent', undefined, ShapeBpmnElementKind.EVENT_BOUNDARY],
  ])('for %ss', (bpmnKind: string, allDefinitionKinds: string[], expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
    describe.each([
      ['none', ShapeBpmnEventDefinitionKind.NONE],
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
    ])(`for %s ${bpmnKind}`, (eventDefinitionKind: string, expectedEventDefinitionKind: ShapeBpmnEventDefinitionKind) => {
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

      if (expectedShapeBpmnElementKind !== ShapeBpmnElementKind.EVENT_BOUNDARY) {
        executeEventCommonTests(
          { bpmnKind, eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn: EventDefinitionOn.NONE } },
          {
            parentId: '0',
            bpmnElementKind: expectedShapeBpmnElementKind,
            bpmnElementName: undefined,
            eventDefinitionKind: expectedEventDefinitionKind,
          },
        );
      } else {
        describe.each([
          ['interrupting', true],
          ['non-interrupting', false],
        ])(`for %s ${eventDefinitionKind} intermediate boundary events`, (boundaryEventKind: string, isInterrupting: boolean) => {
          if (
            (isInterrupting &&
              (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.NONE ||
                expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.LINK ||
                expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TERMINATE)) ||
            (!isInterrupting &&
              (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.NONE ||
                expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ERROR ||
                expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CANCEL ||
                expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.COMPENSATION ||
                expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.LINK ||
                expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TERMINATE))
          ) {
            // Not supported in BPMN specification
            return;
          }
          executeEventCommonTests(
            { bpmnKind, eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn: EventDefinitionOn.NONE }, isInterrupting, attachedToRef: 'task_id_0_0' },
            {
              parentId: 'task_id_0_0',
              bpmnElementKind: expectedShapeBpmnElementKind,
              bpmnElementName: undefined,
              eventDefinitionKind: expectedEventDefinitionKind,
              isInterrupting,
            },
            boundaryEventKind,
            `, 'boundaryEvent' is ${boundaryEventKind} & attached to an 'activity'`,
          );
        });
      }
    });

    // Only for events that support the NONE event kind
    if (expectedShapeBpmnElementKind !== ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH && expectedShapeBpmnElementKind !== ShapeBpmnElementKind.EVENT_BOUNDARY) {
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
    }
  });
});
