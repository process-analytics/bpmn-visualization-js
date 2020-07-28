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
import { BPMNPlane, BPMNShape } from '../../../../../src/component/parser/xml/bpmn-json-model/BPMNDI';
import { BpmnJsonModel, TDefinitions } from '../../../../../src/component/parser/xml/bpmn-json-model/BPMN20';
import ShapeBpmnElement, { ShapeBpmnBoundaryEvent } from '../../../../../src/model/bpmn/shape/ShapeBpmnElement';
import BpmnModel from '../../../../../src/model/bpmn/BpmnModel';
import ShapeUtil from '../../../../../src/model/bpmn/shape/ShapeUtil';
import { TFlowNode } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/flowElement';

type BPMNTEvent = TCatchEvent | TThrowEvent | TBoundaryEvent;
type BPMNEventDefinition = string | TEventDefinition | TEventDefinition[];

export enum EventDefinitionOn {
  NONE,
  EVENT,
  DEFINITIONS,
  BOTH,
}

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
    shapeId: `shape_event_id_0`,
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

function addEventDefinition(bpmnElement: TDefinitions | BPMNTEvent, eventDefinitionKind: string, eventDefinition: BPMNEventDefinition = ''): TProcess | BPMNTEvent {
  if (eventDefinitionKind !== 'none') {
    bpmnElement[`${eventDefinitionKind}EventDefinition`] = eventDefinition;
  }
  return bpmnElement;
}

function addDifferentEventDefinition(bpmnElement: TDefinitions | BPMNTEvent, eventDefinitionKind: string, differentEventDefinition?: TEventDefinition): TProcess | BPMNTEvent {
  const otherEventDefinition = eventDefinitionKind === 'signal' ? 'message' : 'signal';
  return addEventDefinition(bpmnElement, otherEventDefinition, differentEventDefinition);
}

function addEventDefinitions(
  event: BPMNTEvent,
  eventDefinitionKind: string,
  { eventDefinition, withDifferentDefinition = false }: BuildEventParameter,
  differentEventDefinition?: TEventDefinition,
) {
  addEventDefinition(event, eventDefinitionKind, eventDefinition);
  if (withDifferentDefinition) {
    addDifferentEventDefinition(event, eventDefinitionKind, differentEventDefinition);
  }
}

function getFirstElementOfArray(object: any | any[]): any {
  if (Array.isArray(object)) {
    return object[0];
  } else {
    return object;
  }
}

function updateBpmnElement<T>(parentElement: T | T[], childElement: T, setValue: (value: T | T[]) => void) {
  if (parentElement) {
    if (!Array.isArray(parentElement)) {
      setValue([parentElement, childElement]);
    } else {
      parentElement.push(childElement);
    }
  } else {
    setValue(childElement);
  }
}

function addFlownode(jsonModel: BpmnJsonModel, bpmnKind: string, flowNode: TFlowNode) {
  const process: TProcess = getFirstElementOfArray(jsonModel.definitions.process);
  updateBpmnElement(process[bpmnKind], flowNode, (value: TFlowNode | TFlowNode[]) => (process[bpmnKind] = value));
}

function addShape(jsonModel: BpmnJsonModel, taskShape: BPMNShape) {
  const bpmnPlane: BPMNPlane = getFirstElementOfArray(jsonModel.definitions.BPMNDiagram).BPMNPlane;
  updateBpmnElement(bpmnPlane.BPMNShape, taskShape, (value: BPMNShape | BPMNShape[]) => (bpmnPlane.BPMNShape = value));
}

function addTask(jsonModel: BpmnJsonModel) {
  const task = {
    id: 'task_id_0',
    name: 'task name',
  };
  addFlownode(jsonModel, 'task', task);

  const taskShape = {
    id: 'shape_task_id_0',
    bpmnElement: 'task_id_0',
    Bounds: { x: 362, y: 232, width: 36, height: 45 },
  };
  addShape(jsonModel, taskShape);
}

