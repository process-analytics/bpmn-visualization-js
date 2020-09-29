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
import { ShapeBpmnElementKind, ShapeBpmnEventKind, ShapeBpmnMarkerKind, ShapeBpmnSubProcessKind } from '../../src/model/bpmn/internal/shape';
import { SequenceFlowKind } from '../../src/model/bpmn/internal/edge/SequenceFlowKind';
import { MarkerIdentifier, StyleIdentifier } from '../../src';
import { FlowKind } from '../../src/model/bpmn/internal/edge/FlowKind';
import { readFileSync } from '../helpers/file-helper';
import { MessageVisibleKind } from '../../src/model/bpmn/json-xsd/BPMNDI';

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
  parentId?: string;
  /** Only needed when the BPMN shape doesn't exist yet (use an arbitrary shape until the final render is implemented) */
  styleShape?: string;
  markers?: ShapeBpmnMarkerKind[];
  isInstantiating?: boolean;
  isHorizontal?: boolean;
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
  parentId?: string;
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
export interface ExpectedStartEventModelElement extends ExpectedEventModelElement {
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
    const parentId = modelElement.parentId;
    if (parentId) {
      expect(cell.parent.id).toEqual(parentId);
    }
    expect(cell.style).toContain(modelElement.kind);

    if (modelElement.markers?.length > 0) {
      expect(cell.style).toContain(`bpmn.markers=${modelElement.markers.join(',')}`);
    }

