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
import { expectAsWarning, parseJsonAndExpectEvent, parseJsonAndExpectOnlyFlowNodes, parsingMessageCollector, verifyShape } from './JsonTestUtils';
import { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import { TEventDefinition } from '../../../../../src/model/bpmn/json/baseElement/rootElement/eventDefinition';
import { TCatchEvent, TThrowEvent } from '../../../../../src/model/bpmn/json/baseElement/flowNode/event';
import { BpmnJsonModel } from '../../../../../src/model/bpmn/json/BPMN20';
import { BPMNShape } from '../../../../../src/model/bpmn/json/BPMNDI';
import { ShapeBpmnElementKind, ShapeBpmnEventKind, ShapeUtil } from '../../../../../src/model/bpmn/internal';
import { ShapeBpmnBoundaryEvent } from '../../../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import BpmnModel from '../../../../../src/model/bpmn/internal/BpmnModel';
import Shape from '../../../../../src/model/bpmn/internal/shape/Shape';
import { addEvent, buildDefinitionsAndProcessWithTask, BuildEventDefinitionParameter, BuildEventParameter, EventDefinitionOn } from './JsonBuilder';
import { BoundaryEventNotAttachedToActivityWarning, ShapeUnknownBpmnElementWarning } from '../../../../../src/component/parser/json/warnings';

interface TestParameter {
  bpmnKind: string;
  buildEventDefinitionParameter: BuildEventDefinitionParameter;
  buildEventParameter: BuildEventParameter;
  expectedShapeBpmnEventKind: ShapeBpmnEventKind;
  expectedShapeBpmnElementKind: ShapeBpmnElementKind;
  process?: TProcess | TProcess[];
}

export function getEventShapes(model: BpmnModel): Shape[] {
  return model.flowNodes.filter(shape => ShapeUtil.isEvent(shape.bpmnElement.kind));
}

function verifyEventShape(
  shape: Shape,
  buildEventParameter: BuildEventParameter,
  expectedShapeBpmnElementKind: ShapeBpmnElementKind,
  expectedShapeId = `shape_event_id_0`,
  expectedBpmnElementId = 'event_id_0',
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

function testMustConvertOneShape({
  bpmnKind,
  buildEventDefinitionParameter,
  buildEventParameter,
  expectedShapeBpmnEventKind,
  expectedShapeBpmnElementKind,
  process,
}: TestParameter): void {
  const json = buildDefinitionsAndProcessWithTask(process);
  addEvent(json, bpmnKind, buildEventDefinitionParameter, buildEventParameter);

  const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

  const shapes = getEventShapes(model);
  verifyEventShape(shapes[0], buildEventParameter, expectedShapeBpmnElementKind);
}

function executeEventCommonTests(
  bpmnKind: string,
  eventDefinitionKind: string,
  expectedShapeBpmnElementKind: ShapeBpmnElementKind,
  expectedShapeBpmnEventKind: ShapeBpmnEventKind,
  boundaryEventKind?: string,
  specificBuildEventParameter: BuildEventParameter = {},
  specificTitle = '',
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let titlesForEventDefinitionIsAttributeOf: any[][];
  if (expectedShapeBpmnEventKind === ShapeBpmnEventKind.NONE) {
    titlesForEventDefinitionIsAttributeOf = [[`'${bpmnKind}' has no 'eventDefinition' & no 'eventDefinitionRef'`, EventDefinitionOn.NONE]];
  } else {
    titlesForEventDefinitionIsAttributeOf = [
      [`'${bpmnKind}' has '${eventDefinitionKind}EventDefinition' & no 'eventDefinitionRef'`, EventDefinitionOn.EVENT],
      [
        `'definitions' has '${eventDefinitionKind}EventDefinition' and '${bpmnKind}' has no '${eventDefinitionKind}EventDefinition' & 'eventDefinitionRef'`,
        EventDefinitionOn.DEFINITIONS,
      ],
    ];
  }
  describe.each(titlesForEventDefinitionIsAttributeOf)(`when %s`, (titleForEventDefinitionIsAttributeOf: string, eventDefinitionOn: EventDefinitionOn) => {
    const buildEventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind, eventDefinitionOn };
    const testParameter: TestParameter = {
      bpmnKind,
      buildEventDefinitionParameter,
      buildEventParameter: specificBuildEventParameter,
      expectedShapeBpmnEventKind,
      expectedShapeBpmnElementKind,
    };
    it.each([
      ['object', {}],
      ['array', [{}]],
    ])(
      `should convert as Shape, when 'process' (as %s) has '${bpmnKind}' (as object)${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
      (title: string, process: TProcess | TProcess[]) => {
        testMustConvertOneShape({ ...testParameter, process });
      },
    );

    it.each([
      ['object', {}],
      ['array', [{}]],
    ])(
      `should convert as Shape, when 'process' (as %s) has '${bpmnKind}' (as array)${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
      (title: string, process: TProcess | TProcess[]) => {
        const json = buildDefinitionsAndProcessWithTask(process);
        addEvent(json, bpmnKind, buildEventDefinitionParameter, specificBuildEventParameter);
        addEvent(json, bpmnKind, buildEventDefinitionParameter, { ...specificBuildEventParameter, index: 1 });

        const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 2);

        const shapes = getEventShapes(model);
        verifyEventShape(shapes[0], specificBuildEventParameter, expectedShapeBpmnElementKind);
        verifyEventShape(shapes[1], { ...specificBuildEventParameter, index: 1 }, expectedShapeBpmnElementKind, `shape_event_id_1`, 'event_id_1');
      },
    );

    function parseAndExpectNoEvents(json: BpmnJsonModel, numberOfExpectedFlowNodes = 1): void {
      const bpmnModel = parseJsonAndExpectOnlyFlowNodes(json, numberOfExpectedFlowNodes, 1);
      expect(getEventShapes(bpmnModel)).toHaveLength(0);
      const warning = expectAsWarning<ShapeUnknownBpmnElementWarning>(parsingMessageCollector.getWarnings()[0], ShapeUnknownBpmnElementWarning);
      expect(warning.bpmnElementId).toEqual('event_id_0');
    }

    function parseAndExpectNoBoundaryEvents(json: BpmnJsonModel, numberOfExpectedFlowNodes = 1): void {
      const bpmnModel = parseJsonAndExpectOnlyFlowNodes(json, numberOfExpectedFlowNodes, 2);
      expect(getEventShapes(bpmnModel)).toHaveLength(0);
      const warnings = parsingMessageCollector.getWarnings();

      const warning0 = expectAsWarning<BoundaryEventNotAttachedToActivityWarning>(warnings[0], BoundaryEventNotAttachedToActivityWarning);
      expect(warning0.bpmnElementId).toEqual('event_id_0');
      expect(warning0.attachedToRef).toEqual(numberOfExpectedFlowNodes == 0 ? 'unexisting_activity_id_0' : 'not_activity_id_0');
      expect(warning0.attachedToKind).toEqual(numberOfExpectedFlowNodes == 0 ? undefined : ShapeBpmnElementKind.GATEWAY_EXCLUSIVE);

      const warning1 = expectAsWarning<ShapeUnknownBpmnElementWarning>(warnings[1], ShapeUnknownBpmnElementWarning);
      expect(warning1.bpmnElementId).toEqual('event_id_0');
    }

    it.each([
      ["'name'", 'event name'],
      ["no 'name'", undefined],
    ])(`should convert as Shape, when '${bpmnKind}' has %s${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, (title: string, eventName: string) => {
      testMustConvertOneShape({ ...testParameter, buildEventParameter: { ...specificBuildEventParameter, name: eventName } });
    });

    if (expectedShapeBpmnEventKind !== ShapeBpmnEventKind.NONE) {
      it(`should NOT convert, when there are '${eventDefinitionKind}EventDefinition' and another 'EventDefinition' in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, () => {
        const json = buildDefinitionsAndProcessWithTask({ eventDefinitionKind });
        addEvent(json, bpmnKind, { ...buildEventDefinitionParameter, withDifferentDefinition: true }, specificBuildEventParameter);

        parseAndExpectNoEvents(json);
      });

      it(`should NOT convert, when there are several '${eventDefinitionKind}EventDefinition' in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, () => {
        const json = buildDefinitionsAndProcessWithTask();
        addEvent(json, bpmnKind, { ...buildEventDefinitionParameter, withMultipleDefinitions: true }, specificBuildEventParameter);

        parseAndExpectNoEvents(json);
      });

      if (expectedShapeBpmnElementKind !== ShapeBpmnElementKind.EVENT_BOUNDARY) {
        it.each([
          ['empty string', ''],
          ['object', { id: `${buildEventDefinitionParameter.eventDefinitionKind}EventDefinition_1` }],
        ])(
          `should convert as Shape, when '${buildEventDefinitionParameter.eventDefinitionKind}EventDefinition' is %s, ${titleForEventDefinitionIsAttributeOf}`,
          (title: string, eventDefinition: string | TEventDefinition) => {
            testMustConvertOneShape({ ...testParameter, buildEventDefinitionParameter: { ...buildEventDefinitionParameter, eventDefinition } });
          },
        );
      } else {
        if (specificBuildEventParameter.isInterrupting) {
          it(`should convert as Shape, when 'boundaryEvent' has no 'cancelActivity' & is attached to an 'activity', ${titleForEventDefinitionIsAttributeOf}'`, () => {
            const json = buildDefinitionsAndProcessWithTask();
            addEvent(json, 'boundaryEvent', buildEventDefinitionParameter, { ...specificBuildEventParameter, isInterrupting: undefined });

            const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

            const shapes = getEventShapes(model);
            verifyEventShape(shapes[0], specificBuildEventParameter, expectedShapeBpmnElementKind);
          });
        }

        it(`should NOT convert, when 'boundaryEvent' is ${boundaryEventKind} & attached to anything than an 'activity', ${titleForEventDefinitionIsAttributeOf}`, () => {
          const json = {
            definitions: {
              targetNamespace: '',
              process: {
                exclusiveGateway: {
                  id: 'not_activity_id_0',
                },
              },
              BPMNDiagram: {
                name: 'process 0',
                BPMNPlane: {
                  BPMNShape: [
                    {
                      id: 'shape_not_activity_id_0',
                      bpmnElement: 'not_activity_id_0',
                      Bounds: { x: 362, y: 232, width: 36, height: 45 },
                    },
                  ],
                },
              },
            },
          };
          addEvent(json, 'boundaryEvent', buildEventDefinitionParameter, { ...specificBuildEventParameter, attachedToRef: 'not_activity_id_0' });

          parseAndExpectNoBoundaryEvents(json);
        });

        it(`should NOT convert, when 'boundaryEvent' is ${boundaryEventKind} & attached to unexisting activity, ${titleForEventDefinitionIsAttributeOf}`, () => {
          const json = {
            definitions: {
              targetNamespace: '',
              process: {},
              BPMNDiagram: {
                name: 'process 0',
                BPMNPlane: {},
              },
            },
          };
          addEvent(json, 'boundaryEvent', buildEventDefinitionParameter, { ...specificBuildEventParameter, attachedToRef: 'unexisting_activity_id_0' });

          parseAndExpectNoBoundaryEvents(json, 0);
        });
      }
    }

    if (expectedShapeBpmnEventKind !== ShapeBpmnEventKind.NONE) {
      it(`should NOT convert, when 'definitions' has ${eventDefinitionKind}EventDefinition and '${bpmnKind}' has ${eventDefinitionKind}EventDefinition & eventDefinitionRef${specificTitle}`, () => {
        const json = buildDefinitionsAndProcessWithTask();
        addEvent(json, bpmnKind, { eventDefinitionKind, eventDefinitionOn: EventDefinitionOn.BOTH }, specificBuildEventParameter);

        parseAndExpectNoEvents(json);
      });
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
      ['none', ShapeBpmnEventKind.NONE],
      ['message', ShapeBpmnEventKind.MESSAGE],
      ['timer', ShapeBpmnEventKind.TIMER],
      ['terminate', ShapeBpmnEventKind.TERMINATE],
      ['signal', ShapeBpmnEventKind.SIGNAL],
      ['link', ShapeBpmnEventKind.LINK],
      ['error', ShapeBpmnEventKind.ERROR],
      ['compensate', ShapeBpmnEventKind.COMPENSATION],
      ['cancel', ShapeBpmnEventKind.CANCEL],
      ['conditional', ShapeBpmnEventKind.CONDITIONAL],
      ['escalation', ShapeBpmnEventKind.ESCALATION],
    ])(`for %s ${bpmnKind}`, (eventDefinitionKind: string, expectedShapeBpmnEventKind: ShapeBpmnEventKind) => {
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

      if (expectedShapeBpmnElementKind !== ShapeBpmnElementKind.EVENT_BOUNDARY) {
        executeEventCommonTests(bpmnKind, eventDefinitionKind, expectedShapeBpmnElementKind, expectedShapeBpmnEventKind);
      } else {
        describe.each([
          ['interrupting', true],
          ['non-interrupting', false],
        ])(`for %s ${eventDefinitionKind} intermediate boundary events`, (boundaryEventKind: string, isInterrupting: boolean) => {
          if (
            (isInterrupting &&
              (expectedShapeBpmnEventKind === ShapeBpmnEventKind.NONE ||
                expectedShapeBpmnEventKind === ShapeBpmnEventKind.LINK ||
                expectedShapeBpmnEventKind === ShapeBpmnEventKind.TERMINATE)) ||
            (!isInterrupting &&
              (expectedShapeBpmnEventKind === ShapeBpmnEventKind.NONE ||
                expectedShapeBpmnEventKind === ShapeBpmnEventKind.ERROR ||
                expectedShapeBpmnEventKind === ShapeBpmnEventKind.CANCEL ||
                expectedShapeBpmnEventKind === ShapeBpmnEventKind.COMPENSATION ||
                expectedShapeBpmnEventKind === ShapeBpmnEventKind.LINK ||
                expectedShapeBpmnEventKind === ShapeBpmnEventKind.TERMINATE))
          ) {
            // Not supported in BPMN specification
            return;
          }
          executeEventCommonTests(
            bpmnKind,
            eventDefinitionKind,
            expectedShapeBpmnElementKind,
            expectedShapeBpmnEventKind,
            boundaryEventKind,
            {
              isInterrupting,
              attachedToRef: 'task_id_0',
            },
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
          { id: `multiple_${bpmnKind}_with_event_definitions_id`, name: `multiple ${bpmnKind} with event definitions`, messageEventDefinition: {}, timerEventDefinition: {} },
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

        const model = parseJsonAndExpectEvent(json, ShapeBpmnEventKind.NONE, 1);

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
