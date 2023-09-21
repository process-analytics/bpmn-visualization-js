/*
Copyright 2021 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { BaseBpmnSemantic, BpmnSemantic, EdgeBpmnSemantic, ShapeBpmnSemantic } from './types';
import type BpmnModel from '../../model/bpmn/internal/BpmnModel';
import type { Edge } from '../../model/bpmn/internal/edge/edge';
import type Shape from '../../model/bpmn/internal/shape/Shape';
import type { ModelFilter } from '../options';

import { ShapeBpmnMarkerKind, ShapeUtil } from '../../model/bpmn/internal';
import { Flow } from '../../model/bpmn/internal/edge/flows';
import ShapeBpmnElement, { ShapeBpmnCallActivity, ShapeBpmnEvent, ShapeBpmnSubProcess } from '../../model/bpmn/internal/shape/ShapeBpmnElement';

import { ModelFiltering } from './bpmn-model-filters';

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
    const element = this.searchableModel?.elementById(bpmnElementId);
    if (!element) {
      return undefined;
    }
    const bpmnElement = element.bpmnElement;
    const isShape = bpmnElement instanceof ShapeBpmnElement;

    return {
      id: bpmnElementId,
      isShape: isShape,
      kind: bpmnElement.kind,
      name: bpmnElement.name,
      ...(bpmnElement instanceof Flow
        ? ({
            sourceRefId: bpmnElement.sourceReferenceId,
            targetRefId: bpmnElement.targetReferenceId,
          } satisfies Omit<EdgeBpmnSemantic, keyof BaseBpmnSemantic>)
        : ({
            callActivityGlobalTaskKind: bpmnElement instanceof ShapeBpmnCallActivity ? bpmnElement.globalTaskKind : undefined,
            callActivityKind: bpmnElement instanceof ShapeBpmnCallActivity ? bpmnElement.callActivityKind : undefined,
            eventDefinitionKind: bpmnElement instanceof ShapeBpmnEvent ? bpmnElement.eventDefinitionKind : undefined,
            incomingIds: bpmnElement.incomingIds,
            outgoingIds: bpmnElement.outgoingIds,
            parentId: bpmnElement.parentId,
            subProcessKind: bpmnElement instanceof ShapeBpmnSubProcess ? bpmnElement.subProcessKind : undefined,
          } satisfies Omit<ShapeBpmnSemantic, keyof BaseBpmnSemantic>)),
    };
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
  for (const shape of bpmnModel.flowNodes) {
    const kind = shape.bpmnElement.kind;
    if (ShapeUtil.isSubProcess(kind)) {
      subprocesses.push(shape);
    } else if (ShapeUtil.isBoundaryEvent(kind)) {
      boundaryEvents.push(shape);
    } else if (!collapsedSubProcessIds.includes(shape.bpmnElement.parentId)) {
      otherFlowNodes.push(shape);
    }
  }

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
  private elements = new Map<string, Shape | Edge>();

  constructor(bpmnModel: BpmnModel) {
    for (const shapeOrEdge of ([] as (Edge | Shape)[]).concat(bpmnModel.pools, bpmnModel.lanes, bpmnModel.flowNodes, bpmnModel.edges))
      this.elements.set(shapeOrEdge.bpmnElement.id, shapeOrEdge);
  }

  elementById(id: string): Shape | Edge | undefined {
    return this.elements.get(id);
  }
}
