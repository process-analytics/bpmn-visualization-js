/*
Copyright 2021 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { BpmnSemantic, EdgeBpmnSemantic, ShapeBpmnSemantic, BaseBpmnSemantic } from '@lib/component/registry';

import { FlowKind, ShapeBpmnElementKind } from '@lib/model/bpmn/internal';

export type ExpectedBaseBpmnElement = Pick<BaseBpmnSemantic, 'id'> & Partial<Pick<BaseBpmnSemantic, 'name'>>;

export type ExpectedFlowElement = ExpectedBaseBpmnElement & {
  source: string;
  target: string;
};

export type ExpectedFlowNodeElement = ExpectedBaseBpmnElement &
  Pick<ShapeBpmnSemantic, 'parentId'> & {
    incoming?: string[];
    outgoing?: string[];
  };

const expectBaseElement = (bpmnSemantic: BaseBpmnSemantic, expected: ExpectedBaseBpmnElement): void => {
  expect(bpmnSemantic.id).toEqual(expected.id);
  expect(bpmnSemantic.name).toEqual(expected.name);
};

const expectFlow = (bpmnSemantic: EdgeBpmnSemantic, expected: ExpectedFlowElement): void => {
  expectBaseElement(bpmnSemantic, expected);
  expect(bpmnSemantic.isShape).toBeFalsy();
  expect(bpmnSemantic.sourceRefId).toEqual(expected.source);
  expect(bpmnSemantic.targetRefId).toEqual(expected.target);
};

export const expectSequenceFlow = (bpmnSemantic: EdgeBpmnSemantic, expected: ExpectedFlowElement): void => {
  expect(bpmnSemantic.kind).toEqual(FlowKind.SEQUENCE_FLOW);
  expectFlow(bpmnSemantic, expected);
};

export const expectMessageFlow = (bpmnSemantic: EdgeBpmnSemantic, expected: ExpectedFlowElement): void => {
  expect(bpmnSemantic.kind).toEqual(FlowKind.MESSAGE_FLOW);
  expectFlow(bpmnSemantic, expected);
};

export const expectAssociationFlow = (bpmnSemantic: EdgeBpmnSemantic, expected: ExpectedFlowElement): void => {
  expect(bpmnSemantic.kind).toEqual(FlowKind.ASSOCIATION_FLOW);
  expectFlow(bpmnSemantic, expected);
};

function expectShape(bpmnSemantic: BpmnSemantic, expected: ExpectedBaseBpmnElement): void {
  expectBaseElement(bpmnSemantic, expected);
  expect(bpmnSemantic.isShape).toBeTruthy();
}

function expectedFlowNode(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedFlowNodeElement): void {
  expectShape(bpmnSemantic, expected);
  expect(bpmnSemantic.parentId).toEqual(expected.parentId);
  expect(bpmnSemantic.incomingIds).toEqual(expected.incoming ?? []);
  expect(bpmnSemantic.outgoingIds).toEqual(expected.outgoing ?? []);
}

export type ExpectedEventElement = ExpectedFlowNodeElement & Pick<ShapeBpmnSemantic, 'eventDefinitionKind'>;
export type ExpectedIntermediateCatchEventElement = ExpectedEventElement & Pick<ShapeBpmnSemantic, 'linkEventSourceIds'>;
export type ExpectedIntermediateThrowEventElement = ExpectedEventElement & Pick<ShapeBpmnSemantic, 'linkEventTargetId'>;

function expectEvent(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedEventElement): void {
  expectedFlowNode(bpmnSemantic, expected);
  expect(bpmnSemantic.eventDefinitionKind).toBe(expected.eventDefinitionKind);
}

export function expectStartEvent(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedEventElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.EVENT_START);
  expectEvent(bpmnSemantic, expected);
}

export function expectEndEvent(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedEventElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.EVENT_END);
  expectEvent(bpmnSemantic, expected);
}

export function expectIntermediateCatchEvent(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedIntermediateCatchEventElement): void {
  expectEvent(bpmnSemantic, expected);
  expect(bpmnSemantic.linkEventSourceIds).toStrictEqual(expected.linkEventSourceIds);
  expect(bpmnSemantic.linkEventTargetId).toBeUndefined();
}

export function expectIntermediateThrowEvent(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedIntermediateThrowEventElement): void {
  expectEvent(bpmnSemantic, expected);
  expect(bpmnSemantic.linkEventSourceIds).toBeUndefined();
  expect(bpmnSemantic.linkEventTargetId).toStrictEqual(expected.linkEventTargetId);
}

export function expectBoundaryEvent(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedEventElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.EVENT_BOUNDARY);
  expectEvent(bpmnSemantic, expected);
}

export function expectIntermediateCatchEvent(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedEventElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH);
  expectEvent(bpmnSemantic, expected);
}

export function expectParallelGateway(bpmnSemantic: BpmnSemantic, expected: ExpectedFlowNodeElement): void {
  expectShape(bpmnSemantic, expected);
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.GATEWAY_PARALLEL);
}

export function expectLane(bpmnSemantic: BpmnSemantic, expected: ExpectedBaseBpmnElement): void {
  expectShape(bpmnSemantic, expected);
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.LANE);
}

export function expectPool(bpmnSemantic: BpmnSemantic, expected: ExpectedBaseBpmnElement): void {
  expectShape(bpmnSemantic, expected);
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.POOL);
}

export function expectTask(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedFlowNodeElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.TASK);
  expectedFlowNode(bpmnSemantic, expected);
}

export function expectServiceTask(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedFlowNodeElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.TASK_SERVICE);
  expectedFlowNode(bpmnSemantic, expected);
}

export function expectUserTask(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedFlowNodeElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.TASK_USER);
  expectedFlowNode(bpmnSemantic, expected);
}

export type ExpectedCallActivityElement = ExpectedFlowNodeElement & Pick<ShapeBpmnSemantic, 'callActivityKind' | 'callActivityGlobalTaskKind'>;

export function expectCallActivity(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedCallActivityElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.CALL_ACTIVITY);
  expect(bpmnSemantic.callActivityKind).toEqual(expected.callActivityKind);
  expect(bpmnSemantic.callActivityGlobalTaskKind).toEqual(expected.callActivityGlobalTaskKind);
  expectShape(bpmnSemantic, expected);
}

export type ExpectedSubprocessElement = ExpectedFlowNodeElement & Pick<ShapeBpmnSemantic, 'subProcessKind'>;

export function expectSubprocess(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedSubprocessElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.SUB_PROCESS);
  expect(bpmnSemantic.subProcessKind).toBe(expected.subProcessKind);
  expectShape(bpmnSemantic, expected);
}
