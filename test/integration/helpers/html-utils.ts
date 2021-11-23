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
import { BpmnVisualization } from '../../../src/bpmn-visualization';
import { BpmnQuerySelectorsForTests } from '../../helpers/query-selectors';

export interface RequestedChecks {
  readonly additionalClasses?: string[];
  readonly overlayLabel?: string;
}

export interface MessageFlowRequestedChecks extends RequestedChecks {
  readonly hasIcon?: boolean;
}

export class HtmlElementLookup {
  private bpmnQuerySelectors: BpmnQuerySelectorsForTests;

  constructor(private bpmnVisualization: BpmnVisualization) {
    this.bpmnQuerySelectors = new BpmnQuerySelectorsForTests(bpmnVisualization.graph.container.id);
  }

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

  expectEndEvent(bpmnId: string, checks?: RequestedChecks): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgEvent(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, computeClassValue('bpmn-end-event', checks?.additionalClasses));
  }

  expectTask(bpmnId: string): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgTask(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, 'bpmn-task');
  }

  expectServiceTask(bpmnId: string, checks?: RequestedChecks): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgTask(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, computeClassValue('bpmn-service-task', checks?.additionalClasses));

    this.expectSvgOverlay(bpmnId, checks?.overlayLabel);
  }

  private expectSvgOverlay(bpmnId: string, overlayLabel?: string): void {
    const overlayGroupElement = document.querySelector<SVGGElement>(this.bpmnQuerySelectors.overlays(bpmnId));
    if (overlayLabel) {
      expect(overlayGroupElement.querySelector('g > text').innerHTML).toEqual(overlayLabel);
      expectSvgElementClassAttribute(overlayGroupElement, 'overlay-badge');
    } else {
      expect(overlayGroupElement).toBeNull();
    }
  }

  expectUserTask(bpmnId: string, checks?: RequestedChecks): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgTask(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, computeClassValue('bpmn-user-task', checks?.additionalClasses));
  }

  expectLane(bpmnId: string, checks?: RequestedChecks): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgLane(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, computeClassValue('bpmn-lane', checks?.additionalClasses));
  }

  expectPool(bpmnId: string): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgPool(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, 'bpmn-pool');
  }

  expectExclusiveGateway(bpmnId: string, checks?: RequestedChecks): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgGateway(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, computeClassValue('bpmn-exclusive-gateway', checks?.additionalClasses));

    this.expectSvgOverlay(bpmnId, checks?.overlayLabel);
  }

  expectAssociation(bpmnId: string, checks?: RequestedChecks): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgAssociation(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, computeClassValue('bpmn-association'));

    this.expectSvgOverlay(bpmnId, checks?.overlayLabel);
  }

  expectSequenceFlow(bpmnId: string, checks?: RequestedChecks): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgSequenceFlow(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, computeClassValue('bpmn-sequence-flow'));

    this.expectSvgOverlay(bpmnId, checks?.overlayLabel);
  }

  expectMessageFlow(bpmnId: string, checks?: MessageFlowRequestedChecks): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expectSvgMessageFlow(svgGroupElement);
    expectSvgElementClassAttribute(svgGroupElement, computeClassValue('bpmn-message-flow', checks?.additionalClasses));

    // message flow icon
    const msgFlowIconSvgGroupElement = document.querySelector<HTMLElement>(this.bpmnQuerySelectors.element(`messageFlowIcon_of_${bpmnId}`));
    if (checks?.hasIcon) {
      expectSvgMessageFlowIcon(msgFlowIconSvgGroupElement);
      expectSvgElementClassAttribute(msgFlowIconSvgGroupElement, computeClassValue('bpmn-message-flow-icon', checks?.additionalClasses));
    } else {
      expect(msgFlowIconSvgGroupElement).toBeNull();
    }
  }
}

function computeClassValue(bpmnClass: string, additionalClasses?: string[]): string {
  return [bpmnClass].concat(additionalClasses).filter(Boolean).join(' ');
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

export function expectSvgMessageFlow(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'path');
}

export function expectSvgMessageFlowIcon(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'rect');
}

export function expectSvgAssociation(svgGroupElement: HTMLElement): void {
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
