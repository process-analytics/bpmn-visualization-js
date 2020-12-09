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
import BpmnVisualization from '../../src/component/BpmnVisualization';
import { readFileSync } from '../helpers/file-helper';
import { HtmlElementLookup } from './helpers/visu-utils';
import { ShapeBpmnElementKind } from '../../src/model/bpmn/internal/shape';
import { FlowKind } from '../../src/model/bpmn/internal/edge/FlowKind';

const bpmnContainerId = 'bpmn-visualization-container';
const bpmnVisualization = initializeBpmnVisualization();

function initializeBpmnVisualization(): BpmnVisualization {
  // insert bpmn container
  const containerDiv = document.createElement('div');
  containerDiv.id = bpmnContainerId;
  document.body.insertBefore(containerDiv, document.body.firstChild);
  // initialize bpmn-visualization
  const bpmnVisualizationElt = document.getElementById(bpmnContainerId);
  return new BpmnVisualization(bpmnVisualizationElt);
}

describe('DOM only checks', () => {
  it('DOM should contains BPMN elements when loading simple-start-task-end.bpmn', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

    const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);
    htmlElementLookup.expectEvent('StartEvent_1');
    htmlElementLookup.expectTask('Activity_1');
    htmlElementLookup.expectEvent('EndEvent_1');
  });
});

describe('Bpmn Elements registry', () => {
  it('Look for several BPMN elements by ids', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

    const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByIds(['StartEvent_1', 'Flow_2']);
    expect(bpmnElements).toHaveLength(2);

    const startEventElement = bpmnElements[0];
    expect(startEventElement.id).toEqual('StartEvent_1');
    expect(startEventElement.isShape).toBeTruthy();
    expect(startEventElement.kind).toEqual(ShapeBpmnElementKind.EVENT_START);
    expect(startEventElement.label).toEqual('Start Event 1');

    const sequenceFlow2Element = bpmnElements[1];
    expect(sequenceFlow2Element.id).toEqual('Flow_2');
    expect(sequenceFlow2Element.isShape).toBeFalsy();
    expect(sequenceFlow2Element.kind).toEqual(FlowKind.SEQUENCE_FLOW);
    expect(sequenceFlow2Element.label).toBeUndefined();
  });

  it('Look for unknown BPMN elements by ids', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
    const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByIds('unknown');
    expect(bpmnElements).toHaveLength(0);
  });
});
