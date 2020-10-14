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
import { ShapeBpmnElementKind, ShapeBpmnEventKind, ShapeBpmnMarkerKind, ShapeBpmnSubProcessKind } from '../../src/model/bpmn/internal/shape';
import { SequenceFlowKind } from '../../src/model/bpmn/internal/edge/SequenceFlowKind';
import { MarkerIdentifier } from '../../src/bpmn-visualization';
import { MessageVisibleKind } from '../../src/model/bpmn/internal/edge/MessageVisibleKind';
import { readFileSync } from '../helpers/file-helper';
import {
  bpmnVisualization,
  ExpectedShapeModelElement,
  expectModelContainsBpmnBoundaryEvent,
  expectModelContainsBpmnEvent,
  expectModelContainsBpmnStartEvent,
  expectModelContainsLane,
  expectModelContainsPool,
  expectModelContainsSubProcess,
} from './ExpectModelUtils';

describe('mxGraph model', () => {
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
    expectModelContainsLane('lane_4_1_id', { ...minimalPoolModelElement, label: 'Lane with child lanes', parentId: 'participant_4_id' });
    expectModelContainsLane('lane_4_1_1_id', { ...minimalPoolModelElement, label: 'Child Lane 1', parentId: 'lane_4_1_id' });
    expectModelContainsLane('lane_4_1_2_id', { ...minimalPoolModelElement, label: 'Child Lane 2', parentId: 'lane_4_1_id' });
    expectModelContainsLane('lane_4_2_id', { ...minimalPoolModelElement, label: 'Solo Lane', parentId: 'participant_4_id' });

    // start event
    expectModelContainsBpmnEvent('start_event_none_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.NONE,
      font: expectedBoldFont,
      label: 'None Start Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('start_event_timer_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Timer Start Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('start_event_timer_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Timer Start Event On Top',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('start_event_message_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Message Start Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('start_event_message_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Message Start Event On Top',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('start_event_signal_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Signal Start Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('start_event_signal_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Signal Start Event On Top',
      parentId: 'participant_1_id',
    });

    // end event
    expectModelContainsBpmnEvent('end_event_terminate_id', {
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
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('end_event_terminate_on_top_id', {
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
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('end_event_message_id', {
      kind: ShapeBpmnElementKind.EVENT_END,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Message End Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('end_event_message_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_END,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Message End Event On Top',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('end_event_signal_id', {
      kind: ShapeBpmnElementKind.EVENT_END,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Signal End Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('end_event_signal_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_END,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Signal End Event On Top',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('end_event_error_id', {
      kind: ShapeBpmnElementKind.EVENT_END,
      eventKind: ShapeBpmnEventKind.ERROR,
      label: 'Error End Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('end_event_error_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_END,
      eventKind: ShapeBpmnEventKind.ERROR,
      label: 'Error End Event On Top',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('end_event_compensate_id', {
      kind: ShapeBpmnElementKind.EVENT_END,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      label: 'Compensate End Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('end_event_compensate_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_END,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      label: 'Compensate End Event On Top',
      parentId: 'participant_1_id',
    });

    // throw intermediate event
    expectModelContainsBpmnEvent('intermediate_throw_event_none_id', {
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
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_throw_event_message_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Throw Message Intermediate Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_throw_event_message_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Throw Message Intermediate Event On Top',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_throw_event_signal_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Throw Signal Intermediate Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_throw_event_signal_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Throw Signal Intermediate Event On Top',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_throw_event_link_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.LINK,
      label: 'Throw Link Intermediate Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_throw_event_link_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.LINK,
      label: 'Throw Link Intermediate Event On Top',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_throw_event_compensate_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      label: 'Throw Compensate Intermediate Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_throw_event_compensate_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      label: 'Throw Compensate Intermediate Event On Top',
      parentId: 'participant_1_id',
    });

    // catch intermediate event
    expectModelContainsBpmnEvent('intermediate_catch_event_message_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Catch Message Intermediate Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_catch_event_message_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Catch Message Intermediate Event On Top',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_catch_event_timer_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Timer Intermediate Catch Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_catch_event_timer_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Timer Intermediate Catch Event On Top',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_catch_event_signal_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Catch Signal Intermediate Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_catch_event_signal_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Catch Signal Intermediate Event On Top',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_catch_event_link_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.LINK,
      label: 'Catch Link Intermediate Event',
      parentId: 'participant_1_id',
    });
    expectModelContainsBpmnEvent('intermediate_catch_event_link_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.LINK,
      label: 'Catch Link Intermediate Event On Top',
      parentId: 'participant_1_id',
    });

    // boundary event: interrupting
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_message_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: true,
      label: 'Interrupting Message Boundary Intermediate Event',
      parentId: 'user_task_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_message_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: true,
      label: 'Interrupting Message Boundary Intermediate Event On Top',
      parentId: 'user_task_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_timer_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: true,
      label: 'Interrupting Timer Boundary Intermediate Event',
      parentId: 'send_task_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_timer_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: true,
      label: 'Interrupting Timer Boundary Intermediate Event On Top',
      parentId: 'send_task_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_signal_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      isInterrupting: true,
      label: 'Interrupting Signal Boundary Intermediate Event',
      parentId: 'service_task_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_signal_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      isInterrupting: true,
      label: 'Interrupting Signal Boundary Intermediate Event On Top',
      parentId: 'service_task_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_error_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.ERROR,
      isInterrupting: true,
      label: 'Interrupting Error Boundary Intermediate Event',
      parentId: 'task_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_error_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.ERROR,
      isInterrupting: true,
      label: 'Interrupting Error Boundary Intermediate Event On Top',
      parentId: 'task_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_compensate_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      isInterrupting: true,
      label: 'Interrupting Compensate Boundary Intermediate Event',
      parentId: 'business_rule_task_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_compensate_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      isInterrupting: true,
      label: 'Interrupting Compensate Boundary Intermediate Event On Top',
      parentId: 'business_rule_task_id',
    });

    // boundary event: non-interrupting
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_message_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: false,
      label: 'Non-interrupting Message Boundary Intermediate Event',
      parentId: 'expanded_embedded_sub_process_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_message_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: false,
      label: 'Non-interrupting Message Boundary Intermediate Event On Top',
      parentId: 'expanded_embedded_sub_process_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_timer_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: false,
      label: 'Non-interrupting Timer Boundary Intermediate Event',
      parentId: 'expanded_embedded_sub_process_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_timer_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: false,
      label: 'Non-interrupting Timer Boundary Intermediate Event On Top',
      parentId: 'expanded_embedded_sub_process_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_signal_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      isInterrupting: false,
      label: 'Non-interrupting Signal Boundary Intermediate Event',
      parentId: 'collapsed_call_activity_id',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_signal_on_top_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      isInterrupting: false,
      label: 'Non-interrupting Signal Boundary Intermediate Event On Top',
      parentId: 'collapsed_call_activity_id',
    });

    // Sub-process
    expectModelContainsSubProcess('expanded_embedded_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Expanded Embedded Sub-Process',
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expectModelContainsSubProcess('expanded_embedded_sub_process_with_loop_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Expanded Embedded Sub-Process With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expectModelContainsSubProcess('expanded_embedded_sub_process_with_sequential_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Expanded Embedded Sub-Process With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expectModelContainsSubProcess('expanded_embedded_sub_process_with_parallel_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Expanded Embedded Sub-Process With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });

    expectModelContainsSubProcess('collapsed_embedded_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Collapsed Embedded Sub-Process',
      markers: [ShapeBpmnMarkerKind.EXPAND],
      parentId: 'participant_1_id',
    });
    expectModelContainsSubProcess('collapsed_embedded_sub_process_with_loop_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Collapsed Embedded Sub-Process With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
      parentId: 'participant_1_id',
    });
    expectModelContainsSubProcess('collapsed_embedded_sub_process_with_sequential_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Collapsed Embedded Sub-Process With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
      parentId: 'participant_1_id',
    });
    expectModelContainsSubProcess('collapsed_embedded_sub_process_with_parallel_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      label: 'Collapsed Embedded Sub-Process With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND],
      parentId: 'participant_1_id',
    });

    expectModelContainsSubProcess('expanded_event_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Expanded Event Sub-Process',
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expectModelContainsSubProcess('expanded_event_sub_process_with_loop_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Expanded Event Sub-Process With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expectModelContainsSubProcess('expanded_event_sub_process_with_sequential_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Expanded Event Sub-Process With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expectModelContainsSubProcess('expanded_event_sub_process_with_parallel_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Expanded Event Sub-Process With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });

    expectModelContainsSubProcess('collapsed_event_sub_process_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Collapsed Event Sub-Process',
      markers: [ShapeBpmnMarkerKind.EXPAND],
      parentId: 'participant_1_id',
    });
    expectModelContainsSubProcess('collapsed_event_sub_process_with_loop_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Collapsed Event Sub-Process With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
      parentId: 'participant_1_id',
    });
    expectModelContainsSubProcess('collapsed_event_sub_process_with_sequential_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Collapsed Event Sub-Process With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
      parentId: 'participant_1_id',
    });
    expectModelContainsSubProcess('collapsed_event_sub_process_with_parallel_multi_instance_id', {
      kind: null,
      subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      label: 'Collapsed Event Sub-Process With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND],
      parentId: 'participant_1_id',
    });

    // Elements in subprocess
    expect('start_event_in_sub_process_id').toBeShape({
      kind: ShapeBpmnElementKind.EVENT_START,
      label: 'Start Event In Sub-Process',
      parentId: 'expanded_embedded_sub_process_id',
      verticalAlign: 'top',
    });
    expect('task_in_sub_process_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK,
      label: 'Task In Sub-Process',
      parentId: 'expanded_embedded_sub_process_id',
      verticalAlign: 'middle',
    });
    expect('end_event_in_sub_process_id').toBeShape({
      kind: ShapeBpmnElementKind.EVENT_END,
      label: 'End Event In Sub-Process',
      parentId: 'expanded_embedded_sub_process_id',
      verticalAlign: 'top',
    });
    expect('sequence_flow_in_sub_process_1_id').toBeSequenceFlow({
      parentId: 'expanded_embedded_sub_process_id',
      verticalAlign: 'bottom',
    });
    expect('sequence_flow_in_sub_process_2_id').toBeSequenceFlow({
      parentId: 'expanded_embedded_sub_process_id',
      verticalAlign: 'bottom',
    });

    expect('task_in_collapsed_sub_process_id').not.toBeCell();

    // Start Event in Event Sub Process
    // Interrupting Start Event
    expectModelContainsBpmnStartEvent('start_event_interrupting_message_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Interrupting Message Start Event In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: true,
    });
    expectModelContainsBpmnStartEvent('start_event_interrupting_message_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Interrupting Message Start Event On Top In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: true,
    });
    expectModelContainsBpmnStartEvent('start_event_interrupting_timer_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Interrupting Timer Start Event In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: true,
    });
    expectModelContainsBpmnStartEvent('start_event_interrupting_timer_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Interrupting Timer Start Event On Top In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: true,
    });
    expectModelContainsBpmnStartEvent('start_event_interrupting_signal_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Interrupting Signal Start Event In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: true,
    });
    expectModelContainsBpmnStartEvent('start_event_interrupting_signal_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Interrupting Signal Start Event On Top In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: true,
    });
    expectModelContainsBpmnStartEvent('start_event_interrupting_error_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.ERROR,
      label: 'Interrupting Error Start Event In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: true,
    });
    expectModelContainsBpmnStartEvent('start_event_interrupting_error_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.ERROR,
      label: 'Interrupting Error Start Event On Top In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: true,
    });
    expectModelContainsBpmnStartEvent('start_event_interrupting_compensate_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      label: 'Interrupting Compensate Start Event In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: true,
    });
    expectModelContainsBpmnStartEvent('start_event_interrupting_compensate_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.COMPENSATION,
      label: 'Interrupting Compensate Start Event On Top In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: true,
    });

    // Non-interrupting Start Event
    expectModelContainsBpmnStartEvent('start_event_non_interrupting_message_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Non-interrupting Message Start Event In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: false,
    });
    expectModelContainsBpmnStartEvent('start_event_non_interrupting_message_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Non-interrupting Message Start Event On Top In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: false,
    });
    expectModelContainsBpmnStartEvent('start_event_non_interrupting_timer_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Non-interrupting Timer Start Event In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: false,
    });
    expectModelContainsBpmnStartEvent('start_event_non_interrupting_timer_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Non-interrupting Timer Start Event On Top In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: false,
    });
    expectModelContainsBpmnStartEvent('start_event_non_interrupting_signal_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Non-interrupting Signal Start Event In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: false,
    });
    expectModelContainsBpmnStartEvent('start_event_non_interrupting_signal_on_top_id', {
      kind: ShapeBpmnElementKind.EVENT_START,
      eventKind: ShapeBpmnEventKind.SIGNAL,
      label: 'Non-interrupting Signal Start Event On Top In Sub-Process',
      parentId: 'expanded_event_sub_process_with_start_events_id',
      isInterrupting: false,
    });

    // Call Activity calling process
    // Expanded
    expect('expanded_call_activity_id').toBeCallActivity({
      label: 'Expanded Call Activity',
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expect('expanded_call_activity_with_loop_id').toBeCallActivity({
      label: 'Expanded Call Activity With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expect('expanded_call_activity_with_sequential_multi_instance_id').toBeCallActivity({
      label: 'Expanded Call Activity With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expect('expanded_call_activity_with_parallel_multi_instance_id').toBeCallActivity({
      label: 'Expanded Call Activity With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });

    // Collapsed
    expect('collapsed_call_activity_id').toBeCallActivity({
      label: 'Collapsed Call Activity',
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expect('collapsed_call_activity_with_loop_id').toBeCallActivity({
      label: 'Collapsed Call Activity With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
      parentId: 'participant_1_id',
    });
    expect('collapsed_call_activity_with_sequential_multi_instance_id').toBeCallActivity({
      label: 'Collapsed Call Activity With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
      parentId: 'participant_1_id',
    });
    expect('collapsed_call_activity_with_parallel_multi_instance_id').toBeCallActivity({
      label: 'Collapsed Call Activity With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND],
      parentId: 'participant_1_id',
    });

    // activity
    // Task
    expect('task_id').toBeTask({ label: 'Task', parentId: 'participant_1_id' });
    expect('task_with_loop_id').toBeTask({
      label: 'Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
    });
    expect('task_with_sequential_multi_instance_id').toBeTask({
      label: 'Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
    });
    expect('task_with_parallel_multi_instance_id').toBeTask({
      label: 'Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
    });
    expect('task_with_flows_id').toBeTask({
      font: {
        isBold: false,
        isItalic: false,
        isStrikeThrough: false,
        isUnderline: true,
        name: 'Arial',
        size: 11.0,
      },
      label: 'Task with Flows',
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });

    // Service Task
    expect('service_task_id').toBeServiceTask({
      font: expectedBoldFont,
      label: 'Service Task',
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expect('service_task_with_loop_id').toBeServiceTask({
      label: 'Service Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
    });
    expect('service_task_with_sequential_multi_instance_id').toBeServiceTask({
      label: 'Service Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
    });
    expect('service_task_with_parallel_multi_instance_id').toBeServiceTask({
      label: 'Service Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
    });

    // User Task
    expect('user_task_id').toBeUserTask({ font: expectedBoldFont, label: 'User Task', parentId: 'participant_1_id', verticalAlign: 'top' });
    expect('user_task_with_loop_id').toBeUserTask({
      label: 'User Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
    });
    expect('user_task_with_sequential_multi_instance_id').toBeUserTask({
      label: 'User Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
    });
    expect('user_task_with_parallel_multi_instance_id').toBeUserTask({
      label: 'User Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
    });

    // Receive Task: Non instantiating
    expect('receive_task_non_instantiating_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Non-instantiating Receive Task',
      isInstantiating: false,
      parentId: 'participant_1_id',
    });
    expect('receive_task_non_instantiating_with_loop_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Non-instantiating Receive Task With Loop',
      isInstantiating: false,
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
    });
    expect('receive_task_non_instantiating_with_sequential_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Non-instantiating Receive Task With Sequential Multi-instance',
      isInstantiating: false,
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
    });
    expect('receive_task_non_instantiating_with_parallel_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Non-instantiating Receive Task With Parallel Multi-instance',
      isInstantiating: false,
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
    });

    // Receive Task: Instantiating
    expect('receive_task_instantiating_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Instantiating Receive Task',
      isInstantiating: true,
      parentId: 'participant_1_id',
    });
    expect('receive_task_instantiating_with_loop_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Instantiating Receive Task With Loop',
      isInstantiating: true,
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
    });
    expect('receive_task_instantiating_with_sequential_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Instantiating Receive Task With Sequential Multi-instance',
      isInstantiating: true,
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
    });
    expect('receive_task_instantiating_with_parallel_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_RECEIVE,
      label: 'Instantiating Receive Task With Parallel Multi-instance',
      isInstantiating: true,
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
    });

    // Send Task
    expect('send_task_id').toBeShape({ kind: ShapeBpmnElementKind.TASK_SEND, font: expectedBoldFont, label: 'Send Task', parentId: 'participant_1_id', verticalAlign: 'top' });
    expect('send_task_with_loop_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_SEND,
      label: 'Send Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
    });
    expect('send_task_with_sequential_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_SEND,
      label: 'Send Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
    });
    expect('send_task_with_parallel_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_SEND,
      label: 'Send Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
    });

    // Manual Task
    expect('manual_task_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_MANUAL,
      font: expectedBoldFont,
      label: 'Manual Task',
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expect('manual_task_with_loop_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_MANUAL,
      label: 'Manual Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
    });
    expect('manual_task_with_sequential_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_MANUAL,
      label: 'Manual Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
    });
    expect('manual_task_with_parallel_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_MANUAL,
      label: 'Manual Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
    });

    // Script Task
    expect('script_task_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_SCRIPT,
      font: expectedBoldFont,
      label: 'Script Task',
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expect('script_task_with_loop_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_SCRIPT,
      label: 'Script Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
    });
    expect('script_task_with_sequential_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_SCRIPT,
      label: 'Script Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
    });
    expect('script_task_with_parallel_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_SCRIPT,
      label: 'Script Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
    });

    // Business Rule Task
    expect('business_rule_task_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_BUSINESS_RULE,
      font: expectedBoldFont,
      label: 'Business Rule Task',
      parentId: 'participant_1_id',
      verticalAlign: 'top',
    });
    expect('business_rule_task_with_loop_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_BUSINESS_RULE,
      label: 'Business Rule Task With Loop',
      markers: [ShapeBpmnMarkerKind.LOOP],
      parentId: 'participant_1_id',
    });
    expect('business_rule_task_with_sequential_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_BUSINESS_RULE,
      label: 'Business Rule Task With Sequential Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
      parentId: 'participant_1_id',
    });
    expect('business_rule_task_with_parallel_multi_instance_id').toBeShape({
      kind: ShapeBpmnElementKind.TASK_BUSINESS_RULE,
      label: 'Business Rule Task With Parallel Multi-instance',
      markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
      parentId: 'participant_1_id',
    });

    // text annotation
    expect('text_annotation_id').toBeShape({
      kind: ShapeBpmnElementKind.TEXT_ANNOTATION,
      label: 'Annotation',
      parentId: 'participant_1_id',
      align: 'left',
    });

    // gateways
    expect('inclusive_gateway_id').toBeShape({ kind: ShapeBpmnElementKind.GATEWAY_INCLUSIVE, label: 'Inclusive Gateway', parentId: 'participant_1_id', verticalAlign: 'top' });
    expect('parallel_gateway_id').toBeShape({ kind: ShapeBpmnElementKind.GATEWAY_PARALLEL, label: 'Parallel Gateway', parentId: 'participant_1_id', verticalAlign: 'top' });
    expect('exclusive_gateway_id').toBeShape({ kind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, label: 'Exclusive Gateway', parentId: 'participant_1_id', verticalAlign: 'top' });

    // sequence flow
    expect('default_sequence_flow_id').toBeSequenceFlow({
      sequenceFlowKind: SequenceFlowKind.DEFAULT,
      startArrow: MarkerIdentifier.ARROW_DASH,
      parentId: 'participant_1_id',
      font: expectedBoldFont,
    });
    expect('normal_sequence_flow_id').toBeSequenceFlow({
      sequenceFlowKind: SequenceFlowKind.NORMAL,
      parentId: 'participant_1_id',
      label: "From 'start event 1' to 'task 1'",
    });
    expect('conditional_sequence_flow_from_activity_id').toBeSequenceFlow({
      sequenceFlowKind: SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
      startArrow: mxConstants.ARROW_DIAMOND_THIN,
      parentId: 'participant_1_id',
      verticalAlign: 'bottom',
    });
    expect('conditional_sequence_flow_from_gateway_id').toBeSequenceFlow({
      sequenceFlowKind: SequenceFlowKind.CONDITIONAL_FROM_GATEWAY,
      parentId: 'participant_1_id',
      label: '',
      verticalAlign: 'bottom',
    });

    // message flow
    expect('message_flow_initiating_message_id').toBeMessageFlow({
      label: 'Message Flow with initiating message',
      messageVisibleKind: MessageVisibleKind.INITIATING,
      verticalAlign: 'bottom',
    });
    expect('message_flow_non_initiating_message_id').toBeMessageFlow({
      label: 'Message Flow with non-initiating message',
      messageVisibleKind: MessageVisibleKind.NON_INITIATING,
      verticalAlign: 'bottom',
    });
    expect('message_flow_no_visible_id').toBeMessageFlow({ label: 'Message Flow without message', messageVisibleKind: MessageVisibleKind.NONE, verticalAlign: 'bottom' });

    // association
    expect('association_id').toBeAssociationFlow({ parentId: 'participant_1_id', verticalAlign: 'bottom' });
  });

  it('bpmn elements should not be available in the mxGraph model, if they are attached to not existing elements', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-badly-attached-elements.bpmn'));

    // model is OK
    // boundary event: interrupting
    expect('boundary_event_interrupting_message_id').not.toBeCell();
    expect('boundary_event_interrupting_timer_id').not.toBeCell();

    // boundary event: non-interrupting
    expect('boundary_event_non_interrupting_message_id').not.toBeCell();
    expect('boundary_event_non_interrupting_timer_id').not.toBeCell();
  });

  it('bpmn element shape should have coordinates relative to the pool when no lane', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-coordinates-relative-to-pool.bpmn'));

    expect('Participant_1').toBeCellWithParentAndGeometry({
      // unchanged as this is a pool, coordinates are the ones from the bpmn source
      geometry: new mxGeometry(160, 80, 900, 180),
    });

    expect('StartEvent_1').toBeCellWithParentAndGeometry({
      parentId: 'Participant_1',
      geometry: new mxGeometry(
        150, // absolute coordinates: parent 160, cell 310
        80, // absolute coordinates: parent 80, cell 160
        40, // unchanged as no transformation on size
        40, // unchanged as no transformation on size
      ),
    });

    const sequenceFlowMxGeometry = new mxGeometry(0, 0, 0, 0);
    sequenceFlowMxGeometry.points = [
      new mxPoint(190, 100), // absolute coordinates: parent x="160" y="80", cell x="350" y="180"
      new mxPoint(350, 100), // absolute coordinates: parent x="160" y="80", cell x="510" y="180"
    ];
    expect('SequenceFlow_id').toBeCellWithParentAndGeometry({
      parentId: 'Participant_1',
      geometry: sequenceFlowMxGeometry,
    });

    const messageFlowMxGeometry = new mxGeometry(0, 0, 0, 0);
    messageFlowMxGeometry.points = [
      new mxPoint(334, 260), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="260"
      new mxPoint(334, 342), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="342"
    ];
    expect('MessageFlow_1').toBeCellWithParentAndGeometry({
      geometry: messageFlowMxGeometry,
    });
  });

  it('lanes and bpmn element shapes should have coordinates relative to the pool or the lane', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-coordinates-relative-to-pool-or-lane.bpmn'));

    expect('Participant_1').toBeCellWithParentAndGeometry({
      // unchanged as this is a pool, coordinates are the ones from the bpmn source
      geometry: new mxGeometry(160, 80, 900, 400),
    });

    expect('Lane_1_1').toBeCellWithParentAndGeometry({
      parentId: 'Participant_1',
      geometry: new mxGeometry(
        30, // absolute coordinates: parent 160, cell 190
        0, // absolute coordinates: parent 80, cell 80
        870, // unchanged as no transformation on size
        200, // unchanged as no transformation on size
      ),
    });

    expect('StartEvent_1').toBeCellWithParentAndGeometry({
      parentId: 'Lane_1_1',
      geometry: new mxGeometry(
        120, // absolute coordinates: parent 190, cell 310
        80, // absolute coordinates: parent 80, cell 160
        40, // unchanged as no transformation on size
        40, // unchanged as no transformation on size
      ),
    });

    expect('Lane_1_847987').not.toBeCellWithParentAndGeometry({
      parentId: 'Participant_1',
      geometry: new mxGeometry(
        30, // absolute coordinates: parent 160, cell 190
        200, // absolute coordinates: parent 80, cell 280
        870, // unchanged as no transformation on size
        200, // unchanged as no transformation on size
      ),
    });

    const sequenceFlowMxGeometry = new mxGeometry(0, 0, 0, 0);
    sequenceFlowMxGeometry.points = [
      new mxPoint(160, 100), // absolute coordinates: parent x="190" y="80", cell x="350" y="180"
      new mxPoint(320, 100), // absolute coordinates: parent x="190" y="80", cell x="510" y="180"
    ];
    expect('SequenceFlow_id').toBeCellWithParentAndGeometry({
      parentId: 'Lane_1_1',
      geometry: sequenceFlowMxGeometry,
    });

    const messageFlowMxGeometry = new mxGeometry(0, 0, 0, 0);
    messageFlowMxGeometry.points = [
      new mxPoint(334, 480), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="480"
      new mxPoint(334, 632), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="632"
    ];
    expect('MessageFlow_1').toBeCellWithParentAndGeometry({
      geometry: messageFlowMxGeometry,
    });
  });

  it('vertical pool, with vertical lanes & sub-lanes', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-vertical-pool-lanes-sub_lanes.bpmn'));

    // pool
    const minimalPoolModelElement: ExpectedShapeModelElement = { kind: null, isHorizontal: false };
    expectModelContainsPool('Participant_Vertical_With_Lanes', { ...minimalPoolModelElement, label: 'Vertical Pool With Lanes' });

    // lane
    expectModelContainsLane('Lane_Vertical_3', { ...minimalPoolModelElement, parentId: 'Participant_Vertical_With_Lanes' });
    expectModelContainsLane('Lane_Vertical_1', { ...minimalPoolModelElement, label: 'Lane', parentId: 'Participant_Vertical_With_Lanes' });
    expectModelContainsLane('Lane_Vertical_With_Sub_Lane', { ...minimalPoolModelElement, label: 'Lane with Sub-Lanes', parentId: 'Participant_Vertical_With_Lanes' });
    expectModelContainsLane('SubLane_Vertical_1', { ...minimalPoolModelElement, label: 'Sub-Lane 1', parentId: 'Lane_Vertical_With_Sub_Lane' });
    expectModelContainsLane('SubLane_Vertical_2', { ...minimalPoolModelElement, label: 'Sub-Lane 2', parentId: 'Lane_Vertical_With_Sub_Lane' });
  });
});
