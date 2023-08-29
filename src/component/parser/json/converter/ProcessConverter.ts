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

import type { ConvertedElements } from './utils';
import type { AssociationDirectionKind, BpmnEventKind } from '../../../../model/bpmn/internal';
import type { TAssociation, TGroup, TTextAnnotation } from '../../../../model/bpmn/json/baseElement/artifact';
import type { TLane, TLaneSet } from '../../../../model/bpmn/json/baseElement/baseElement';
import type { TFlowNode, TSequenceFlow } from '../../../../model/bpmn/json/baseElement/flowElement';
import type { TActivity, TCallActivity, TSubProcess } from '../../../../model/bpmn/json/baseElement/flowNode/activity/activity';
import type { TReceiveTask } from '../../../../model/bpmn/json/baseElement/flowNode/activity/task';
import type { TBoundaryEvent, TCatchEvent, TThrowEvent } from '../../../../model/bpmn/json/baseElement/flowNode/event';
import type { TEventBasedGateway } from '../../../../model/bpmn/json/baseElement/flowNode/gateway';
import type { TProcess } from '../../../../model/bpmn/json/baseElement/rootElement/rootElement';
import type { ParsingMessageCollector } from '../../parsing-messages';

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
import { AssociationFlow, SequenceFlow } from '../../../../model/bpmn/internal/edge/flows';
import ShapeBpmnElement, {
  ShapeBpmnActivity,
  ShapeBpmnBoundaryEvent,
  ShapeBpmnCallActivity,
  ShapeBpmnEvent,
  ShapeBpmnEventBasedGateway,
  ShapeBpmnStartEvent,
  ShapeBpmnSubProcess,
} from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { eventDefinitionKinds } from '../../../../model/bpmn/internal/shape/utils';
import { ensureIsArray } from '../../../helpers/array-utils';
import { BoundaryEventNotAttachedToActivityWarning, LaneUnknownFlowNodeReferenceWarning } from '../warnings';

import { buildShapeBpmnGroup } from './utils';

interface EventDefinition {
  kind: ShapeBpmnEventDefinitionKind;
  counter: number;
}

type FlowNode = TFlowNode | TActivity | TReceiveTask | TEventBasedGateway | TTextAnnotation;

type BpmnSemanticType = keyof TProcess;

const computeSubProcessKind = (processedSemanticType: BpmnSemanticType, bpmnElement: TSubProcess): ShapeBpmnSubProcessKind => {
  switch (processedSemanticType) {
    case 'adHocSubProcess': {
      return ShapeBpmnSubProcessKind.AD_HOC;
    }
    case 'transaction': {
      return ShapeBpmnSubProcessKind.TRANSACTION;
    }
    default: {
      return bpmnElement.triggeredByEvent ? ShapeBpmnSubProcessKind.EVENT : ShapeBpmnSubProcessKind.EMBEDDED;
    }
  }
};

const orderedFlowNodeBpmnTypes: BpmnSemanticType[] = [
  // specific management for adhoc and transaction sub-processes which are handled with a dedicated ShapeBpmnSubProcessKind
  'adHocSubProcess',
  'transaction',
  // process boundary events afterward as we need its parent activity to be available when building it
  ...(ShapeUtil.flowNodeKinds().filter(kind => kind !== ShapeBpmnElementKind.EVENT_BOUNDARY) as BpmnSemanticType[]),
  ShapeBpmnElementKind.EVENT_BOUNDARY,
];

function getShapeBpmnElementKind(bpmnSemanticType: BpmnSemanticType): ShapeBpmnElementKind {
  return ['adHocSubProcess', 'transaction'].includes(bpmnSemanticType as string) ? ShapeBpmnElementKind.SUB_PROCESS : (bpmnSemanticType as ShapeBpmnElementKind);
}

/**
 * @internal
 */
export default class ProcessConverter {
  private defaultSequenceFlowIds: string[] = [];
  private elementsWithoutParentByProcessId = new Map<string, ShapeBpmnElement[]>();
  private callActivitiesCallingProcess = new Map<string, ShapeBpmnElement>();

