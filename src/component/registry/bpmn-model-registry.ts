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
import Shape from '../../model/bpmn/internal/shape/Shape';
import { Edge } from '../../model/bpmn/internal/edge/edge';
import { BpmnSemantic } from './types';
import { ShapeBpmnMarkerKind, ShapeUtil } from '../../model/bpmn/internal';
import ShapeBpmnElement, { ShapeBpmnSubProcess } from '../../model/bpmn/internal/shape/ShapeBpmnElement';

export class BpmnModelRegistry {
  private searchableModel: SearchableModel;
  private onLoadCallback: () => void;

  load(bpmnModel: BpmnModel): RenderedModel {
    this.searchableModel = new SearchableModel(bpmnModel);
    this.onLoadCallback?.();
    return toRenderedModel(bpmnModel);
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