function addEventDefinitionsOnDefinition(jsonModel: BpmnJsonModel, eventDefinitionKind: string, buildParameter: BuildEventParameter, event: BPMNTEvent) {
  addEventDefinitions(jsonModel.definitions, eventDefinitionKind, { ...buildParameter, eventDefinition: { id: 'event_definition_id' } }, { id: 'other_event_definition_id' });
  if (buildParameter.withDifferentDefinition) {
    (event.eventDefinitionRef as string[]) = ['event_definition_id', 'other_event_definition_id'];
  } else {
    if (Array.isArray(buildParameter.eventDefinition)) {
      event.eventDefinitionRef = buildParameter.eventDefinition.map(eventDefinition => eventDefinition.id);
    } else {
      event.eventDefinitionRef = (buildParameter.eventDefinition as TEventDefinition).id;
    }
  }
}

function buildEvent({ index = 0, eventName, isInterrupting, attachedToRef }: BuildEventParameter = {}): BPMNTEvent {
  const event: BPMNTEvent = {
    id: `event_id_${index}`,
    name: eventName,
  };

  if (isInterrupting !== undefined) {
    event.cancelActivity = isInterrupting;
  }
  if (attachedToRef) {
    event.attachedToRef = attachedToRef;
  }
  return event;
}

function addEvent(jsonModel: BpmnJsonModel, bpmnKind: string, eventDefinitionKind: string, eventDefinitionOn: EventDefinitionOn, buildParameter: BuildEventParameter) {
  const event = buildEvent(buildParameter);
  switch (eventDefinitionOn) {
    case EventDefinitionOn.BOTH:
      addEventDefinitions(event, eventDefinitionKind, buildParameter);
      addEventDefinitionsOnDefinition(jsonModel, eventDefinitionKind, buildParameter, event);
      break;
    case EventDefinitionOn.DEFINITIONS:
      addEventDefinitionsOnDefinition(jsonModel, eventDefinitionKind, buildParameter, event);
      break;
    case EventDefinitionOn.EVENT:
      addEventDefinitions(event, eventDefinitionKind, buildParameter);
      break;
    case EventDefinitionOn.NONE:
      break;
  }
  addFlownode(jsonModel, bpmnKind, event);

  const index = buildParameter.index ? buildParameter.index : 0;
  const eventShape = {
    id: `shape_event_id_${index}`,
    bpmnElement: `event_id_${index}`,
    Bounds: { x: 362, y: 232, width: 36, height: 45 },
  };
  addShape(jsonModel, eventShape);
}

function buildDefinitionsAndProcessWithTask({ process = {} }: BuildDefinitionsParameter) {
  const json: BpmnJsonModel = {
    definitions: {
      targetNamespace: '',
      process: process,
      BPMNDiagram: {
        name: 'process 0',
        BPMNPlane: {},
      },
    },
  };
  addTask(json);
  return json;
}