  constructor(
    private convertedElements: ConvertedElements,
    private parsingMessageCollector: ParsingMessageCollector,
  ) {}

  deserialize(processes: string | TProcess | (string | TProcess)[]): void {
    for (const process of ensureIsArray(processes)) this.parseProcess(process);

    // Need to call this after all processes have been parsed, because to link a call activity to the elements of the called process, we have to parse all processes before.
    for (const process of ensureIsArray(processes)) this.assignParentOfProcessElementsCalledByCallActivity(process.id);

    this.assignIncomingAndOutgoingIdsFromFlows();
  }

  private assignParentOfProcessElementsCalledByCallActivity(processId: string): void {
    const callActivity = this.callActivitiesCallingProcess.get(processId);
    if (callActivity) {
      const pool = this.convertedElements.findPoolByProcessRef(processId);
      if (pool) {
        pool.parentId = callActivity.id;
      }

      for (const element of this.elementsWithoutParentByProcessId.get(processId)) {
        element.parentId = callActivity.id;
      }
    }
  }

  private assignIncomingAndOutgoingIdsFromFlows(): void {
    const fillShapeBpmnElementAttribute = (
      shapeBpmnElementId: string,
      shapeBpmnElementAttributeName: keyof Pick<ShapeBpmnElement, 'outgoingIds' | 'incomingIds'>,
      valueToAdd: string,
      // eslint-disable-next-line unicorn/consistent-function-scoping -- No need for now to move it
    ): void => {
      const shapeBpmnElement =
        this.convertedElements.findFlowNode(shapeBpmnElementId) ?? this.convertedElements.findLane(shapeBpmnElementId) ?? this.convertedElements.findPoolById(shapeBpmnElementId);
      if (shapeBpmnElement && !shapeBpmnElement[shapeBpmnElementAttributeName].includes(valueToAdd)) {
        shapeBpmnElement[shapeBpmnElementAttributeName].push(valueToAdd);
      }
    };

    for (const flow of this.convertedElements.getFlows()) {
      fillShapeBpmnElementAttribute(flow.sourceReferenceId, 'outgoingIds', flow.id);
      fillShapeBpmnElementAttribute(flow.targetReferenceId, 'incomingIds', flow.id);
    }
  }

  private parseProcess(process: TProcess): void {
    const processReference = process.id;
    const pool = this.convertedElements.findPoolByProcessRef(processReference);

    // for pool without name, use the process name instead
    if (pool && !pool.name) {
      this.convertedElements.registerPool(new ShapeBpmnElement(pool.id, process.name, ShapeBpmnElementKind.POOL), processReference);
    }

    this.buildProcessInnerElements(process, pool?.id);
  }

  private buildProcessInnerElements(process: TProcess | TSubProcess, parentId: string): void {
    this.elementsWithoutParentByProcessId.set(process.id, []);

    // flow nodes
    for (const bpmnType of orderedFlowNodeBpmnTypes) this.buildFlowNodeBpmnElements(process[bpmnType] as FlowNode | FlowNode[], getShapeBpmnElementKind(bpmnType), parentId, process.id, bpmnType);
    // containers
    this.buildLaneSetBpmnElements(process.laneSet, parentId, process.id);

    // flows
    this.buildSequenceFlows(process.sequenceFlow);
    this.buildAssociationFlows(process.association);
  }

  private buildFlowNodeBpmnElements(
    bpmnElements: FlowNode[] | FlowNode,
    kind: ShapeBpmnElementKind,
    parentId: string,
    processId: string,
    processedSemanticType: BpmnSemanticType,
  ): void {
    for (const bpmnElement of ensureIsArray(bpmnElements)) {
      const shapeBpmnElement = this.buildFlowNodeBpmnElement(kind, bpmnElement, parentId, processedSemanticType);

      if ('default' in bpmnElement && ShapeUtil.isWithDefaultSequenceFlow(kind)) {
        this.defaultSequenceFlowIds.push(bpmnElement.default);
      }

      if (shapeBpmnElement) {
        this.convertedElements.registerFlowNode(shapeBpmnElement);
        if (!parentId) {
          this.elementsWithoutParentByProcessId.get(processId).push(shapeBpmnElement);
        }
      }
    }
  }

