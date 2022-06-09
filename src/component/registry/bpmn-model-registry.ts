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
import { flat } from '../../model/bpmn/internal/BpmnModel';
import { ensureIsArray } from '../helpers/array-utils';
import type { BpmnModel } from '../../model/bpmn/internal/BpmnModel';
import Shape from '../../model/bpmn/internal/shape/Shape';
import { Edge } from '../../model/bpmn/internal/edge/edge';
import type { BpmnSemantic } from './types';
import { ShapeBpmnElementKind, ShapeBpmnMarkerKind, ShapeUtil } from '../../model/bpmn/internal';
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
  const flatBpmnModel = flat(bpmnModel);
  const collapsedSubProcessIds: string[] = flatBpmnModel
    .filter(element => {
      if (element instanceof Shape) {
        const bpmnElement = element.bpmnElement;
        return ShapeUtil.isSubProcess(bpmnElement.kind) && (bpmnElement as ShapeBpmnSubProcess).markers.includes(ShapeBpmnMarkerKind.EXPAND);
      }
    })
    .map(shape => shape.bpmnElement.id);

  const edges: Edge[] = [];
  const pools: Shape[] = [];
  const lanes: Shape[] = [];
  const subprocesses: Shape[] = [];
  const boundaryEvents: Shape[] = [];
  const otherFlowNodes: Shape[] = [];

  flatBpmnModel.forEach(element => {
    if (element instanceof Edge) {
      edges.push(element);
      return;
    }

    const kind = element.bpmnElement.kind;
    if (kind === ShapeBpmnElementKind.POOL) {
      pools.push(element);
    } else if (kind === ShapeBpmnElementKind.LANE) {
      lanes.push(element);
    } else if (ShapeUtil.isSubProcess(kind)) {
      subprocesses.push(element);
    } else if (ShapeUtil.isBoundaryEvent(kind)) {
      boundaryEvents.push(element);
    } else if (!collapsedSubProcessIds.includes(element.bpmnElement.parent?.id)) {
      otherFlowNodes.push(element);
    }
  });

  return {
    boundaryEvents,
    edges,
    lanes,
    otherFlowNodes,
    pools,
    subprocesses,
  };
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
    // use the bpmn element id and not the bpmn shape id
    bpmnModel.forEach(e => this.elements.set(e.bpmnElement.id, e));
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

    // TODO ensure it is an array
    // const filterPoolBpmnIds = <Array<string>>poolIdsFilter;
    const filterPoolBpmnIds = ensureIsArray(poolIdsFilter);

    const pools = bpmnModel.filter(element => element instanceof Shape && element.bpmnElement.kind === ShapeBpmnElementKind.POOL);
    logModelFiltering('pools: ', pools);
    // TODO choose filterPoolBpmnIds by id if defined, otherwise filterPoolBpmnIds by name
    const filteredPools = pools.filter(pool => filterPoolBpmnIds.includes(pool.bpmnElement.id));
    logModelFiltering('filtered pools: ', filteredPools);
    if (filteredPools.length == 0) {
      throw new Error('no existing pool with ids ' + filterPoolBpmnIds);
    }

    logModelFiltering('END');
    return filteredPools;
  }
}
