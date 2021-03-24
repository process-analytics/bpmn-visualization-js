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
import BpmnVisualization from '../../../src/component/BpmnVisualization';

export class HtmlElementLookup {
  constructor(private bpmnVisualization: BpmnVisualization) {}

  private findSvgElement(bpmnId: string): HTMLElement {
    const bpmnElements = this.bpmnVisualization.bpmnElementsRegistry.getElementsByIds(bpmnId);
    return bpmnElements.length == 0 ? undefined : bpmnElements[0].htmlElement;
  }

  expectNoElement(bpmnId: string): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expect(svgGroupElement).toBeUndefined();
  }

  expectStartEvent(bpmnId: string): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgEvent(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, 'bpmn-start-event');
  }

  expectIntermediateThrowEvent(bpmnId: string): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgEvent(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, 'bpmn-intermediate-throw-event');
  }

  expectEndEvent(bpmnId: string, additionalClasses?: string[]): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgEvent(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, HtmlElementLookup.computeClassValue('bpmn-end-event', additionalClasses));
  }

  expectTask(bpmnId: string): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgTask(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, 'bpmn-task');
  }

  expectServiceTask(bpmnId: string, options?: { additionalClasses?: string[]; overlayLabel?: string }): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgTask(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, HtmlElementLookup.computeClassValue('bpmn-service-task', options?.additionalClasses));

    const overlayGroupElement = document.querySelector<SVGGElement>(`#${this.bpmnVisualization.graph.container.id} > svg > g > g:nth-child(3) > g[data-bpmn-id="${bpmnId}"]`);
    if (options?.overlayLabel) {
      expect(overlayGroupElement.querySelector('g > text').innerHTML).toEqual(options.overlayLabel);
      expectSvgElementClassAttribute(overlayGroupElement, 'overlay-badge');
    } else {
      expect(overlayGroupElement).toBeNull();
    }
  }

  expectUserTask(bpmnId: string, additionalClasses?: string[]): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgTask(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, HtmlElementLookup.computeClassValue('bpmn-user-task', additionalClasses));
  }

  expectLane(bpmnId: string, additionalClasses?: string[]): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgLane(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, HtmlElementLookup.computeClassValue('bpmn-lane', additionalClasses));
  }

  expectPool(bpmnId: string): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgPool(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, 'bpmn-pool');
  }

  expectExclusiveGateway(bpmnId: string, additionalClasses?: string[]): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgGateway(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, HtmlElementLookup.computeClassValue('bpmn-exclusive-gateway', additionalClasses));
  }

  private static computeClassValue(bpmnClass: string, additionalClasses?: string[]): string {
    return [bpmnClass].concat(additionalClasses).filter(Boolean).join(' ');
  }
}

export function expectSvgEvent(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'ellipse');
}

export function expectSvgTask(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'rect');
}

export function expectSvgLane(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'path');
}

export function expectSvgGateway(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'path');
}

export function expectSvgPool(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'path');
}

export function expectSvgSequenceFlow(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'path');
}

// TODO duplication with BpmnPage
// we expect a SVGGElement as HTMLElement parameter
function expectSvgFirstChildNodeName(svgGroupElement: HTMLElement, name: string): void {
  expect(svgGroupElement).not.toBeUndefined();
  const firstChild = svgGroupElement.firstChild as SVGGeometryElement;
  expect(firstChild.nodeName).toEqual(name);
}

export function expectSvgElementClassAttribute(svgElement: HTMLElement | SVGElement, value: string): void {
  expect(svgElement).not.toBeUndefined();
  expect(svgElement.getAttribute('class')).toEqual(value);
}
