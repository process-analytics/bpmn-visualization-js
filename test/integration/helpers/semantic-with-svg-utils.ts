/**
 * Copyright 2021 Bonitasoft S.A.
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
import type { BpmnElement } from '../../../src/component/registry';
import type { ExpectedBaseBpmnElement } from '../../unit/helpers/bpmn-semantic-utils';
import { expectEndEvent, expectPool, expectSequenceFlow, expectServiceTask, expectStartEvent, expectTask } from '../../unit/helpers/bpmn-semantic-utils';
import { expectSvgEvent, expectSvgPool, expectSvgSequenceFlow, expectSvgTask } from './html-utils';

export function expectStartEventBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectStartEvent(bpmnElement.bpmnSemantic, expected);
  expectSvgEvent(bpmnElement.htmlElement);
}

export function expectEndEventBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectEndEvent(bpmnElement.bpmnSemantic, expected);
  expectSvgEvent(bpmnElement.htmlElement);
}

export function expectSequenceFlowBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectSequenceFlow(bpmnElement.bpmnSemantic, expected);
  expectSvgSequenceFlow(bpmnElement.htmlElement);
}

export function expectTaskBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectTask(bpmnElement.bpmnSemantic, expected);
  expectSvgTask(bpmnElement.htmlElement);
}

export function expectServiceTaskBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectServiceTask(bpmnElement.bpmnSemantic, expected);
  expectSvgTask(bpmnElement.htmlElement);
}

export function expectPoolBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectPool(bpmnElement.bpmnSemantic, expected);
  expectSvgPool(bpmnElement.htmlElement);
}
