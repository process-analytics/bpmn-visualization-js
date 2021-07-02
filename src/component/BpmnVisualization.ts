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

import MxGraphConfigurator from './mxgraph/MxGraphConfigurator';
import { newBpmnRenderer } from './mxgraph/BpmnRenderer';
import { newBpmnParser } from './parser/BpmnParser';
import { BpmnMxGraph } from './mxgraph/BpmnMxGraph';
import { FitOptions, GlobalOptions, LoadOptions } from './options';
import { BpmnElementsRegistry } from './registry';
import { newBpmnElementsRegistry } from './registry/bpmn-elements-registry';
import { BpmnModelRegistry } from './registry/bpmn-model-registry';
import { htmlElement } from './helpers/dom-utils';

/**
 * @category Initialization
 */
export default class BpmnVisualization {
  public readonly graph: BpmnMxGraph;

  /**
   * @experimental subject to change, feedback welcome
   */
  readonly bpmnElementsRegistry: BpmnElementsRegistry;
  private readonly bpmnModelRegistry: BpmnModelRegistry;

  constructor(options: GlobalOptions) {
    // mxgraph configuration
    const configurator = new MxGraphConfigurator(htmlElement(options?.container));
    this.graph = configurator.configure(options);
    // other configurations
    this.bpmnModelRegistry = new BpmnModelRegistry();
    this.bpmnElementsRegistry = newBpmnElementsRegistry(this.bpmnModelRegistry, this.graph);
  }

  public load(xml: string, options?: LoadOptions): void {
    try {
      const bpmnModel = newBpmnParser().parse(xml);
      const renderedModel = this.bpmnModelRegistry.computeRenderedModel(bpmnModel);
      newBpmnRenderer(this.graph).render(renderedModel, options);
    } catch (e) {
      // TODO error handling
      window.alert(`Cannot load bpmn diagram: ${e.message}`);
      throw e;
    }
  }

  public fit(options?: FitOptions): void {
    this.graph.customFit(options);
  }
}
