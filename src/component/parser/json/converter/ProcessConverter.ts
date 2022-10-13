/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import ShapeBpmnElement, {
  ShapeBpmnActivity,
  ShapeBpmnBoundaryEvent,
  ShapeBpmnCallActivity,
  ShapeBpmnEvent,
  ShapeBpmnEventBasedGateway,
  ShapeBpmnStartEvent,
  ShapeBpmnSubProcess,
} from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import type { AssociationDirectionKind, BpmnEventKind } from '../../../../model/bpmn/internal';
import {
  SequenceFlowKind,
  ShapeBpmnCallActivityKind,
  ShapeBpmnElementKind,
  ShapeBpmnEventBasedGatewayKind,
  ShapeBpmnEventDefinitionKind,
  ShapeBpmnMarkerKind,
  ShapeBpmnSubProcessKind,
  ShapeUtil,
} from '../../../../model/bpmn/internal';
import { eventDefinitionKinds } from '../../../../model/bpmn/internal/shape/utils';
import { AssociationFlow, SequenceFlow } from '../../../../model/bpmn/internal/edge/flows';
import type { TProcess } from '../../../../model/bpmn/json/baseElement/rootElement/rootElement';
import type { TBoundaryEvent, TCatchEvent, TThrowEvent } from '../../../../model/bpmn/json/baseElement/flowNode/event';
import type { TActivity, TCallActivity, TSubProcess } from '../../../../model/bpmn/json/baseElement/flowNode/activity/activity';
import type { TLane, TLaneSet } from '../../../../model/bpmn/json/baseElement/baseElement';
import type { TFlowNode, TSequenceFlow } from '../../../../model/bpmn/json/baseElement/flowElement';
import type { TAssociation, TGroup, TTextAnnotation } from '../../../../model/bpmn/json/baseElement/artifact';
import type { ConvertedElements } from './utils';
import { buildShapeBpmnGroup } from './utils';
import type { TEventBasedGateway } from '../../../../model/bpmn/json/baseElement/flowNode/gateway';
import type { TReceiveTask } from '../../../../model/bpmn/json/baseElement/flowNode/activity/task';
import { ensureIsArray } from '../../../helpers/array-utils';
import type { ParsingMessageCollector } from '../../parsing-messages';
import { BoundaryEventNotAttachedToActivityWarning, LaneUnknownFlowNodeRefWarning } from '../warnings';
import type { TTransaction } from '../../../../model/bpmn/json/baseElement/flowNode/activity/activity';

interface EventDefinition {
  kind: ShapeBpmnEventDefinitionKind;
  counter: number;
}

type FlowNode = TFlowNode | TActivity | TReceiveTask | TEventBasedGateway | TTextAnnotation;

/**
 * @internal
 */
export default class ProcessConverter {
  private defaultSequenceFlowIds: string[] = [];
  private elementsWithoutParentByProcessId: Map<string, ShapeBpmnElement[]> = new Map();
  private callActivitiesCallingProcess: Map<string, ShapeBpmnElement> = new Map();

  constructor(private convertedElements: ConvertedElements, private parsingMessageCollector: ParsingMessageCollector) {}

  deserialize(processes: string | TProcess | (string | TProcess)[]): void {
    ensureIsArray(processes).forEach(process => this.parseProcess(process));
    // Need to call this after all processes have been parsed, because to link a call activity to the elements of the called process, we have to parse all processes before.
    ensureIsArray(processes).forEach(process => this.assignParentOfProcessElementsCalledByCallActivity(process.id));
  }

  private assignParentOfProcessElementsCalledByCallActivity(processId: string): void {
    const callActivity = this.callActivitiesCallingProcess.get(processId);
    if (callActivity) {
      const pool = this.convertedElements.findPoolByProcessRef(processId);
      if (pool) {
        pool.parentId = callActivity.id;
      }

      this.elementsWithoutParentByProcessId.get(processId).forEach(element => {
        element.parentId = callActivity.id;
      });
    }
  }

  private parseProcess(process: TProcess): void {
    const processRef = process.id;
    const pool = this.convertedElements.findPoolByProcessRef(processRef);

    // for pool without name, use the process name instead
    if (pool && !pool.name) {
      this.convertedElements.registerPool(new ShapeBpmnElement(pool.id, process.name, ShapeBpmnElementKind.POOL), processRef);
    }

    this.buildProcessInnerElements(process, pool?.id);
  }

