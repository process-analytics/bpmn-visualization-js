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
import BpmnVisualization from '../../src/component/BpmnVisualization';
import { ShapeBpmnElementKind } from '../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { ShapeBpmnEventKind } from '../../src/model/bpmn/shape/ShapeBpmnEventKind';
import { SequenceFlowKind } from '../../src/model/bpmn/edge/SequenceFlowKind';
import { ShapeBpmnSubProcessKind } from '../../src/model/bpmn/shape/ShapeBpmnSubProcessKind';
import { MarkerIdentifier } from '../../src/component/mxgraph/StyleUtils';
import { FlowKind } from '../../src/model/bpmn/edge/FlowKind';
import { MessageVisibleKind } from '../../src/model/bpmn/edge/MessageVisibleKind';
import { readFileSync } from '../helpers/file-helper';

export interface ExpectedFont {
  name?: string;
  size?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikeThrough?: boolean;
}

export interface ExpectedShapeModelElement {
  label?: string;
  kind: ShapeBpmnElementKind;
  font?: ExpectedFont;
  /** Only needed when the BPMN shape doesn't exist yet (use an arbitrary shape until the final render is implemented) */
  styleShape?: string;
  isExpanded?: boolean;
}

export interface ExpectedEventModelElement extends ExpectedShapeModelElement {
  eventKind: ShapeBpmnEventKind;
}

// TODO find a way to not be forced to pass 'kind'
export interface ExpectedSubProcessModelElement extends ExpectedShapeModelElement {
  subProcessKind: ShapeBpmnSubProcessKind;
}

interface ExpectedEdgeModelElement {
  label?: string;
  kind?: FlowKind;
  font?: ExpectedFont;
  startArrow?: string;
  messageVisibleKind?: MessageVisibleKind;
}

export interface ExpectedSequenceFlowModelElement extends ExpectedEdgeModelElement {
  sequenceFlowKind?: SequenceFlowKind;
}

// TODO find a way to not be forced to pass 'kind'
export interface ExpectedBoundaryEventModelElement extends ExpectedEventModelElement {
  isInterrupting?: boolean;
}

function expectGeometry(cell: mxCell, geometry: mxGeometry): void {
  const cellGeometry = cell.getGeometry();
  expect(cellGeometry.x).toEqual(geometry.x);
  expect(cellGeometry.y).toEqual(geometry.y);
  expect(cellGeometry.width).toEqual(geometry.width);
  expect(cellGeometry.height).toEqual(geometry.height);
  expect(cellGeometry.points).toEqual(geometry.points);
}

