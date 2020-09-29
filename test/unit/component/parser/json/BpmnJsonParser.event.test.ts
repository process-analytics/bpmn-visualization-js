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
import { ShapeBaseElementType } from '../../../../../src/model/bpmn/internal/shape/ShapeBpmnElementType';
import { parseJsonAndExpectEvent, parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { BpmnEventType } from '../../../../../src/model/bpmn/internal/shape/ShapeBpmnEventType';
import { TProcess } from '../../../../../src/model/bpmn/json-xsd/baseElement/rootElement/rootElement';
import { TEventDefinition } from '../../../../../src/model/bpmn/json-xsd/baseElement/rootElement/eventDefinition';
import { TCatchEvent, TThrowEvent } from '../../../../../src/model/bpmn/json-xsd/baseElement/flowNode/event';
import { BPMNShape } from '../../../../../src/model/bpmn/json-xsd/BPMNDI';
import { ShapeBpmnBoundaryEvent } from '../../../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import InternalBPMNModel from '../../../../../src/model/bpmn/internal/BpmnModel';
import BPMNShapeUtil from '../../../../../src/model/bpmn/internal/shape/ShapeUtil';
import BPMNShape from '../../../../../src/model/bpmn/internal/shape/Shape';
import { addEvent, buildDefinitionsAndProcessWithTask, BuildEventDefinitionParameter, BuildEventParameter, EventDefinitionOn } from './JsonBuilder';

interface TestParameter {
  bpmnType: string;
  buildEventDefinitionParameter: BuildEventDefinitionParameter;
  buildEventParameter: BuildEventParameter;
  expectedShapeBpmnEventType: BpmnEventType;
  expectedShapeBpmnElementType: ShapeBaseElementType;
  process?: TProcess | TProcess[];
}

export function getEventShapes(model: InternalBPMNModel): BPMNShape[] {
  return model.flowNodes.filter(shape => BPMNShapeUtil.isEvent(shape.bpmnElement.type));
}

function verifyEventShape(
  shape: BPMNShape,
  buildEventParameter: BuildEventParameter,
  expectedShapeBpmnElementType: ShapeBaseElementType,
  expectedShapeId = `shape_event_id_0`,
  expectedBpmnElementId = 'event_id_0',
): void {
  verifyShape(shape, {
    shapeId: expectedShapeId,
    parentId: buildEventParameter.attachedToRef,
    bpmnElementId: expectedBpmnElementId,
    bpmnElementName: buildEventParameter.name,
    bpmnElementType: expectedShapeBpmnElementType,
    bounds: {
      x: 362,
      y: 232,
      width: 36,
      height: 45,
    },
  });

  if (expectedShapeBpmnElementType === ShapeBaseElementType.EVENT_BOUNDARY) {
    expect(shape.bpmnElement instanceof ShapeBpmnBoundaryEvent).toBeTruthy();
    expect((shape.bpmnElement as ShapeBpmnBoundaryEvent).isInterrupting).toEqual(buildEventParameter.isInterrupting);
  }
}

function testMustConvertOneShape({
  bpmnType,
  buildEventDefinitionParameter,
  buildEventParameter,
  expectedShapeBpmnEventType,
  expectedShapeBpmnElementType,
  process,
}: TestParameter): void {
  const json = buildDefinitionsAndProcessWithTask(process);
  addEvent(json, bpmnType, buildEventDefinitionParameter, buildEventParameter);

  const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventType, 1);

  const shapes = getEventShapes(model);
  verifyEventShape(shapes[0], buildEventParameter, expectedShapeBpmnElementType);
}

