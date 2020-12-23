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
import G6Configurator from './g6/config/G6Configurator';
import { ShapeBpmnElementKind } from '../model/bpmn/internal/shape';
import { NodeConfig } from '@antv/g6/lib/types';

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
    const configurator = new G6Configurator(htmlElement(options?.container));
    this.graph = configurator.configure(options);

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
          // nodeType: 'message' --> for event
          const kind = flowNode.bpmnElement.kind;
          const node: NodeConfig = {
            id: flowNode.bpmnElement.id,
            label: flowNode.bpmnElement.name,
            x: flowNode.bounds.x,
            y: flowNode.bounds.y,
            size: [flowNode.bounds.width, flowNode.bounds.height],
          };
          if (kind === ShapeBpmnElementKind.EVENT_END) {
            node.type = kind;
            node.nodeType = 'a';
            node.error = true;
          } else if (kind === ShapeBpmnElementKind.TASK) {
            node.type = kind;
            node.nodeType = 'b';
            node.markers = [
              { title: '成功率', value: '11%' },
              { title: '耗时', value: '111' },
              { title: '错误数', value: '111' },
            ];
          }
          return node;
        }),
        edges: bpmnModel.edges.map(function (edge) {
          return { id: edge.id, type: edge.bpmnElement.kind, label: edge.bpmnElement.name, source: edge.bpmnElement.sourceRefId, target: edge.bpmnElement.targetRefId };
        }),
      };

      // const data = {
      //   nodes: [
      //     {
      //       title: 'node1',
      //       error: true,
      //       nodeType: 'a',
      //       id: 'node1',
      //       nodeLevel: 2,
      //       panels: [
      //         { title: '成功率', value: '11%' },
      //         { title: '耗时', value: '111' },
      //         { title: '错误数', value: '111' },
      //       ],
      //       x: 100,
      //       y: 100,
      //     },
      //     {
      //       title: 'node2',
      //       error: false,
      //       nodeType: 'b',
      //       id: 'node2',
      //       nodeLevel: 0,
      //       panels: [
      //         { title: '成功率', value: '11%' },
      //         { title: '耗时', value: '111' },
      //         { title: '错误数', value: '111' },
      //       ],
      //       x: 100,
      //       y: 200,
      //     },
      //     {
      //       title: 'node3',
      //       error: false,
      //       nodeType: 'a',
      //       id: 'node3',
      //       nodeLevel: 3,
      //       panels: [
      //         { title: '成功率', value: '11%' },
      //         { title: '耗时', value: '111' },
      //         { title: '错误数', value: '111' },
      //       ],
      //       collapse: true,
      //       x: 100,
      //       y: 300,
      //     },
      //   ],
      // };

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
