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

import { BoundaryEventNotAttachedToActivityWarning, ShapeUnknownBpmnElementWarning } from '../../../../../src/component/parser/json/warnings';
import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '../../../../../src/model/bpmn/internal';
import type Shape from '../../../../../src/model/bpmn/internal/shape/Shape';
import { ShapeBpmnBoundaryEvent } from '../../../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import type { TCatchEvent, TThrowEvent } from '../../../../../src/model/bpmn/json/baseElement/flowNode/event';
import type { TEventDefinition } from '../../../../../src/model/bpmn/json/baseElement/rootElement/eventDefinition';
import type { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import type { BpmnJsonModel } from '../../../../../src/model/bpmn/json/BPMN20';
import type { BPMNShape } from '../../../../../src/model/bpmn/json/BPMNDI';
import { verifyShape } from '../../../helpers/bpmn-model-expect';
import type { BuildEventDefinitionParameter, BuildEventParameter } from '../../../helpers/JsonBuilder';
import { buildDefinitions, EventDefinitionOn } from '../../../helpers/JsonBuilder';

import { expectAsWarning, parseJsonAndExpectEvent, parseJsonAndExpectOnlyFlowNodes, parsingMessageCollector } from '../../../helpers/JsonTestUtils';
import { getEventShapes } from '../../../helpers/TestUtils';

interface TestParameter {
  buildEventParameter: BuildEventParameter;
  expectedEventDefinitionKind: ShapeBpmnEventDefinitionKind;
  expectedShapeBpmnElementKind: ShapeBpmnElementKind;
  processIsArray?: boolean;
}

function verifyEventShape(
  shape: Shape,
  buildEventParameter: BuildEventParameter,
  expectedShapeBpmnElementKind: ShapeBpmnElementKind,
  expectedShapeId = `shape_event_id_0_0`,
  expectedBpmnElementId = 'event_id_0_0',
): void {
  verifyShape(shape, {
    shapeId: expectedShapeId,
    parentId: buildEventParameter.attachedToRef,
    bpmnElementId: expectedBpmnElementId,
    bpmnElementName: buildEventParameter.name,
    bpmnElementKind: expectedShapeBpmnElementKind,
    bounds: {
      x: 362,
      y: 232,
      width: 36,
      height: 45,
    },
  });

  if (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_BOUNDARY) {
    expect(shape.bpmnElement instanceof ShapeBpmnBoundaryEvent).toBeTruthy();
    expect((shape.bpmnElement as ShapeBpmnBoundaryEvent).isInterrupting).toEqual(buildEventParameter.isInterrupting);
  }
}

function testMustConvertOneShape({ buildEventParameter, expectedEventDefinitionKind, expectedShapeBpmnElementKind, processIsArray = false }: TestParameter): void {
  const process = {
    event: buildEventParameter,
    task: { id: 'task_id_0_0' },
  };
  const json = buildDefinitions({
    process: processIsArray ? [process] : process,
  });

  const model = parseJsonAndExpectEvent(json, expectedEventDefinitionKind, 1);

  const shapes = getEventShapes(model);
  verifyEventShape(shapes[0], buildEventParameter, expectedShapeBpmnElementKind);
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

function executeEventCommonTests(
  buildEventParameter: BuildEventParameter,
  expectedShapeBpmnElementKind: ShapeBpmnElementKind,
  expectedEventDefinitionKind: ShapeBpmnEventDefinitionKind,
  titleSuffix = '',
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let titlesForEventDefinitionIsAttributeOf: any[][];
  if (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.NONE) {
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

    titleSuffix += `, (${titleForEventDefinitionIsAttributeOf})`;

    const testParameter: TestParameter = {
      buildEventParameter: buildEventParameter,
      expectedEventDefinitionKind: expectedEventDefinitionKind,
      expectedShapeBpmnElementKind,
    };
    it.each([['object'], ['array']])(`should convert as Shape, when 'process' (as %s) has '${buildEventParameter.bpmnKind}' (as object)${titleSuffix}`, (title: string) => {
      testMustConvertOneShape({ ...testParameter, processIsArray: title === 'array' });
    });

    it.each([['object'], ['array']])(`should convert as Shape, when 'process' (as %s) has '${buildEventParameter.bpmnKind}' (as array)${titleSuffix}`, (title: string) => {
      const process = {
        event: [buildEventParameter, buildEventParameter],
        task: { id: 'task_id_0_0' },
      };
      const json = buildDefinitions(title === 'object' ? { process } : { process: [process] });

      const model = parseJsonAndExpectEvent(json, expectedEventDefinitionKind, 2);

      const shapes = getEventShapes(model);
      verifyEventShape(shapes[0], buildEventParameter, expectedShapeBpmnElementKind);
      verifyEventShape(shapes[1], buildEventParameter, expectedShapeBpmnElementKind, `shape_event_id_0_1`, 'event_id_0_1');
    });

    it.each([
      ["'name'", 'event name'],
      ["no 'name'", undefined],
    ])(`should convert as Shape, when '${buildEventParameter.bpmnKind}' has %s${titleSuffix}`, (title: string, eventName: string) => {
      testMustConvertOneShape({ ...testParameter, buildEventParameter: { ...buildEventParameter, name: eventName } });
    });

    if (expectedEventDefinitionKind !== ShapeBpmnEventDefinitionKind.NONE) {
      it(`should NOT convert, when there are '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' and another 'EventDefinition' in the same element${titleSuffix}`, () => {
        const json = buildDefinitions({
          process: {
            event: {
              ...buildEventParameter,
              eventDefinitionParameter: { ...buildEventDefinitionParameter, withDifferentDefinition: true },
            },
            task: { id: 'task_id_0_0' },
          },
        });

        parseAndExpectNoEvents(json);
      });

      it(`should NOT convert, when there are several '${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition' in the same element${titleSuffix}`, () => {
        const json = buildDefinitions({
          process: {
            event: [{ ...buildEventParameter, eventDefinitionParameter: { ...buildEventDefinitionParameter, withMultipleDefinitions: true } }],
            task: { id: 'task_id_0_0' },
          },
        });

        parseAndExpectNoEvents(json);
      });

      it(`should NOT convert, when 'definitions' has ${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition and '${buildEventParameter.bpmnKind}' has ${buildEventParameter.eventDefinitionParameter.eventDefinitionKind}EventDefinition & eventDefinitionRef${titleSuffix}`, () => {
        const json = buildDefinitions({
          process: {
            event: [{ ...buildEventParameter, eventDefinitionParameter: { ...buildEventParameter.eventDefinitionParameter, eventDefinitionOn: EventDefinitionOn.BOTH } }],
            task: { id: 'task_id_0_0' },
          },
        });

        parseAndExpectNoEvents(json);
      });

      if (expectedShapeBpmnElementKind !== ShapeBpmnElementKind.EVENT_BOUNDARY) {
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
                task: { id: 'task_id_0_0' },
              },
            });

            const model = parseJsonAndExpectEvent(json, expectedEventDefinitionKind, 1);

            const shapes = getEventShapes(model);
            verifyEventShape(shapes[0], buildEventParameter, expectedShapeBpmnElementKind);
          });
        }

        it(`should NOT convert, when 'boundaryEvent' is ${
          buildEventParameter.isInterrupting ? 'interrupting' : 'non-interrupting'
        } & attached to anything than an 'activity', ${titleForEventDefinitionIsAttributeOf}`, () => {
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

        it(`should NOT convert, when 'boundaryEvent' is ${
          buildEventParameter.isInterrupting ? 'interrupting' : 'non-interrupting'
        } & attached to unexisting activity, ${titleForEventDefinitionIsAttributeOf}`, () => {
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

      executeEventCommonTests(
        { bpmnKind, eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn: EventDefinitionOn.NONE }, attachedToRef: '0' },
        expectedShapeBpmnElementKind,
        expectedEventDefinitionKind,
      );
    });

    describe(`for none ${bpmnKind}`, () => {
      // Only for events that support the NONE event kind
      if (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH) {
        // Not supported in BPMN specification
        return;
      }

      executeEventCommonTests(
        { bpmnKind, eventDefinitionParameter: { eventDefinitionKind: 'none', eventDefinitionOn: EventDefinitionOn.NONE }, attachedToRef: '0' },
        expectedShapeBpmnElementKind,
        ShapeBpmnEventDefinitionKind.NONE,
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

        executeEventCommonTests(
          { bpmnKind, eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn: EventDefinitionOn.NONE }, isInterrupting, attachedToRef: 'task_id_0_0' },
          expectedShapeBpmnElementKind,
          expectedEventDefinitionKind,
          `, 'boundaryEvent' is ${isInterrupting ? 'interrupting' : 'non-interrupting'} & attached to an 'activity'`,
        );
      });
    });
  });
});
