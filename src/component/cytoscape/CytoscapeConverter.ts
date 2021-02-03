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

export class CytoscapeConverter {
  constructor(private graph: Core) {}

  convertToCytoscapeModel(bpmnModel: BpmnModel): void {
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
    this.graph.add(
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
    this.graph.add(
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
    this.graph.add(
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
  }
}
