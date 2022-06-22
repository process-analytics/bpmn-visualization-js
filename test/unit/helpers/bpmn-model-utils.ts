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

// TODO missing parentId in SequenceFlow constructor
const newSequenceFlow = (parentId: string, id: string, name: string, source: string, target: string): Edge => new Edge(buildEdgeId(id), new SequenceFlow(id, name, source, target));

const newMessageFlow = (id: string, name: string, source: string, target: string): Edge => new Edge(buildEdgeId(id), new MessageFlow(id, name, source, target));

export const sequenceFlowInModel = (id: string, name: string): BpmnModel => {
  const bpmnModel = newBpmnModel();
  // TODO duplication with newSequenceFlow
  bpmnModel.edges.push(new Edge(buildEdgeId(id), new SequenceFlow(id, name)));
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

const addContainerElements = (bpmnModel: BpmnModel, containerWithLanes: ContainerWithLanes & BaseElement): void => {
  if (containerWithLanes.lanes) {
    bpmnModel.lanes.push(newLane(containerWithLanes.id, containerWithLanes.lanes.id, containerWithLanes.lanes.name));
    addContainerElements(bpmnModel, containerWithLanes.lanes);
  }
  if (containerWithLanes.subProcesses) {
    bpmnModel.flowNodes.push(
      newSubProcess(containerWithLanes.id, containerWithLanes.subProcesses.id, containerWithLanes.subProcesses.name, containerWithLanes.subProcesses.isExpanded),
    );
    addContainerElements(bpmnModel, containerWithLanes.subProcesses);
  }
  if (containerWithLanes.callActivities) {
    bpmnModel.flowNodes.push(
      newCallActivity(containerWithLanes.id, containerWithLanes.callActivities.id, containerWithLanes.callActivities.name, containerWithLanes.callActivities.isExpanded),
    );
    addContainerElements(bpmnModel, containerWithLanes.callActivities);
  }
  if (containerWithLanes.startEvents) {
    bpmnModel.flowNodes.push(newStartEvent(containerWithLanes.id, containerWithLanes.startEvents.id, containerWithLanes.startEvents.name));
  }
  const tasks = containerWithLanes.tasks;
  if (tasks) {
    bpmnModel.flowNodes.push(newTask(containerWithLanes.id, tasks.id, tasks.name));

    if (tasks.boundaryEvents) {
      bpmnModel.flowNodes.push(newBoundaryEvent(tasks.id, tasks.boundaryEvents.id, tasks.boundaryEvents.name));
    }
  }
  if (containerWithLanes.groups) {
    bpmnModel.flowNodes.push(newGroup(containerWithLanes.id, containerWithLanes.groups.id, containerWithLanes.groups.name));
  }
  if (containerWithLanes.sequenceFlows) {
    const sequenceFlow = containerWithLanes.sequenceFlows;
    bpmnModel.edges.push(newSequenceFlow(containerWithLanes.id, sequenceFlow.id, sequenceFlow.name, sequenceFlow.source, sequenceFlow.target));
  }
};

export const toBpmnModel = (model: BpmnModelTestRepresentation): BpmnModel => {
  const bpmnModel = newBpmnModel();
  const pools = ensureIsArray(model.pools);

  pools.forEach(pool => {
    addNewPool(bpmnModel, pool.id, pool.name);
    addContainerElements(bpmnModel, pool);
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

type Pool = ContainerWithLanes & BaseElement;

type ContainerElement = BaseElement & Container;

interface ContainerWithLanes extends Container {
  lanes?: ContainerElement & { lanes?: ContainerElement };
}

interface ExpendableElement {
  isExpanded?: boolean;
}

// TODO allow array in all properties
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
