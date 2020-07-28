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
import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { parseJsonAndExpectEvent, parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { ShapeBpmnEventKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnEventKind';
import { TProcess } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/rootElement/rootElement';
import { TEventDefinition } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/rootElement/eventDefinition';
import { TBoundaryEvent, TCatchEvent, TThrowEvent } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/flowNode/event';
import { BPMNDiagram, BPMNShape } from '../../../../../src/component/parser/xml/bpmn-json-model/BPMNDI';
import { BpmnJsonModel, TDefinitions } from '../../../../../src/component/parser/xml/bpmn-json-model/BPMN20';
import ShapeBpmnElement, { ShapeBpmnBoundaryEvent } from '../../../../../src/model/bpmn/shape/ShapeBpmnElement';
import BpmnModel from '../../../../../src/model/bpmn/BpmnModel';
import ShapeUtil from '../../../../../src/model/bpmn/shape/ShapeUtil';

type BPMNTEvent = TCatchEvent | TThrowEvent | TBoundaryEvent;
type BPMNEventDefinition = string | TEventDefinition | TEventDefinition[];

interface BuildEventParameter {
  index?: number;
  eventName?: string;
  isInterrupting?: boolean;
  attachedToRef?: string;
  eventDefinition?: BPMNEventDefinition;
  withDifferentDefinition?: boolean;
}

interface BuildDefinitionsParameter {
  eventDefinitionKind: string;
  eventDefinition?: BPMNEventDefinition;
  process?: TProcess | TProcess[];
}

function verifyBoundaryEvent(bpmnElement: ShapeBpmnElement, isInterrupting: boolean) {
  expect(bpmnElement instanceof ShapeBpmnBoundaryEvent).toBeTruthy();
  expect((bpmnElement as ShapeBpmnBoundaryEvent).isInterrupting).toEqual(isInterrupting);
}

function getEventShapes(model: BpmnModel) {
  return model.flowNodes.filter(shape => ShapeUtil.isEvent(shape.bpmnElement.kind));
}

function expectOneShape(
  model: BpmnModel,
  expectedParentId: string,
  eventName: string,
  expectedShapeBpmnElementKind: ShapeBpmnElementKind,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  specificVerify: (bpmnElement: ShapeBpmnElement) => void = () => {},
) {
  const shapes = getEventShapes(model);
  const shape = shapes[0];
  verifyShape(shape, {
    shapeId: `shape_id_0`,
    parentId: expectedParentId,
    bpmnElementId: 'event_id_0',
    bpmnElementName: eventName,
    bpmnElementKind: expectedShapeBpmnElementKind,
    bounds: {
      x: 362,
      y: 232,
      width: 36,
      height: 45,
    },
  });
  specificVerify(shape.bpmnElement);
}

function addTEventDefinition(bpmnElement: TDefinitions | BPMNTEvent, eventDefinitionKind: string, eventDefinition: BPMNEventDefinition = ''): TProcess | BPMNTEvent {
  if (eventDefinitionKind !== 'none') {
    bpmnElement[`${eventDefinitionKind}EventDefinition`] = eventDefinition;
  }
  return bpmnElement;
}

function addDifferentTEventDefinition(bpmnElement: TDefinitions | BPMNTEvent, eventDefinitionKind: string): TProcess | BPMNTEvent {
  const otherEventDefinition = eventDefinitionKind === 'signal' ? 'message' : 'signal';
  return addTEventDefinition(bpmnElement, otherEventDefinition, { id: 'other_event_definition' });
}

function buildTEvent({ index = 0, eventName }: BuildEventParameter = {}): BPMNTEvent {
  return {
    id: `event_id_${index}`,
    name: eventName,
  };
}

function buildTBoundaryEvent({ index, eventName, isInterrupting, attachedToRef = 'task_id_0' }: BuildEventParameter = {}): TBoundaryEvent {
  const event: TBoundaryEvent = buildTEvent({ index, eventName }) as TBoundaryEvent;
  event.attachedToRef = attachedToRef;
  event.cancelActivity = isInterrupting;
  return event;
}

function getFirstElementOfArray(object: any | any[]): any {
  if (Array.isArray(object)) {
    return object[0];
  } else {
    return object;
  }
}

function addShape(json: BpmnJsonModel, taskShape: BPMNShape) {
  const bpmnPlane = getFirstElementOfArray(json.definitions.BPMNDiagram).BPMNPlane;
  const bpmnShape = bpmnPlane.BPMNShape;
  if (bpmnShape) {
    if (!Array.isArray(bpmnShape)) {
      bpmnPlane.BPMNShape = [bpmnShape, taskShape];
    } else {
      bpmnShape.push(taskShape);
    }
  } else {
    bpmnPlane.BPMNShape = taskShape;
  }
}

function addTask(json: BpmnJsonModel) {
  const task = {
    id: 'task_id_0',
    name: 'task name',
  };
  getFirstElementOfArray(json.definitions.process).task = task;

  const taskShape = {
    id: 'shape_task_id_0',
    bpmnElement: 'task_id_0',
    Bounds: { x: 362, y: 232, width: 36, height: 45 },
  };
  addShape(json, taskShape);
}

function buildDefinitionsWithEventDefinitionAndProcessWithEventAndTask({
  eventDefinitionKind,
  eventDefinition = { id: 'event_definition_id' },
  process = {},
}: BuildDefinitionsParameter) {
  const json: BpmnJsonModel = {
    definitions: {
      targetNamespace: '',
      process: process,
      BPMNDiagram: {
        name: 'process 0',
        BPMNPlane: {
          BPMNShape: [
            {
              id: `shape_id_0`,
              bpmnElement: 'event_id_0',
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
          ],
        },
      },
    },
  };
  addTask(json);
  addTEventDefinition(json.definitions, eventDefinitionKind, eventDefinition);
  addDifferentTEventDefinition(json.definitions, eventDefinitionKind);
  return json;
}

function buildTEventWithEventDefinition(
  buildTEvent: (buildParameter?: BuildEventParameter) => BPMNTEvent,
  eventDefinitionKind: string,
  { index, eventName, isInterrupting, attachedToRef, eventDefinition, withDifferentDefinition = false }: BuildEventParameter = {},
) {
  const event = buildTEvent({ index, eventName, isInterrupting, attachedToRef });
  addTEventDefinition(event, eventDefinitionKind, eventDefinition);
  if (withDifferentDefinition) {
    addDifferentTEventDefinition(event, eventDefinitionKind);
  }
  return event;
}

function buildTEventWithEventDefinitionRef(
  buildTEvent: (buildParameter?: BuildEventParameter) => BPMNTEvent,
  { index, eventName, isInterrupting, attachedToRef, eventDefinition = { id: 'event_definition_id' }, withDifferentDefinition = false }: BuildEventParameter = {},
) {
  const event = buildTEvent({ index, eventName, isInterrupting, attachedToRef });
  if (withDifferentDefinition) {
    (event.eventDefinitionRef as string[]) = ['event_definition_id', 'other_event_definition'];
  } else {
    if (Array.isArray(eventDefinition)) {
      event.eventDefinitionRef = eventDefinition.map(eventDefinition => eventDefinition.id);
    } else {
      event.eventDefinitionRef = (eventDefinition as TEventDefinition).id;
    }
  }
  return event;
}

function executeEventCommonTests(
  bpmnKind: string,
  eventDefinitionKind: string,
  expectedShapeBpmnElementKind: ShapeBpmnElementKind,
  expectedShapeBpmnEventKind: ShapeBpmnEventKind,
  buildTEvent: (buildParameter?: BuildEventParameter) => BPMNTEvent,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  executeSpecificTests: (titleForEventDefinitionIsAttributeOf: string, buildTEventWithDefinition: (parameter: BuildEventParameter) => BPMNTEvent) => void = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  specificVerify: (bpmnElement: ShapeBpmnElement) => void = () => {},
  expectedParentId: string = undefined,
  specificTitle = '',
) {
  let titlesForEventDefinitionIsAttributeOf;
  if (expectedShapeBpmnEventKind === ShapeBpmnEventKind.NONE) {
    titlesForEventDefinitionIsAttributeOf = [
      [`'${bpmnKind}' has no 'eventDefinition' & no 'eventDefinitionRef'`, (buildParameter?: BuildEventParameter): BPMNTEvent => buildTEvent(buildParameter)],
    ];
  } else {
    titlesForEventDefinitionIsAttributeOf = [
      [
        `'${bpmnKind}' has '${eventDefinitionKind}EventDefinition' & no 'eventDefinitionRef'`,
        (buildParameter?: BuildEventParameter): BPMNTEvent => {
          return buildTEventWithEventDefinition(buildTEvent, eventDefinitionKind, buildParameter);
        },
      ],
      [
        `'definitions' has '${eventDefinitionKind}EventDefinition' and '${bpmnKind}' has no '${eventDefinitionKind}EventDefinition' & 'eventDefinitionRef'`,
        (buildParameter?: BuildEventParameter): BPMNTEvent => {
          return buildTEventWithEventDefinitionRef(buildTEvent, buildParameter);
        },
      ],
    ];
  }
  describe.each(titlesForEventDefinitionIsAttributeOf)(
    `when %s`,
    (titleForEventDefinitionIsAttributeOf: string, buildTEventWithEventDefinition: (parameter?: BuildEventParameter) => BPMNTEvent) => {
      const processAsObjectWithEventAsObject = {} as TProcess;
      processAsObjectWithEventAsObject[bpmnKind] = buildTEventWithEventDefinition();
      it.each([
        ['object', processAsObjectWithEventAsObject],
        ['array', [processAsObjectWithEventAsObject]],
      ])(
        `should convert as Shape, when 'process' (as %s) has '${bpmnKind}' (as object)${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
        (title: string, process: TProcess | TProcess[]) => {
          const json = buildDefinitionsWithEventDefinitionAndProcessWithEventAndTask({ eventDefinitionKind, process });

          const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

          expectOneShape(model, expectedParentId, undefined, expectedShapeBpmnElementKind, specificVerify);
        },
      );

      const processAsObjectWithEventAsArray = {} as TProcess;
      processAsObjectWithEventAsArray[bpmnKind] = [buildTEventWithEventDefinition(), buildTEventWithEventDefinition({ index: 1 })];
      it.each([
        ['object', processAsObjectWithEventAsArray],
        ['array', [processAsObjectWithEventAsArray]],
      ])(
        `should convert as Shape, when 'process' (as %s) has '${bpmnKind}' (as array)${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
        (title: string, process: TProcess | TProcess[]) => {
          const json = {
            definitions: {
              targetNamespace: '',
              process: process,
              BPMNDiagram: {
                name: 'process 0',
                BPMNPlane: {
                  BPMNShape: [
                    {
                      id: `shape_id_0`,
                      bpmnElement: 'event_id_0',
                      Bounds: { x: 362, y: 232, width: 36, height: 45 },
                    },
                    {
                      id: `shape_id_1`,
                      bpmnElement: 'event_id_1',
                      Bounds: { x: 365, y: 235, width: 35, height: 46 },
                    },
                  ],
                },
              },
            },
          };
          addTask(json);
          addTEventDefinition(json.definitions, eventDefinitionKind);
          addDifferentTEventDefinition(json.definitions, expectedShapeBpmnEventKind);

          const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 2);

          const shapes = getEventShapes(model);
          verifyShape(shapes[0], {
            shapeId: `shape_id_0`,
            parentId: expectedParentId,
            bpmnElementId: 'event_id_0',
            bpmnElementName: undefined,
            bpmnElementKind: expectedShapeBpmnElementKind,
            bounds: {
              x: 362,
              y: 232,
              width: 36,
              height: 45,
            },
          });
          specificVerify(shapes[0].bpmnElement);

          verifyShape(shapes[1], {
            shapeId: `shape_id_1`,
            parentId: expectedParentId,
            bpmnElementId: 'event_id_1',
            bpmnElementName: undefined,
            bpmnElementKind: expectedShapeBpmnElementKind,
            bounds: {
              x: 365,
              y: 235,
              width: 35,
              height: 46,
            },
          });
          specificVerify(shapes[1].bpmnElement);
        },
      );

      it.each([
        ["'name'", 'event name'],
        ["no 'name'", undefined],
      ])(`should convert as Shape, when '${bpmnKind}' has %s${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, (title: string, eventName: string) => {
        const json = buildDefinitionsWithEventDefinitionAndProcessWithEventAndTask({ eventDefinitionKind });
        (json.definitions.process as TProcess)[bpmnKind] = buildTEventWithEventDefinition({ eventName });

        const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

        expectOneShape(model, expectedParentId, eventName, expectedShapeBpmnElementKind, specificVerify);
      });

      if (expectedShapeBpmnEventKind !== ShapeBpmnEventKind.NONE) {
        it(`should NOT convert, when there are '${eventDefinitionKind}EventDefinition' and another 'EventDefinition' in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, () => {
          const json = buildDefinitionsWithEventDefinitionAndProcessWithEventAndTask({ eventDefinitionKind });
          (json.definitions.process as TProcess)[bpmnKind] = buildTEventWithEventDefinition({ withDifferentDefinition: true });

          parseJsonAndExpectOnlyFlowNodes(json, 1);
        });

        it(`should NOT convert, when there are several '${eventDefinitionKind}EventDefinition' in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, () => {
          const eventDefinition = [{}, {}];
          const json = buildDefinitionsWithEventDefinitionAndProcessWithEventAndTask({ eventDefinitionKind, eventDefinition });
          (json.definitions.process as TProcess)[bpmnKind] = buildTEventWithEventDefinition({ eventDefinition });

          parseJsonAndExpectOnlyFlowNodes(json, 1);
        });

        executeSpecificTests(titleForEventDefinitionIsAttributeOf, buildTEventWithEventDefinition);
      }
    },
  );

  it.skip(`should NOT convert, when 'definitions' has ${eventDefinitionKind}EventDefinition and '${bpmnKind}' has ${eventDefinitionKind}EventDefinition & eventDefinitionRef${specificTitle}`, () => {
    const json = buildDefinitionsWithEventDefinitionAndProcessWithEventAndTask({ eventDefinitionKind });
    // TODO Add eventDefinitionRef
    (json.definitions.process as TProcess)[bpmnKind] = buildTEvent();

    parseJsonAndExpectOnlyFlowNodes(json, 0);
  });
}

function executeNotBoundaryEventSpecificTests(
  titleForEventDefinitionIsAttributeOf: string,
  bpmnKind: string,
  eventDefinitionKind: string,
  buildTEventWithDefinition: (parameter?: BuildEventParameter) => BPMNTEvent,
  expectedShapeBpmnElementKind: ShapeBpmnElementKind,
  expectedShapeBpmnEventKind: ShapeBpmnEventKind,
) {
  it.each([
    ['empty string', ''],
    ['object', { id: `${eventDefinitionKind}EventDefinition_1` }],
  ])(
    `should convert as Shape, when '${eventDefinitionKind}EventDefinition' is %s, ${titleForEventDefinitionIsAttributeOf}`,
    (title: string, eventDefinition: string | TEventDefinition) => {
      const json = buildDefinitionsWithEventDefinitionAndProcessWithEventAndTask({ eventDefinitionKind });
      (json.definitions.process as TProcess)[bpmnKind] = buildTEventWithDefinition({ eventDefinition });

      const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

      expectOneShape(model, undefined, undefined, expectedShapeBpmnElementKind);
    },
  );
}

function executeBoundaryEventSpecificTests(
  titleForEventDefinitionIsAttributeOf: string,
  buildTBoundaryEventWithDefinition: (parameter?: BuildEventParameter) => BPMNTEvent,
  eventDefinitionKind: string,
  isInterrupting: boolean,
  expectedShapeBpmnEventKind: ShapeBpmnEventKind,
  boundaryEventKind: string,
) {
  if (isInterrupting) {
    it(`should convert as Shape, when 'boundaryEvent' has no 'cancelActivity' & is attached to an 'activity', ${titleForEventDefinitionIsAttributeOf}'`, () => {
      const json = buildDefinitionsWithEventDefinitionAndProcessWithEventAndTask({ eventDefinitionKind });
      (json.definitions.process as TProcess)['boundaryEvent'] = buildTBoundaryEventWithDefinition({ isInterrupting: undefined }) as TBoundaryEvent;

      const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

      expectOneShape(model, 'task_id_0', undefined, ShapeBpmnElementKind.EVENT_BOUNDARY, bpmnElement => verifyBoundaryEvent(bpmnElement, isInterrupting));
    });
  }

  it(`should NOT convert, when 'boundaryEvent' is ${boundaryEventKind} & attached to anything than an 'activity', ${titleForEventDefinitionIsAttributeOf}`, () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          startEvent: {
            id: 'not_task_id_0',
          },
        },
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'shape_task_id_0',
                bpmnElement: 'task_id_0',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
              {
                id: 'shape_boundaryEvent_id_0',
                bpmnElement: 'event_id_0',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
            ],
          },
        },
      },
    };
    addTEventDefinition(json.definitions, eventDefinitionKind);
    (json.definitions.process as TProcess)['boundaryEvent'] = buildTBoundaryEventWithDefinition({ attachedToRef: 'not_task_id_0' }) as TBoundaryEvent;

    parseJsonAndExpectEvent(json, undefined, 0);
  });
}

