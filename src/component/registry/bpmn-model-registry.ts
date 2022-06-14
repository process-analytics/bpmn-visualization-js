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
import type BpmnModel from '../../model/bpmn/internal/BpmnModel';
import type Shape from '../../model/bpmn/internal/shape/Shape';
import type { Edge } from '../../model/bpmn/internal/edge/edge';
import type { BpmnSemantic } from './types';
import { ShapeBpmnMarkerKind, ShapeUtil } from '../../model/bpmn/internal';
import type { ShapeBpmnSubProcess } from '../../model/bpmn/internal/shape/ShapeBpmnElement';
import ShapeBpmnElement from '../../model/bpmn/internal/shape/ShapeBpmnElement';
import type { ModelFilter } from '../options';
import { ensureIsArray } from '../helpers/array-utils';

/**
 * @internal
 */
export class BpmnModelRegistry {
  private searchableModel: SearchableModel;
  private onLoadCallback: () => void;

  load(bpmnModel: BpmnModel, modelFilter?: ModelFilter): RenderedModel {
    const filteredModel = new ModelFiltering().filter(bpmnModel, modelFilter);

    this.searchableModel = new SearchableModel(filteredModel);
    this.onLoadCallback?.();
    return toRenderedModel(filteredModel);
  }

  registerOnLoadCallback(callback: () => void): void {
    this.onLoadCallback = callback;
  }

  getBpmnSemantic(bpmnElementId: string): BpmnSemantic | undefined {
    const element = this.searchableModel.elementById(bpmnElementId);
    if (!element) {
      return undefined;
    }
    const bpmnElement = element.bpmnElement;
    const isShape = bpmnElement instanceof ShapeBpmnElement;
    return { id: bpmnElementId, name: bpmnElement.name, isShape: isShape, kind: bpmnElement.kind };
  }
}

function toRenderedModel(bpmnModel: BpmnModel): RenderedModel {
  const collapsedSubProcessIds: string[] = bpmnModel.flowNodes
    .filter(shape => {
      const bpmnElement = shape.bpmnElement;
      return ShapeUtil.isSubProcess(bpmnElement.kind) && (bpmnElement as ShapeBpmnSubProcess).markers.includes(ShapeBpmnMarkerKind.EXPAND);
    })
    .map(shape => shape.bpmnElement.id);

  const subprocesses: Shape[] = [];
  const boundaryEvents: Shape[] = [];
  const otherFlowNodes: Shape[] = [];
  bpmnModel.flowNodes.forEach(shape => {
    const kind = shape.bpmnElement.kind;
    if (ShapeUtil.isSubProcess(kind)) {
      subprocesses.push(shape);
    } else if (ShapeUtil.isBoundaryEvent(kind)) {
      boundaryEvents.push(shape);
    } else if (!collapsedSubProcessIds.includes(shape.bpmnElement.parentId)) {
      otherFlowNodes.push(shape);
    }
  });

  return { boundaryEvents: boundaryEvents, edges: bpmnModel.edges, lanes: bpmnModel.lanes, otherFlowNodes: otherFlowNodes, pools: bpmnModel.pools, subprocesses: subprocesses };
}

/**
 * @internal
 */
export interface RenderedModel {
  edges: Edge[];
  boundaryEvents: Shape[];
  otherFlowNodes: Shape[];
  lanes: Shape[];
  pools: Shape[];
  subprocesses: Shape[];
}

class SearchableModel {
  private elements: Map<string, Shape | Edge> = new Map();

  constructor(bpmnModel: BpmnModel) {
    ([] as Array<Edge | Shape>)
      .concat(bpmnModel.pools, bpmnModel.lanes, bpmnModel.flowNodes, bpmnModel.edges)
      // use the bpmn element id and not the bpmn shape id
      .forEach(e => this.elements.set(e.bpmnElement.id, e));
  }

  elementById(id: string): Shape | Edge | undefined {
    return this.elements.get(id);
  }
}

function logModelFiltering(msg: unknown, ...optionalParams: unknown[]): void {
  // eslint-disable-next-line no-console
  _log('model filtering', msg, ...optionalParams);
}

function _log(header: string, message: unknown, ...optionalParams: unknown[]): void {
  // eslint-disable-next-line no-console
  console.info(header + ' - ' + message, ...optionalParams);
}

