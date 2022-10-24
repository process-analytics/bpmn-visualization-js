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
import type { BpmnVisualization, ShapeBpmnEventDefinitionKind } from '../../../src/bpmn-visualization';
import { BpmnQuerySelectorsForTests } from '../../helpers/query-selectors';

/* eslint-disable jest/no-standalone-expect */

export interface RequestedChecks {
  readonly additionalClasses?: string[];
  readonly label?: string;
  readonly overlayLabel?: string;
}

export interface MessageFlowRequestedChecks extends RequestedChecks {
  readonly hasIcon?: boolean;
  readonly isInitiatingIcon?: boolean;
}

export class HtmlElementLookup {
  private bpmnQuerySelectors: BpmnQuerySelectorsForTests;

  constructor(private bpmnVisualization: BpmnVisualization) {
    this.bpmnQuerySelectors = new BpmnQuerySelectorsForTests();
  }

  expectNoElement(bpmnId: string): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    expect(svgGroupElement).toBeUndefined();
  }

  // replicate what we do in HtmlElementRegistry: query selector on the BPMN container element directly
  private querySelector<E extends Element>(selector: string): E | null {
    return this.bpmnVisualization.graph.container.querySelector<E>(selector);
  }

  // ===========================================================================
  // EVENTS
  // ===========================================================================

  private expectEventType(bpmnId: string, bpmnClass: string, bpmnEventDefinition: ShapeBpmnEventDefinitionKind, checks?: RequestedChecks): void {
    this.expectElement(bpmnId, expectSvgEvent, ['bpmn-type-event', bpmnClass, `bpmn-event-def-${bpmnEventDefinition}`], checks);
  }

  expectStartEvent(bpmnId: string, bpmnEventDefinition: ShapeBpmnEventDefinitionKind, checks?: RequestedChecks): void {
    this.expectEventType(bpmnId, 'bpmn-start-event', bpmnEventDefinition, checks);
  }

  expectIntermediateThrowEvent(bpmnId: string, bpmnEventDefinition: ShapeBpmnEventDefinitionKind): void {
    this.expectEventType(bpmnId, 'bpmn-intermediate-throw-event', bpmnEventDefinition);
  }

  expectEndEvent(bpmnId: string, bpmnEventDefinition: ShapeBpmnEventDefinitionKind, checks?: RequestedChecks): void {
    this.expectEventType(bpmnId, 'bpmn-end-event', bpmnEventDefinition, checks);
  }

  // ===========================================================================
  // TASKS
  // ===========================================================================

  private expectTaskType(bpmnId: string, bpmnClass: string, checks?: RequestedChecks): void {
    this.expectElement(bpmnId, expectSvgTask, ['bpmn-type-activity', 'bpmn-type-task', bpmnClass], checks);
  }

  expectTask(bpmnId: string): void {
    this.expectTaskType(bpmnId, 'bpmn-task');
  }

  expectServiceTask(bpmnId: string, checks?: RequestedChecks): void {
    this.expectTaskType(bpmnId, 'bpmn-service-task', checks);
  }

  expectUserTask(bpmnId: string, checks?: RequestedChecks): void {
    this.expectTaskType(bpmnId, 'bpmn-user-task', checks);
  }

  // ===========================================================================
  // CONTAINERS
  // ===========================================================================

  expectLane(bpmnId: string, checks?: RequestedChecks): void {
    this.expectElement(bpmnId, expectSvgLane, ['bpmn-type-container', 'bpmn-lane'], checks);
  }

  expectPool(bpmnId: string): void {
    this.expectElement(bpmnId, expectSvgPool, ['bpmn-type-container', 'bpmn-pool']);
  }

  // ===========================================================================
  // GATEWAYS
  // ===========================================================================

  expectExclusiveGateway(bpmnId: string, checks?: RequestedChecks): void {
    this.expectElement(bpmnId, expectSvgGateway, ['bpmn-type-gateway', 'bpmn-exclusive-gateway'], checks);
  }

  // ===========================================================================
  // FLOWS
  // ===========================================================================

  expectAssociation(bpmnId: string, checks?: RequestedChecks): void {
    this.expectElement(bpmnId, expectSvgAssociation, ['bpmn-type-flow', 'bpmn-association'], checks);
  }

  expectSequenceFlow(bpmnId: string, checks?: RequestedChecks): void {
    this.expectElement(bpmnId, expectSvgSequenceFlow, ['bpmn-type-flow', 'bpmn-sequence-flow'], checks);
  }

  expectMessageFlow(bpmnId: string, checks?: MessageFlowRequestedChecks): void {
    this.expectElement(bpmnId, expectSvgMessageFlow, ['bpmn-type-flow', 'bpmn-message-flow'], checks);

    // message flow icon
    const msgFlowIconSvgGroupElement = this.querySelector<HTMLElement>(this.bpmnQuerySelectors.element(`messageFlowIcon_of_${bpmnId}`));
    if (checks?.hasIcon) {
      expectSvgMessageFlowIcon(msgFlowIconSvgGroupElement);
      expectClassAttribute(
        msgFlowIconSvgGroupElement,
        computeClassValue(['bpmn-message-flow-icon', checks?.isInitiatingIcon ? 'bpmn-icon-initiating' : 'bpmn-icon-non-initiating'], checks?.additionalClasses),
      );
    } else {
      expect(msgFlowIconSvgGroupElement).toBeNull();
    }
  }

  // ===========================================================================
  // UTILS
  // ===========================================================================

  private expectElement(bpmnId: string, svgExpectCheck: (svgGroupElement: HTMLElement) => void, bpmnClasses: string[], checks?: RequestedChecks): void {
    const svgGroupElement = this.findSvgElement(bpmnId);
    svgExpectCheck(svgGroupElement);
    expectClassAttribute(svgGroupElement, computeClassValue(bpmnClasses, checks?.additionalClasses));

    this.expectSvgLabel(bpmnId, bpmnClasses, checks?.label, checks?.additionalClasses);
    this.expectSvgOverlay(bpmnId, checks?.overlayLabel);
  }

  private findSvgElement(bpmnId: string): HTMLElement {
    const bpmnElements = this.bpmnVisualization.bpmnElementsRegistry.getElementsByIds(bpmnId);
    return bpmnElements.length == 0 ? undefined : bpmnElements[0].htmlElement;
  }

  private expectSvgOverlay(bpmnId: string, overlayLabel?: string): void {
    const overlayGroupElement = this.querySelector<SVGGElement>(this.bpmnQuerySelectors.overlays(bpmnId));
    if (overlayLabel) {
      expect(overlayGroupElement.querySelector('g > text').innerHTML).toEqual(overlayLabel);
      expectClassAttribute(overlayGroupElement, 'overlay-badge');
    } else {
      expect(overlayGroupElement).toBeNull();
    }
  }

  private expectSvgLabel(bpmnId: string, bpmnClasses: string[], label?: string, additionalClasses?: string[]): void {
    if (!label) {
      return;
    }

    // TODO make the label check pass with jest v28 and the previous implementation of the test
    const labelSvgGroup = this.querySelector<HTMLElement>(this.bpmnQuerySelectors.labelSvgGroup(bpmnId));
    const foreignObject = labelSvgGroup.querySelector('g > foreignObject');
    // also work
    // svg > g > g > g[data-bpmn-id="serviceTask_1_2"].bpmn-label > g > foreignObject
    // const foreignObject = this.querySelector(`svg > g > g > g[data-bpmn-id="${bpmnId}"].bpmn-label > g > foreignObject`);

    // svg > g > g > g[data-bpmn-id="serviceTask_1_2"].bpmn-label > g > foreignObject > div > div > div
    // const labelLastDivElement = foreignObject.firstElementChild.firstElementChild.firstElementChild;
    const labelLastDivElement = foreignObject.querySelector('div > div > div');

    // Do not work anymore with jest 28 (jsdom bump for 16.6 to 19), this is due to the part of the selector after foreignObject
    // It works well in BpmnPageSvgTester (check in the browser, not with jsdom)
    // const labelLastDivElement = this.querySelector<HTMLElement>(this.bpmnQuerySelectors.labelLastDiv(bpmnId));
    expect(labelLastDivElement.innerHTML).toEqual(label);
    // const labelSvgGroup = this.querySelector<HTMLElement>(this.bpmnQuerySelectors.labelSvgGroup(bpmnId));
    expectClassAttribute(labelSvgGroup, computeClassValue(bpmnClasses, ['bpmn-label', ...(additionalClasses ?? [])]));
  }
}

function computeClassValue(bpmnClasses: string[], additionalClasses?: string[]): string {
  return bpmnClasses.concat(additionalClasses).filter(Boolean).join(' ');
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
  expect(svgGroupElement).toBeDefined();
  const firstChild = svgGroupElement.firstChild as SVGGeometryElement;
  expect(firstChild.nodeName).toEqual(name);
}

function expectClassAttribute(svgElement: HTMLElement | SVGElement, value: string): void {
  expect(svgElement).toBeDefined();
  expect(svgElement.getAttribute('class')).toEqual(value);
}

/* eslint-enable jest/no-standalone-expect */