function executeEventCommonTests(
  bpmnType: string,
  eventDefinitionType: string,
  expectedShapeBpmnElementType: ShapeBaseElementType,
  expectedShapeBpmnEventType: BpmnEventType,
  boundaryEventType?: string,
  specificBuildEventParameter: BuildEventParameter = {},
  specificTitle = '',
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let titlesForEventDefinitionIsAttributeOf: any[][];
  if (expectedShapeBpmnEventType === BpmnEventType.NONE) {
    titlesForEventDefinitionIsAttributeOf = [[`'${bpmnType}' has no 'eventDefinition' & no 'eventDefinitionRef'`, EventDefinitionOn.NONE]];
  } else {
    titlesForEventDefinitionIsAttributeOf = [
      [`'${bpmnType}' has '${eventDefinitionType}EventDefinition' & no 'eventDefinitionRef'`, EventDefinitionOn.EVENT],
      [
        `'definitions' has '${eventDefinitionType}EventDefinition' and '${bpmnType}' has no '${eventDefinitionType}EventDefinition' & 'eventDefinitionRef'`,
        EventDefinitionOn.DEFINITIONS,
      ],
    ];
  }
  describe.each(titlesForEventDefinitionIsAttributeOf)(`when %s`, (titleForEventDefinitionIsAttributeOf: string, eventDefinitionOn: EventDefinitionOn) => {
    const buildEventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionType, eventDefinitionOn };
    const testParameter: TestParameter = {
      bpmnType,
      buildEventDefinitionParameter,
      buildEventParameter: specificBuildEventParameter,
      expectedShapeBpmnEventType,
      expectedShapeBpmnElementType,
    };
    it.each([
      ['object', {}],
      ['array', [{}]],
    ])(
      `should convert as Shape, when 'process' (as %s) has '${bpmnType}' (as object)${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
      (title: string, process: TProcess | TProcess[]) => {
        testMustConvertOneShape({ ...testParameter, process });
      },
    );

    it.each([
      ['object', {}],
      ['array', [{}]],
    ])(
      `should convert as Shape, when 'process' (as %s) has '${bpmnType}' (as array)${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
      (title: string, process: TProcess | TProcess[]) => {
        const json = buildDefinitionsAndProcessWithTask(process);
        addEvent(json, bpmnType, buildEventDefinitionParameter, specificBuildEventParameter);
        addEvent(json, bpmnType, buildEventDefinitionParameter, { ...specificBuildEventParameter, index: 1 });

        const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventType, 2);

        const shapes = getEventShapes(model);
        verifyEventShape(shapes[0], specificBuildEventParameter, expectedShapeBpmnElementType);
        verifyEventShape(shapes[1], { ...specificBuildEventParameter, index: 1 }, expectedShapeBpmnElementType, `shape_event_id_1`, 'event_id_1');
      },
    );

    it.each([
      ["'name'", 'event name'],
      ["no 'name'", undefined],
    ])(`should convert as Shape, when '${bpmnType}' has %s${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, (title: string, eventName: string) => {
      testMustConvertOneShape({ ...testParameter, buildEventParameter: { ...specificBuildEventParameter, name: eventName } });
    });

    if (expectedShapeBpmnEventType !== BpmnEventType.NONE) {
      it(`should NOT convert, when there are '${eventDefinitionType}EventDefinition' and another 'EventDefinition' in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, () => {
        const json = buildDefinitionsAndProcessWithTask({ eventDefinitionType });
        addEvent(json, bpmnType, { ...buildEventDefinitionParameter, withDifferentDefinition: true }, specificBuildEventParameter);

        const bpmnModel = parseJsonAndExpectOnlyFlowNodes(json, 1);
        expect(getEventShapes(bpmnModel)).toHaveLength(0);
      });

      it(`should NOT convert, when there are several '${eventDefinitionType}EventDefinition' in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, () => {
        const json = buildDefinitionsAndProcessWithTask();
        addEvent(json, bpmnType, { ...buildEventDefinitionParameter, withMultipleDefinitions: true }, specificBuildEventParameter);

        const bpmnModel = parseJsonAndExpectOnlyFlowNodes(json, 1);
        expect(getEventShapes(bpmnModel)).toHaveLength(0);
      });

      if (expectedShapeBpmnElementType !== ShapeBaseElementType.EVENT_BOUNDARY) {
        it.each([
          ['empty string', ''],
          ['object', { id: `${buildEventDefinitionParameter.eventDefinitionType}EventDefinition_1` }],
        ])(
          `should convert as Shape, when '${buildEventDefinitionParameter.eventDefinitionType}EventDefinition' is %s, ${titleForEventDefinitionIsAttributeOf}`,
          (title: string, eventDefinition: string | TEventDefinition) => {
            testMustConvertOneShape({ ...testParameter, buildEventDefinitionParameter: { ...buildEventDefinitionParameter, eventDefinition } });
          },
        );
      } else {
        if (specificBuildEventParameter.isInterrupting) {
          it(`should convert as Shape, when 'boundaryEvent' has no 'cancelActivity' & is attached to an 'activity', ${titleForEventDefinitionIsAttributeOf}'`, () => {
            const json = buildDefinitionsAndProcessWithTask();
            addEvent(json, 'boundaryEvent', buildEventDefinitionParameter, { ...specificBuildEventParameter, isInterrupting: undefined });

            const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventType, 1);

            const shapes = getEventShapes(model);
            verifyEventShape(shapes[0], specificBuildEventParameter, expectedShapeBpmnElementType);
          });
        }

        it(`should NOT convert, when 'boundaryEvent' is ${boundaryEventType} & attached to anything than an 'activity', ${titleForEventDefinitionIsAttributeOf}`, () => {
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

          const bpmnModel = parseJsonAndExpectOnlyFlowNodes(json, 1);
          expect(getEventShapes(bpmnModel)).toHaveLength(0);
        });

        it(`should NOT convert, when 'boundaryEvent' is ${boundaryEventType} & attached to unexisting activity, ${titleForEventDefinitionIsAttributeOf}`, () => {
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

          parseJsonAndExpectOnlyFlowNodes(json, 0);
        });
      }
    }

    if (expectedShapeBpmnEventType !== BpmnEventType.NONE) {
      it(`should NOT convert, when 'definitions' has ${eventDefinitionType}EventDefinition and '${bpmnType}' has ${eventDefinitionType}EventDefinition & eventDefinitionRef${specificTitle}`, () => {
        const json = buildDefinitionsAndProcessWithTask();
        addEvent(json, bpmnType, { eventDefinitionType, eventDefinitionOn: EventDefinitionOn.BOTH }, specificBuildEventParameter);

        const bpmnModel = parseJsonAndExpectOnlyFlowNodes(json, 1);
        expect(getEventShapes(bpmnModel)).toHaveLength(0);
      });
    }
  });
}

