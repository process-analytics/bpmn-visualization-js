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
import { TBoundaryEvent, TCatchEvent, TEvent, TThrowEvent } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/flowNode/event';
import { BPMNShape } from '../../../../../src/component/parser/xml/bpmn-json-model/BPMNDI';
import { TDefinitions } from '../../../../../src/component/parser/xml/bpmn-json-model/BPMN20';
import ShapeBpmnElement, { ShapeBpmnBoundaryEvent } from '../../../../../src/model/bpmn/shape/ShapeBpmnElement';
import BpmnModel from '../../../../../src/model/bpmn/BpmnModel';
import ShapeUtil from '../../../../../src/model/bpmn/shape/ShapeUtil';

type BPMNTEvent = TCatchEvent | TThrowEvent | TBoundaryEvent;
type BPMNEventDefinition = string | TEventDefinition | TEventDefinition[];

interface BuildEventParameter {
  index?: number;
  eventName?: string;
  eventDefinition?: BPMNEventDefinition;
  eventDefinitionRef?: string | string[];
  isInterrupting?: boolean;
}

function verifyBoundaryEvent(bpmnElement: ShapeBpmnElement, isInterrupting: boolean) {
  expect(bpmnElement instanceof ShapeBpmnBoundaryEvent).toBeTruthy();
  expect((bpmnElement as ShapeBpmnBoundaryEvent).isInterrupting).toEqual(isInterrupting);
}

function addTEventDefinition(bpmnElement: TDefinitions | BPMNTEvent, eventDefinitionKind: string, eventDefinition: BPMNEventDefinition = ''): TProcess | BPMNTEvent {
  if (eventDefinitionKind !== 'none') {
    bpmnElement[`${eventDefinitionKind}EventDefinition`] = eventDefinition;
  }
  return bpmnElement;
}

function addDifferentEventDefinition(bpmnElement: TDefinitions | BPMNTEvent, expectedShapeBpmnEventKind: ShapeBpmnEventKind): TProcess | BPMNTEvent {
  const otherEventDefinition = expectedShapeBpmnEventKind === ShapeBpmnEventKind.SIGNAL ? 'message' : 'signal';
  return addTEventDefinition(bpmnElement, otherEventDefinition, '');
}

function buildTEvent(index = 0, eventName?: string): BPMNTEvent {
  return {
    id: `event_id_${index}`,
    name: eventName,
  };
}

function buildTBoundaryEvent(index = 0, eventName?: string, isInterrupting: boolean = undefined): TBoundaryEvent {
  const event: TBoundaryEvent = buildTEvent(index, eventName) as TBoundaryEvent;
  event.attachedToRef = 'task_id_0';
  event.cancelActivity = isInterrupting;
  return event;
}

function buildTDefinitionsWithEventDefinitionAndEventOnProcess(eventDefinitionKind: string, expectedShapeBpmnEventKind: ShapeBpmnEventKind, process: TProcess | TProcess[] = {}) {
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
              id: 'shape_task_id_0',
              bpmnElement: 'task_id_0',
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
          ],
        },
      },
    },
  };

  const task = {
    id: 'task_id_0',
    name: 'task name',
  };
  if (Array.isArray(process)) {
    process[0].task = task;
  } else {
    process.task = task;
  }

  addTEventDefinition(json.definitions, eventDefinitionKind);
  addDifferentEventDefinition(json.definitions, expectedShapeBpmnEventKind);
  return json;
}

function getEventShapes(model: BpmnModel) {
  return model.flowNodes.filter(shape => ShapeUtil.isEvent(shape.bpmnElement.kind));
}

