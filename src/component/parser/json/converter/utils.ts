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

import ShapeBpmnElement from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import type { AssociationFlow, MessageFlow, SequenceFlow } from '../../../../model/bpmn/internal/edge/flows';
import type { GlobalTaskKind, ShapeBpmnEventDefinitionKind } from '../../../../model/bpmn/internal';
import { ShapeBpmnElementKind } from '../../../../model/bpmn/internal';
import type { TGroup } from '../../../../model/bpmn/json/baseElement/artifact';
import type { ParsingMessageCollector } from '../../parsing-messages';
import { GroupUnknownCategoryValueWarning } from '../warnings';

/**
 * @internal
 */
export class ConvertedElements {
  private poolsById: Map<string, ShapeBpmnElement> = new Map();
  findPoolById(id: string): ShapeBpmnElement {
    return this.poolsById.get(id);
  }
  private poolsByProcessRef: Map<string, ShapeBpmnElement> = new Map();
  findPoolByProcessRef(processRef: string): ShapeBpmnElement {
    return this.poolsByProcessRef.get(processRef);
  }
  registerPool(pool: ShapeBpmnElement, processRef: string): void {
    this.poolsById.set(pool.id, pool);
    if (processRef) {
      this.poolsByProcessRef.set(processRef, pool);
    }
  }

  private messageFlows: Map<string, MessageFlow> = new Map();
  findMessageFlow(id: string): MessageFlow {
    return this.messageFlows.get(id);
  }
  registerMessageFlow(messageFlow: MessageFlow): void {
    this.messageFlows.set(messageFlow.id, messageFlow);
  }

  private flowNodes: Map<string, ShapeBpmnElement> = new Map();
  findFlowNode(id: string): ShapeBpmnElement {
    return this.flowNodes.get(id);
  }
  registerFlowNode(flowNode: ShapeBpmnElement): void {
    this.flowNodes.set(flowNode.id, flowNode);
  }

  private lanes: Map<string, ShapeBpmnElement> = new Map();
  findLane(id: string): ShapeBpmnElement {
    return this.lanes.get(id);
  }
  registerLane(lane: ShapeBpmnElement): void {
    this.lanes.set(lane.id, lane);
  }

  private sequenceFlows: Map<string, SequenceFlow> = new Map();
  findSequenceFlow(id: string): SequenceFlow {
    return this.sequenceFlows.get(id);
  }
  registerSequenceFlow(sequenceFlow: SequenceFlow): void {
    this.sequenceFlows.set(sequenceFlow.id, sequenceFlow);
  }

  private associationFlows: Map<string, AssociationFlow> = new Map();
  findAssociationFlow(id: string): AssociationFlow {
    return this.associationFlows.get(id);
  }
  registerAssociationFlow(associationFlow: AssociationFlow): void {
    this.associationFlows.set(associationFlow.id, associationFlow);
  }

  private eventDefinitionsOfDefinitions: Map<string, ShapeBpmnEventDefinitionKind> = new Map();
  findEventDefinitionOfDefinition(id: string): ShapeBpmnEventDefinitionKind {
    return this.eventDefinitionsOfDefinitions.get(id);
  }
  registerEventDefinitionsOfDefinition(id: string, eventDefinition: ShapeBpmnEventDefinitionKind): void {
    this.eventDefinitionsOfDefinitions.set(id, eventDefinition);
  }

  private globalTasks: Map<string, GlobalTaskKind> = new Map();
  findGlobalTask(id: string): GlobalTaskKind {
    return this.globalTasks.get(id);
  }
  registerGlobalTask(id: string, kind: GlobalTaskKind): void {
    this.globalTasks.set(id, kind);
  }

  private categoryValues: Map<string, CategoryValueData> = new Map();
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
