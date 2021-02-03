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
import BpmnModel from '../../model/bpmn/internal/BpmnModel';
import { Core } from 'cytoscape';
import Shape from '../../model/bpmn/internal/shape/Shape';

export class CytoscapeConverter {
  constructor(private graph: Core) {}

  convertToCytoscapeModel(bpmnModel: BpmnModel): void {
    this.graph.remove('*');

    // eslint-disable-next-line no-console
    console.log('____________________BPMN MODEL___________________', bpmnModel);
    this.convertNodes(bpmnModel);
    this.convertEdges(bpmnModel);
  }

  private convertEdges(bpmnModel: BpmnModel): void {
    this.graph.add(
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

  private convertNodes(bpmnModel: BpmnModel): void {
    this.convertNode(bpmnModel.pools);
    this.convertNode(bpmnModel.lanes);
    this.convertNode(bpmnModel.flowNodes, true);
  }

  private convertNode(shapes: Shape[], selectable = false): void {
    this.graph.add(
      shapes.map(function (shape) {
        return {
          group: 'nodes',
          data: {
            id: shape.bpmnElement.id,
            parent: shape.bpmnElement.parentId,
            label: shape.bpmnElement.name,
            kind: shape.bpmnElement.kind,
            height: shape.bounds.height,
            width: shape.bounds.width,
          },
          position: { x: shape.bounds.x, y: shape.bounds.y },
          selectable: selectable,
          grabbable: false,
          pannable: true,
        };
      }),
    );
  }
}