  private buildFlowNodeBpmnElement(kind: ShapeBpmnElementKind, bpmnElement: TFlowNode, parentId: string, processedSemanticType: BpmnSemanticType): ShapeBpmnElement {
    if (ShapeUtil.isEvent(kind)) {
      return this.buildShapeBpmnEvent(bpmnElement, kind as BpmnEventKind, parentId);
    } else if (ShapeUtil.isActivity(kind)) {
      return this.buildShapeBpmnActivity(bpmnElement, kind, parentId, processedSemanticType);
    } else if (kind == ShapeBpmnElementKind.GATEWAY_EVENT_BASED) {
      const eventBasedGatewayBpmnElement = bpmnElement as TEventBasedGateway;
      return new ShapeBpmnEventBasedGateway(
        eventBasedGatewayBpmnElement.id,
        eventBasedGatewayBpmnElement.name,
        parentId,
        eventBasedGatewayBpmnElement.instantiate,
        ShapeBpmnEventBasedGatewayKind[eventBasedGatewayBpmnElement.eventGatewayType],
      );
    } else if (kind == ShapeBpmnElementKind.GROUP) {
      return buildShapeBpmnGroup(this.convertedElements, this.parsingMessageCollector, bpmnElement as TGroup, parentId);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- We know that the 'text' & 'name' fields are not on all types, but it's already tested
      // @ts-ignore
      const name = kind === ShapeBpmnElementKind.TEXT_ANNOTATION ? bpmnElement.text : bpmnElement.name;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- We know that the 'instantiate' field is not on all types, but it's already tested
      // @ts-ignore
      return new ShapeBpmnElement(bpmnElement.id, name, kind, parentId, bpmnElement.instantiate);
    }
  }

