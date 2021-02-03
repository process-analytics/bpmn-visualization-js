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
            label: 'data(label)',
            height: 'data(height)',
            width: 'data(width)',
            'background-color': 'yellow',
            'border-color': 'black',
            'border-width': 1,
          },
        },
        {
          selector: 'node[kind = "lane"],node[kind = "pool"]',
          style: {
            shape: 'rectangle',
            'background-color': 'white',
          },
        },
        {
          selector: 'node[kind = "task"]',
          style: {
            shape: 'round-rectangle',
            'background-color': 'orange',
          },
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'segments',
            label: 'data(label)',
            width: 2,
            'line-color': 'cyan',
            'target-arrow-color': 'green',
            'target-arrow-shape': 'triangle',
            'line-style': 'dotted',
            'segment-distances': '-20 20 -20',
            'segment-weights': '0.25 0.5 0.75',
          },
        },
        {
          selector: 'edge[kind = "sequenceFlow"]',
          style: {
            'source-arrow-shape': 'diamond',
          },
        },
        {
          selector: 'edge[kind = "messageFlow"]',
          style: {
            'line-style': 'dashed',
            'line-dash-pattern': [6, 3],
            'line-color': 'pink',
          },
        },
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
    });

    cy.add(
      bpmnModel.pools.map(function (flowNode) {
        return {
          group: 'nodes',
          data: {
            id: flowNode.bpmnElement.id,
            label: flowNode.bpmnElement.name,
            kind: flowNode.bpmnElement.kind,
            height: flowNode.bounds.height,
            width: flowNode.bounds.width,
          },
          position: { x: flowNode.bounds.x, y: flowNode.bounds.y },
          selectable: false,
          grabbable: false,
          pannable: true,
        };
      }),
    );
    cy.add(
      bpmnModel.lanes.map(function (flowNode) {
        return {
          group: 'nodes',
          data: {
            id: flowNode.bpmnElement.id,
            label: flowNode.bpmnElement.name,
            kind: flowNode.bpmnElement.kind,
            height: flowNode.bounds.height,
            width: flowNode.bounds.width,
          },
          position: { x: flowNode.bounds.x, y: flowNode.bounds.y },
          selectable: false,
          grabbable: false,
          pannable: true,
        };
      }),
    );
    cy.add(
      bpmnModel.flowNodes.map(function (flowNode) {
        return {
          group: 'nodes',
          data: {
            id: flowNode.bpmnElement.id,
            label: flowNode.bpmnElement.name,
            kind: flowNode.bpmnElement.kind,
            height: flowNode.bounds.height,
            width: flowNode.bounds.width,
          },
          position: { x: flowNode.bounds.x, y: flowNode.bounds.y },
          grabbable: false,
          pannable: true,
        };
      }),
    );
    cy.add(
      bpmnModel.edges.map(function (edge) {
        return {
          group: 'edges',
          data: {
            id: edge.id,
            label: edge.bpmnElement.name,
            kind: edge.bpmnElement.kind,
            source: edge.bpmnElement.sourceRefId,
            target: edge.bpmnElement.targetRefId,
            waypoints: edge.waypoints,
          },
          position: { x: 0, y: 0 },
          grabbable: false,
          pannable: true,
        };
      }),
    );
  }
}