describe('parse bpmn as json for all events', () => {
  describe.each([
    ['startEvent', ['message', 'timer', 'conditional', 'signal'], ShapeBaseElementType.EVENT_START],
    ['endEvent', ['message', 'error', 'escalation', 'cancel', 'compensate', 'signal', 'terminate'], ShapeBaseElementType.EVENT_END],
    ['intermediateCatchEvent', ['message', 'timer', 'conditional', 'link', 'signal'], ShapeBaseElementType.EVENT_INTERMEDIATE_CATCH],
    ['intermediateThrowEvent', ['message', 'escalation', 'compensate', 'link', 'signal'], ShapeBaseElementType.EVENT_INTERMEDIATE_THROW],
    ['boundaryEvent', undefined, ShapeBaseElementType.EVENT_BOUNDARY],
  ])('for %ss', (bpmnType: string, allDefinitionTypes: string[], expectedShapeBpmnElementType: ShapeBaseElementType) => {
    describe.each([
      ['none', BpmnEventType.NONE],
      ['message', BpmnEventType.MESSAGE],
      ['timer', BpmnEventType.TIMER],
      ['terminate', BpmnEventType.TERMINATE],
      ['signal', BpmnEventType.SIGNAL],
      ['link', BpmnEventType.LINK],
      ['error', BpmnEventType.ERROR],
      ['compensate', BpmnEventType.COMPENSATION],

      // TODO To uncomment when an element is supported
      // ['cancel', ShapeBpmnEventType.CANCEL],
      // ['conditional', ShapeBpmnEventType.CONDITIONAL],
      // ['escalation', ShapeBpmnEventType.ESCALATION],
    ])(`for %s ${bpmnType}`, (eventDefinitionType: string, expectedShapeBpmnEventType: BpmnEventType) => {
      if (
        (expectedShapeBpmnElementType === ShapeBaseElementType.EVENT_START &&
          (expectedShapeBpmnEventType === BpmnEventType.ERROR ||
            expectedShapeBpmnEventType === BpmnEventType.ESCALATION ||
            expectedShapeBpmnEventType === BpmnEventType.CANCEL ||
            expectedShapeBpmnEventType === BpmnEventType.COMPENSATION ||
            expectedShapeBpmnEventType === BpmnEventType.LINK ||
            expectedShapeBpmnEventType === BpmnEventType.TERMINATE)) ||
        (expectedShapeBpmnElementType === ShapeBaseElementType.EVENT_INTERMEDIATE_CATCH &&
          (expectedShapeBpmnEventType === BpmnEventType.NONE ||
            expectedShapeBpmnEventType === BpmnEventType.ERROR ||
            expectedShapeBpmnEventType === BpmnEventType.ESCALATION ||
            expectedShapeBpmnEventType === BpmnEventType.CANCEL ||
            expectedShapeBpmnEventType === BpmnEventType.COMPENSATION ||
            expectedShapeBpmnEventType === BpmnEventType.TERMINATE)) ||
        (expectedShapeBpmnElementType === ShapeBaseElementType.EVENT_INTERMEDIATE_THROW &&
          (expectedShapeBpmnEventType === BpmnEventType.TIMER ||
            expectedShapeBpmnEventType === BpmnEventType.ERROR ||
            expectedShapeBpmnEventType === BpmnEventType.CANCEL ||
            expectedShapeBpmnEventType === BpmnEventType.CONDITIONAL ||
            expectedShapeBpmnEventType === BpmnEventType.TERMINATE)) ||
        (expectedShapeBpmnElementType === ShapeBaseElementType.EVENT_END &&
          (expectedShapeBpmnEventType === BpmnEventType.TIMER || expectedShapeBpmnEventType === BpmnEventType.CONDITIONAL || expectedShapeBpmnEventType === BpmnEventType.LINK))
      ) {
        // Not supported in BPMN specification
        return;
      }

      if (expectedShapeBpmnElementType !== ShapeBaseElementType.EVENT_BOUNDARY) {
        executeEventCommonTests(bpmnType, eventDefinitionType, expectedShapeBpmnElementType, expectedShapeBpmnEventType);
      } else {
        describe.each([
          ['interrupting', true],
          ['non-interrupting', false],
        ])(`for %s ${eventDefinitionType} intermediate boundary events`, (boundaryEventType: string, isInterrupting: boolean) => {
          if (
            (isInterrupting &&
              (expectedShapeBpmnEventType === BpmnEventType.NONE || expectedShapeBpmnEventType === BpmnEventType.LINK || expectedShapeBpmnEventType === BpmnEventType.TERMINATE)) ||
            (!isInterrupting &&
              (expectedShapeBpmnEventType === BpmnEventType.NONE ||
                expectedShapeBpmnEventType === BpmnEventType.ERROR ||
                expectedShapeBpmnEventType === BpmnEventType.CANCEL ||
                expectedShapeBpmnEventType === BpmnEventType.COMPENSATION ||
                expectedShapeBpmnEventType === BpmnEventType.LINK ||
                expectedShapeBpmnEventType === BpmnEventType.TERMINATE))
          ) {
            // Not supported in BPMN specification
            return;
          }
          executeEventCommonTests(
            bpmnType,
            eventDefinitionType,
            expectedShapeBpmnElementType,
            expectedShapeBpmnEventType,
            boundaryEventType,
            {
              isInterrupting,
              attachedToRef: 'task_id_0',
            },
            `, 'boundaryEvent' is ${boundaryEventType} & attached to an 'activity'`,
          );
        });
      }
    });

    //TODO We can delete it when all type of event definition are implemented
    if (expectedShapeBpmnElementType !== ShapeBaseElementType.EVENT_INTERMEDIATE_CATCH && expectedShapeBpmnElementType !== ShapeBaseElementType.EVENT_BOUNDARY) {
      it(`should convert as NONE Shape only the '${bpmnType}' without 'eventDefinition' & without 'eventDefinitionRef', when an array of '${bpmnType}' (without/with one or several event definition) is an attribute of 'process'`, () => {
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
                    id: `shape_none_${bpmnType}_id`,
                    bpmnElement: `none_${bpmnType}_id`,
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: `shape_multiple_${bpmnType}_id`,
                    bpmnElement: `multiple_${bpmnType}_id`,
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        };
        (json.definitions.process as TProcess)[bpmnType] = [
          { id: `none_${bpmnType}_id`, name: `none ${bpmnType}` },
          { id: `multiple_${bpmnType}_with_event_definitions_id`, name: `multiple ${bpmnType} with event definitions`, messageEventDefinition: {}, timerEventDefinition: {} },
          {
            id: `multiple_${bpmnType}_with_eventDefinitionRefs_id`,
            name: `multiple ${bpmnType} with eventDefinitionRefs`,
            eventDefinitionRef: ['message_event_definition_id', 'timer_event_definition_id'],
          },
          {
            id: `multiple_${bpmnType}_with_event_definition_and_eventDefinitionRef_id`,
            name: `multiple ${bpmnType} with event definition and eventDefinitionRef`,
            messageEventDefinition: {},
            eventDefinitionRef: 'timer_event_definition_id',
          },
        ];

        allDefinitionTypes.forEach((definitionType, index) => {
          const event: TCatchEvent | TThrowEvent = { id: `${definitionType}_${bpmnType}_id_${index}` };
          event[`${definitionType}EventDefinition`] = {};
          (json.definitions.process as TProcess)[bpmnType].push(event);

          const shape = {
            id: `shape_${definitionType}_${bpmnType}_id_${index}`,
            bpmnElement: `${definitionType}_${bpmnType}_id_${index}`,
            Bounds: { x: 362, y: 232, width: 36, height: 45 },
          };
          (json.definitions.BPMNDiagram.BPMNPlane.BPMNShape as BPMNShape[]).push(shape);
        });

        const model = parseJsonAndExpectEvent(json, BpmnEventType.NONE, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_none_${bpmnType}_id`,
          bpmnElementId: `none_${bpmnType}_id`,
          bpmnElementName: `none ${bpmnType}`,
          bpmnElementType: expectedShapeBpmnElementType,
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
