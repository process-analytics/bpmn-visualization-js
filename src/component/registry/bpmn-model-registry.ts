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
import { ensureIsArray } from '../helpers/array-utils';
import type BpmnModel from '../../model/bpmn/internal/BpmnModel';
import type Shape from '../../model/bpmn/internal/shape/Shape';
import type { Edge } from '../../model/bpmn/internal/edge/edge';
import type { BpmnSemantic } from './types';
import { ShapeBpmnMarkerKind, ShapeUtil } from '../../model/bpmn/internal';
import type { ShapeBpmnSubProcess } from '../../model/bpmn/internal/shape/ShapeBpmnElement';
import ShapeBpmnElement from '../../model/bpmn/internal/shape/ShapeBpmnElement';
import type { ModelFilter } from '../options';

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
    } else if (!collapsedSubProcessIds.includes(shape.bpmnElement.parent?.id)) {
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

    // TODO no pool in model --> error?

    // lookup pools
    const pools = bpmnModel.pools;
    logModelFiltering('pools: ', pools);
    // TODO ensure it is an array
    // const filterPoolBpmnIds = <Array<string>>poolIdsFilter;
    const filterPoolBpmnIds = ensureIsArray(poolIdsFilter);
    // TODO choose filterPoolBpmnIds by id if defined, otherwise filterPoolBpmnIds by name
    const filteredPools = pools.filter(pool => filterPoolBpmnIds.includes(pool.bpmnElement.id));
    logModelFiltering('filtered pools: ', filteredPools);
    if (filteredPools.length == 0) {
      throw new Error('no existing pool with ids ' + filterPoolBpmnIds);
    }

    // prepare parent
    const filteredPoolBpmnElements = filteredPools.map(pool => pool.bpmnElement);

    // lanes
    logModelFiltering('lanes: ', bpmnModel.lanes);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filteredLanes = bpmnModel.lanes.filter(lane => filteredPoolBpmnElements.includes(lane.bpmnElement.parent));
    logModelFiltering('filtered lanes: ', filteredLanes);

    // TODO subprocesses / call activity

    // TODO group - they are currently not associated to participant. How do we handle it?

    const filteredFlowNodes = bpmnModel.flowNodes.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      flowNode => filteredPools.map(pool => pool.bpmnElement).includes(flowNode.bpmnElement.parent) || filteredLanes.includes(flowNode.bpmnElement.parent),
    );

    const flowNodes: Shape[] = filteredFlowNodes; //[];
    // const flowNodes: Shape[] = bpmnModel.flowNodes; //[];
    const lanes: Shape[] = filteredLanes; //[];
    // filterPoolBpmnIds message flow: a single pool, remove all but we should remove refs to outgoing msg flows on related shapes
    const edges: Edge[] = bpmnModel.edges; //[];

    logModelFiltering('END');
    return { flowNodes, lanes, pools: filteredPools, edges };
  }
}
