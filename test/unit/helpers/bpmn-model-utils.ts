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
import { MessageFlow, SequenceFlow } from '../../../src/model/bpmn/internal/edge/flows';
import Shape from '../../../src/model/bpmn/internal/shape/Shape';
import ShapeBpmnElement, { ShapeBpmnActivity, ShapeBpmnStartEvent } from '../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '../../../src/model/bpmn/internal';
import { ensureIsArray } from '../../../src/component/helpers/array-utils';

const newBpmnModel = (): BpmnModel => ({
  edges: [],
  flowNodes: [],
  lanes: [],
  pools: [],
});

// TODO missing parentId in SequenceFlow constructor
const newSequenceFlow = (parentId: string, id: string, name: string, source: string, target: string): Edge => new Edge(`Edge_${id}`, new SequenceFlow(id, name, source, target));

const newMessageFlow = (id: string, name: string, source: string, target: string): Edge => new Edge(`Edge_${id}`, new MessageFlow(id, name, source, target));

export const sequenceFlowInModel = (id: string, name: string): BpmnModel => {
  const bpmnModel = newBpmnModel();
  // TODO duplication with newSequenceFlow
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

const newStartEvent = (parent: string, id: string, name: string): Shape => new Shape(`Shape_${id}`, new ShapeBpmnStartEvent(id, name, ShapeBpmnEventDefinitionKind.TIMER, parent));

const newPool = (id: string, name: string): Shape => new Shape(`Shape_${id}`, new ShapeBpmnElement(id, name, ShapeBpmnElementKind.POOL));
const addNewPool = (bpmnModel: BpmnModel, id: string, name: string): void => {
  bpmnModel.pools.push(newPool(id, name));
};

const newTask = (parent: string, id: string, name: string): Shape => new Shape(`Shape_${id}`, new ShapeBpmnActivity(id, name, ShapeBpmnElementKind.TASK, parent));
const newGroup = (parent: string, id: string, name: string): Shape => new Shape(`Shape_${id}`, new ShapeBpmnElement(id, name, ShapeBpmnElementKind.GROUP, parent));

export const toBpmnModel = (model: BpmnModelTestRepresentation): BpmnModel => {
  const bpmnModel = newBpmnModel();
  const pools = ensureIsArray(model.pools);

  pools.forEach(pool => {
    addNewPool(bpmnModel, pool.id, pool.name);
    if (pool.startEvents) {
      bpmnModel.flowNodes.push(newStartEvent(pool.id, pool.startEvents.id, pool.startEvents.name));
    }
    if (pool.tasks) {
      bpmnModel.flowNodes.push(newTask(pool.id, pool.tasks.id, pool.tasks.name));
    }
    if (pool.groups) {
      bpmnModel.flowNodes.push(newGroup(pool.id, pool.groups.id, pool.groups.name));
    }
    if (pool.sequenceFlows) {
      const sequenceFlow = pool.sequenceFlows;
      bpmnModel.edges.push(newSequenceFlow(pool.id, sequenceFlow.id, sequenceFlow.name, sequenceFlow.source, sequenceFlow.target));
    }
  });

  if (model.messageFlows) {
    const messageFlow = model.messageFlows;
    bpmnModel.edges.push(newMessageFlow(messageFlow.id, messageFlow.name, messageFlow.source, messageFlow.target));
  }

  return bpmnModel;
};

export interface BpmnModelTestRepresentation extends ContainerWithLanes {
  pools?: Pool | Pool[];
  messageFlows?: Flow;
  // TODO add elements out of participant lanes, or elements out of lanes
  // the need is minimal for filtering participants, in this case, the filtering fails
  // only considered when there is no defined pools
  process?: ContainerWithLanes;
}

interface BaseElement {
  id: string;
  name?: string;
}

interface Pool extends ContainerWithLanes, BaseElement {}

interface ContainerElement extends BaseElement, Container {}

interface ContainerWithLanes extends Container {
  lanes?: ContainerElement;
}

// TODO allow array in all properties
interface Container {
  startEvents?: BaseElement;
  tasks?: BaseElement;
  groups?: BaseElement;
  // subProcesses?: ContainerElement; // WARN subprocess can have lanes!!!!
  // callActivities?: ContainerElement;
  sequenceFlows?: Flow;
}

interface Flow extends BaseElement {
  source: string;
  target: string;
}
