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
import ShapeBpmnElement, {
  ShapeBpmnActivity,
  ShapeBpmnBoundaryEvent,
  ShapeBpmnCallActivity,
  ShapeBpmnStartEvent,
  ShapeBpmnSubProcess,
} from '../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import { ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind, ShapeBpmnMarkerKind, ShapeBpmnSubProcessKind } from '../../../src/model/bpmn/internal';
import { ensureIsArray } from '../../../src/component/helpers/array-utils';

const newBpmnModel = (): BpmnModel => ({
  edges: [],
  flowNodes: [],
  lanes: [],
  pools: [],
});

export const buildShapeId = (bpmnElementId: string): string => {
  return `Shape_${bpmnElementId}`;
};
export const buildEdgeId = (bpmnElementId: string): string => {
  return `Edge_${bpmnElementId}`;
};

const newSequenceFlow = (id: string, name: string, source: string, target: string): Edge => new Edge(buildEdgeId(id), new SequenceFlow(id, name, source, target));

const newMessageFlow = (id: string, name: string, source: string, target: string): Edge => new Edge(buildEdgeId(id), new MessageFlow(id, name, source, target));

export const sequenceFlowInModel = (id: string, name: string): BpmnModel => {
  const bpmnModel = newBpmnModel();
  bpmnModel.edges.push(newSequenceFlow(id, name, undefined, undefined));
  return bpmnModel;
};

export const startEventInModel = (id: string, name: string): BpmnModel => {
  const bpmnModel = newBpmnModel();
  bpmnModel.flowNodes.push(newStartEvent('parentId', id, name));
  return bpmnModel;
};

export const laneInModel = (id: string, name: string): BpmnModel => {
  const bpmnModel = newBpmnModel();
  bpmnModel.lanes.push(new Shape(buildShapeId(id), new ShapeBpmnElement(id, name, ShapeBpmnElementKind.LANE)));
  return bpmnModel;
};

export const poolInModel = (id: string, name: string): BpmnModel => {
  const bpmnModel = newBpmnModel();
  addNewPool(bpmnModel, id, name);
  return bpmnModel;
};

const newStartEvent = (parent: string, id: string, name: string): Shape =>
  new Shape(buildShapeId(id), new ShapeBpmnStartEvent(id, name, ShapeBpmnEventDefinitionKind.TIMER, parent));
const newBoundaryEvent = (parent: string, id: string, name: string): Shape =>
  new Shape(buildShapeId(id), new ShapeBpmnBoundaryEvent(id, name, ShapeBpmnEventDefinitionKind.CANCEL, parent));

const newPool = (id: string, name: string): Shape => new Shape(buildShapeId(id), new ShapeBpmnElement(id, name, ShapeBpmnElementKind.POOL));
const addNewPool = (bpmnModel: BpmnModel, id: string, name: string): void => {
  bpmnModel.pools.push(newPool(id, name));
};
const newLane = (parent: string, id: string, name: string): Shape => new Shape(buildShapeId(id), new ShapeBpmnElement(id, name, ShapeBpmnElementKind.LANE, parent));

const newTask = (parent: string, id: string, name: string): Shape => new Shape(buildShapeId(id), new ShapeBpmnActivity(id, name, ShapeBpmnElementKind.TASK, parent));
const newCallActivity = (parent: string, id: string, name: string, isExpanded: boolean): Shape =>
  new Shape(buildShapeId(id), new ShapeBpmnCallActivity(id, name, ShapeBpmnCallActivityKind.CALLING_PROCESS, parent, isExpanded ? undefined : [ShapeBpmnMarkerKind.EXPAND]));
const newGroup = (parent: string, id: string, name: string): Shape => new Shape(buildShapeId(id), new ShapeBpmnElement(id, name, ShapeBpmnElementKind.GROUP, parent));
const newSubProcess = (parent: string, id: string, name: string, isExpanded: boolean): Shape =>
  new Shape(buildShapeId(id), new ShapeBpmnSubProcess(id, name, ShapeBpmnSubProcessKind.EMBEDDED, parent, isExpanded ? undefined : [ShapeBpmnMarkerKind.EXPAND]));

