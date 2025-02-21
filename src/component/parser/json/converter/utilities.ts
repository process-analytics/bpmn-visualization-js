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

import type { AssociationDirectionKind, GlobalTaskKind, ShapeBpmnEventDefinitionKind } from '../../../../model/bpmn/internal';
import type { Flow, MessageFlow, SequenceFlow } from '../../../../model/bpmn/internal/edge/flows';
import type { TAssociation, TGroup } from '../../../../model/bpmn/json/baseElement/artifact';
import type { TEventDefinition, TLinkEventDefinition } from '../../../../model/bpmn/json/baseElement/rootElement/eventDefinition';
import type { ParsingMessageCollector } from '../../parsing-messages';

import { ShapeBpmnElementKind } from '../../../../model/bpmn/internal';
import { AssociationFlow } from '../../../../model/bpmn/internal/edge/flows';
import ShapeBpmnElement from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { ensureIsArray } from '../../../helpers/array-utilities';
import { GroupUnknownCategoryValueWarning } from '../warnings';

export type RegisteredEventDefinition = (Pick<TEventDefinition, 'id'> & Pick<TLinkEventDefinition, 'source' | 'target'>) & {
  kind: ShapeBpmnEventDefinitionKind;
};

/**
 * @internal
 */
export class ConvertedElements {
  getFlows(): Flow[] {
    return [...this.messageFlows.values(), ...this.sequenceFlows.values(), ...this.associationFlows.values()];
  }

  private readonly poolsById = new Map<string, ShapeBpmnElement>();
  findPoolById(id: string): ShapeBpmnElement {
    return this.poolsById.get(id);
  }
  private readonly poolsByProcessRef = new Map<string, ShapeBpmnElement>();
  findPoolByProcessRef(processReference: string): ShapeBpmnElement {
    return this.poolsByProcessRef.get(processReference);
  }
  registerPool(pool: ShapeBpmnElement, processReference: string): void {
    this.poolsById.set(pool.id, pool);
    if (processReference) {
      this.poolsByProcessRef.set(processReference, pool);
    }
  }

  private readonly messageFlows = new Map<string, MessageFlow>();
  findMessageFlow(id: string): MessageFlow {
    return this.messageFlows.get(id);
  }
  registerMessageFlow(messageFlow: MessageFlow): void {
    this.messageFlows.set(messageFlow.id, messageFlow);
  }

  private readonly flowNodes = new Map<string, ShapeBpmnElement>();
  findFlowNode(id: string): ShapeBpmnElement {
    return this.flowNodes.get(id);
  }
  registerFlowNode(flowNode: ShapeBpmnElement): void {
    this.flowNodes.set(flowNode.id, flowNode);
  }

  private readonly lanes = new Map<string, ShapeBpmnElement>();
  findLane(id: string): ShapeBpmnElement {
    return this.lanes.get(id);
  }
  registerLane(lane: ShapeBpmnElement): void {
    this.lanes.set(lane.id, lane);
  }

  private readonly sequenceFlows = new Map<string, SequenceFlow>();
  findSequenceFlow(id: string): SequenceFlow {
    return this.sequenceFlows.get(id);
  }
  registerSequenceFlow(sequenceFlow: SequenceFlow): void {
    this.sequenceFlows.set(sequenceFlow.id, sequenceFlow);
  }

  private readonly associationFlows = new Map<string, AssociationFlow>();
  findAssociationFlow(id: string): AssociationFlow {
    return this.associationFlows.get(id);
  }
  registerAssociationFlow(associationFlow: AssociationFlow): void {
    this.associationFlows.set(associationFlow.id, associationFlow);
  }

  private readonly eventDefinitionsOfDefinitions = new Map<string, RegisteredEventDefinition>();
  findEventDefinitionOfDefinition(id: string): RegisteredEventDefinition {
    return this.eventDefinitionsOfDefinitions.get(id);
  }
  registerEventDefinitionsOfDefinition(id: string, eventDefinition: RegisteredEventDefinition): void {
    this.eventDefinitionsOfDefinitions.set(id, eventDefinition);
  }

  private readonly globalTasks = new Map<string, GlobalTaskKind>();
  findGlobalTask(id: string): GlobalTaskKind {
    return this.globalTasks.get(id);
  }
  registerGlobalTask(id: string, kind: GlobalTaskKind): void {
    this.globalTasks.set(id, kind);
  }

  private readonly categoryValues = new Map<string, CategoryValueData>();
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

export const convertAndRegisterAssociationFlows = (convertedElements: ConvertedElements, bpmnElements: TAssociation[] | TAssociation): void => {
  for (const association of ensureIsArray(bpmnElements)) {
    const direction = association.associationDirection as unknown as AssociationDirectionKind;
    convertedElements.registerAssociationFlow(new AssociationFlow(association.id, undefined, association.sourceRef, association.targetRef, direction));
  }
};
