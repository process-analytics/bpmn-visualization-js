/*
Copyright 2020 Bonitasoft S.A.

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

import type { GlobalTaskKind, ShapeBpmnEventDefinitionKind } from '../../../../model/bpmn/internal';
import type { Flow, AssociationFlow, MessageFlow, SequenceFlow } from '../../../../model/bpmn/internal/edge/flows';
import type { TGroup } from '../../../../model/bpmn/json/baseElement/artifact';
import type { ParsingMessageCollector } from '../../parsing-messages';

import { ShapeBpmnElementKind } from '../../../../model/bpmn/internal';
import ShapeBpmnElement from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { GroupUnknownCategoryValueWarning } from '../warnings';

/**
 * @internal
 */
export class ConvertedElements {
  getFlows(): Flow[] {
    return [...this.messageFlows.values(), ...this.sequenceFlows.values(), ...this.associationFlows.values()];
  }

  private poolsById = new Map<string, ShapeBpmnElement>();
  findPoolById(id: string): ShapeBpmnElement {
    return this.poolsById.get(id);
  }
  private poolsByProcessRef = new Map<string, ShapeBpmnElement>();
  findPoolByProcessRef(processRef: string): ShapeBpmnElement {
    return this.poolsByProcessRef.get(processRef);
  }
  registerPool(pool: ShapeBpmnElement, processRef: string): void {
    this.poolsById.set(pool.id, pool);
    if (processRef) {
      this.poolsByProcessRef.set(processRef, pool);
    }
  }

  private messageFlows = new Map<string, MessageFlow>();
  findMessageFlow(id: string): MessageFlow {
    return this.messageFlows.get(id);
  }
  registerMessageFlow(messageFlow: MessageFlow): void {
    this.messageFlows.set(messageFlow.id, messageFlow);
  }

  private flowNodes = new Map<string, ShapeBpmnElement>();
  findFlowNode(id: string): ShapeBpmnElement {
    return this.flowNodes.get(id);
  }
  registerFlowNode(flowNode: ShapeBpmnElement): void {
    this.flowNodes.set(flowNode.id, flowNode);
  }

  private lanes = new Map<string, ShapeBpmnElement>();
  findLane(id: string): ShapeBpmnElement {
    return this.lanes.get(id);
  }
  registerLane(lane: ShapeBpmnElement): void {
    this.lanes.set(lane.id, lane);
  }

  private sequenceFlows = new Map<string, SequenceFlow>();
  findSequenceFlow(id: string): SequenceFlow {
    return this.sequenceFlows.get(id);
  }
  registerSequenceFlow(sequenceFlow: SequenceFlow): void {
    this.sequenceFlows.set(sequenceFlow.id, sequenceFlow);
  }

  private associationFlows = new Map<string, AssociationFlow>();
  findAssociationFlow(id: string): AssociationFlow {
    return this.associationFlows.get(id);
  }
  registerAssociationFlow(associationFlow: AssociationFlow): void {
    this.associationFlows.set(associationFlow.id, associationFlow);
  }

  private eventDefinitionsOfDefinitions = new Map<string, ShapeBpmnEventDefinitionKind>();
  findEventDefinitionOfDefinition(id: string): ShapeBpmnEventDefinitionKind {
    return this.eventDefinitionsOfDefinitions.get(id);
  }
  registerEventDefinitionsOfDefinition(id: string, eventDefinition: ShapeBpmnEventDefinitionKind): void {
    this.eventDefinitionsOfDefinitions.set(id, eventDefinition);
  }

  private globalTasks = new Map<string, GlobalTaskKind>();
  findGlobalTask(id: string): GlobalTaskKind {
    return this.globalTasks.get(id);
  }
  registerGlobalTask(id: string, kind: GlobalTaskKind): void {
    this.globalTasks.set(id, kind);
  }

  private categoryValues = new Map<string, CategoryValueData>();
  findCategoryValue(categoryValue: string): CategoryValueData {
    return this.categoryValues.get(categoryValue);
  }
  registerCategoryValue(id: string, value: string): void {
    this.categoryValues.set(id, { value });
  }
}

export const buildShapeBpmnGroup = (
  convertedElements: ConvertedElements,
  parsingMessageCollector: ParsingMessageCollector,
  groupBpmnElement: TGroup,
  processId?: string,
): ShapeBpmnElement | undefined => {
  const categoryValueData = convertedElements.findCategoryValue(groupBpmnElement.categoryValueRef);
  if (categoryValueData) {
    return new ShapeBpmnElement(groupBpmnElement.id, categoryValueData.value, ShapeBpmnElementKind.GROUP, processId);
  }
  parsingMessageCollector.warning(new GroupUnknownCategoryValueWarning(groupBpmnElement.id, groupBpmnElement.categoryValueRef));
  return undefined;
};

interface CategoryValueData {
  value?: string;
}