const addContainerElements = (bpmnModel: BpmnModel, containerWithLanes: ContainerWithLanes & BaseElement, parentId: string): void => {
  if (containerWithLanes.lanes) {
    bpmnModel.lanes.push(newLane(parentId, containerWithLanes.lanes.id, containerWithLanes.lanes.name));
    addContainerElements(bpmnModel, containerWithLanes.lanes, containerWithLanes.lanes.id);
  }
  if (containerWithLanes.subProcesses) {
    bpmnModel.flowNodes.push(newSubProcess(parentId, containerWithLanes.subProcesses.id, containerWithLanes.subProcesses.name, containerWithLanes.subProcesses.isExpanded));
    addContainerElements(bpmnModel, containerWithLanes.subProcesses, containerWithLanes.subProcesses.id);
  }
  if (containerWithLanes.callActivities) {
    bpmnModel.flowNodes.push(newCallActivity(parentId, containerWithLanes.callActivities.id, containerWithLanes.callActivities.name, containerWithLanes.callActivities.isExpanded));
    addContainerElements(bpmnModel, containerWithLanes.callActivities, containerWithLanes.callActivities.id);
  }
  if (containerWithLanes.startEvents) {
    bpmnModel.flowNodes.push(newStartEvent(parentId, containerWithLanes.startEvents.id, containerWithLanes.startEvents.name));
  }
  const tasks = containerWithLanes.tasks;
  if (tasks) {
    bpmnModel.flowNodes.push(newTask(parentId, tasks.id, tasks.name));

    if (tasks.boundaryEvents) {
      bpmnModel.flowNodes.push(newBoundaryEvent(tasks.id, tasks.boundaryEvents.id, tasks.boundaryEvents.name));
    }
  }
  if (containerWithLanes.groups) {
    bpmnModel.flowNodes.push(newGroup(parentId, containerWithLanes.groups.id, containerWithLanes.groups.name));
  }
  if (containerWithLanes.sequenceFlows) {
    const sequenceFlow = containerWithLanes.sequenceFlows;
    bpmnModel.edges.push(newSequenceFlow(sequenceFlow.id, sequenceFlow.name, sequenceFlow.source, sequenceFlow.target));
  }
};

export const toBpmnModel = (model: BpmnModelTestRepresentation): BpmnModel => {
  const bpmnModel = newBpmnModel();
  const pools = ensureIsArray(model.pools);

  pools.forEach(pool => {
    if (!pool.hidden) {
      addNewPool(bpmnModel, pool.id, pool.name);
    }
    addContainerElements(bpmnModel, pool, pool.id);
  });

  if (model.messageFlows) {
    ensureIsArray(model.messageFlows).forEach(messageFlow => bpmnModel.edges.push(newMessageFlow(messageFlow.id, messageFlow.name, messageFlow.source, messageFlow.target)));
  }

  if (model.process) {
    addContainerElements(bpmnModel, model.process, undefined);
  }

  return bpmnModel;
};

export interface BpmnModelTestRepresentation {
  pools?: Pool | Pool[];
  messageFlows?: Flow | Flow[];
  // to define a process without participant
  process?: ContainerWithLanes & BaseElement;
}

interface BaseElement {
  id: string;
  name?: string;
}

type Pool = ContainerWithLanes & BaseElement & { hidden?: boolean };

type ContainerElement = BaseElement & Container;

interface ContainerWithLanes extends Container {
  lanes?: ContainerElement & { lanes?: ContainerElement };
}

interface ExpendableElement {
  isExpanded?: boolean;
}

// The name of all properties is using plural even if we currently use mono values and not arrays.
// This is consistent with the other models we used in implementation and tests.
interface Container {
  startEvents?: BaseElement;
  tasks?: BaseElement & { boundaryEvents?: BaseElement };
  groups?: BaseElement;
  subProcesses?: ContainerWithLanes & BaseElement & ExpendableElement;
  callActivities?: ContainerElement & ExpendableElement;
  sequenceFlows?: Flow;
}

interface Flow extends BaseElement {
  source: string;
  target: string;
}
