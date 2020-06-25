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
import * as fs from 'fs';
import * as path from 'path';
import BpmnVisu from '../../src/component/BpmnVisu';

const bpmnStartTaskEnd = fs.readFileSync(path.join(__dirname, '../fixtures/bpmn/simple-start-task-end.bpmn'), 'utf-8');
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

function expectEvent(cellId: string): void {
  const cellGroups = document.querySelectorAll(`#${graphContainerId} svg g g[data-cell-id="${cellId}"]`);
  const event = cellGroups[0] as SVGGElement;
  const shape = event.firstChild as SVGEllipseElement;
  expect(shape.nodeName).toBe('ellipse');
}

function expectTask(cellId: string): void {
  const cellGroups = document.querySelectorAll(`#${graphContainerId} svg g g[data-cell-id="${cellId}"]`);
  const task = cellGroups[0] as SVGGElement;
  const shape = task.firstChild as SVGGElement;
  expect(shape.nodeName).toBe('rect');
}

describe('BpmnVisu dom only checks', () => {
  const bpmnVisu = initializeBpmnVisu();

  it('DOM should contains BPMN elements', async () => {
    bpmnVisu.load(bpmnStartTaskEnd);

    expectEvent('StartEvent_1');
    expectTask('Activity_1');
    expectEvent('EndEvent_1');
  });
});
