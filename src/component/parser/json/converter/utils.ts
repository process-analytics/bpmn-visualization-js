/**
 * Copyright 2020 Bonitasoft S.A.
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
  constructor(private parsingMessageCollector: ParsingMessageCollector) {}

  private participantsById: Map<string, Participant> = new Map();
  private findParticipantById(id: string): Participant {
    return this.participantsById.get(id);
  }

  private participantsByProcessRef: Map<string, Participant> = new Map();
  findParticipantByProcessRef(processRef: string): Participant {
    return this.participantsByProcessRef.get(processRef);
  }

  registerParticipant(participant: Participant): void {
    this.participantsById.set(participant.id, participant);
    if (participant.processRef) {
      this.participantsByProcessRef.set(participant.processRef, participant);
    }
  }

  private processesByProcessId: Map<string, ShapeBpmnElement> = new Map();

  // TODO rename into buildAndRegisterProcessIfConform
  registerProcess(process: ProcessInfo): ShapeBpmnElement | undefined {
    const shapeBpmnElement = this.buildPool(process);
    if (shapeBpmnElement) {
      this.processesByProcessId.set(process.id, shapeBpmnElement);
    } else {
      // TODO this seems dead code - add test if we want to keep this
      throw new Error('@@undefined shapeBpmnElement');
    }
    return shapeBpmnElement;
  }

  // TODO move elsewhere when we will know how to manage 'black box' pool
  private buildPool(process: ProcessInfo): ShapeBpmnElement {
    const participant = this.findParticipantByProcessRef(process.id);
    if (participant) {
      const name = participant.name ?? process.name;
      return new ShapeBpmnElement(participant.id, name, ShapeBpmnElementKind.POOL);
    }
    return new ShapeBpmnElement(process.id, process.name, ShapeBpmnElementKind.POOL);
  }

  // TODO rename findProcessByParticipant or findPoolByxxxx
  findProcess(participantId: string): ShapeBpmnElement | undefined {
    const participant = this.findParticipantById(participantId);
    if (participant) {
      const process = this.processesByProcessId.get(participant.processRef);
      if (process) {
        return process;
      }
      // TODO find a way to not create instance of black box pool here
      // we have an issue because the findProcess is called in CollaborationConverter to get source/target of msg flow
      // at that time the json process element has not been deserialized, so this method always returns a new instance of black box pool
      // Then, after the ProcessConverter has been executed, the method may return another instance!!!
      // WARN: we have no test that show this!!!!
      // black box pool
      return new ShapeBpmnElement(participant.id, participant.name, ShapeBpmnElementKind.POOL);
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
  registerCategoryValues(id: string, value: string): void {
    this.categoryValues.set(id, { value });
  }

  // Special case: create the ShapeBpmnElement instance here to avoid duplication in CollaborationConverter and ProcessConverter
  buildShapeBpmnGroup(groupBpmnElement: TGroup, process?: ShapeBpmnElement): ShapeBpmnElement | undefined {
    const categoryValueData = this.categoryValues.get(groupBpmnElement.categoryValueRef);
    if (categoryValueData) {
      return new ShapeBpmnElement(groupBpmnElement.id, categoryValueData.value, ShapeBpmnElementKind.GROUP, process);
    }
    this.parsingMessageCollector.warning(new GroupUnknownCategoryValueWarning(groupBpmnElement.id, groupBpmnElement.categoryValueRef));
    return undefined;
  }
}

interface CategoryValueData {
  value?: string;
}

interface ProcessInfo {
  id: string;
  name: string;
}

/**
 * @internal
 */
export class Participant {
  constructor(readonly id: string, readonly name?: string, public processRef?: string) {}
}
