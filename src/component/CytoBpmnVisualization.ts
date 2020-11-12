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
import cytoscape from 'cytoscape';
import { newBpmnParser } from './parser/BpmnParser';

export default class CytoBpmnVisualization {
  constructor(readonly container: string) {
    document.getElementById(container);
  }

  public load(xml: string) {
    const bpmnModel = newBpmnParser().parse(xml);
    // eslint-disable-next-line no-console
    console.log('____________________BPMN MODEL___________________', bpmnModel);
    const cy = cytoscape({
      container: document.getElementById('graph-cyto'),
      style: [
        {
          selector: 'node',
          style: {
            shape: 'rectangle',
            label: 'data(label)',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
    });

    cy.add(
      bpmnModel.flowNodes.map(function (flowNode) {
        return { group: 'nodes', data: { id: flowNode.bpmnElement.id, label: flowNode.bpmnElement.name }, position: { x: flowNode.bounds.x, y: flowNode.bounds.y } };
      }),
    );
    cy.add(
      bpmnModel.edges.map(function (edge) {
        return { group: 'edges', data: { id: edge.id, label: edge.bpmnElement.name, source: edge.bpmnElement.sourceRefId, target: edge.bpmnElement.targetRefId } };
      }),
    );
    // eslint-disable-next-line no-console
    console.log('_______________________CY_____________________', cy);
  }
}
