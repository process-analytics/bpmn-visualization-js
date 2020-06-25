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
import BpmnVisu from '../../src/component/BpmnVisu';
import { readFileSync } from './e2e-helpers';

const graphContainerId = 'bpmn-visualization-graph';

function initializeBpmnVisu(): BpmnVisu {
  // insert graph container
  const containerDiv = document.createElement('div');
  containerDiv.id = graphContainerId;
  document.body.insertBefore(containerDiv, document.body.firstChild);
  // initialize graph
  const bpmnVisuGraphContainer = document.getElementById(graphContainerId);
  return new BpmnVisu(bpmnVisuGraphContainer);
}

function findSvgElement(cellId: string): SVGGeometryElement {
  const cellGroups = document.querySelectorAll(`#${graphContainerId} svg g g[data-cell-id="${cellId}"]`);
  const event = cellGroups[0] as SVGGElement;
  return event.firstChild as SVGGeometryElement;
}

function expectEvent(cellId: string): void {
  expect(findSvgElement(cellId).nodeName).toBe('ellipse');
}

function expectTask(cellId: string): void {
  expect(findSvgElement(cellId).nodeName).toBe('rect');
}

describe('BpmnVisu DOM only checks', () => {
  it('DOM should contains BPMN elements when loading simple-start-task-end.bpmn', async () => {
    initializeBpmnVisu().load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

    expectEvent('StartEvent_1');
    expectTask('Activity_1');
    expectEvent('EndEvent_1');
  });
});