function executeEventCommonTests(
  bpmnKind: string,
  eventDefinitionKind: string,
  expectedShapeBpmnEventKind:
    | ShapeBpmnEventKind
    | ShapeBpmnEventKind.TERMINATE
    | ShapeBpmnEventKind.CANCEL
    | ShapeBpmnEventKind.COMPENSATION
    | ShapeBpmnEventKind.CONDITIONAL
    | ShapeBpmnEventKind.ERROR
    | ShapeBpmnEventKind.ESCALATION
    | ShapeBpmnEventKind.LINK
    | ShapeBpmnEventKind.MESSAGE
    | ShapeBpmnEventKind.SIGNAL
    | ShapeBpmnEventKind.TIMER,
  expectedShapeBpmnElementKind: ShapeBpmnElementKind,
  buildTEvent: (index?: number, eventName?: string) => BPMNTEvent,
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
      [`'${bpmnKind}' has no 'eventDefinition' & no 'eventDefinitionRef'`, ({ index, eventName }: BuildEventParameter = {}): BPMNTEvent => buildTEvent(index, eventName)],
    ];
  } else {
    titlesForEventDefinitionIsAttributeOf = [
      [
        `'${bpmnKind}' has '${eventDefinitionKind}EventDefinition' & no 'eventDefinitionRef'`,
        ({ index, eventName, eventDefinition }: BuildEventParameter = {}): BPMNTEvent => {
          const event = buildTEvent(index, eventName);
          addTEventDefinition(event, eventDefinitionKind, eventDefinition);
          return event;
        },
      ],
      // [
      //   `'definitions' has '${eventDefinitionKind}EventDefinition' and '${bpmnKind}' has no '${eventDefinitionKind}EventDefinition' & 'eventDefinitionRef'`,
      //   ({ index, eventName, eventDefinitionRef}: BuildEventParameter = {}): BPMNTEvent => {
      //     const event = buildTEvent(index, eventName);
      //     event.eventDefinitionRef = eventDefinitionRef ? eventDefinitionRef : 'event_id_0';
      //     return event;
      //   },
      // ],
    ];
  }
  describe.each(titlesForEventDefinitionIsAttributeOf)(
    `when %s`,
    (titleForEventDefinitionIsAttributeOf: string, buildTEventWithDefinition: (parameter?: BuildEventParameter) => BPMNTEvent) => {
      const processAsObjectWithEventAsObject = {} as TProcess;
      processAsObjectWithEventAsObject[bpmnKind] = buildTEventWithDefinition();
      it.each([
        ['object', processAsObjectWithEventAsObject],
        ['array', [processAsObjectWithEventAsObject]],
      ])(
        `should convert as Shape, when 'process' (as %s) has '${bpmnKind}' (as object)${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
        (title: string, processJson: TProcess | TProcess[]) => {
          const json = buildTDefinitionsWithEventDefinitionAndEventOnProcess(eventDefinitionKind, expectedShapeBpmnEventKind, processJson);

          const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

          const shape = getEventShapes(model)[0];
          verifyShape(shape, {
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
          specificVerify(shape.bpmnElement);
        },
      );

      const processAsObjectWithEventAsArray = {} as TProcess;
      processAsObjectWithEventAsArray[bpmnKind] = [buildTEventWithDefinition(), buildTEventWithDefinition({ index: 1 })];
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
                    {
                      id: 'shape_task_id_0',
                      bpmnElement: 'task_id_0',
                      Bounds: { x: 362, y: 232, width: 36, height: 45 },
                    },
                  ],
                },
              },
            },
          };
          const task = {
            id: 'task_id_0',
            name: 'task name',
          };
          if (Array.isArray(process)) {
            process[0].task = task;
          } else {
            process.task = task;
          }
          addTEventDefinition(json.definitions, eventDefinitionKind);
          addDifferentEventDefinition(json.definitions, expectedShapeBpmnEventKind);

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
        const json = buildTDefinitionsWithEventDefinitionAndEventOnProcess(eventDefinitionKind, expectedShapeBpmnEventKind);
        (json.definitions.process as TProcess)[`${bpmnKind}`] = buildTEventWithDefinition({ eventName: eventName });

        const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

        const shapes = getEventShapes(model);
        verifyShape(shapes[0], {
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
        specificVerify(shapes[0].bpmnElement);
      });

      if (expectedShapeBpmnEventKind !== ShapeBpmnEventKind.NONE) {
        it.each([
          ['empty string', ''],
          ['object', { id: `${eventDefinitionKind}EventDefinition_1` }],
        ])(
          `should convert as Shape, when '${eventDefinitionKind}EventDefinition' is %s${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
          (title: string, eventDefinition: string | TEventDefinition) => {
            const json = buildTDefinitionsWithEventDefinitionAndEventOnProcess(eventDefinitionKind, expectedShapeBpmnEventKind);
            (json.definitions.process as TProcess)[`${bpmnKind}`] = buildTEventWithDefinition({ eventDefinition: eventDefinition });

            const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

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
          },
        );

        it.each([
          [`'${eventDefinitionKind}EventDefinition' and another 'EventDefinition'`, addDifferentEventDefinition(buildTEventWithDefinition(), expectedShapeBpmnEventKind)],
          [`several '${eventDefinitionKind}EventDefinition'`, buildTEventWithDefinition({ eventDefinition: [{}, {}] })],
        ])(`should NOT convert, when there are %s in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, (title: string, event: TEvent[]) => {
          const json = buildTDefinitionsWithEventDefinitionAndEventOnProcess(eventDefinitionKind, expectedShapeBpmnEventKind);
          (json.definitions.process as TProcess)[`${bpmnKind}`] = event;

          parseJsonAndExpectOnlyFlowNodes(json, 1);
        });

        executeSpecificTests(titleForEventDefinitionIsAttributeOf, buildTEventWithDefinition);
      }
    },
  );

  it.skip(`should NOT convert, when 'definitions' has ${eventDefinitionKind}EventDefinition and '${bpmnKind}' has ${eventDefinitionKind}EventDefinition & eventDefinitionRef${specificTitle}`, () => {
    const json = buildTDefinitionsWithEventDefinitionAndEventOnProcess(eventDefinitionKind, expectedShapeBpmnEventKind);
    // TODO Add eventDefinitionRef
    (json.definitions.process as TProcess)[`${bpmnKind}`] = buildTEvent();

    parseJsonAndExpectOnlyFlowNodes(json, 0);
  });
}

function executeBoundaryEventSpecificTests(
  isInterrupting: boolean,
  titleForEventDefinitionIsAttributeOf: string,
  eventDefinitionKind: string,
  buildTBoundaryEventWithDefinition: (parameter?: BuildEventParameter) => BPMNTEvent,
  expectedShapeBpmnEventKind: ShapeBpmnEventKind,
  boundaryEventKind: string,
) {
  if (isInterrupting) {
    it(`should convert as Shape, when 'boundaryEvent' has no 'cancelActivity' & is attached to an 'activity', ${titleForEventDefinitionIsAttributeOf}'`, () => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: {
            task: {
              id: 'task_id_0',
              name: 'task name',
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
      (json.definitions.process as TProcess)['boundaryEvent'] = buildTBoundaryEventWithDefinition({ isInterrupting: undefined }) as TBoundaryEvent;

      const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

      const shapes = getEventShapes(model);
      verifyShape(shapes[0], {
        shapeId: 'shape_boundaryEvent_id_0',
        parentId: 'task_id_0',
        bpmnElementId: 'event_id_0',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.EVENT_BOUNDARY,
        bounds: {
          x: 362,
          y: 232,
          width: 36,
          height: 45,
        },
      });
      verifyBoundaryEvent(shapes[0].bpmnElement, isInterrupting);
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
    // TODO: modify attachedRef
    (json.definitions.process as TProcess)['boundaryEvent'] = buildTBoundaryEventWithDefinition({ isInterrupting: isInterrupting }) as TBoundaryEvent;

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
        executeEventCommonTests(bpmnKind, eventDefinitionKind, expectedShapeBpmnEventKind, expectedShapeBpmnElementKind, buildTEvent);
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
            expectedShapeBpmnEventKind,
            expectedShapeBpmnElementKind,
            (index, eventName): TBoundaryEvent => buildTBoundaryEvent(index, eventName, isInterrupting),
            (titleForEventDefinitionIsAttributeOf, buildTEvent) =>
              executeBoundaryEventSpecificTests(
                isInterrupting,
                titleForEventDefinitionIsAttributeOf,
                eventDefinitionKind,
                buildTEvent,
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
        (json.definitions.process as TProcess)[`${bpmnKind}`] = [
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
          (json.definitions.process as TProcess)[`${bpmnKind}`].push(event);

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