  private buildProcessInnerElements(process: TProcess | TSubProcess, parentId: string): void {
    this.elementsWithoutParentByProcessId.set(process.id, []);

    // flow nodes
    ShapeUtil.flowNodeKinds()
      .filter(kind => kind != ShapeBpmnElementKind.EVENT_BOUNDARY)
      .forEach(kind => this.buildFlowNodeBpmnElements(process[kind], kind, parentId, process.id));
    // process boundary events afterwards as we need its parent activity to be available when building it
    this.buildFlowNodeBpmnElements(process.boundaryEvent, ShapeBpmnElementKind.EVENT_BOUNDARY, parentId, process.id);

    // containers
    this.buildLaneBpmnElements(process[ShapeBpmnElementKind.LANE], parentId, process.id);

    this.buildLaneSetBpmnElements(process.laneSet, parentId, process.id);

    // flows
    this.buildSequenceFlows(process.sequenceFlow);
    this.buildAssociationFlows(process.association);
  }

  private buildFlowNodeBpmnElements(bpmnElements: Array<FlowNode> | FlowNode, kind: ShapeBpmnElementKind, parentId: string, processId: string): void {
    ensureIsArray(bpmnElements).forEach(bpmnElement => {
      let shapeBpmnElement;

      if (ShapeUtil.isEvent(kind)) {
        shapeBpmnElement = this.buildShapeBpmnEvent(bpmnElement, kind as BpmnEventKind, parentId);
      } else if (ShapeUtil.isActivity(kind)) {
        shapeBpmnElement = this.buildShapeBpmnActivity(bpmnElement, kind, parentId);
      } else if (kind == ShapeBpmnElementKind.GATEWAY_EVENT_BASED) {
        const eventBasedGatewayBpmnElement = bpmnElement as TEventBasedGateway;
        shapeBpmnElement = new ShapeBpmnEventBasedGateway(
          bpmnElement.id,
          eventBasedGatewayBpmnElement.name,
          parentId,
          eventBasedGatewayBpmnElement.instantiate,
          ShapeBpmnEventBasedGatewayKind[eventBasedGatewayBpmnElement.eventGatewayType],
        );
      } else if (kind == ShapeBpmnElementKind.GROUP) {
        shapeBpmnElement = buildShapeBpmnGroup(this.convertedElements, this.parsingMessageCollector, bpmnElement as TGroup, parentId);
      } else {
        // @ts-ignore We know that the 'text' & 'name' fields are not on all types, but it's already tested
        const name = kind === ShapeBpmnElementKind.TEXT_ANNOTATION ? bpmnElement.text : bpmnElement.name;
        // @ts-ignore We know that the 'instantiate' field is not on all types, but it's already tested
        shapeBpmnElement = new ShapeBpmnElement(bpmnElement.id, name, kind, parentId, bpmnElement.instantiate);
      }

      // @ts-ignore We know that the 'default' field is not on all types, but it's already tested
      const defaultFlow = bpmnElement.default;
      if (ShapeUtil.isWithDefaultSequenceFlow(kind) && defaultFlow) {
        this.defaultSequenceFlowIds.push(defaultFlow);
      }

      if (shapeBpmnElement) {
        this.convertedElements.registerFlowNode(shapeBpmnElement);
        if (!parentId) {
          this.elementsWithoutParentByProcessId.get(processId).push(shapeBpmnElement);
        }
      }
    });
  }

  private buildShapeBpmnActivity(bpmnElement: TActivity, kind: ShapeBpmnElementKind, parentId: string): ShapeBpmnActivity {
    const markers = buildMarkers(bpmnElement);

    if (ShapeUtil.isSubProcess(kind)) {
      return this.buildShapeBpmnSubProcess(bpmnElement, parentId, markers);
    }

    if (!ShapeUtil.isCallActivity(kind)) {
      // @ts-ignore
      return new ShapeBpmnActivity(bpmnElement.id, bpmnElement.name, kind, parentId, bpmnElement.instantiate, markers);
    }
    return this.buildShapeBpmnCallActivity(bpmnElement, parentId, markers);
  }

  private buildShapeBpmnCallActivity(bpmnElement: TCallActivity, parentId: string, markers: ShapeBpmnMarkerKind[]): ShapeBpmnCallActivity {
    const globalTaskKind = this.convertedElements.findGlobalTask(bpmnElement.calledElement);
    if (!globalTaskKind) {
      const shapeBpmnCallActivity = new ShapeBpmnCallActivity(bpmnElement.id, bpmnElement.name, ShapeBpmnCallActivityKind.CALLING_PROCESS, parentId, markers);
      this.callActivitiesCallingProcess.set(bpmnElement.calledElement, shapeBpmnCallActivity);
      return shapeBpmnCallActivity;
    }
    return new ShapeBpmnCallActivity(bpmnElement.id, bpmnElement.name, ShapeBpmnCallActivityKind.CALLING_GLOBAL_TASK, parentId, markers, globalTaskKind);
  }