class ModelFiltering {
  filter(bpmnModel: BpmnModel, modelFilter?: ModelFilter): BpmnModel {
    logModelFiltering('START');
    // TODO validate that filterPoolBpmnIds is correctly defined = NOT (empty string, empty array, ....)
    const poolIdsFilter = modelFilter?.includes?.pools?.ids;
    // const poolNamesFilter = modelFilter?.includes?.pools?.names;
    if (!poolIdsFilter) {
      logModelFiltering('nothing to filterPoolBpmnIds');
      return bpmnModel;
    }

    // TODO no pool in model but filteredPools --> error with dedicated message? add a test for this use case

    // lookup pools
    const pools = bpmnModel.pools;
    logModelFiltering('total pools: ' + pools?.length);
    // TODO we shouldn't need to cast - type signature issue?
    const filterPoolBpmnIds = <Array<string>>ensureIsArray(poolIdsFilter);
    // TODO choose filter by id if defined, otherwise filter by name
    const filteredPools = pools.filter(pool => filterPoolBpmnIds.includes(pool.bpmnElement.id));
    if (filteredPools.length == 0) {
      throw new Error('no existing pool with ids ' + filterPoolBpmnIds);
    }
    // TODO also fail if one of the ids is not retrieved? or filter at best?

    // prepare parent
    const effectiveFilteredPoolIds = filteredPools.map(shape => shape.bpmnElement.id);
    logModelFiltering('filtered pools: ' + effectiveFilteredPoolIds);
    const keptElementIds = <string[]>[];
    // TODO simplify variables, only use keptElementIds starting from here
    logModelFiltering('kept pools number: ' + filterPoolBpmnIds.length);
    keptElementIds.push(...filterPoolBpmnIds);

    // lanes
    const filteredLanes = bpmnModel.lanes.filter(shape => filterPoolBpmnIds.includes(shape.bpmnElement.parentId));
    const filteredLaneBpmnElementIds = filteredLanes.map(shape => shape.bpmnElement.id);
    logModelFiltering('filtered lanes: ' + filteredLaneBpmnElementIds);
    logModelFiltering('kept lanes number: ' + filteredLaneBpmnElementIds.length);
    keptElementIds.push(...filteredLaneBpmnElementIds);

    // children of subprocesses / call activity
    // boundary events attached to tasks
    const flowNodes = bpmnModel.flowNodes;
    const accumulatedFilteredFlowNodes: Shape[] = []; // TODO rename into filteredFlowNodes
    let keptParentIdsOfFlowNodes = keptElementIds;

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

    // const filteredFlowNodes = flowNodes.filter(flowNode => keptElementIds.includes(flowNode.bpmnElement.parentId));
    //
    // // children of subprocesses / call activity
    // // boundary events attached to tasks
    // // TODO manage in a better way, this doesn't work with boundary elements of a task within a subprocess, nor subprocess of subprocess....
    // const keptFlowNodeIds = filteredFlowNodes.map(shape => shape.bpmnElement.id);
    // logModelFiltering('kept flow nodes number: ' + keptFlowNodeIds.length);
    // keptElementIds.push(...keptFlowNodeIds);
    //
    // // TODO continue, does not work for boundary events and inner elements of a subprocess
    // const additionalFilteredFlowNodes = flowNodes.filter(flowNode => keptFlowNodeIds.includes(flowNode.bpmnElement.parentId));
    // logModelFiltering('Additional kept flow nodes number after checking parent again: ', additionalFilteredFlowNodes.length);
    // logModelFiltering(
    //   'Additional kept flow nodes: ',
    //   additionalFilteredFlowNodes.map(node => node.bpmnElement.id),
    // );
    // const newFilteredFlowNodesNumber = filteredFlowNodes.push(...additionalFilteredFlowNodes);
    // logModelFiltering('Total kept flow nodes number after checking parent again: ', newFilteredFlowNodesNumber);

    // TODO filter edges
    // filterPoolBpmnIds message flow: a single pool, remove all but we should remove refs to outgoing msg flows on related shapes
    const edges: Edge[] = bpmnModel.edges; //[];

    logModelFiltering('END');
    return { flowNodes: accumulatedFilteredFlowNodes, lanes: filteredLanes, pools: filteredPools, edges };
  }
}
