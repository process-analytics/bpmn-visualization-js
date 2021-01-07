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
import { mxgraph } from 'ts-mxgraph';
import { defaultMxGraphRenderer } from './mxgraph/MxGraphRenderer';
import { newBpmnParser } from './parser/BpmnParser';
import { BpmnMxGraph } from './mxgraph/BpmnMxGraph';
import { FitOptions, GlobalOptions, LoadOptions } from './options';
import { BpmnElementsRegistry } from './registry';
import { newBpmnElementsRegistry } from './registry/bpmn-elements-registry';

// TODO unable to load mxClient from mxgraph-type-definitions@1.0.2
declare const mxClient: typeof mxgraph.mxClient;

export default class BpmnVisualization {
  public readonly graph: BpmnMxGraph;
  /**
   * @experimental subject to change, feedback welcome
   */
  readonly bpmnElementsRegistry: BpmnElementsRegistry;

  constructor(protected container: HTMLElement, options?: GlobalOptions) {
    try {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false);
      }
      // Instantiate and configure mxgraph
      const configurator = new MxGraphConfigurator(this.container);
      this.graph = configurator.configure(options);

      this.bpmnElementsRegistry = newBpmnElementsRegistry(this.graph);
    } catch (e) {
      // TODO error handling
      mxUtils.alert('Cannot start application: ' + e.message);
      throw e;
    }
  }

  public load(xml: string, options?: LoadOptions): void {
    try {
      const bpmnModel = newBpmnParser().parse(xml);
      defaultMxGraphRenderer(this.graph).render(bpmnModel, options);
    } catch (e) {
      // TODO error handling
      mxUtils.alert('Cannot load bpmn diagram: ' + e.message);
      throw e;
    }
  }

  public fit(options?: FitOptions): void {
    this.graph.customFit(options);
  }
}