  private buildShapeBpmnEvent(bpmnElement: TCatchEvent | TThrowEvent, elementKind: BpmnEventKind, parentId: string): ShapeBpmnEvent {
    const eventDefinitions = this.getEventDefinitions(bpmnElement);
    const numberOfEventDefinitions = eventDefinitions.map(eventDefinition => eventDefinition.counter).reduce((counter, it) => counter + it, 0);

    // do we have a None Event?
    if (numberOfEventDefinitions == 0 && ShapeUtil.canHaveNoneEvent(elementKind)) {
      return new ShapeBpmnEvent(bpmnElement.id, bpmnElement.name, elementKind, ShapeBpmnEventDefinitionKind.NONE, parentId);
    }

    if (numberOfEventDefinitions == 1) {
      const eventDefinitionKind = eventDefinitions[0].kind;
      if (ShapeUtil.isBoundaryEvent(elementKind)) {
        return this.buildShapeBpmnBoundaryEvent(bpmnElement as TBoundaryEvent, eventDefinitionKind);
      }
      if (ShapeUtil.isStartEvent(elementKind)) {
        return new ShapeBpmnStartEvent(bpmnElement.id, bpmnElement.name, eventDefinitionKind, parentId, bpmnElement.isInterrupting);
      }
      return new ShapeBpmnEvent(bpmnElement.id, bpmnElement.name, elementKind, eventDefinitionKind, parentId);
    }
  }

  private buildShapeBpmnBoundaryEvent(bpmnElement: TBoundaryEvent, eventDefinitionKind: ShapeBpmnEventDefinitionKind): ShapeBpmnBoundaryEvent {
    const parent = this.convertedElements.findFlowNode(bpmnElement.attachedToRef);

    if (ShapeUtil.isActivity(parent?.kind)) {
      return new ShapeBpmnBoundaryEvent(bpmnElement.id, bpmnElement.name, eventDefinitionKind, bpmnElement.attachedToRef, bpmnElement.cancelActivity);
    } else {
      this.parsingMessageCollector.warning(new BoundaryEventNotAttachedToActivityWarning(bpmnElement.id, bpmnElement.attachedToRef, parent?.kind));
    }
  }

  /**
   * Get the list of eventDefinitions hold by the Event bpmElement
   *
   * @param bpmnElement The BPMN element from the XML data which represents a BPMN Event
   */
  private getEventDefinitions(bpmnElement: TCatchEvent | TThrowEvent): EventDefinition[] {
    const eventDefinitions = new Map<ShapeBpmnEventDefinitionKind, number>();

    eventDefinitionKinds.forEach(eventDefinitionKind => {
      // sometimes eventDefinition is simple, and therefore it is parsed as empty string "", in that case eventDefinition will be converted to an empty object
      const eventDefinition = bpmnElement[eventDefinitionKind + 'EventDefinition'];
      const counter = ensureIsArray(eventDefinition, true).length;
      eventDefinitions.set(eventDefinitionKind, counter);
    });

    ensureIsArray<string>(bpmnElement.eventDefinitionRef).forEach(eventDefinitionRef => {
      const kind = this.convertedElements.findEventDefinitionOfDefinition(eventDefinitionRef);
      eventDefinitions.set(kind, eventDefinitions.get(kind) + 1);
    });

    return Array.from(eventDefinitions.keys())
      .map(kind => ({ kind, counter: eventDefinitions.get(kind) }))
      .filter(eventDefinition => eventDefinition.counter > 0);
  }

  private buildShapeBpmnSubProcess(bpmnElement: TSubProcess, parentId: string, markers: ShapeBpmnMarkerKind[]): ShapeBpmnSubProcess {
    const subProcessKind = isTransactionSubprocess(bpmnElement)
      ? ShapeBpmnSubProcessKind.TRANSACTION
      : !bpmnElement.triggeredByEvent
      ? ShapeBpmnSubProcessKind.EMBEDDED
      : ShapeBpmnSubProcessKind.EVENT;

    const convertedSubProcess = new ShapeBpmnSubProcess(bpmnElement.id, bpmnElement.name, subProcessKind, parentId, markers);
    this.buildProcessInnerElements(bpmnElement, bpmnElement.id);
    return convertedSubProcess;
  }