describe('mxGraph model', () => {
  const bpmnVisualization = new BpmnVisualization(null);

  function expectFont(state: mxCellState, expectedFont: ExpectedFont): void {
    if (expectedFont) {
      if (expectedFont.isBold) {
        expect(state.style[mxConstants.STYLE_FONTSTYLE]).toEqual(mxConstants.FONT_BOLD);
      }

      if (expectedFont.isItalic) {
        expect(state.style[mxConstants.STYLE_FONTSTYLE]).toEqual(mxConstants.FONT_ITALIC);
      }

      if (expectedFont.isUnderline) {
        expect(state.style[mxConstants.STYLE_FONTSTYLE]).toEqual(mxConstants.FONT_UNDERLINE);
      }

      if (expectedFont.isStrikeThrough) {
        expect(state.style[mxConstants.STYLE_FONTSTYLE]).toEqual(mxConstants.FONT_STRIKETHROUGH);
      }

      expect(state.style[mxConstants.STYLE_FONTFAMILY]).toEqual(expectedFont.name);
      expect(state.style[mxConstants.STYLE_FONTSIZE]).toEqual(expectedFont.size);
    }
  }

  function expectModelNotContainCell(cellId: string): void {
    const cell = bpmnVisualization.graph.model.getCell(cellId);
    expect(cell).toBeUndefined();
  }

  function expectModelContainsCell(cellId: string): mxCell {
    const cell = bpmnVisualization.graph.model.getCell(cellId);
    expect(cell).not.toBeUndefined();
    expect(cell).not.toBeNull();
    return cell;
  }

  function expectModelContainsShape(cellId: string, modelElement: ExpectedShapeModelElement): mxCell {
    const cell = expectModelContainsCell(cellId);
    expect(cell.style).toContain(modelElement.kind);
    if (modelElement.isExpanded !== undefined) {
      expect(cell.style).toContain(`bpmn.isExpanded=${modelElement.isExpanded}`);
    }
    const state = bpmnVisualization.graph.getView().getState(cell);

    const styleShape = !modelElement.styleShape ? modelElement.kind : modelElement.styleShape;
    expect(state.style[mxConstants.STYLE_SHAPE]).toEqual(styleShape);
    expect(cell.value).toEqual(modelElement.label);
    expectFont(state, modelElement.font);
    return cell;
  }

  function expectModelContainsEdge(cellId: string, modelElement: ExpectedEdgeModelElement): mxCell {
    const cell = expectModelContainsCell(cellId);
    expect(cell.style).toContain(modelElement.kind);

    if (modelElement.messageVisibleKind === MessageVisibleKind.NON_INITIATING) {
      expect(cell.style).toContain('strokeColor=DeepSkyBlue');
    } else if (modelElement.messageVisibleKind === MessageVisibleKind.INITIATING) {
      expect(cell.style).toContain('strokeColor=Yellow');
    }

    if (modelElement.startArrow || modelElement.font) {
      const state = bpmnVisualization.graph.getView().getState(cell);
      expect(state.style[mxConstants.STYLE_STARTARROW]).toEqual(modelElement.startArrow);
      expectFont(state, modelElement.font);
    }

    expect(cell.value).toEqual(modelElement.label);
    return cell;
  }

  function expectModelContainsSequenceFlow(cellId: string, modelElement: ExpectedSequenceFlowModelElement): mxCell {
    const cell = expectModelContainsEdge(cellId, { ...modelElement, kind: FlowKind.SEQUENCE_FLOW });
    expect(cell.style).toContain(modelElement.sequenceFlowKind);
    return cell;
  }

  function expectModelContainsMessageFlow(cellId: string, modelElement: ExpectedEdgeModelElement): mxCell {
    return expectModelContainsEdge(cellId, { ...modelElement, kind: FlowKind.MESSAGE_FLOW });
  }

  function expectModelContainsBpmnEvent(cellId: string, eventModelElement: ExpectedEventModelElement): mxCell {
    const cell = expectModelContainsShape(cellId, eventModelElement);
    expect(cell.style).toContain(`bpmn.eventKind=${eventModelElement.eventKind}`);
    return cell;
  }

  function expectModelContainsBpmnBoundaryEvent(cellId: string, boundaryEventModelElement: ExpectedBoundaryEventModelElement): void {
    const cell = expectModelContainsBpmnEvent(cellId, { ...boundaryEventModelElement, kind: ShapeBpmnElementKind.EVENT_BOUNDARY });
    expect(cell.style).toContain(`bpmn.isInterrupting=${boundaryEventModelElement.isInterrupting}`);
  }

  function expectModelContainsSubProcess(cellId: string, subProcessModelElement: ExpectedSubProcessModelElement): mxCell {
    const cell = expectModelContainsShape(cellId, {
      ...subProcessModelElement,
      kind: ShapeBpmnElementKind.SUB_PROCESS,
      isExpanded: subProcessModelElement.isExpanded ? true : false,
    });
    expect(cell.style).toContain(`bpmn.subProcessKind=${subProcessModelElement.subProcessKind}`);
    return cell;
  }

  it('bpmn elements should be available in the mxGraph model', async () => {
    // load BPMN
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-complete-semantic.bpmn'));

    // model is OK
    const expectedBoldFont = {
      isBold: true,
      isItalic: false,
      isStrikeThrough: false,
      isUnderline: false,
      name: 'Arial',
      size: 11.0,
    };

    // start event
    expectModelContainsBpmnEvent('startEvent_1', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.NONE, font: expectedBoldFont, label: 'Start Event' });
    expectModelContainsBpmnEvent('startEvent_2_timer', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.TIMER, label: 'Timer Start Event' });
    expectModelContainsBpmnEvent('startEvent_3_message', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.MESSAGE, label: 'Message Start Event' });
    expectModelContainsBpmnEvent('startEvent_4_signal', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.SIGNAL, label: 'Signal Start Event' });

    // end event
    expectModelContainsBpmnEvent('terminateEndEvent', {
      kind: ShapeBpmnElementKind.EVENT_END,
      eventKind: ShapeBpmnEventKind.TERMINATE,
      font: {
        isBold: false,
        isItalic: true,
        isStrikeThrough: false,
        isUnderline: false,
        name: 'Arial',
        size: 11.0,
      },
      label: 'Terminate End Event',
    });
    expectModelContainsBpmnEvent('messageEndEvent', { kind: ShapeBpmnElementKind.EVENT_END, eventKind: ShapeBpmnEventKind.MESSAGE, label: 'Message End Event' });
    expectModelContainsBpmnEvent('signalEndEvent', { kind: ShapeBpmnElementKind.EVENT_END, eventKind: ShapeBpmnEventKind.SIGNAL, label: 'Signal End Event' });

    // throw intermediate event
    expectModelContainsBpmnEvent('noneIntermediateThrowEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.NONE,
      font: {
        isBold: false,
        isItalic: false,
        isStrikeThrough: true,
        isUnderline: false,
        name: 'Arial',
        size: 11.0,
      },
      label: 'Throw None Intermediate Event',
    });
    expectModelContainsBpmnEvent('messageIntermediateThrowEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Throw Message Intermediate Event',
    });
    expectModelContainsBpmnEvent('signalIntermediateThrowEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Throw Signal Intermediate Event',
    });

    // catch intermediate event
    expectModelContainsBpmnEvent('messageIntermediateCatchEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Catch Message Intermediate Event',
    });
    expectModelContainsBpmnEvent('IntermediateCatchEvent_Timer_01', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Timer Intermediate Catch Event',
    });
    expectModelContainsBpmnEvent('signalIntermediateCatchEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Catch Signal Intermediate Event',
    });

    // boundary event: interrupting
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_message_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Message',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_timer_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Timer',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_signal_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Signal',
    });

    // boundary event: non-interrupting
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_message_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: false,
      label: 'Boundary Intermediate Event Non-interrupting Message',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_timer_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: false,
      label: 'Boundary Intermediate Event Non-interrupting Timer',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_signal_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      isInterrupting: false,
      label: 'Boundary Intermediate Event Non-interrupting Signal',
    });

    // Sub-process
    expectModelContainsSubProcess('expanded_embedded_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Expanded Embedded Sub-Process',
      isExpanded: true,
    });
    expectModelContainsSubProcess('collapsed_embedded_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Collapsed Embedded Sub-Process',
      isExpanded: false,
    });
    expectModelContainsSubProcess('expanded_event_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Expanded Event Sub-Process',
      isExpanded: true,
    });
    expectModelContainsSubProcess('collapsed_event_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Collapsed Event Sub-Process',
      isExpanded: false,
    });

    // activity
    expectModelContainsShape('task_1', {
      kind: ShapeBpmnElementKind.TASK,
      font: {
        isBold: false,
        isItalic: false,
        isStrikeThrough: false,
        isUnderline: true,
        name: 'Arial',
        size: 11.0,
      },
      label: 'Task 1',
    });
    expectModelContainsShape('serviceTask_2', { kind: ShapeBpmnElementKind.TASK_SERVICE, font: expectedBoldFont, label: 'Service Task 2' });
    expectModelContainsShape('userTask_3', { kind: ShapeBpmnElementKind.TASK_USER, font: expectedBoldFont, label: 'User Task 3' });
    expectModelContainsShape('callActivity_1', { kind: ShapeBpmnElementKind.CALL_ACTIVITY, label: 'Call Activity Collapsed' });
    expectModelContainsShape('receiveTask_not_instantiated', { kind: ShapeBpmnElementKind.TASK_RECEIVE, label: 'Not instantiated Receive Task' });
    expectModelContainsShape('receiveTask_instantiated', { kind: ShapeBpmnElementKind.TASK_RECEIVE, label: 'Instantiated Receive Task' });

    // text annotation
    expectModelContainsShape('text_annotation_id_1', { kind: ShapeBpmnElementKind.TEXT_ANNOTATION, label: 'Annotation' });

    // gateways
    expectModelContainsShape('inclusiveGateway_1', { kind: ShapeBpmnElementKind.GATEWAY_INCLUSIVE, label: 'Inclusive Gateway 1' });

    // sequence flow
    expectModelContainsSequenceFlow('default_sequence_flow_id', { sequenceFlowKind: SequenceFlowKind.DEFAULT, startArrow: MarkerIdentifier.ARROW_DASH, font: expectedBoldFont });
    expectModelContainsSequenceFlow('normal_sequence_flow_id', { sequenceFlowKind: SequenceFlowKind.NORMAL, label: "From 'start event 1' to 'task 1'" });
    expectModelContainsSequenceFlow('conditional_sequence_flow_from_activity_id', {
      sequenceFlowKind: SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
      startArrow: mxConstants.ARROW_DIAMOND_THIN,
    });
    expectModelContainsSequenceFlow('conditional_sequence_flow_from_gateway_id', { sequenceFlowKind: SequenceFlowKind.CONDITIONAL_FROM_GATEWAY, label: '' });

    // message flow
    expectModelContainsMessageFlow('message_flow_initiating_message_id', { label: 'Message Flow with initiating message', messageVisibleKind: MessageVisibleKind.INITIATING });
    expectModelContainsMessageFlow('message_flow_non_initiating_message_id', {
      label: 'Message Flow with non-initiating message',
      messageVisibleKind: MessageVisibleKind.NON_INITIATING,
    });
    expectModelContainsMessageFlow('message_flow_no_visible_id', { label: 'Message Flow without message', messageVisibleKind: MessageVisibleKind.NONE });
  });

  it('bpmn elements should not be available in the mxGraph model, if they are attached to not existing elements', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-badly-attached-elements.bpmn'));

    // model is OK
    // boundary event: interrupting
    expectModelNotContainCell('boundary_event_interrupting_message_id');
    expectModelNotContainCell('boundary_event_interrupting_timer_id');

    // boundary event: non-interrupting
    expectModelNotContainCell('boundary_event_non_interrupting_message_id');
    expectModelNotContainCell('boundary_event_non_interrupting_timer_id');
  });

  function expectModelContainsCellWithGeometry(cellId: string, parentId: string, geometry: mxGeometry): void {
    const cell = bpmnVisualization.graph.model.getCell(cellId);
    expect(cell).not.toBeNull();

    if (parentId) {
      expect(cell.parent.id).toEqual(parentId);
    } else {
      expect(cell.parent).toEqual(bpmnVisualization.graph.getDefaultParent());
    }

    expectGeometry(cell, geometry);
  }

  function getDefaultParentId(): string {
    return bpmnVisualization.graph.getDefaultParent().id;
  }

  it('bpmn element shape should have coordinates relative to the pool when no lane', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-coordinates-relative-to-pool.bpmn'));

    expectModelContainsCellWithGeometry(
      'Participant_1',
      getDefaultParentId(),
      // unchanged as this is a pool, coordinates are the ones from the bpmn source
      new mxGeometry(160, 80, 900, 180),
    );

    expectModelContainsCellWithGeometry(
      'StartEvent_1',
      'Participant_1',
      new mxGeometry(
        150, // absolute coordinates: parent 160, cell 310
        80, // absolute coordinates: parent 80, cell 160
        40, // unchanged as no transformation on size
        40, // unchanged as no transformation on size
      ),
    );

    const sequenceFlowMxGeometry = new mxGeometry(0, 0, 0, 0);
    sequenceFlowMxGeometry.points = [
      new mxPoint(190, 100), // absolute coordinates: parent x="160" y="80", cell x="350" y="180"
      new mxPoint(350, 100), // absolute coordinates: parent x="160" y="80", cell x="510" y="180"
    ];
    expectModelContainsCellWithGeometry('SequenceFlow_id', 'Participant_1', sequenceFlowMxGeometry);

    const messageFlowMxGeometry = new mxGeometry(0, 0, 0, 0);
    messageFlowMxGeometry.points = [
      new mxPoint(334, 260), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="260"
      new mxPoint(334, 342), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="342"
    ];
    expectModelContainsCellWithGeometry('MessageFlow_1', undefined, messageFlowMxGeometry);
  });

  it('lanes and bpmn element shapes should have coordinates relative to the pool or the lane', async () => {
    const bpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://example.com/schema/bpmn">
  <bpmn:collaboration id="Collaboration_1">
    <bpmn:participant id="Participant_1" name="Process" processRef="Process_1" />
    <bpmn:participant id="Participant_2" name="Process 2" processRef="Process_2" />
    <bpmn:messageFlow id="MessageFlow_1" sourceRef="Participant_1" targetRef="StartEvent_2" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:laneSet id="LaneSet_1">
      <bpmn:lane id="Lane_1_2" />
      <bpmn:lane id="Lane_1_1" name="Lane 1">
        <bpmn:flowNodeRef>SequenceFlow_id</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>EndEvent_1</bpmn:flowNodeRef>
      </bpmn:lane>
    </bpmn:laneSet>
    <bpmn:startEvent id="StartEvent_1" name="Start Event" />
    <bpmn:endEvent id="EndEvent_1" name="End Event" />
    <bpmn:sequenceFlow id="SequenceFlow_id" sourceRef="StartEvent_1" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmn:process id="Process_2" isExecutable="false">
    <bpmn:laneSet id="LaneSet_2">
      <bpmn:lane id="Lane_2_1">
        <bpmn:flowNodeRef>StartEvent_2</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="Lane_2_2" />
    </bpmn:laneSet>
    <bpmn:startEvent id="StartEvent_2" name="Start Event 2" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPLane_1_1" bpmnElement="Collaboration_1">
      <bpmndi:BPMNShape id="BPMNShape_Participant_1" bpmnElement="Participant_1" isHorizontal="true">
        <dc:Bounds x="160" y="80" width="900" height="400" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_Lane_1_1" bpmnElement="Lane_1_1" isHorizontal="true">
        <dc:Bounds x="190" y="80" width="870" height="200" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_Lane_1_2" bpmnElement="Lane_1_2" isHorizontal="true">
        <dc:Bounds x="190" y="280" width="870" height="200" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="310" y="160" width="40" height="40" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="306" y="133" width="55" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_EndEvent_1" bpmnElement="EndEvent_1">
        <dc:Bounds x="510" y="160" width="40" height="40" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="505" y="213" width="51" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_Participant_2" bpmnElement="Participant_2" isHorizontal="true">
        <dc:Bounds x="160" y="570" width="900" height="300" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_Lane_2_1" bpmnElement="Lane_2_1" isHorizontal="true">
        <dc:Bounds x="190" y="570" width="870" height="180" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_Lane_2_2" bpmnElement="Lane_2_2" isHorizontal="true">
        <dc:Bounds x="190" y="750" width="870" height="120" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_StartEvent_2" bpmnElement="StartEvent_2">
        <dc:Bounds x="316" y="632" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="302" y="683" width="64" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="BPMNEdge_SequenceFlow_id" bpmnElement="SequenceFlow_id">
        <di:waypoint x="350" y="180" />
        <di:waypoint x="510" y="180" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="BPMNEdge_MessageFlow_1" bpmnElement="MessageFlow_1">
        <di:waypoint x="334" y="480" />
        <di:waypoint x="334" y="632" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
    bpmnVisualization.load(bpmn);

    expectModelContainsCellWithGeometry(
      'Participant_1',
      getDefaultParentId(),
      // unchanged as this is a pool, coordinates are the ones from the bpmn source
      new mxGeometry(160, 80, 900, 400),
    );

    expectModelContainsCellWithGeometry(
      'Lane_1_1',
      'Participant_1',
      new mxGeometry(
        30, // absolute coordinates: parent 160, cell 190
        0, // absolute coordinates: parent 80, cell 80
        870, // unchanged as no transformation on size
        200, // unchanged as no transformation on size
      ),
    );

    expectModelContainsCellWithGeometry(
      'StartEvent_1',
      'Lane_1_1',
      new mxGeometry(
        120, // absolute coordinates: parent 190, cell 310
        80, // absolute coordinates: parent 80, cell 160
        40, // unchanged as no transformation on size
        40, // unchanged as no transformation on size
      ),
    );

    expectModelContainsCellWithGeometry(
      'Lane_1_2',
      'Participant_1',
      new mxGeometry(
        30, // absolute coordinates: parent 160, cell 190
        200, // absolute coordinates: parent 80, cell 280
        870, // unchanged as no transformation on size
        200, // unchanged as no transformation on size
      ),
    );

    const sequenceFlowMxGeometry = new mxGeometry(0, 0, 0, 0);
    sequenceFlowMxGeometry.points = [
      new mxPoint(160, 100), // absolute coordinates: parent x="190" y="80", cell x="350" y="180"
      new mxPoint(320, 100), // absolute coordinates: parent x="190" y="80", cell x="510" y="180"
    ];
    expectModelContainsCellWithGeometry('SequenceFlow_id', 'Lane_1_1', sequenceFlowMxGeometry);

    const messageFlowMxGeometry = new mxGeometry(0, 0, 0, 0);
    messageFlowMxGeometry.points = [
      new mxPoint(334, 480), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="480"
      new mxPoint(334, 632), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="632"
    ];
    expectModelContainsCellWithGeometry('MessageFlow_1', undefined, messageFlowMxGeometry);
  });
});
