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
import { newBpmnParser } from './parser/BpmnParser';
import { FitOptions, GlobalOptions, LoadOptions } from './options';
import { BpmnElementsRegistry } from './registry';
import { newBpmnElementsRegistry } from './registry/bpmn-elements-registry';
import { BpmnModelRegistry } from './registry/bpmn-model-registry';
import { htmlElement } from './helpers/dom-utils';
import G6, { Graph } from '@antv/g6';

/**
 * @category Initialization
 */
export default class BpmnVisualization {
  private readonly graph: Graph;
  /**
   * @experimental subject to change, feedback welcome
   */
  readonly bpmnElementsRegistry: BpmnElementsRegistry;
  private readonly bpmnModelRegistry: BpmnModelRegistry;


  constructor(options?: GlobalOptions) {
    // Instantiate and configure Graph
    this.graph = new G6.Graph({
      container: htmlElement(options?.container),
      width: 1800,
      height: 800,
      defaultNode: {
        shape: 'circle',
        size: [100],
        color: '#5B8FF9',
        style: {
          fill: '#9EC9FF',
          lineWidth: 3,
        },
        labelCfg: {
          style: {
            fill: '#fff',
            fontSize: 20,
          },
        },
      },
      defaultEdge: {
        style: {
          stroke: '#e2e2e2',
        },
      },
    });

    // other configurations
    this.bpmnModelRegistry = new BpmnModelRegistry();
    this.bpmnElementsRegistry = newBpmnElementsRegistry(this.bpmnModelRegistry, this.graph);
  }

  public load(xml: string, options?: LoadOptions): void {
    try {
      const bpmnModel = newBpmnParser().parse(xml);

      // const renderedModel = this.bpmnModelRegistry.computeRenderedModel(bpmnModel);
      // newMxGraphRenderer(this.graph).render(renderedModel, options);

      // eslint-disable-next-line no-console
      console.log('____________________BPMN MODEL___________________', bpmnModel);

      const data = {
        nodes: bpmnModel.flowNodes.map(function (flowNode) {
          return { id: flowNode.bpmnElement.id, label: flowNode.bpmnElement.name, x: flowNode.bounds.x, y: flowNode.bounds.y };
        }),
        edges: bpmnModel.edges.map(function (edge) {
          return { id: edge.id, label: edge.bpmnElement.name, source: edge.bpmnElement.sourceRefId, target: edge.bpmnElement.targetRefId };
        }),
      };

      this.graph.data(data);
      this.graph.render();
      // eslint-disable-next-line no-console
      console.log('_______________________G6_____________________', this.graph);
    } catch (e) {
      // TODO error handling
      window.alert(`Cannot load bpmn diagram: ${e.message}`);
      throw e;
    }
  }

  public fit(options?: FitOptions): void {
    this.graph.fitCenter();
  }
}
