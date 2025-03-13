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

import type { BpmnElement, EdgeBpmnSemantic, ShapeBpmnSemantic } from '@lib/component/registry';
import type {
  ExpectedBaseBpmnElement,
  ExpectedFlowElement,
  ExpectedFlowNodeElement,
  ExpectedEventElement,
  ExpectedIntermediateThrowEventElement,
  ExpectedIntermediateCatchEventElement,
} from '@test/shared/model/bpmn-semantic-utilities';

import { expectSvgEvent, expectSvgGateway, expectSvgPool, expectSvgSequenceFlow, expectSvgTask } from './html-utilities';

import {
  expectEndEvent,
  expectIntermediateCatchEvent,
  expectIntermediateThrowEvent,
  expectParallelGateway,
  expectPool,
  expectSequenceFlow,
  expectServiceTask,
  expectStartEvent,
  expectTask,
} from '@test/shared/model/bpmn-semantic-utilities';

export function expectStartEventBpmnElement(bpmnElement: BpmnElement, expected: ExpectedEventElement): void {
  expectStartEvent(bpmnElement.bpmnSemantic as ShapeBpmnSemantic, expected);
  expectSvgEvent(bpmnElement.htmlElement);
}

export function expectEndEventBpmnElement(bpmnElement: BpmnElement, expected: ExpectedEventElement): void {
  expectEndEvent(bpmnElement.bpmnSemantic as ShapeBpmnSemantic, expected);
  expectSvgEvent(bpmnElement.htmlElement);
}

export function expectIntermediateCatchEventBpmnElement(bpmnElement: BpmnElement, expected: ExpectedIntermediateCatchEventElement): void {
  expectIntermediateCatchEvent(bpmnElement.bpmnSemantic as ShapeBpmnSemantic, expected);
  expectSvgEvent(bpmnElement.htmlElement);
}

export function expectIntermediateThrowEventBpmnElement(bpmnElement: BpmnElement, expected: ExpectedIntermediateThrowEventElement): void {
  expectIntermediateThrowEvent(bpmnElement.bpmnSemantic as ShapeBpmnSemantic, expected);
  expectSvgEvent(bpmnElement.htmlElement);
}

export function expectSequenceFlowBpmnElement(bpmnElement: BpmnElement, expected: ExpectedFlowElement): void {
  expectSequenceFlow(bpmnElement.bpmnSemantic as EdgeBpmnSemantic, expected);
  expectSvgSequenceFlow(bpmnElement.htmlElement);
}

export function expectTaskBpmnElement(bpmnElement: BpmnElement, expected: ExpectedFlowNodeElement): void {
  expectTask(bpmnElement.bpmnSemantic as ShapeBpmnSemantic, expected);
  expectSvgTask(bpmnElement.htmlElement);
}

export function expectServiceTaskBpmnElement(bpmnElement: BpmnElement, expected: ExpectedFlowNodeElement): void {
  expectServiceTask(bpmnElement.bpmnSemantic as ShapeBpmnSemantic, expected);
  expectSvgTask(bpmnElement.htmlElement);
}

export function expectParallelGatewayBpmnElement(bpmnElement: BpmnElement, expected: ExpectedFlowNodeElement): void {
  expectParallelGateway(bpmnElement.bpmnSemantic as ShapeBpmnSemantic, expected);
  expectSvgGateway(bpmnElement.htmlElement);
}

export function expectPoolBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectPool(bpmnElement.bpmnSemantic, expected);
  expectSvgPool(bpmnElement.htmlElement);
}
