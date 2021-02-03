/**
 * Copyright 2021 Bonitasoft S.A.
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
import cytoscape, { Core } from 'cytoscape';

export class CytoscapeConfigurator {
  constructor(private container: string) {}

  initializeGraph(): Core {
    return cytoscape({
      container: document.getElementById(this.container),
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
  }
}
