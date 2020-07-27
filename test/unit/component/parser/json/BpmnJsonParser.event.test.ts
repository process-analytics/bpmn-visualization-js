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

interface BuildParameter {
  eventDefinitionKind: string;
  index: number;
  withName: boolean;
  eventDefinition?: BPMNEventDefinition;
  isInterrupting?: boolean;
}

const eventDefinitionParameters = [
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
];

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

function buildTitleForEventDefinitionIsAttributeOf(
  bpmnKind: string,
  eventDefinitionKind: string,
  expectedShapeBpmnEventKind: ShapeBpmnEventKind,
  buildTEvent: (index?: number, withName?: boolean, isInterrupting?: boolean) => BPMNTEvent,
): (string | ((index?: number, withName?: boolean, eventDefinition?: BPMNEventDefinition, eventDefinitionRef?: string | string[], isInterrupting?: boolean) => BPMNTEvent))[][] {
  if (expectedShapeBpmnEventKind === ShapeBpmnEventKind.NONE) {
    return [
      [
        `'${bpmnKind}' has no 'eventDefinition' & no 'eventDefinitionRef'`,
        (index, withName, eventDefinition, eventDefinitionRef, isInterrupting): BPMNTEvent => buildTEvent(index, withName, isInterrupting),
      ],
    ];
  } else {
    return [
      [
        `'${bpmnKind}' has '${eventDefinitionKind}EventDefinition' & no 'eventDefinitionRef'`,
        (index, withName, eventDefinition, eventDefinitionRef, isInterrupting): BPMNTEvent => {
          const event = buildTEvent(index, withName, isInterrupting);
          addTEventDefinition(event, eventDefinitionKind, eventDefinition);
          return event;
        },
      ],
      // [
      //   `'definitions' has '${eventDefinitionKind}EventDefinition' and '${bpmnKind}' has no '${eventDefinitionKind}EventDefinition' & 'eventDefinitionRef'`,
      //   (index, withName, eventDefinition, eventDefinitionRef, isInterrupting): BPMNTEvent => {
      //     const event = buildTEvent(index, withName, isInterrupting);
      //     event.eventDefinitionRef = eventDefinitionRef ? eventDefinitionRef : 'event_id_0';
      //     return event;
      //   },
      // ],
    ];
  }
}

function buildTEvent(index = 0, withName = false): BPMNTEvent {
  const event: BPMNTEvent = {
    id: `event_id_${index}`,
  };

  if (withName) {
    event.name = 'event name';
  }

  return event;
}

function buildTBoundaryEvent(index = 0, withName = false, isInterrupting: boolean = undefined): TBoundaryEvent {
  const event: TBoundaryEvent = buildTEvent(index, withName) as TBoundaryEvent;
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
  buildTEvent: (index?: number, withName?: boolean) => BPMNTEvent,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  executeSpecificTests: (titleForEventDefinitionIsAttributeOf: string, buildTEvent: (index?: number, withName?: boolean) => BPMNTEvent) => void = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  specificVerify: (bpmnElement: ShapeBpmnElement) => void = () => {},
  expectedParentId: string = undefined,
  specificTitle = '',
) {
  describe.each(buildTitleForEventDefinitionIsAttributeOf(bpmnKind, eventDefinitionKind, expectedShapeBpmnEventKind, buildTEvent))(
    `when %s`,
    (
      titleForEventDefinitionIsAttributeOf: string,
      buildTEvent: (index?: number, withName?: boolean, eventDefinition?: BPMNEventDefinition, eventDefinitionRef?: string | string[]) => BPMNTEvent,
    ) => {
      const processAsObjectWithEventAsObject = {} as TProcess;
      processAsObjectWithEventAsObject[bpmnKind] = buildTEvent();
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
      processAsObjectWithEventAsArray[bpmnKind] = [buildTEvent(), buildTEvent(1)];
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
        ["'name'", true],
        ["no 'name'", false],
      ])(`should convert as Shape, when '${bpmnKind}' has %s${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, (title: string, withName: boolean) => {
        const json = buildTDefinitionsWithEventDefinitionAndEventOnProcess(eventDefinitionKind, expectedShapeBpmnEventKind);
        (json.definitions.process as TProcess)[`${bpmnKind}`] = buildTEvent(0, withName);

        const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

        const shapes = getEventShapes(model);
        verifyShape(shapes[0], {
          shapeId: `shape_id_0`,
          parentId: expectedParentId,
          bpmnElementId: 'event_id_0',
          bpmnElementName: withName ? 'event name' : undefined,
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
          (title: string, eventDefinitionJson: string | TEventDefinition) => {
            const json = buildTDefinitionsWithEventDefinitionAndEventOnProcess(eventDefinitionKind, expectedShapeBpmnEventKind);
            (json.definitions.process as TProcess)[`${bpmnKind}`] = buildTEvent(0, true, eventDefinitionJson);

            const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

            const shapes = getEventShapes(model);
            verifyShape(shapes[0], {
              shapeId: `shape_id_0`,
              parentId: expectedParentId,
              bpmnElementId: 'event_id_0',
              bpmnElementName: 'event name',
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
          [`'${eventDefinitionKind}EventDefinition' and another 'EventDefinition'`, addDifferentEventDefinition(buildTEvent(), expectedShapeBpmnEventKind)],
          [`several '${eventDefinitionKind}EventDefinition'`, buildTEvent(0, true, [{}, {}])],
        ])(`should NOT convert, when there are %s in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, (title: string, eventJson: TEvent[]) => {
          const json = buildTDefinitionsWithEventDefinitionAndEventOnProcess(eventDefinitionKind, expectedShapeBpmnEventKind);
          (json.definitions.process as TProcess)[`${bpmnKind}`] = eventJson;

          parseJsonAndExpectOnlyFlowNodes(json, 1);
        });

        executeSpecificTests(titleForEventDefinitionIsAttributeOf, buildTEvent);
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
  buildTBoundaryEvent: (index?: number, withName?: boolean, eventDefinition?: BPMNEventDefinition, eventDefinitionRef?: string | string[], isInterrupting?: boolean) => BPMNTEvent,
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
      (json.definitions.process as TProcess)['boundaryEvent'] = buildTBoundaryEvent(0, false, '', undefined, undefined) as TBoundaryEvent;

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
    (json.definitions.process as TProcess)['boundaryEvent'] = buildTBoundaryEvent(0, false, '', undefined, isInterrupting) as TBoundaryEvent;

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
    describe.each(eventDefinitionParameters)(`for %s ${bpmnKind}`, (eventDefinitionKind: string, expectedShapeBpmnEventKind: ShapeBpmnEventKind) => {
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
            (index, withName): TBoundaryEvent => buildTBoundaryEvent(index, withName, isInterrupting),
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