function executeEventCommonTests(
  bpmnKind: string,
  eventDefinitionKind: string,
  expectedShapeBpmnElementKind: ShapeBpmnElementKind,
  expectedShapeBpmnEventKind: ShapeBpmnEventKind,
  executeSpecificTests: (
    titleForEventDefinitionIsAttributeOf: string,
    eventDefinitionOn: EventDefinitionOn,
    buildEventParameter: BuildEventParameter,
  ) => // eslint-disable-next-line @typescript-eslint/no-empty-function
  void = () => {},
  specificBuildEventParameter: BuildEventParameter = {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  specificVerify: (bpmnElement: ShapeBpmnElement) => void = () => {},
  expectedParentId: string = undefined,
  specificTitle = '',
) {
  let titlesForEventDefinitionIsAttributeOf;
  if (expectedShapeBpmnEventKind === ShapeBpmnEventKind.NONE) {
    titlesForEventDefinitionIsAttributeOf = [[`'${bpmnKind}' has no 'eventDefinition' & no 'eventDefinitionRef'`, EventDefinitionOn.NONE]];
  } else {
    titlesForEventDefinitionIsAttributeOf = [
      [`'${bpmnKind}' has '${eventDefinitionKind}EventDefinition' & no 'eventDefinitionRef'`, EventDefinitionOn.EVENT],
      // [
      //   `'definitions' has '${eventDefinitionKind}EventDefinition' and '${bpmnKind}' has no '${eventDefinitionKind}EventDefinition' & 'eventDefinitionRef'`,
      //   EventDefinitionOn.DEFINITIONS,
      // ],
    ];
  }
  describe.each(titlesForEventDefinitionIsAttributeOf)(`when %s`, (titleForEventDefinitionIsAttributeOf: string, eventDefinitionOn: EventDefinitionOn) => {
    it.each([
      ['object', {}],
      ['array', [{}]],
    ])(
      `should convert as Shape, when 'process' (as %s) has '${bpmnKind}' (as object)${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
      (title: string, process: TProcess | TProcess[]) => {
        const json = buildDefinitionsAndProcessWithTask({ eventDefinitionKind, process });
        addEvent(json, bpmnKind, eventDefinitionKind, eventDefinitionOn, specificBuildEventParameter);

        const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

        expectOneShape(model, expectedParentId, undefined, expectedShapeBpmnElementKind, specificVerify);
      },
    );

    it.each([
      ['object', {}],
      ['array', [{}]],
    ])(
      `should convert as Shape, when 'process' (as %s) has '${bpmnKind}' (as array)${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`,
      (title: string, process: TProcess | TProcess[]) => {
        const json = buildDefinitionsAndProcessWithTask({ eventDefinitionKind, process });
        addEvent(json, bpmnKind, eventDefinitionKind, eventDefinitionOn, specificBuildEventParameter);
        addEvent(json, bpmnKind, eventDefinitionKind, eventDefinitionOn, { ...specificBuildEventParameter, index: 1 });

        const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 2);

        const shapes = getEventShapes(model);
        verifyShape(shapes[0], {
          shapeId: `shape_event_id_0`,
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
          shapeId: `shape_event_id_1`,
          parentId: expectedParentId,
          bpmnElementId: 'event_id_1',
          bpmnElementName: undefined,
          bpmnElementKind: expectedShapeBpmnElementKind,
          bounds: {
            x: 362,
            y: 232,
            width: 36,
            height: 45,
          },
        });
        specificVerify(shapes[1].bpmnElement);
      },
    );

    it.each([
      ["'name'", 'event name'],
      ["no 'name'", undefined],
    ])(`should convert as Shape, when '${bpmnKind}' has %s${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, (title: string, eventName: string) => {
      const json = buildDefinitionsAndProcessWithTask({ eventDefinitionKind });
      addEvent(json, bpmnKind, eventDefinitionKind, eventDefinitionOn, { ...specificBuildEventParameter, eventName });

      const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

      expectOneShape(model, expectedParentId, eventName, expectedShapeBpmnElementKind, specificVerify);
    });

    if (expectedShapeBpmnEventKind !== ShapeBpmnEventKind.NONE) {
      it(`should NOT convert, when there are '${eventDefinitionKind}EventDefinition' and another 'EventDefinition' in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, () => {
        const json = buildDefinitionsAndProcessWithTask({ eventDefinitionKind });
        addEvent(json, bpmnKind, eventDefinitionKind, eventDefinitionOn, { ...specificBuildEventParameter, withDifferentDefinition: true });

        parseJsonAndExpectOnlyFlowNodes(json, 1);
      });

      it(`should NOT convert, when there are several '${eventDefinitionKind}EventDefinition' in the same element${specificTitle}, ${titleForEventDefinitionIsAttributeOf}`, () => {
        const eventDefinition = [{}, {}];
        const json = buildDefinitionsAndProcessWithTask({ eventDefinitionKind, eventDefinition });
        addEvent(json, bpmnKind, eventDefinitionKind, eventDefinitionOn, { ...specificBuildEventParameter, eventDefinition });

        parseJsonAndExpectOnlyFlowNodes(json, 1);
      });

      executeSpecificTests(titleForEventDefinitionIsAttributeOf, eventDefinitionOn, specificBuildEventParameter);
    }
  });

  // it(`should NOT convert, when 'definitions' has ${eventDefinitionKind}EventDefinition and '${bpmnKind}' has ${eventDefinitionKind}EventDefinition & eventDefinitionRef${specificTitle}`, () => {
  //   const json = buildDefinitionsAndProcessWithTask({ eventDefinitionKind });
  //   addEvent(json, bpmnKind, eventDefinitionKind, EventDefinitionOn.BOTH, buildEvent);
  //
  //   parseJsonAndExpectOnlyFlowNodes(json, 0);
  // });
}

function executeNotBoundaryEventSpecificTests(
  titleForEventDefinitionIsAttributeOf: string,
  bpmnKind: string,
  eventDefinitionKind: string,
  eventDefinitionOn: EventDefinitionOn,
  buildEventParameter: BuildEventParameter,
  expectedShapeBpmnElementKind: ShapeBpmnElementKind,
  expectedShapeBpmnEventKind: ShapeBpmnEventKind,
) {
  it.each([
    ['empty string', ''],
    ['object', { id: `${eventDefinitionKind}EventDefinition_1` }],
  ])(
    `should convert as Shape, when '${eventDefinitionKind}EventDefinition' is %s, ${titleForEventDefinitionIsAttributeOf}`,
    (title: string, eventDefinition: string | TEventDefinition) => {
      const json = buildDefinitionsAndProcessWithTask({ eventDefinitionKind });
      addEvent(json, bpmnKind, eventDefinitionKind, eventDefinitionOn, { ...buildEventParameter, eventDefinition });

      const model = parseJsonAndExpectEvent(json, expectedShapeBpmnEventKind, 1);

      expectOneShape(model, undefined, undefined, expectedShapeBpmnElementKind);
    },
  );
}

function executeBoundaryEventSpecificTests(
  titleForEventDefinitionIsAttributeOf: string,
  buildEventParameter: BuildEventParameter,
  eventDefinitionKind: string,
  eventDefinitionOn: EventDefinitionOn,
  isInterrupting: boolean,
  expectedShapeBpmnEventKind: ShapeBpmnEventKind,
  boundaryEventKind: string,
) {
  if (isInterrupting) {
    it(`should convert as Shape, when 'boundaryEvent' has no 'cancelActivity' & is attached to an 'activity', ${titleForEventDefinitionIsAttributeOf}'`, () => {
      const json = buildDefinitionsAndProcessWithTask({ eventDefinitionKind });
      addEvent(json, 'boundaryEvent', eventDefinitionKind, eventDefinitionOn, { ...buildEventParameter, isInterrupting: undefined });

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
                id: 'shape_not_task_id_0',
                bpmnElement: 'not_task_id_0',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
            ],
          },
        },
      },
    };
    addEventDefinition(json.definitions, eventDefinitionKind);
    addEvent(json, 'boundaryEvent', eventDefinitionKind, eventDefinitionOn, { ...buildEventParameter, attachedToRef: 'not_task_id_0' });

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
          (titleForEventDefinitionIsAttributeOf, eventDefinitionOn, buildEventParameter) =>
            executeNotBoundaryEventSpecificTests(
              titleForEventDefinitionIsAttributeOf,
              bpmnKind,
              eventDefinitionKind,
              eventDefinitionOn,
              buildEventParameter,
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
            (titleForEventDefinitionIsAttributeOf, eventDefinitionOn, buildEventParameter) =>
              executeBoundaryEventSpecificTests(
                titleForEventDefinitionIsAttributeOf,
                buildEventParameter,
                eventDefinitionKind,
                eventDefinitionOn,
                isInterrupting,
                expectedShapeBpmnEventKind,
                boundaryEventKind,
              ),
            {
              isInterrupting,
              attachedToRef: 'task_id_0',
            },
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
