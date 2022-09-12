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

/**
 * @internal
 */
export class ModelFiltering {
  filter(bpmnModel: BpmnModel, modelFilter?: ModelFilter): BpmnModel {
    const poolIdsFilter: string[] = [];
    const poolNamesFilter: string[] = [];
    ensureIsArray(modelFilter?.pools)
      .filter(p => p && Object.keys(p).length)
      .forEach(filter => (filter.id ? poolIdsFilter.push(filter.id) : filter.name && poolNamesFilter.push(filter.name)));

    if (poolIdsFilter.length == 0 && poolNamesFilter.length == 0) {
      return bpmnModel;
    }

    const { filteredPools, filteredPoolIds } = filterPools(bpmnModel, poolIdsFilter, poolNamesFilter);
    const filteredPoolAndBlackPoolIds = [...poolIdsFilter, ...filteredPoolIds];
    const { filteredLanes, filteredLaneIds, filteredFlowNodes, filteredFlowNodeIds } = filterLanesAndFlowNodes(bpmnModel.lanes, bpmnModel.flowNodes, filteredPoolAndBlackPoolIds);
    const filteredEdges = filterEdges(bpmnModel.edges, [...filteredPoolAndBlackPoolIds, ...filteredLaneIds, ...filteredFlowNodeIds]);

    // For the NOT displayed Pool, there is no Shape for it, but we need to filter the flow nodes, the lanes and the edges which are in the NOT displayed Pool
    // If there is no shape associated to a Pool, no flow nodes, no lanes and no edges, there is no ShapeBPMNElement associated to the pool id to filter.
    // So we need to throw an error.
    if (filteredPools.length == 0 && filteredLanes.length == 0 && filteredFlowNodes.length == 0 && filteredEdges.length == 0) {
      let errorMsgSuffix = poolIdsFilter.length > 0 ? ` for ids [${poolIdsFilter}]` : '';
      const msgSeparator = errorMsgSuffix ? ' and' : '';
      errorMsgSuffix += poolNamesFilter.length > 0 ? `${msgSeparator} for names [${poolNamesFilter}]` : '';
      throw new Error('No matching pools' + errorMsgSuffix);
    }

    return { lanes: filteredLanes, flowNodes: filteredFlowNodes, pools: filteredPools, edges: filteredEdges };
  }
}

function filterPools(bpmnModel: BpmnModel, poolIdsFilter: string[], poolNamesFilter: string[]): { filteredPools: Shape[]; filteredPoolIds: string[] } {
  const filteredPools = bpmnModel.pools.filter(pool => poolIdsFilter.includes(pool.bpmnElement.id) || poolNamesFilter.includes(pool.bpmnElement.name));
  const filteredPoolIds = filteredPools.map(shape => shape.bpmnElement.id);
  return { filteredPools, filteredPoolIds };
}

function filterLanesAndFlowNodes(
  lanes: Shape[],
  flowNodes: Shape[],
  parentIdsToFilter: string[],
): { filteredLanes: Shape[]; filteredLaneIds: string[]; filteredFlowNodes: Shape[]; filteredFlowNodeIds: string[] } {
  const { filteredLanes, filteredLaneIds } = filterLanes(lanes, parentIdsToFilter);

  const {
    filteredLanes: filteredSubLanes,
    filteredLaneIds: filteredSubLanesIds,
    filteredFlowNodes,
    filteredFlowNodeIds,
  } = filterFlowNodes(flowNodes, [...parentIdsToFilter, ...filteredLaneIds], lanes);
  filteredLanes.push(...filteredSubLanes);
  filteredLaneIds.push(...filteredSubLanesIds);
  return { filteredLanes, filteredLaneIds, filteredFlowNodes, filteredFlowNodeIds };
}

function filterLanes(lanes: Shape[], parentIdsToFilter: string[]): { filteredLanes: Shape[]; filteredLaneIds: string[] } {
  const filteredLanes = lanes.filter(shape => parentIdsToFilter.includes(shape.bpmnElement.parentId));
  const filteredLaneIds = filteredLanes.map(shape => shape.bpmnElement.id);
  if (filteredLanes.length > 0) {
    const { filteredLanes: filteredSubLanes, filteredLaneIds: filteredSubLaneIds } = filterLanes(lanes, filteredLaneIds);
    filteredLanes.push(...filteredSubLanes);
    filteredLaneIds.push(...filteredSubLaneIds);
  }
  return { filteredLanes, filteredLaneIds };
}

function filterFlowNodes(
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
  } = filterLanesAndFlowNodes(lanes, flowNodes, filteredFlowNodeIds);
  filteredFlowNodes.push(...filteredChildFlowNodes);
  filteredFlowNodeIds.push(...filteredChildFlowNodeIds);
  return { filteredLanes, filteredLaneIds, filteredFlowNodes, filteredFlowNodeIds };
}

function filterEdges(edges: Edge[], filteredElementIds: string[]): Edge[] {
  return edges.filter(edge => filteredElementIds.includes(edge.bpmnElement.sourceRefId) && filteredElementIds.includes(edge.bpmnElement.targetRefId));
}
