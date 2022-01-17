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

import GraphConfigurator from './mxgraph/GraphConfigurator';
import { newBpmnRenderer } from './mxgraph/BpmnRenderer';
import { newBpmnParser } from './parser/BpmnParser';
import type { BpmnGraph } from './mxgraph/BpmnGraph';
import type { FitOptions, GlobalOptions, LoadOptions } from './options';
import type { BpmnElementsRegistry } from './registry';
import { newBpmnElementsRegistry } from './registry/bpmn-elements-registry';
import { BpmnModelRegistry } from './registry/bpmn-model-registry';
import { htmlElement } from './helpers/dom-utils';

/**
 * Let initialize `bpmn-visualization`. It requires at minimum to pass the HTMLElement in the page where the BPMN diagram is rendered.
 * ```javascript
 * const bpmnVisualization = new BpmnVisualization({ container: 'bpmn-container' });
 * ```
 * For more options, see {@link GlobalOptions}
 *
 * @category Initialization
 */
export class BpmnVisualization {
  /**
   * Direct access to the `mxGraph` instance that powers `bpmn-visualization`.
   * It is for **advanced users**, so please use the lib API first and access to the `mxGraph` instance only when there is no alternative.
   * @experimental subject to change, could be removed or made available in another way.
   */
  readonly graph: BpmnGraph;

  /**
   * Interact with BPMN diagram elements rendered in the page.
   * @experimental subject to change, feedback welcome.
   */
  readonly bpmnElementsRegistry: BpmnElementsRegistry;

  private readonly bpmnModelRegistry: BpmnModelRegistry;

  constructor(options: GlobalOptions) {
    // mxgraph configuration
    const configurator = new GraphConfigurator(htmlElement(options?.container));
    this.graph = configurator.configure(options);
    // other configurations
    this.bpmnModelRegistry = new BpmnModelRegistry();
    this.bpmnElementsRegistry = newBpmnElementsRegistry(this.bpmnModelRegistry, this.graph);
  }

  /**
   * Load and render the BPMN diagram.
   * @param xml The BPMN content as xml string
   * @param options Let decide how to render the diagram
   * @throws `Error` when loading fails. This is generally due to a parsing error caused by a malformed BPMN content
   */
  load(xml: string, options?: LoadOptions): void {
    const bpmnModel = newBpmnParser().parse(xml);
    const renderedModel = this.bpmnModelRegistry.load(bpmnModel);
    newBpmnRenderer(this.graph).render(renderedModel, options);
  }

  fit(options?: FitOptions): void {
    this.graph.customFit(options);
  }
}
