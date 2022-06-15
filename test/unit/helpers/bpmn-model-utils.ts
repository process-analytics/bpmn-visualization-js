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
import type BpmnModel from '../../../src/model/bpmn/internal/BpmnModel';
import { Edge } from '../../../src/model/bpmn/internal/edge/edge';
import { SequenceFlow } from '../../../src/model/bpmn/internal/edge/flows';
import Shape from '../../../src/model/bpmn/internal/shape/Shape';
import ShapeBpmnElement, { ShapeBpmnStartEvent } from '../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '../../../src/model/bpmn/internal';
import { ensureIsArray } from '../../../src/component/helpers/array-utils';

const newBpmnModel = (): BpmnModel => ({
  edges: [],
  flowNodes: [],
  lanes: [],
  pools: [],
});

export const sequenceFlowInModel = (id: string, name: string): BpmnModel => {
  const bpmnModel = newBpmnModel();
  bpmnModel.edges.push(new Edge(`Edge_${id}`, new SequenceFlow(id, name)));
  return bpmnModel;
};

export const startEventInModel = (id: string, name: string): BpmnModel => {
  const bpmnModel = newBpmnModel();
  bpmnModel.flowNodes.push(newStartEvent('parentId', id, name));
  return bpmnModel;
};

export const laneInModel = (id: string, name: string): BpmnModel => {
  const bpmnModel = newBpmnModel();
  bpmnModel.lanes.push(new Shape(`Shape_${id}`, new ShapeBpmnElement(id, name, ShapeBpmnElementKind.LANE)));
  return bpmnModel;
};

export const poolInModel = (id: string, name: string): BpmnModel => {
  const bpmnModel = newBpmnModel();
  addNewPool(bpmnModel, id, name);
  return bpmnModel;
};

const newStartEvent = (parentId: string, id: string, name: string): Shape =>
  new Shape(`Shape_${id}`, new ShapeBpmnStartEvent(id, name, ShapeBpmnEventDefinitionKind.TIMER, parentId));

const newPool = (id: string, name: string): Shape => new Shape(`Shape_${id}`, new ShapeBpmnElement(id, name, ShapeBpmnElementKind.POOL));
const addNewPool = (bpmnModel: BpmnModel, id: string, name: string): void => {
  bpmnModel.pools.push(newPool(id, name));
};

export const toBpmnModel = (model: ModelRepresentationForTestOnly): BpmnModel => {
  const bpmnModel = newBpmnModel();
  const pools = ensureIsArray(model.pools);

  pools.forEach(pool => {
    addNewPool(bpmnModel, pool.id, pool.name);
    if (pool.startEvent) {
      bpmnModel.flowNodes.push(newStartEvent(pool.id, pool.startEvent.id, pool.startEvent.name));
    }
  });

  return bpmnModel;
};

// TODO rename into BpmnModelTestRepresentation? TestBpmnModel?
export interface ModelRepresentationForTestOnly {
  pools?: PoolForTestOnly | PoolForTestOnly[];
  // TODO add elements out of participant lanes, or elements out of lanes
  // the need is minimal for filtering participants, in this case, the filtering fails
}

export interface BaseElementForTestOnly {
  id: string;
  name?: string;
}

export interface PoolForTestOnly extends BaseElementForTestOnly {
  startEvent: BaseElementForTestOnly;
  tasks?: BaseElementForTestOnly | BaseElementForTestOnly[];
  // sequenceFlows?: XXX;
}
