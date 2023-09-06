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

import type { BpmnSemantic, EdgeBpmnSemantic, ShapeBpmnSemantic } from '@lib/component/registry';

import { FlowKind, ShapeBpmnElementKind } from '@lib/model/bpmn/internal';

export interface ExpectedBaseBpmnElement {
  id: string;
  name?: string;
}

export interface ExpectedFlowElement extends ExpectedBaseBpmnElement {
  source: string;
  target: string;
}

export interface ExpectedFlowNodeElement extends ExpectedBaseBpmnElement {
  incoming?: string[];
  outgoing?: string[];
}

const expectFlow = (bpmnSemantic: EdgeBpmnSemantic, expected: ExpectedFlowElement): void => {
  expect(bpmnSemantic.id).toEqual(expected.id);
  expect(bpmnSemantic.name).toEqual(expected.name);
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
  expect(bpmnSemantic.id).toEqual(expected.id);
  expect(bpmnSemantic.name).toEqual(expected.name);
  expect(bpmnSemantic.isShape).toBeTruthy();
}

function expectedFlowNode(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedFlowNodeElement): void {
  expectShape(bpmnSemantic, expected);
  expect(bpmnSemantic.incomingIds).toEqual(expected.incoming ?? []);
  expect(bpmnSemantic.outgoingIds).toEqual(expected.outgoing ?? []);
}

export function expectStartEvent(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedFlowNodeElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.EVENT_START);
  expectedFlowNode(bpmnSemantic, expected);
}

export function expectEndEvent(bpmnSemantic: BpmnSemantic, expected: ExpectedBaseBpmnElement): void {
  expectShape(bpmnSemantic, expected);
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.EVENT_END);
}

export function expectBoundaryEvent(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedFlowNodeElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.EVENT_BOUNDARY);
  expectedFlowNode(bpmnSemantic, expected);
}

export function expectParallelGateway(bpmnSemantic: BpmnSemantic, expected: ExpectedBaseBpmnElement): void {
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

export function expectServiceTask(bpmnSemantic: BpmnSemantic, expected: ExpectedBaseBpmnElement): void {
  expectShape(bpmnSemantic, expected);
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.TASK_SERVICE);
}

export function expectUserTask(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedFlowNodeElement): void {
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.TASK_USER);
  expectedFlowNode(bpmnSemantic, expected);
}

export function expectSubprocess(bpmnSemantic: ShapeBpmnSemantic, expected: ExpectedFlowNodeElement): void {
  expectedFlowNode(bpmnSemantic, expected);
  expect(bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.SUB_PROCESS);
}