    if (modelElement.isInstantiating !== undefined) {
      expect(cell.style).toContain(`bpmn.isInstantiating=${modelElement.isInstantiating}`);
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
    const parentId = modelElement.parentId;
    if (parentId) {
      expect(cell.parent.id).toEqual(parentId);
    }

    if (modelElement.messageVisibleKind) {
      const messageCell = expectModelContainsCell(`messageFlowIcon_of_${cellId}`);
      expect(messageCell.style).toContain(`shape=${StyleIdentifier.BPMN_STYLE_MESSAGE_FLOW_ICON};${StyleIdentifier.BPMN_STYLE_IS_INITIATING}=${modelElement.messageVisibleKind}`);
    } else {
      expectModelNotContainCell(`messageFlowIcon_of_${cellId}`);
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

  function expectModelContainsAssociationFlow(cellId: string, modelElement: ExpectedEdgeModelElement): mxCell {
    return expectModelContainsEdge(cellId, { ...modelElement, kind: FlowKind.ASSOCIATION_FLOW });
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

  function expectModelContainsBpmnStartEvent(cellId: string, startEventModelElement: ExpectedStartEventModelElement): void {
    const cell = expectModelContainsBpmnEvent(cellId, { ...startEventModelElement, kind: ShapeBpmnElementKind.EVENT_START });
    expect(cell.style).toContain(`bpmn.isInterrupting=${startEventModelElement.isInterrupting}`);
  }

  function expectModelContainsSubProcess(cellId: string, subProcessModelElement: ExpectedSubProcessModelElement): mxCell {
    const cell = expectModelContainsShape(cellId, {
      ...subProcessModelElement,
      kind: ShapeBpmnElementKind.SUB_PROCESS,
    });
    expect(cell.style).toContain(`bpmn.subProcessKind=${subProcessModelElement.subProcessKind}`);
    return cell;
  }

  function expectModelContainsPool(cellId: string, modelElement: ExpectedShapeModelElement): void {
    const mxCell = expectModelContainsShape(cellId, { ...modelElement, kind: ShapeBpmnElementKind.POOL, styleShape: mxConstants.SHAPE_SWIMLANE });
    expect(mxCell.style).toContain(`${mxConstants.STYLE_HORIZONTAL}=${modelElement.isHorizontal ? '0' : '1'}`);
  }

  function expectModelContainsLane(cellId: string, modelElement: ExpectedShapeModelElement): void {
    const mxCell = expectModelContainsShape(cellId, { ...modelElement, kind: ShapeBpmnElementKind.LANE, styleShape: mxConstants.SHAPE_SWIMLANE });
    expect(mxCell.style).toContain(`${mxConstants.STYLE_HORIZONTAL}=${modelElement.isHorizontal ? '0' : '1'}`);
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

    // pool
    const minimalPoolModelElement: ExpectedShapeModelElement = { kind: null, isHorizontal: true };
    expectModelContainsPool('participant_1_id', { ...minimalPoolModelElement, label: 'Pool 1' });
    expectModelContainsPool('participant_2_id', minimalPoolModelElement);
    expectModelContainsPool('participant_3_id', { ...minimalPoolModelElement, label: 'Black Box Process' });
    expectModelContainsPool('participant_4_id', { ...minimalPoolModelElement, label: 'Pool containing sublanes' });

    // lane
    expectModelContainsLane('Lane_1jf55v8', { ...minimalPoolModelElement, label: 'Lane with child lanes' });
    expectModelContainsLane('Lane_08b5s6x', { ...minimalPoolModelElement, label: 'Child Lane 1' });
    expectModelContainsLane('Lane_1vk6vro', { ...minimalPoolModelElement, label: 'Child lane 2' });

    // start event
    expectModelContainsBpmnEvent('startEvent_1', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.NONE, font: expectedBoldFont, label: 'Start Event' });
    expectModelContainsBpmnEvent('startEvent_2_timer', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.TIMER, label: 'Timer Start Event' });
    expectModelContainsBpmnEvent('startEvent_2_timer_on_top', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.TIMER, label: 'Timer Start Event On Top' });
    expectModelContainsBpmnEvent('startEvent_3_message', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.MESSAGE, label: 'Message Start Event' });
    expectModelContainsBpmnEvent('startEvent_3_message_on_top', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Message Start Event On Top',
    });
    expectModelContainsBpmnEvent('startEvent_4_signal', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.SIGNAL, label: 'Signal Start Event' });
    expectModelContainsBpmnEvent('startEvent_4_signal_on_top', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Signal Start Event On Top',
    });

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
    expectModelContainsBpmnEvent('terminateEndEvent_on_top', {
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
      label: 'Terminate End Event On Top',
    });
    expectModelContainsBpmnEvent('messageEndEvent', { kind: ShapeBpmnElementKind.EVENT_END, eventKind: ShapeBpmnEventKind.MESSAGE, label: 'Message End Event' });
    expectModelContainsBpmnEvent('messageEndEvent_on_top', { kind: ShapeBpmnElementKind.EVENT_END, eventKind: ShapeBpmnEventKind.MESSAGE, label: 'Message End Event On Top' });
    expectModelContainsBpmnEvent('signalEndEvent', { kind: ShapeBpmnElementKind.EVENT_END, eventKind: ShapeBpmnEventKind.SIGNAL, label: 'Signal End Event' });
    expectModelContainsBpmnEvent('signalEndEvent_on_top', { kind: ShapeBpmnElementKind.EVENT_END, eventKind: ShapeBpmnEventKind.SIGNAL, label: 'Signal End Event On Top' });
    expectModelContainsBpmnEvent('errorEndEvent', { kind: ShapeBpmnElementKind.EVENT_END, eventKind: ShapeBpmnEventKind.ERROR, label: 'Error End Event' });
    expectModelContainsBpmnEvent('errorEndEvent_on_top', { kind: ShapeBpmnElementKind.EVENT_END, eventKind: ShapeBpmnEventKind.ERROR, label: 'Error End Event On Top' });
    expectModelContainsBpmnEvent('compensate_end_event', { kind: ShapeBpmnElementKind.EVENT_END, eventKind: ShapeBpmnEventKind.COMPENSATION, label: 'Compensate End Event' });
    expectModelContainsBpmnEvent('compensate_end_event_on_top', {
      kind: ShapeBpmnElementKind.EVENT_END,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      label: 'Compensate End Event On Top',
    });

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
    expectModelContainsBpmnEvent('messageIntermediateThrowEvent_on_top', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Throw Message Intermediate Event On Top',
    });
    expectModelContainsBpmnEvent('signalIntermediateThrowEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Throw Signal Intermediate Event',
    });
    expectModelContainsBpmnEvent('signalIntermediateThrowEvent_on_top', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Throw Signal Intermediate Event On Top',
    });
    expectModelContainsBpmnEvent('linkIntermediateThrowEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.LINK,
      label: 'Throw Link Intermediate Event',
    });
    expectModelContainsBpmnEvent('linkIntermediateThrowEvent_on_top', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.LINK,
      label: 'Throw Link Intermediate Event On Top',
    });
    expectModelContainsBpmnEvent('compensateIntermediateThrowEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      label: 'Throw Compensate Intermediate Event',
    });
    expectModelContainsBpmnEvent('compensateIntermediateThrowEvent_on_top', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      label: 'Throw Compensate Intermediate Event On Top',
    });

    // catch intermediate event
    expectModelContainsBpmnEvent('messageIntermediateCatchEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Catch Message Intermediate Event',
    });
    expectModelContainsBpmnEvent('messageIntermediateCatchEvent_on_top', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Catch Message Intermediate Event On Top',
    });
    expectModelContainsBpmnEvent('IntermediateCatchEvent_Timer_01', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Timer Intermediate Catch Event',
    });
    expectModelContainsBpmnEvent('IntermediateCatchEvent_Timer_01_on_top', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Timer Intermediate Catch Event On Top',
    });
    expectModelContainsBpmnEvent('signalIntermediateCatchEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Catch Signal Intermediate Event',
    });
    expectModelContainsBpmnEvent('signalIntermediateCatchEvent_on_top', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Catch Signal Intermediate Event On Top',
    });
    expectModelContainsBpmnEvent('linkIntermediateCatchEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.LINK,
      label: 'Catch Link Intermediate Event',
    });
    expectModelContainsBpmnEvent('linkIntermediateCatchEvent_on_top', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.LINK,
      label: 'Catch Link Intermediate Event On Top',
    });

    // boundary event: interrupting
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_message_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Message',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_message_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Message On Top',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_timer_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Timer',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_timer_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Timer On Top',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_signal_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Signal',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_signal_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Signal On Top',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_error_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.ERROR,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Error',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_error_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.ERROR,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Error On Top',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_compensate_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Compensate',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_compensate_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Compensate On Top',
    });

    // boundary event: non-interrupting
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_message_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: false,
      label: 'Boundary Intermediate Event Non-interrupting Message',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_message_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: false,
      label: 'Boundary Intermediate Event Non-interrupting Message On Top',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_timer_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: false,
      label: 'Boundary Intermediate Event Non-interrupting Timer',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_timer_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: false,
      label: 'Boundary Intermediate Event Non-interrupting Timer On Top',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_signal_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      isInterrupting: false,
      label: 'Boundary Intermediate Event Non-interrupting Signal',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_signal_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      isInterrupting: false,
      label: 'Boundary Intermediate Event Non-interrupting Signal On Top',
    });

    // Sub-process
    expectModelContainsSubProcess('expanded_embedded_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Expanded Embedded Sub-Process',
    });
    expectModelContainsSubProcess('expanded_embedded_sub_process_with_loop_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Expanded Embedded Sub-Process With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsSubProcess('expanded_embedded_sub_process_with_sequential_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Expanded Embedded Sub-Process With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsSubProcess('expanded_embedded_sub_process_with_parallel_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Expanded Embedded Sub-Process With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    expectModelContainsSubProcess('collapsed_embedded_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Collapsed Embedded Sub-Process',
      markers: [ShapeBpmnMarkerKind.EXPAND],
    });
    expectModelContainsSubProcess('collapsed_embedded_sub_process_with_loop_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Collapsed Embedded Sub-Process With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
    });
    expectModelContainsSubProcess('collapsed_embedded_sub_process_with_sequential_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Collapsed Embedded Sub-Process With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
    });
    expectModelContainsSubProcess('collapsed_embedded_sub_process_with_parallel_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Collapsed Embedded Sub-Process With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND],
    });

    expectModelContainsSubProcess('expanded_event_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Expanded Event Sub-Process',
    });
    expectModelContainsSubProcess('expanded_event_sub_process_with_loop_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Expanded Event Sub-Process With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsSubProcess('expanded_event_sub_process_with_sequential_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Expanded Event Sub-Process With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsSubProcess('expanded_event_sub_process_with_parallel_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Expanded Event Sub-Process With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    expectModelContainsSubProcess('collapsed_event_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Collapsed Event Sub-Process',
      markers: [ShapeBpmnMarkerKind.EXPAND],
    });
    expectModelContainsSubProcess('collapsed_event_sub_process_with_loop_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Collapsed Event Sub-Process With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
    });
    expectModelContainsSubProcess('collapsed_event_sub_process_with_sequential_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Collapsed Event Sub-Process With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
    });
    expectModelContainsSubProcess('collapsed_event_sub_process_with_parallel_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Collapsed Event Sub-Process With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND],
    });

    // Elements in subprocess
    expectModelContainsShape('expanded_embedded_sub_process_id_startEvent_1', {
      kind: ShapeBpmnElementKind.EVENT_START,
      label: 'start event subprocess',
      parentId: 'expanded_embedded_sub_process_id',
    });
    expectModelContainsShape('expanded_embedded_sub_process_id_task_1', {
      kind: ShapeBpmnElementKind.TASK,
      label: 'Task in subprocess',
      parentId: 'expanded_embedded_sub_process_id',
    });
    expectModelContainsShape('expanded_embedded_sub_process_id_endEvent_1', {
      kind: ShapeBpmnElementKind.EVENT_END,
      label: 'end event subprocess',
      parentId: 'expanded_embedded_sub_process_id',
    });
    expectModelContainsEdge('expanded_embedded_sub_process_id_SeqFlow_1', {
      kind: FlowKind.SEQUENCE_FLOW,
      parentId: 'expanded_embedded_sub_process_id',
    });
    expectModelContainsEdge('expanded_embedded_sub_process_id_SeqFlow_2', {
      kind: FlowKind.SEQUENCE_FLOW,
      parentId: 'expanded_embedded_sub_process_id',
    });

    // Start Event in Event Sub Process
    expectModelContainsBpmnStartEvent('expanded_event_sub_process_with_non_interrupting_start_event_id_startEvent_1', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'non-interrupting start event in subprocess',
      parentId: 'expanded_event_sub_process_with_non_interrupting_start_event_id',
      isInterrupting: false,
    });
    expectModelContainsBpmnStartEvent('event_subprocess_compensate_start_interrupting', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      label: 'Event Subprocess Compensate Start Interrupting',
      parentId: 'expanded_event_sub_process_with_non_interrupting_start_event_id',
      isInterrupting: true,
    });
    expectModelContainsBpmnStartEvent('event_subprocess_compensate_start_interrupting_on_top', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      label: 'Event Subprocess Compensate Start Interrupting On Top',
      parentId: 'expanded_event_sub_process_with_non_interrupting_start_event_id',
      isInterrupting: true,
    });

    // Call Activity calling process
    // Expanded
    expectModelContainsShape('expanded_callActivity_1', { kind: ShapeBpmnElementKind.CALL_ACTIVITY, label: 'Expanded Call Activity' });
    expectModelContainsShape('expanded_callActivity_with_loop', {
      kind: ShapeBpmnElementKind.CALL_ACTIVITY,
      label: 'Expanded Call Activity With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsShape('expanded_callActivity_with_sequential_multi_instance', {
      kind: ShapeBpmnElementKind.CALL_ACTIVITY,
      label: 'Expanded Call Activity With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsShape('expanded_callActivity_with_parallel_multi_instance', {
      kind: ShapeBpmnElementKind.CALL_ACTIVITY,
      label: 'Expanded Call Activity With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    // Collapsed
    expectModelContainsShape('collapsed_callActivity_1', { kind: ShapeBpmnElementKind.CALL_ACTIVITY, label: 'Collapsed Call Activity' });
    expectModelContainsShape('collapsed_callActivity_with_loop', {
      kind: ShapeBpmnElementKind.CALL_ACTIVITY,
      label: 'Collapsed Call Activity With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
    });
    expectModelContainsShape('collapsed_callActivity_with_sequential_multi_instance', {
      kind: ShapeBpmnElementKind.CALL_ACTIVITY,
      label: 'Collapsed Call Activity With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
    });
    expectModelContainsShape('collapsed_callActivity_with_parallel_multi_instance', {
      kind: ShapeBpmnElementKind.CALL_ACTIVITY,
      label: 'Collapsed Call Activity With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND],
    });

    // activity
    // Task
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
    expectModelContainsShape('task_with_loop', {
      kind: ShapeBpmnElementKind.TASK,
      font: {
        isBold: false,
        isItalic: false,
        isStrikeThrough: false,
        isUnderline: true,
        name: 'Arial',
        size: 11.0,
      },
      label: 'Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsShape('task_with_sequential_multi_instance', {
      kind: ShapeBpmnElementKind.TASK,
      font: {
        isBold: false,
        isItalic: false,
        isStrikeThrough: false,
        isUnderline: true,
        name: 'Arial',
        size: 11.0,
      },
      label: 'Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsShape('task_with_parallel_multi_instance', {
      kind: ShapeBpmnElementKind.TASK,
      font: {
        isBold: false,
        isItalic: false,
        isStrikeThrough: false,
        isUnderline: true,
        name: 'Arial',
        size: 11.0,
      },
      label: 'Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    // Service Task
    expectModelContainsShape('serviceTask_2', { kind: ShapeBpmnElementKind.TASK_SERVICE, font: expectedBoldFont, label: 'Service Task 2' });
    expectModelContainsShape('serviceTask_with_loop', {
      kind: ShapeBpmnElementKind.TASK_SERVICE,
      font: expectedBoldFont,
      label: 'Service Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsShape('serviceTask_with_sequential_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_SERVICE,
      font: expectedBoldFont,
      label: 'Service Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsShape('serviceTask_with_parallel_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_SERVICE,
      font: expectedBoldFont,
      label: 'Service Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    // User Task
    expectModelContainsShape('userTask_3', { kind: ShapeBpmnElementKind.TASK_USER, font: expectedBoldFont, label: 'User Task 3' });
    expectModelContainsShape('userTask_with_loop', {
      kind: ShapeBpmnElementKind.TASK_USER,
      font: expectedBoldFont,
      label: 'User Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsShape('userTask_with_sequential_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_USER,
      font: expectedBoldFont,
      label: 'User Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsShape('userTask_with_parallel_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_USER,
      font: expectedBoldFont,
      label: 'User Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    // Receive Task: Non instantiating
    expectModelContainsShape('receiveTask_non_instantiating', { kind: ShapeBpmnElementKind.TASK_RECEIVE, label: 'Non-instantiating Receive Task', isInstantiating: false });
    expectModelContainsShape('receiveTask_non_instantiating_with_loop', {
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Non-instantiating Receive Task With Loop',
      isInstantiating: false,
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsShape('receiveTask_non_instantiating_with_sequential_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Non-instantiating Receive Task With Sequential Multi-instance',
      isInstantiating: false,
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsShape('receiveTask_non_instantiating_with_parallel_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Non-instantiating Receive Task With Parallel Multi-instance',
      isInstantiating: false,
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    // Receive Task: Instantiating
    expectModelContainsShape('receiveTask_instantiating', { kind: ShapeBpmnElementKind.TASK_RECEIVE, label: 'Instantiating Receive Task', isInstantiating: true });
    expectModelContainsShape('receiveTask_instantiating_with_loop', {
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Instantiating Receive Task With Loop',
      isInstantiating: true,
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsShape('receiveTask_instantiating_with_sequential_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Instantiating Receive Task With Sequential Multi-instance',
      isInstantiating: true,
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsShape('receiveTask_instantiating_with_parallel_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Instantiating Receive Task With Parallel Multi-instance',
      isInstantiating: true,
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    // Send Task
    expectModelContainsShape('sendTask', { kind: ShapeBpmnElementKind.TASK_SEND, font: expectedBoldFont, label: 'Send Task' });
    expectModelContainsShape('sendTask_with_loop', {
      kind: ShapeBpmnElementKind.TASK_SEND,
      font: expectedBoldFont,
      label: 'Send Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsShape('sendTask_with_sequential_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_SEND,
      font: expectedBoldFont,
      label: 'Send Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsShape('sendTask_with_parallel_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_SEND,
      font: expectedBoldFont,
      label: 'Send Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    // Manual Task
    expectModelContainsShape('manualTask', { kind: ShapeBpmnElementKind.TASK_MANUAL, font: expectedBoldFont, label: 'Manual Task' });
    expectModelContainsShape('manualTask_with_loop', {
      kind: ShapeBpmnElementKind.TASK_MANUAL,
      font: expectedBoldFont,
      label: 'Manual Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsShape('manualTask_with_sequential_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_MANUAL,
      font: expectedBoldFont,
      label: 'Manual Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsShape('manualTask_with_parallel_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_MANUAL,
      font: expectedBoldFont,
      label: 'Manual Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    // Script Task
    expectModelContainsShape('scriptTask', { kind: ShapeBpmnElementKind.TASK_SCRIPT, font: expectedBoldFont, label: 'Script Task' });
    expectModelContainsShape('scriptTask_with_loop', {
      kind: ShapeBpmnElementKind.TASK_SCRIPT,
      font: expectedBoldFont,
      label: 'Script Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsShape('scriptTask_with_sequential_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_SCRIPT,
      font: expectedBoldFont,
      label: 'Script Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsShape('scriptTask_with_parallel_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_SCRIPT,
      font: expectedBoldFont,
      label: 'Script Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    // Business Rule Task
    expectModelContainsShape('businessRuleTask', { kind: ShapeBpmnElementKind.TASK_BUSINESS_RULE, font: expectedBoldFont, label: 'Business Rule Task' });
    expectModelContainsShape('businessRuleTask_with_loop', {
      kind: ShapeBpmnElementKind.TASK_BUSINESS_RULE,
      font: expectedBoldFont,
      label: 'Business Rule Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
    });
    expectModelContainsShape('businessRuleTask_with_sequential_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_BUSINESS_RULE,
      font: expectedBoldFont,
      label: 'Business Rule Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    });
    expectModelContainsShape('businessRuleTask_with_parallel_multi_instance', {
      kind: ShapeBpmnElementKind.TASK_BUSINESS_RULE,
      font: expectedBoldFont,
      label: 'Business Rule Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
    });

    // text annotation
    expectModelContainsShape('text_annotation_id_1', { kind: ShapeBpmnElementKind.TEXT_ANNOTATION, label: 'Annotation' });

    // gateways
    expectModelContainsShape('inclusiveGateway_1', { kind: ShapeBpmnElementKind.GATEWAY_INCLUSIVE, label: 'Inclusive Gateway 1' });
    expectModelContainsShape('parallelGateway', { kind: ShapeBpmnElementKind.GATEWAY_PARALLEL, label: 'Parallel Gateway' });
    expectModelContainsShape('exclusiveGateway', { kind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, label: 'Exclusive Gateway' });

    // sequence flow
    expectModelContainsSequenceFlow('default_sequence_flow_id', { sequenceFlowKind: SequenceFlowKind.DEFAULT, startArrow: MarkerIdentifier.ARROW_DASH, font: expectedBoldFont });
    expectModelContainsSequenceFlow('normal_sequence_flow_id', { sequenceFlowKind: SequenceFlowKind.NORMAL, label: "From 'start event 1' to 'task 1'" });
    expectModelContainsSequenceFlow('conditional_sequence_flow_from_activity_id', {
      sequenceFlowKind: SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
      startArrow: mxConstants.ARROW_DIAMOND_THIN,
    });
    expectModelContainsSequenceFlow('conditional_sequence_flow_from_gateway_id', { sequenceFlowKind: SequenceFlowKind.CONDITIONAL_FROM_GATEWAY, label: '' });

    // message flow
    expectModelContainsMessageFlow('message_flow_initiating_message_id', { label: 'Message Flow with initiating message', messageVisibleKind: MessageVisibleKind.initiating });
    expectModelContainsMessageFlow('message_flow_non_initiating_message_id', {
      label: 'Message Flow with non-initiating message',
      messageVisibleKind: MessageVisibleKind.nonInitiating,
    });
    expectModelContainsMessageFlow('message_flow_no_visible_id', { label: 'Message Flow without message', messageVisibleKind: undefined });

    // association
    expectModelContainsAssociationFlow('association_id_1', { kind: FlowKind.ASSOCIATION_FLOW });
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
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-coordinates-relative-to-pool-or-lane.bpmn'));

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

  it('vertical pool, with vertical lanes & sub-lanes', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-vertical-pool-lanes-sub_lanes.bpmn'));

    // pool
    const minimalPoolModelElement: ExpectedShapeModelElement = { kind: null, isHorizontal: false };
    expectModelContainsPool('Participant_Vertical_With_Lanes', { ...minimalPoolModelElement, label: 'Vertical Pool With Lanes' });

    // lane
    expectModelContainsLane('Lane_Vertical_3', { ...minimalPoolModelElement });
    expectModelContainsLane('Lane_Vertical_1', { ...minimalPoolModelElement, label: 'Lane' });
    expectModelContainsLane('Lane_Vertical_With_Sub_Lane', { ...minimalPoolModelElement, label: 'Lane with Sub-Lanes' });
    expectModelContainsLane('SubLane_Vertical_1', { ...minimalPoolModelElement, label: 'Sub-Lane 1', parentId: 'Lane_Vertical_With_Sub_Lane' });
    expectModelContainsLane('SubLane_Vertical_2', { ...minimalPoolModelElement, label: 'Sub-Lane 2', parentId: 'Lane_Vertical_With_Sub_Lane' });
  });
});