  private buildLaneSetBpmnElements(laneSets: Array<TLaneSet> | TLaneSet, parentId: string, processId: string): void {
    ensureIsArray(laneSets).forEach(laneSet => this.buildLaneBpmnElements(laneSet.lane, parentId, processId));
  }

  private buildLaneBpmnElements(lanes: Array<TLane> | TLane, parentId: string, processId: string): void {
    ensureIsArray(lanes).forEach(lane => {
      const shapeBpmnElement = new ShapeBpmnElement(lane.id, lane.name, ShapeBpmnElementKind.LANE, parentId);
      this.convertedElements.registerLane(shapeBpmnElement);
      if (!parentId) {
        this.elementsWithoutParentByProcessId.get(processId).push(shapeBpmnElement);
      }

      this.assignParentOfLaneFlowNodes(lane);
      if (lane.childLaneSet?.lane) {
        this.buildLaneBpmnElements(lane.childLaneSet.lane, lane.id, processId);
      }
    });
  }

  private assignParentOfLaneFlowNodes(lane: TLane): void {
    ensureIsArray<string>(lane.flowNodeRef).forEach(flowNodeRef => {
      const shapeBpmnElement = this.convertedElements.findFlowNode(flowNodeRef);
      const laneId = lane.id;
      if (shapeBpmnElement) {
        if (!ShapeUtil.isBoundaryEvent(shapeBpmnElement.kind)) {
          shapeBpmnElement.parentId = laneId;
        }
      } else {
        this.parsingMessageCollector.warning(new LaneUnknownFlowNodeRefWarning(laneId, flowNodeRef));
      }
    });
  }

  private buildSequenceFlows(bpmnElements: Array<TSequenceFlow> | TSequenceFlow): void {
    ensureIsArray(bpmnElements).forEach(sequenceFlow => {
      const kind = this.getSequenceFlowKind(sequenceFlow);
      this.convertedElements.registerSequenceFlow(new SequenceFlow(sequenceFlow.id, sequenceFlow.name, sequenceFlow.sourceRef, sequenceFlow.targetRef, kind));
    });
  }

  private buildAssociationFlows(bpmnElements: Array<TAssociation> | TAssociation): void {
    ensureIsArray(bpmnElements).forEach(association => {
      const direction = association.associationDirection as unknown as AssociationDirectionKind;
      this.convertedElements.registerAssociationFlow(new AssociationFlow(association.id, undefined, association.sourceRef, association.targetRef, direction));
    });
  }

  private getSequenceFlowKind(sequenceFlow: TSequenceFlow): SequenceFlowKind {
    if (this.defaultSequenceFlowIds.includes(sequenceFlow.id)) {
      return SequenceFlowKind.DEFAULT;
    } else {
      const sourceShapeBpmnElement = this.convertedElements.findFlowNode(sequenceFlow.sourceRef);
      if (sourceShapeBpmnElement && ShapeUtil.isWithDefaultSequenceFlow(sourceShapeBpmnElement.kind) && sequenceFlow.conditionExpression) {
        if (ShapeUtil.isActivity(sourceShapeBpmnElement.kind)) {
          return SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY;
        } else {
          return SequenceFlowKind.CONDITIONAL_FROM_GATEWAY;
        }
      }
    }
    return SequenceFlowKind.NORMAL;
  }
}

const buildMarkers = (bpmnElement: TActivity): ShapeBpmnMarkerKind[] => {
  const markers: ShapeBpmnMarkerKind[] = [];
  // @ts-ignore We know that the standardLoopCharacteristics field is not on all types, but it's already tested
  const standardLoopCharacteristics = bpmnElement.standardLoopCharacteristics;
  // @ts-ignore We know that the multiInstanceLoopCharacteristics field is not on all types, but it's already tested
  const multiInstanceLoopCharacteristics = ensureIsArray(bpmnElement.multiInstanceLoopCharacteristics, true)[0];
  if (standardLoopCharacteristics || standardLoopCharacteristics === '') {
    markers.push(ShapeBpmnMarkerKind.LOOP);
  } else if (multiInstanceLoopCharacteristics && multiInstanceLoopCharacteristics.isSequential) {
    markers.push(ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL);
  } else if ((multiInstanceLoopCharacteristics && !multiInstanceLoopCharacteristics.isSequential) || multiInstanceLoopCharacteristics === '') {
    markers.push(ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL);
  }
  return markers;
};

function isTransactionSubprocess(object: TSubProcess): object is TTransaction {
  //   method?: tTransactionMethod; //default="##Compensate"
  return Object.prototype.hasOwnProperty.call(object, 'method');
}