  private buildShapeBpmnActivity(bpmnElement: TActivity, kind: ShapeBpmnElementKind, parentId: string, processedSemanticType: BpmnSemanticType): ShapeBpmnActivity {
    const markers = buildMarkers(bpmnElement);

    if (ShapeUtil.isSubProcess(kind)) {
      return this.buildShapeBpmnSubProcess(bpmnElement, parentId, computeSubProcessKind(processedSemanticType, bpmnElement), markers);
    }

    if (!ShapeUtil.isCallActivity(kind)) {
      const instantiate = 'instantiate' in bpmnElement ? (bpmnElement.instantiate as boolean) : undefined;
      return new ShapeBpmnActivity(bpmnElement.id, bpmnElement.name, kind, parentId, instantiate, markers);
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

  private buildShapeBpmnEvent(bpmnElement: TCatchEvent | TThrowEvent, elementKind: BpmnEventKind, parentId: string): ShapeBpmnEvent | undefined {
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
        return new ShapeBpmnStartEvent(bpmnElement.id, bpmnElement.name, eventDefinitionKind, parentId, (bpmnElement as TStartEvent).isInterrupting);
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

    for (const eventDefinitionKind of eventDefinitionKinds) {
      // sometimes eventDefinition is simple, and therefore it is parsed as empty string "", in that case eventDefinition will be converted to an empty object
      const eventDefinition = bpmnElement[`${eventDefinitionKind}EventDefinition`] as TEventDefinition;
      const counter = ensureIsArray(eventDefinition, true).length;
      eventDefinitions.set(eventDefinitionKind, counter);
    }

    for (const eventDefinitionReference of ensureIsArray<string>(bpmnElement.eventDefinitionRef)) {
      const kind = this.convertedElements.findEventDefinitionOfDefinition(eventDefinitionReference);
      eventDefinitions.set(kind, eventDefinitions.get(kind) + 1);
    }

    return [...eventDefinitions.entries()].filter(([, counter]) => counter > 0).map(([kind, counter]) => ({ kind, counter }));
  }

  private buildShapeBpmnSubProcess(bpmnElement: TSubProcess, parentId: string, subProcessKind: ShapeBpmnSubProcessKind, markers: ShapeBpmnMarkerKind[]): ShapeBpmnSubProcess {
    const convertedSubProcess = new ShapeBpmnSubProcess(bpmnElement.id, bpmnElement.name, subProcessKind, parentId, markers);
    this.buildProcessInnerElements(bpmnElement, bpmnElement.id);
    return convertedSubProcess;
  }

  private buildLaneSetBpmnElements(laneSets: TLaneSet[] | TLaneSet, parentId: string, processId: string): void {
    for (const laneSet of ensureIsArray(laneSets)) this.buildLaneBpmnElements(laneSet.lane, parentId, processId);
  }

  private buildLaneBpmnElements(lanes: TLane[] | TLane, parentId: string, processId: string): void {
    for (const lane of ensureIsArray(lanes)) {
      const shapeBpmnElement = new ShapeBpmnElement(lane.id, lane.name, ShapeBpmnElementKind.LANE, parentId);
      this.convertedElements.registerLane(shapeBpmnElement);
      if (!parentId) {
        this.elementsWithoutParentByProcessId.get(processId).push(shapeBpmnElement);
      }

      this.assignParentOfLaneFlowNodes(lane);
      if (lane.childLaneSet?.lane) {
        this.buildLaneBpmnElements(lane.childLaneSet.lane, lane.id, processId);
      }
    }
  }

  private assignParentOfLaneFlowNodes(lane: TLane): void {
    for (const flowNodeReference of ensureIsArray<string>(lane.flowNodeRef)) {
      const shapeBpmnElement = this.convertedElements.findFlowNode(flowNodeReference);
      const laneId = lane.id;
      if (shapeBpmnElement) {
        if (!ShapeUtil.isBoundaryEvent(shapeBpmnElement.kind)) {
          shapeBpmnElement.parentId = laneId;
        }
      } else {
        this.parsingMessageCollector.warning(new LaneUnknownFlowNodeReferenceWarning(laneId, flowNodeReference));
      }
    }
  }

  private buildSequenceFlows(bpmnElements: TSequenceFlow[] | TSequenceFlow): void {
    for (const sequenceFlow of ensureIsArray(bpmnElements)) {
      const kind = this.getSequenceFlowKind(sequenceFlow);
      this.convertedElements.registerSequenceFlow(new SequenceFlow(sequenceFlow.id, sequenceFlow.name, sequenceFlow.sourceRef, sequenceFlow.targetRef, kind));
    }
  }

  private buildAssociationFlows(bpmnElements: TAssociation[] | TAssociation): void {
    for (const association of ensureIsArray(bpmnElements)) {
      const direction = association.associationDirection as unknown as AssociationDirectionKind;
      this.convertedElements.registerAssociationFlow(new AssociationFlow(association.id, undefined, association.sourceRef, association.targetRef, direction));
    }
  }

  private getSequenceFlowKind(sequenceFlow: TSequenceFlow): SequenceFlowKind {
    if (this.defaultSequenceFlowIds.includes(sequenceFlow.id)) {
      return SequenceFlowKind.DEFAULT;
    } else {
      const sourceShapeBpmnElement = this.convertedElements.findFlowNode(sequenceFlow.sourceRef);
      if (sourceShapeBpmnElement && ShapeUtil.isWithDefaultSequenceFlow(sourceShapeBpmnElement.kind) && sequenceFlow.conditionExpression) {
        return ShapeUtil.isActivity(sourceShapeBpmnElement.kind) ? SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY : SequenceFlowKind.CONDITIONAL_FROM_GATEWAY;
      }
    }
    return SequenceFlowKind.NORMAL;
  }
}

const buildMarkers = (bpmnElement: TActivity): ShapeBpmnMarkerKind[] => {
  const markers: ShapeBpmnMarkerKind[] = [];
  const standardLoopCharacteristics = bpmnElement.standardLoopCharacteristics;
  const multiInstanceLoopCharacteristics = ensureIsArray(bpmnElement.multiInstanceLoopCharacteristics, true)[0];
  if (standardLoopCharacteristics !== undefined) {
    markers.push(ShapeBpmnMarkerKind.LOOP);
  } else if (multiInstanceLoopCharacteristics) {
    markers.push(multiInstanceLoopCharacteristics.isSequential ? ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL : ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL);
  }
  return markers;
};
