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
    if (poolFilters.length == 0) {
      logModelFiltering('No pool filtering set, so skip filtering');
      // TODO no pool in model but filteredPools --> error with dedicated message? add a test for this use case
      return bpmnModel;
    }

    const poolIdsFilter = poolFilters.filter(filter => filter.id).map(filter => filter.id);
    const poolNamesFilter = poolFilters.filter(filter => !filter.id && filter.name).map(filter => filter.name);

    // lookup pools
    const pools = bpmnModel.pools;
    logModelFiltering('total pools in the model: ' + pools?.length);
    // TODO choose filter by id if defined, otherwise filter by name
    const filteredPools = pools.filter(pool => poolIdsFilter.includes(pool.bpmnElement.id) || poolNamesFilter.includes(pool.bpmnElement.name));
    if (filteredPools.length == 0) {
      let errorMsgSuffix = poolIdsFilter.length > 0 ? ' with ids ' + poolIdsFilter : '';
      errorMsgSuffix += poolNamesFilter.length > 0 ? ' with names ' + poolNamesFilter : '';
      throw new Error('no existing pool' + errorMsgSuffix);
    }
    // TODO also fail if one of the ids is not retrieved? or filter at best?

    // TODO use consistent names: 'kept' or 'filtered' but not both
    // prepare parent
    const keptElementIds = filteredPools.map(shape => shape.bpmnElement.id);
    logModelFiltering('kept pools number: ' + keptElementIds.length);
    logModelFiltering('kept pools: ' + keptElementIds);

    // lanes
    const filteredLanes = bpmnModel.lanes.filter(shape => keptElementIds.includes(shape.bpmnElement.parentId));
    const filteredLaneBpmnElementIds = filteredLanes.map(shape => shape.bpmnElement.id);
    logModelFiltering('filtered lanes: ' + filteredLaneBpmnElementIds);
    logModelFiltering('kept lanes number: ' + filteredLaneBpmnElementIds.length);
    keptElementIds.push(...filteredLaneBpmnElementIds);

    // children of subprocesses / call activity
    // boundary events attached to tasks
    const flowNodes = bpmnModel.flowNodes;
    const accumulatedFilteredFlowNodes: Shape[] = []; // TODO rename into filteredFlowNodes
    let keptParentIdsOfFlowNodes = keptElementIds;

    logModelFiltering('keptElementIds before lookup: ', keptElementIds.length);

    let cpt = 0;
    while (keptParentIdsOfFlowNodes.length > 0) {
      const filteredFlowNodes = flowNodes.filter(flowNode => keptParentIdsOfFlowNodes.includes(flowNode.bpmnElement.parentId));
      const keptFlowNodeIds = filteredFlowNodes.map(shape => shape.bpmnElement.id);
      logModelFiltering('kept flow nodes number: ' + keptFlowNodeIds.length);
      accumulatedFilteredFlowNodes.push(...filteredFlowNodes);
      logModelFiltering('accumulated flow nodes number: ' + accumulatedFilteredFlowNodes.length);
      keptParentIdsOfFlowNodes = keptFlowNodeIds;
      cpt++;
      if (cpt > 10) {
        throw Error('too much iteration');
      }
    }

    logModelFiltering('keptElementIds after lookup: ', keptElementIds.length);
    keptElementIds.push(...accumulatedFilteredFlowNodes.map(shape => shape.bpmnElement.id));

    // filterPoolBpmnIds message flow: a single pool, remove all but we should remove refs to outgoing msg flows on related shapes
    // keep only edge whose source and target have been kept
    const edges = bpmnModel.edges;
    logModelFiltering('edges number: ', edges.length);
    const filteredEdges = edges.filter(edge => keptElementIds.includes(edge.bpmnElement.sourceRefId) && keptElementIds.includes(edge.bpmnElement.targetRefId));
    logModelFiltering('filteredEdges number: ', filteredEdges.length);

    logModelFiltering('END');
    return { flowNodes: accumulatedFilteredFlowNodes, lanes: filteredLanes, pools: filteredPools, edges: filteredEdges };
  }
}
