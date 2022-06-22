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

function logModelFiltering(msg: unknown, ...optionalParams: unknown[]): void {
  // eslint-disable-next-line no-console
  _log('model filtering', msg, ...optionalParams);
}

function _log(header: string, message: unknown, ...optionalParams: unknown[]): void {
  // eslint-disable-next-line no-console
  console.info(header + ' - ' + message, ...optionalParams);
}

// TODO find a convenient name in the final implementation
export class ModelFiltering {
  filter(bpmnModel: BpmnModel, modelFilter?: ModelFilter): BpmnModel {
    logModelFiltering('START');
    const poolFilters = ensureIsArray(modelFilter?.pools).filter(p => p && Object.keys(p).length);
    const poolIdsFilter = poolFilters.filter(filter => filter.id).map(filter => filter.id);
    const poolNamesFilter = poolFilters.filter(filter => !filter.id && filter.name).map(filter => filter.name);

    if (poolIdsFilter.length == 0 && poolNamesFilter.length == 0) {
      logModelFiltering('No pool filtering set, so skip filtering');
      // TODO no pool in model but filteredPools --> error with dedicated message? add a test for this use case
      return bpmnModel;
    }

    // lookup pools
    const pools = bpmnModel.pools;
    logModelFiltering('total pools in the model: ' + pools?.length);
    const filteredPools = pools.filter(pool => poolIdsFilter.includes(pool.bpmnElement.id) || poolNamesFilter.includes(pool.bpmnElement.name));
    if (filteredPools.length == 0) {
      let errorMsgSuffix = poolIdsFilter.length > 0 ? ' with ids ' + poolIdsFilter : '';
      errorMsgSuffix += poolNamesFilter.length > 0 ? ' with names ' + poolNamesFilter : '';
      throw new Error('no existing pool' + errorMsgSuffix);
    }
    // TODO also fail if one of the ids is not retrieved? or filter at best?

    // TODO use consistent names: 'kept' or 'filtered' but not both
    // prepare parent
    const poolIdsToFilter = filteredPools.map(shape => shape.bpmnElement.id);
    logModelFiltering('kept pools number: ' + poolIdsToFilter.length);
    logModelFiltering('kept pools: ' + poolIdsToFilter);

    const { filteredLanes, filteredLanesIds, filteredFlowNodes, filteredFlowNodeIds } = this.filterLanesAndFlowNodes(bpmnModel.lanes, bpmnModel.flowNodes, poolIdsToFilter);

    // filterPoolBpmnIds message flow: a single pool, remove all but we should remove refs to outgoing msg flows on related shapes
    // keep only edge whose source and target have been kept
    logModelFiltering('edges number: ', bpmnModel.edges.length);
    const keptElementIds = [...poolIdsToFilter, ...filteredLanesIds, ...filteredFlowNodeIds];
    const filteredEdges = bpmnModel.edges.filter(edge => keptElementIds.includes(edge.bpmnElement.sourceRefId) && keptElementIds.includes(edge.bpmnElement.targetRefId));
    logModelFiltering('filteredEdges number: ', filteredEdges.length);

    logModelFiltering('END');
    return { lanes: filteredLanes, flowNodes: filteredFlowNodes, pools: filteredPools, edges: filteredEdges };
  }

  private filterLanesAndFlowNodes(
    lanes: Shape[],
    flowNodes: Shape[],
    parentIdsToFilter: string[],
  ): { filteredLanes: Shape[]; filteredLanesIds: string[]; filteredFlowNodes: Shape[]; filteredFlowNodeIds: string[] } {
    // lanes
    const { filteredLanes, filteredLanesIds } = this.filterLanes(lanes, parentIdsToFilter);
    logModelFiltering('filtered lanes: ' + filteredLanesIds);
    logModelFiltering('kept lanes number: ' + filteredLanesIds.length);
    const keptElementIds = [...parentIdsToFilter, ...filteredLanesIds];

    // flow nodes
    logModelFiltering('keptElementIds before lookup: ', keptElementIds.length);
    const {
      filteredLanes: filteredSubLanes,
      filteredLanesIds: filteredSubLanesIds,
      filteredFlowNodes,
      filteredFlowNodeIds,
    } = this.filterFlowNodes(flowNodes, keptElementIds, lanes);
    logModelFiltering('filtered sub lanes: ' + filteredSubLanes);
    logModelFiltering('kept sub lanes number: ' + filteredSubLanesIds.length);
    filteredLanes.push(...filteredSubLanes);
    filteredLanesIds.push(...filteredSubLanesIds);
    logModelFiltering('filtered flowNodes: ' + filteredFlowNodes);
    logModelFiltering('kept flowNodes number: ' + filteredFlowNodeIds.length);
    keptElementIds.push(...filteredSubLanesIds, ...filteredFlowNodeIds);
    logModelFiltering('keptElementIds after lookup: ', keptElementIds.length);
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
      // children of subprocesses / call activity
      // boundary events attached to tasks
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
