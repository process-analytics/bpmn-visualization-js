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

const bpmnContainerId = 'bpmn-visualization-container';

function initializeBpmnVisualization(): BpmnVisualization {
  // insert bpmn container
  const containerDiv = document.createElement('div');
  containerDiv.id = bpmnContainerId;
  document.body.insertBefore(containerDiv, document.body.firstChild);
  // initialize bpmn-visualization
  const bpmnVisualizationElt = document.getElementById(bpmnContainerId);
  return new BpmnVisualization(bpmnVisualizationElt);
}

describe('BpmnVisu DOM only checks', () => {
  it('DOM should contains BPMN elements when loading simple-start-task-end.bpmn', async () => {
    const bpmnVisualization = initializeBpmnVisualization();
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

    const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);
    htmlElementLookup.expectEvent('StartEvent_1');
    htmlElementLookup.expectTask('Activity_1');
    htmlElementLookup.expectEvent('EndEvent_1');
  });
});

// TODO duplication between HtmlElementLookup and
class HtmlElementLookup {
  constructor(private bpmnVisualization: BpmnVisualization) {}

  private findSvgElement(cellId: string): SVGGeometryElement {
    const cellSvgElement = this.bpmnVisualization.htmlElementRegistry.getBpmnHtmlElement(cellId); // should be SVGGElement
    return cellSvgElement.firstChild as SVGGeometryElement;
  }

  expectEvent(cellId: string): void {
    expect(this.findSvgElement(cellId).nodeName).toBe('ellipse');
  }

  expectTask(cellId: string): void {
    expect(this.findSvgElement(cellId).nodeName).toBe('rect');
  }
}
