/**
 * Copyright 2022 Bonitasoft S.A.
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

import type { Edge } from '../../model/bpmn/internal/edge/edge';
import type Shape from '../../model/bpmn/internal/shape/Shape';
import type BpmnModel from '../../model/bpmn/internal/BpmnModel';
import type { ModelFilter } from '../options';
import { ensureIsArray } from '../helpers/array-utils';

export class ModelFiltering {
  filter(bpmnModel: BpmnModel, modelFilter?: ModelFilter): BpmnModel {
    const poolFilters = ensureIsArray(modelFilter?.pools).filter(p => p && Object.keys(p).length);
    const poolIdsFilter = poolFilters.filter(filter => filter.id).map(filter => filter.id);
    const poolNamesFilter = poolFilters.filter(filter => !filter.id && filter.name).map(filter => filter.name);

    if (poolIdsFilter.length == 0 && poolNamesFilter.length == 0) {
      return bpmnModel;
    }

    // TODO no pool in model but filteredPools exist --> error with dedicated message? add a test for this use case
    // Impossible to filter because the existing model doesn't contain any pool

    const { filteredPools, filteredPoolsIds } = this.filterPools(bpmnModel, poolIdsFilter, poolNamesFilter);
    const { filteredLanes, filteredLaneIds, filteredFlowNodes, filteredFlowNodeIds } = this.filterLanesAndFlowNodes(bpmnModel.lanes, bpmnModel.flowNodes, filteredPoolsIds);
    const filteredEdges = this.filterEdges(bpmnModel.edges, [...filteredPoolsIds, ...filteredLaneIds, ...filteredFlowNodeIds]);

    return { lanes: filteredLanes, flowNodes: filteredFlowNodes, pools: filteredPools, edges: filteredEdges };
  }

  private filterPools(bpmnModel: BpmnModel, poolIdsFilter: string[], poolNamesFilter: string[]): { filteredPools: Shape[]; filteredPoolsIds: string[] } {
    const filteredPools = bpmnModel.pools.filter(pool => poolIdsFilter.includes(pool.bpmnElement.id) || poolNamesFilter.includes(pool.bpmnElement.name));
    if (filteredPools.length == 0) {
      let errorMsgSuffix = poolIdsFilter.length > 0 ? ` for ids [${poolIdsFilter}]` : '';
      errorMsgSuffix += poolNamesFilter.length > 0 ? `${errorMsgSuffix ? ' and' : ''} for names [${poolNamesFilter}]` : '';
      throw new Error('No matching pools' + errorMsgSuffix);
    }
    const filteredPoolsIds = filteredPools.map(shape => shape.bpmnElement.id);
    return { filteredPools, filteredPoolsIds };
  }

  private filterLanesAndFlowNodes(
    lanes: Shape[],
    flowNodes: Shape[],
    parentIdsToFilter: string[],
  ): { filteredLanes: Shape[]; filteredLaneIds: string[]; filteredFlowNodes: Shape[]; filteredFlowNodeIds: string[] } {
    const { filteredLanes, filteredLaneIds } = this.filterLanes(lanes, parentIdsToFilter);

    const {
      filteredLanes: filteredSubLanes,
      filteredLaneIds: filteredSubLanesIds,
      filteredFlowNodes,
      filteredFlowNodeIds,
    } = this.filterFlowNodes(flowNodes, [...parentIdsToFilter, ...filteredLaneIds], lanes);
    filteredLanes.push(...filteredSubLanes);
    filteredLaneIds.push(...filteredSubLanesIds);
    return { filteredLanes, filteredLaneIds, filteredFlowNodes, filteredFlowNodeIds };
  }

  private filterLanes(lanes: Shape[], parentIdsToFilter: string[]): { filteredLanes: Shape[]; filteredLaneIds: string[] } {
    const filteredLanes = lanes.filter(shape => parentIdsToFilter.includes(shape.bpmnElement.parentId));
    const filteredLaneIds = filteredLanes.map(shape => shape.bpmnElement.id);
    if (filteredLanes.length > 0) {
      const { filteredLanes: filteredSubLanes, filteredLaneIds: filteredSubLaneIds } = this.filterLanes(lanes, filteredLaneIds);
      filteredLanes.push(...filteredSubLanes);
      filteredLaneIds.push(...filteredSubLaneIds);
    }
    return { filteredLanes, filteredLaneIds };
  }

  private filterFlowNodes(
    flowNodes: Shape[],
    parentIdsToFilter: string[],
    lanes: Shape[],
  ): { filteredLanes: Shape[]; filteredLaneIds: string[]; filteredFlowNodes: Shape[]; filteredFlowNodeIds: string[] } {
    const filteredFlowNodes = flowNodes.filter(shape => parentIdsToFilter.includes(shape.bpmnElement.parentId));
    if (filteredFlowNodes.length === 0) {
      return { filteredLanes: [], filteredLaneIds: [], filteredFlowNodes: [], filteredFlowNodeIds: [] };
    }

    // manage children of subprocesses / call activity and boundary events attached to tasks
    const filteredFlowNodeIds = filteredFlowNodes.map(shape => shape.bpmnElement.id);
    const {
      filteredLanes,
      filteredLaneIds,
      filteredFlowNodes: filteredChildFlowNodes,
      filteredFlowNodeIds: filteredChildFlowNodeIds,
    } = this.filterLanesAndFlowNodes(lanes, flowNodes, filteredFlowNodeIds);
    filteredFlowNodes.push(...filteredChildFlowNodes);
    filteredFlowNodeIds.push(...filteredChildFlowNodeIds);
    return { filteredLanes, filteredLaneIds, filteredFlowNodes, filteredFlowNodeIds };
  }

  private filterEdges(edges: Edge[], filteredElementIds: string[]): Edge[] {
    return edges.filter(edge => filteredElementIds.includes(edge.bpmnElement.sourceRefId) && filteredElementIds.includes(edge.bpmnElement.targetRefId));
  }
}
