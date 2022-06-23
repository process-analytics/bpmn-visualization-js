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

import type BpmnModel from '../../model/bpmn/internal/BpmnModel';
import type { ModelFilter } from '../options';
import { ensureIsArray } from '../helpers/array-utils';
import type Shape from '../../model/bpmn/internal/shape/Shape';

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

    const pools = bpmnModel.pools;
    const filteredPools = pools.filter(pool => poolIdsFilter.includes(pool.bpmnElement.id) || poolNamesFilter.includes(pool.bpmnElement.name));
    if (filteredPools.length == 0) {
      let errorMsgSuffix = poolIdsFilter.length > 0 ? ' with ids ' + poolIdsFilter : '';
      errorMsgSuffix += poolNamesFilter.length > 0 ? ' with names ' + poolNamesFilter : '';
      // TODO change - No matching pools for ids [xxxx,xxxxxxxx] or names [yyyyy,yyyyyy]
      throw new Error('no existing pool' + errorMsgSuffix);
    }
    // TODO use consistent names: 'kept' or 'filtered' but not both --> use 'filter' everywhere
    const poolIdsToFilter = filteredPools.map(shape => shape.bpmnElement.id);

    const { filteredLanes, filteredLanesIds, filteredFlowNodes, filteredFlowNodeIds } = this.filterLanesAndFlowNodes(bpmnModel.lanes, bpmnModel.flowNodes, poolIdsToFilter);

    const keptElementIds = [...poolIdsToFilter, ...filteredLanesIds, ...filteredFlowNodeIds];
    const filteredEdges = bpmnModel.edges.filter(edge => keptElementIds.includes(edge.bpmnElement.sourceRefId) && keptElementIds.includes(edge.bpmnElement.targetRefId));

    return { lanes: filteredLanes, flowNodes: filteredFlowNodes, pools: filteredPools, edges: filteredEdges };
  }

  private filterLanesAndFlowNodes(
    lanes: Shape[],
    flowNodes: Shape[],
    parentIdsToFilter: string[],
  ): { filteredLanes: Shape[]; filteredLanesIds: string[]; filteredFlowNodes: Shape[]; filteredFlowNodeIds: string[] } {
    // TODO rename --> filter, not kept
    const { filteredLanes, filteredLanesIds } = this.filterLanes(lanes, parentIdsToFilter);
    const keptElementIds = [...parentIdsToFilter, ...filteredLanesIds];

    const {
      filteredLanes: filteredSubLanes,
      filteredLanesIds: filteredSubLanesIds,
      filteredFlowNodes,
      filteredFlowNodeIds,
    } = this.filterFlowNodes(flowNodes, keptElementIds, lanes);
    filteredLanes.push(...filteredSubLanes);
    filteredLanesIds.push(...filteredSubLanesIds);
    keptElementIds.push(...filteredSubLanesIds, ...filteredFlowNodeIds);
    return { filteredLanes, filteredLanesIds, filteredFlowNodes, filteredFlowNodeIds };
  }

  private filterLanes(lanes: Shape[], parentIdsToFilter: string[]): { filteredLanes: Shape[]; filteredLanesIds: string[] } {
    const filteredLanes = lanes.filter(shape => parentIdsToFilter.includes(shape.bpmnElement.parentId));
    const filteredLaneIds = filteredLanes.map(shape => shape.bpmnElement.id);
    if (filteredLanes.length > 0) {
      const { filteredLanes: filteredSubLanes, filteredLanesIds: filteredSubLaneIds } = this.filterLanes(lanes, filteredLaneIds);
      filteredLanes.push(...filteredSubLanes);
      filteredLaneIds.push(...filteredSubLaneIds);
    }
    return { filteredLanes: filteredLanes, filteredLanesIds: filteredLaneIds };
  }

  private filterFlowNodes(
    flowNodes: Shape[],
    parentIdsToFilter: string[],
    lanes: Shape[],
  ): { filteredLanes: Shape[]; filteredLanesIds: string[]; filteredFlowNodes: Shape[]; filteredFlowNodeIds: string[] } {
    const filteredFlowNodes = flowNodes.filter(shape => parentIdsToFilter.includes(shape.bpmnElement.parentId));
    const filteredFlowNodeIds = filteredFlowNodes.map(shape => shape.bpmnElement.id);
    const filteredLanes = [],
      filteredLanesIds = [];

    if (filteredFlowNodes.length > 0) {
      // manage children of subprocesses / call activity and boundary events attached to tasks
      const {
        filteredLanes: filteredSubLanes,
        filteredLanesIds: filteredSubLanesIds,
        filteredFlowNodes: filteredChildFlowNodes,
        filteredFlowNodeIds: filteredChildFlowNodeIds,
      } = this.filterLanesAndFlowNodes(lanes, flowNodes, filteredFlowNodeIds);
      filteredLanes.push(...filteredSubLanes);
      filteredLanesIds.push(...filteredSubLanesIds);
      filteredFlowNodes.push(...filteredChildFlowNodes);
      filteredFlowNodeIds.push(...filteredChildFlowNodeIds);
    }
    return { filteredLanes, filteredLanesIds, filteredFlowNodes, filteredFlowNodeIds };
  }
}