describe('parse bpmn as json for all events', () => {
  describe.each([
    ['startEvent', ['message', 'timer', 'conditional', 'signal'], ShapeBpmnElementKind.EVENT_START],
    ['endEvent', ['message', 'error', 'escalation', 'cancel', 'compensate', 'signal', 'terminate'], ShapeBpmnElementKind.EVENT_END],
    ['intermediateCatchEvent', ['message', 'timer', 'conditional', 'link', 'signal'], ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
    ['intermediateThrowEvent', ['message', 'escalation', 'compensate', 'link', 'signal'], ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW],
    ['boundaryEvent', ['message', 'timer', 'conditional', 'error', 'escalation', 'cancel', 'compensate', 'signal'], ShapeBpmnElementKind.EVENT_BOUNDARY],
  ])('for %ss', (bpmnKind: string, allDefinitionKinds: string[], expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
    describe.each([
      ['none', ShapeBpmnEventKind.NONE],
      ['message', ShapeBpmnEventKind.MESSAGE],
      ['timer', ShapeBpmnEventKind.TIMER],
      ['terminate', ShapeBpmnEventKind.TERMINATE],
      ['signal', ShapeBpmnEventKind.SIGNAL],

      // TODO To uncomment when an element is supported
      // ['cancel', ShapeBpmnEventKind.CANCEL],
      // ['compensate', ShapeBpmnEventKind.COMPENSATION],
      // ['conditional', ShapeBpmnEventKind.CONDITIONAL],
      // ['error', ShapeBpmnEventKind.ERROR],
      // ['escalation', ShapeBpmnEventKind.ESCALATION],
      // ['link', ShapeBpmnEventKind.LINK],
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
        executeEventCommonTests(
          bpmnKind,
          eventDefinitionKind,
          expectedShapeBpmnElementKind,
          expectedShapeBpmnEventKind,
          buildTEvent,
          (titleForEventDefinitionIsAttributeOf, buildTEventWithDefinition) =>
            executeNotBoundaryEventSpecificTests(
              titleForEventDefinitionIsAttributeOf,
              bpmnKind,
              eventDefinitionKind,
              buildTEventWithDefinition,
              expectedShapeBpmnElementKind,
              expectedShapeBpmnEventKind,
            ),
        );
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
            (buildParameter): TBoundaryEvent => buildTBoundaryEvent({ ...buildParameter, isInterrupting }),
            (titleForEventDefinitionIsAttributeOf, buildTEventWithDefinition) =>
              executeBoundaryEventSpecificTests(
                titleForEventDefinitionIsAttributeOf,
                buildTEventWithDefinition,
                eventDefinitionKind,
                isInterrupting,
                expectedShapeBpmnEventKind,
                boundaryEventKind,
              ),
            (bpmnElement: ShapeBpmnElement) => verifyBoundaryEvent(bpmnElement, isInterrupting),
            'task_id_0',
            `, 'boundaryEvent' is ${boundaryEventKind} & attached to an 'activity'`,
          );
        });
      }
    });

    //TODO We can delete it when all kind of event definition are implemented
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
