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
import {
  MarkerIdentifier,
  MessageVisibleKind,
  SequenceFlowKind,
  ShapeBpmnElementKind,
  ShapeBpmnEventBasedGatewayKind,
  ShapeBpmnEventDefinitionKind,
  ShapeBpmnMarkerKind,
  ShapeBpmnSubProcessKind,
} from '../../src/bpmn-visualization';
import { readFileSync } from '../helpers/file-helper';
import type { ExpectedShapeModelElement } from './helpers/model-expect';
import { bpmnVisualization, expectEdgesInModel, expectPoolsInModel, expectTotalEdgesInModel, expectShapesInModel, expectTotalShapesInModel } from './helpers/model-expect';
import { mxgraph } from '../../src/component/mxgraph/initializer';

describe('mxGraph model - BPMN elements', () => {
  describe('BPMN elements should be available in the mxGraph model', () => {
    // load BPMN
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-complete-semantic.bpmn'));

    const expectedBoldFont = {
      isBold: true,
      isItalic: false,
      isStrikeThrough: false,
      isUnderline: false,
      name: 'Arial',
      size: 11.0,
    };

    describe('BPMN containers', () => {
      const minimalPoolModelElement: ExpectedShapeModelElement = { isHorizontal: true };
      it('pool', async () => {
        expect('participant_1_id').toBePool({ ...minimalPoolModelElement, label: 'Pool 1' });
        expect('participant_2_id').toBePool(minimalPoolModelElement);
        expect('participant_3_id').toBePool({ ...minimalPoolModelElement, label: 'Black Box Process' });
        expect('participant_4_id').toBePool({ ...minimalPoolModelElement, label: 'Pool containing sublanes' });
      });

      it('lane', async () => {
        expect('lane_4_1_id').toBeLane({ ...minimalPoolModelElement, label: 'Lane with child lanes', parentId: 'participant_4_id' });
        expect('lane_4_1_1_id').toBeLane({ ...minimalPoolModelElement, label: 'Child Lane 1', parentId: 'lane_4_1_id' });
        expect('lane_4_1_2_id').toBeLane({ ...minimalPoolModelElement, label: 'Child Lane 2', parentId: 'lane_4_1_id' });
        expect('lane_4_2_id').toBeLane({ ...minimalPoolModelElement, label: 'Solo Lane', parentId: 'participant_4_id' });
      });
    });

    describe('BPMN events', () => {
      it('start event', async () => {
        expect('start_event_none_id').toBeStartEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
          font: expectedBoldFont,
          label: 'None Start Event',
          parentId: 'participant_1_id',
        });
        expect('start_event_timer_id').toBeStartEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
          label: 'Timer Start Event',
          parentId: 'participant_1_id',
        });
        expect('start_event_timer_on_top_id').toBeStartEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
          label: 'Timer Start Event On Top',
          parentId: 'participant_1_id',
        });
        expect('start_event_message_id').toBeStartEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          label: 'Message Start Event',
          parentId: 'participant_1_id',
        });
        expect('start_event_message_on_top_id').toBeStartEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          label: 'Message Start Event On Top',
          parentId: 'participant_1_id',
        });
        expect('start_event_signal_id').toBeStartEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          label: 'Signal Start Event',
          parentId: 'participant_1_id',
        });
        expect('start_event_signal_on_top_id').toBeStartEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          label: 'Signal Start Event On Top',
          parentId: 'participant_1_id',
        });
        expect('start_event_conditional_id').toBeStartEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
          label: 'Conditional Start Event',
          parentId: 'participant_1_id',
        });
        expect('start_event_conditional_on_top_id').toBeStartEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
          label: 'Conditional Start Event On Top',
          parentId: 'participant_1_id',
        });
      });

      it('end event', async () => {
        expect('end_event_terminate_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.TERMINATE,
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
        expect('end_event_terminate_on_top_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.TERMINATE,
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
        expect('end_event_message_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          label: 'Message End Event',
          parentId: 'participant_1_id',
        });
        expect('end_event_message_on_top_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          label: 'Message End Event On Top',
          parentId: 'participant_1_id',
        });
        expect('end_event_signal_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          label: 'Signal End Event',
          parentId: 'participant_1_id',
        });
        expect('end_event_signal_on_top_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          label: 'Signal End Event On Top',
          parentId: 'participant_1_id',
        });
        expect('end_event_error_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ERROR,
          label: 'Error End Event',
          parentId: 'participant_1_id',
        });
        expect('end_event_error_on_top_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ERROR,
          label: 'Error End Event On Top',
          parentId: 'participant_1_id',
        });
        expect('end_event_compensate_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.COMPENSATION,
          label: 'Compensate End Event',
          parentId: 'participant_1_id',
        });
        expect('end_event_compensate_on_top_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.COMPENSATION,
          label: 'Compensate End Event On Top',
          parentId: 'participant_1_id',
        });
        expect('end_event_cancel_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CANCEL,
          label: 'Cancel End Event',
          parentId: 'participant_1_id',
        });
        expect('end_event_cancel_on_top_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CANCEL,
          label: 'Cancel End Event On Top',
          parentId: 'participant_1_id',
        });
        expect('end_event_escalation_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
          label: 'Escalation End Event',
          parentId: 'participant_1_id',
        });
        expect('end_event_escalation_on_top_id').toBeEndEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
          label: 'Escalation End Event On Top',
          parentId: 'participant_1_id',
        });
      });

      it('throw intermediate event', async () => {
        expect('intermediate_throw_event_none_id').toBeIntermediateThrowEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
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
        expect('intermediate_throw_event_message_id').toBeIntermediateThrowEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          label: 'Throw Message Intermediate Event',
          parentId: 'participant_1_id',
        });
        expect('intermediate_throw_event_message_on_top_id').toBeIntermediateThrowEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          label: 'Throw Message Intermediate Event On Top',
          parentId: 'participant_1_id',
        });
        expect('intermediate_throw_event_signal_id').toBeIntermediateThrowEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          label: 'Throw Signal Intermediate Event',
          parentId: 'participant_1_id',
        });
        expect('intermediate_throw_event_signal_on_top_id').toBeIntermediateThrowEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          label: 'Throw Signal Intermediate Event On Top',
          parentId: 'participant_1_id',
        });
        expect('intermediate_throw_event_link_id').toBeIntermediateThrowEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
          label: 'Throw Link Intermediate Event',
          parentId: 'participant_1_id',
        });
        expect('intermediate_throw_event_link_on_top_id').toBeIntermediateThrowEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
          label: 'Throw Link Intermediate Event On Top',
          parentId: 'participant_1_id',
        });
        expect('intermediate_throw_event_compensate_id').toBeIntermediateThrowEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.COMPENSATION,
          label: 'Throw Compensate Intermediate Event',
          parentId: 'participant_1_id',
        });
        expect('intermediate_throw_event_compensate_on_top_id').toBeIntermediateThrowEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.COMPENSATION,
          label: 'Throw Compensate Intermediate Event On Top',
          parentId: 'participant_1_id',
        });
        expect('intermediate_throw_event_escalation_id').toBeIntermediateThrowEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
          label: 'Throw Escalation Intermediate Event',
          parentId: 'participant_1_id',
        });
        expect('intermediate_throw_event_escalation_on_top_id').toBeIntermediateThrowEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
          label: 'Throw Escalation Intermediate Event On Top',
          parentId: 'participant_1_id',
        });
      });

      it('catch intermediate event', async () => {
        expect('intermediate_catch_event_message_id').toBeIntermediateCatchEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          label: 'Catch Message Intermediate Event',
          parentId: 'participant_1_id',
        });
        expect('intermediate_catch_event_message_on_top_id').toBeIntermediateCatchEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          label: 'Catch Message Intermediate Event On Top',
          parentId: 'participant_1_id',
        });
        expect('intermediate_catch_event_timer_id').toBeIntermediateCatchEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
          label: 'Catch Timer Intermediate Event',
          parentId: 'participant_1_id',
        });
        expect('intermediate_catch_event_timer_on_top_id').toBeIntermediateCatchEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
          label: 'Catch Timer Intermediate Event On Top',
          parentId: 'participant_1_id',
        });
        expect('intermediate_catch_event_signal_id').toBeIntermediateCatchEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          label: 'Catch Signal Intermediate Event',
          parentId: 'participant_1_id',
        });
        expect('intermediate_catch_event_signal_on_top_id').toBeIntermediateCatchEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          label: 'Catch Signal Intermediate Event On Top',
          parentId: 'participant_1_id',
        });
        expect('intermediate_catch_event_link_id').toBeIntermediateCatchEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
          label: 'Catch Link Intermediate Event',
          parentId: 'participant_1_id',
        });
        expect('intermediate_catch_event_link_on_top_id').toBeIntermediateCatchEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
          label: 'Catch Link Intermediate Event On Top',
          parentId: 'participant_1_id',
        });
        expect('intermediate_catch_event_conditional_id').toBeIntermediateCatchEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
          label: 'Catch Conditional Intermediate Event',
          parentId: 'participant_1_id',
        });
        expect('intermediate_catch_event_conditional_on_top_id').toBeIntermediateCatchEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
          label: 'Catch Conditional Intermediate Event On Top',
          parentId: 'participant_1_id',
        });
      });

      it('boundary event: interrupting', async () => {
        expect('boundary_event_interrupting_message_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          isInterrupting: true,
          label: 'Interrupting Message Boundary Intermediate Event',
          parentId: 'user_task_id',
        });
        expect('boundary_event_interrupting_message_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          isInterrupting: true,
          label: 'Interrupting Message Boundary Intermediate Event On Top',
          parentId: 'user_task_id',
        });
        expect('boundary_event_interrupting_timer_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
          isInterrupting: true,
          label: 'Interrupting Timer Boundary Intermediate Event',
          parentId: 'send_task_id',
        });
        expect('boundary_event_interrupting_timer_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
          isInterrupting: true,
          label: 'Interrupting Timer Boundary Intermediate Event On Top',
          parentId: 'send_task_id',
        });
        expect('boundary_event_interrupting_signal_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          isInterrupting: true,
          label: 'Interrupting Signal Boundary Intermediate Event',
          parentId: 'service_task_id',
        });
        expect('boundary_event_interrupting_signal_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          isInterrupting: true,
          label: 'Interrupting Signal Boundary Intermediate Event On Top',
          parentId: 'service_task_id',
        });
        expect('boundary_event_interrupting_error_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ERROR,
          isInterrupting: true,
          label: 'Interrupting Error Boundary Intermediate Event',
          parentId: 'task_id',
        });
        expect('boundary_event_interrupting_error_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ERROR,
          isInterrupting: true,
          label: 'Interrupting Error Boundary Intermediate Event On Top',
          parentId: 'task_id',
        });
        expect('boundary_event_interrupting_compensate_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.COMPENSATION,
          isInterrupting: true,
          label: 'Interrupting Compensate Boundary Intermediate Event',
          parentId: 'business_rule_task_id',
        });
        expect('boundary_event_interrupting_compensate_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.COMPENSATION,
          isInterrupting: true,
          label: 'Interrupting Compensate Boundary Intermediate Event On Top',
          parentId: 'business_rule_task_id',
        });
        expect('boundary_event_interrupting_cancel_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CANCEL,
          isInterrupting: true,
          label: 'Interrupting Cancel Boundary Intermediate Event',
          parentId: 'receive_task_non_instantiating_id',
        });
        expect('boundary_event_interrupting_cancel_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CANCEL,
          isInterrupting: true,
          label: 'Interrupting Cancel Boundary Intermediate Event On Top',
          parentId: 'receive_task_non_instantiating_id',
        });
        expect('boundary_event_interrupting_conditional_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
          isInterrupting: true,
          label: 'Interrupting Conditional Boundary Intermediate Event',
          parentId: 'receive_task_instantiating_id',
        });
        expect('boundary_event_interrupting_conditional_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
          isInterrupting: true,
          label: 'Interrupting Conditional Boundary Intermediate Event On Top',
          parentId: 'receive_task_instantiating_id',
        });
        expect('boundary_event_interrupting_escalation_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
          isInterrupting: true,
          label: 'Interrupting Escalation Boundary Intermediate Event',
          parentId: 'receive_task_non_instantiating_with_loop_id',
        });
        expect('boundary_event_interrupting_escalation_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
          isInterrupting: true,
          label: 'Interrupting Escalation Boundary Intermediate Event On Top',
          parentId: 'receive_task_non_instantiating_with_loop_id',
        });
      });

      it('boundary event: non-interrupting', async () => {
        expect('boundary_event_non_interrupting_message_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          isInterrupting: false,
          label: 'Non-interrupting Message Boundary Intermediate Event',
          parentId: 'collapsed_embedded_sub_process_with_loop_id',
        });
        expect('boundary_event_non_interrupting_message_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          isInterrupting: false,
          label: 'Non-interrupting Message Boundary Intermediate Event On Top',
          parentId: 'collapsed_embedded_sub_process_with_parallel_multi_instance_id',
        });
        expect('boundary_event_non_interrupting_timer_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
          isInterrupting: false,
          label: 'Non-interrupting Timer Boundary Intermediate Event',
          parentId: 'collapsed_call_activity_with_parallel_multi_instance_id',
        });
        expect('boundary_event_non_interrupting_timer_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
          isInterrupting: false,
          label: 'Non-interrupting Timer Boundary Intermediate Event On Top',
          parentId: 'collapsed_embedded_sub_process_with_sequential_multi_instance_id',
        });
        expect('boundary_event_non_interrupting_signal_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          isInterrupting: false,
          label: 'Non-interrupting Signal Boundary Intermediate Event',
          parentId: 'collapsed_call_activity_id',
        });
        expect('boundary_event_non_interrupting_signal_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
          isInterrupting: false,
          label: 'Non-interrupting Signal Boundary Intermediate Event On Top',
          parentId: 'collapsed_call_activity_id',
        });
        expect('boundary_event_non_interrupting_conditional_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
          isInterrupting: false,
          label: 'Non-interrupting Conditional Boundary Intermediate Event',
          parentId: 'collapsed_call_activity_with_loop_id',
        });
        expect('boundary_event_non_interrupting_conditional_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
          isInterrupting: false,
          label: 'Non-interrupting Conditional Boundary Intermediate Event On Top',
          parentId: 'collapsed_call_activity_with_loop_id',
        });
        expect('boundary_event_non_interrupting_escalation_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
          isInterrupting: false,
          label: 'Non-interrupting Escalation Boundary Intermediate Event',
          parentId: 'collapsed_call_activity_with_sequential_multi_instance_id',
        });
        expect('boundary_event_non_interrupting_escalation_on_top_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
          isInterrupting: false,
          label: 'Non-interrupting Escalation Boundary Intermediate Event On Top',
          parentId: 'collapsed_call_activity_with_sequential_multi_instance_id',
        });
      });
    });

    describe('Sub-Processes', () => {
      it('Expanded embedded subprocess', async () => {
        expect('expanded_embedded_sub_process_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
          label: 'Expanded Embedded Sub-Process',
          parentId: 'participant_1_id',
          verticalAlign: 'top',
        });
        expect('expanded_embedded_sub_process_with_loop_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
          label: 'Expanded Embedded Sub-Process With Loop',
          markers: [ShapeBpmnMarkerKind.LOOP],
          parentId: 'participant_1_id',
          verticalAlign: 'top',
        });
        expect('expanded_embedded_sub_process_with_sequential_multi_instance_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
          label: 'Expanded Embedded Sub-Process With Sequential Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
          parentId: 'participant_1_id',
          verticalAlign: 'top',
        });
        expect('expanded_embedded_sub_process_with_parallel_multi_instance_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
          label: 'Expanded Embedded Sub-Process With Parallel Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
          parentId: 'participant_1_id',
          verticalAlign: 'top',
        });
      });

      it('Collapsed embedded subprocess', async () => {
        expect('collapsed_embedded_sub_process_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
          label: 'Collapsed Embedded Sub-Process',
          markers: [ShapeBpmnMarkerKind.EXPAND],
          parentId: 'participant_1_id',
        });
        expect('collapsed_embedded_sub_process_with_loop_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
          label: 'Collapsed Embedded Sub-Process With Loop',
          markers: [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
          parentId: 'participant_1_id',
        });
        expect('collapsed_embedded_sub_process_with_sequential_multi_instance_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
          label: 'Collapsed Embedded Sub-Process With Sequential Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
          parentId: 'participant_1_id',
        });
        expect('collapsed_embedded_sub_process_with_parallel_multi_instance_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
          label: 'Collapsed Embedded Sub-Process With Parallel Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND],
          parentId: 'participant_1_id',
        });
      });

      it('Expanded event subprocess', async () => {
        expect('expanded_event_sub_process_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EVENT,
          label: 'Expanded Event Sub-Process',
          parentId: 'participant_1_id',
          verticalAlign: 'top',
        });
        expect('expanded_event_sub_process_with_loop_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EVENT,
          label: 'Expanded Event Sub-Process With Loop',
          markers: [ShapeBpmnMarkerKind.LOOP],
          parentId: 'participant_1_id',
          verticalAlign: 'top',
        });
        expect('expanded_event_sub_process_with_sequential_multi_instance_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EVENT,
          label: 'Expanded Event Sub-Process With Sequential Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
          parentId: 'participant_1_id',
          verticalAlign: 'top',
        });
        expect('expanded_event_sub_process_with_parallel_multi_instance_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EVENT,
          label: 'Expanded Event Sub-Process With Parallel Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
          parentId: 'participant_1_id',
          verticalAlign: 'top',
        });
      });

      it('Collapsed event subprocess', async () => {
        expect('collapsed_event_sub_process_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EVENT,
          label: 'Collapsed Event Sub-Process',
          markers: [ShapeBpmnMarkerKind.EXPAND],
          parentId: 'participant_1_id',
        });
        expect('collapsed_event_sub_process_with_loop_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EVENT,
          label: 'Collapsed Event Sub-Process With Loop',
          markers: [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
          parentId: 'participant_1_id',
        });
        expect('collapsed_event_sub_process_with_sequential_multi_instance_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EVENT,
          label: 'Collapsed Event Sub-Process With Sequential Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
          parentId: 'participant_1_id',
        });
        expect('collapsed_event_sub_process_with_parallel_multi_instance_id').toBeSubProcess({
          subProcessKind: ShapeBpmnSubProcessKind.EVENT,
          label: 'Collapsed Event Sub-Process With Parallel Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND],
          parentId: 'participant_1_id',
        });
      });

      it('Elements in expanded subprocess', async () => {
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
      });

      it('Elements of collapsed Sub Process', async () => {
        expect('message_boundary_event_attached_to_collapsed_embedded_sub_process_id').toBeBoundaryEvent({
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          label: 'Interrupting Message Boundary Event attached to collapsed Sub-Process',
          parentId: 'collapsed_embedded_sub_process_id',
          isInterrupting: true,
        });
        expect('task_in_collapsed_sub_process_id').not.toBeCell();
      });

      describe('Start Event in Event Sub Process', () => {
        it('Interrupting Start Event', async () => {
          expect('start_event_interrupting_message_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
            label: 'Interrupting Message Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_message_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
            label: 'Interrupting Message Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_timer_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
            label: 'Interrupting Timer Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_timer_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
            label: 'Interrupting Timer Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_signal_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
            label: 'Interrupting Signal Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_signal_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
            label: 'Interrupting Signal Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_error_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.ERROR,
            label: 'Interrupting Error Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_error_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.ERROR,
            label: 'Interrupting Error Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_compensate_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.COMPENSATION,
            label: 'Interrupting Compensate Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_compensate_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.COMPENSATION,
            label: 'Interrupting Compensate Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_conditional_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
            label: 'Interrupting Conditional Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_conditional_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
            label: 'Interrupting Conditional Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_escalation_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
            label: 'Interrupting Escalation Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
          expect('start_event_interrupting_escalation_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
            label: 'Interrupting Escalation Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: true,
          });
        });

        it('Non-interrupting Start Event', async () => {
          expect('start_event_non_interrupting_message_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
            label: 'Non-interrupting Message Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: false,
          });
          expect('start_event_non_interrupting_message_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
            label: 'Non-interrupting Message Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: false,
          });
          expect('start_event_non_interrupting_timer_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
            label: 'Non-interrupting Timer Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: false,
          });
          expect('start_event_non_interrupting_timer_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
            label: 'Non-interrupting Timer Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: false,
          });
          expect('start_event_non_interrupting_signal_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
            label: 'Non-interrupting Signal Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: false,
          });
          expect('start_event_non_interrupting_signal_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
            label: 'Non-interrupting Signal Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: false,
          });
          expect('start_event_non_interrupting_conditional_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
            label: 'Non-interrupting Conditional Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: false,
          });
          expect('start_event_non_interrupting_conditional_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL,
            label: 'Non-interrupting Conditional Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: false,
          });
          expect('start_event_non_interrupting_escalation_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
            label: 'Non-interrupting Escalation Start Event In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: false,
          });
          expect('start_event_non_interrupting_escalation_on_top_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.ESCALATION,
            label: 'Non-interrupting Escalation Start Event On Top In Sub-Process',
            parentId: 'expanded_event_sub_process_with_start_events_id',
            isInterrupting: false,
          });
        });
      });
    });

    describe('Call Activities', () => {
      describe('Call Activity calling process', () => {
        it('Expanded', async () => {
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
        });

        it('Collapsed', async () => {
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
        });
      });

      describe('Call Activity calling Global Tasks', () => {
        it('Calling Global Task', async () => {
          expect('call_activity_calling_global_task_id').toBeCallActivity({
            label: 'Call Activity Calling Global Task',
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK,
            verticalAlign: 'top',
          });
          expect('call_activity_calling_global_task_with_loop_id').toBeCallActivity({
            label: 'Call Activity Calling Global Task With Loop',
            markers: [ShapeBpmnMarkerKind.LOOP],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK,
          });
          expect('call_activity_calling_global_task_with_sequential_multi_instance_id').toBeCallActivity({
            label: 'Call Activity Calling Global Task With Sequential Multi-instance',
            markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK,
          });
          expect('call_activity_calling_global_task_with_parallel_multi_instance_id').toBeCallActivity({
            label: 'Call Activity Calling Global Task With Parallel Multi-instance',
            markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK,
          });
        });

        it('Calling Global Business Rule Task', async () => {
          expect('call_activity_calling_global_business_rule_task_id').toBeCallActivity({
            label: 'Call Activity Calling Global Business Rule Task',
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE,
            verticalAlign: 'top',
          });
          expect('call_activity_calling_global_business_rule_task_with_loop_id').toBeCallActivity({
            label: 'Call Activity Calling Global Business Rule Task With Loop',
            markers: [ShapeBpmnMarkerKind.LOOP],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE,
          });
          expect('call_activity_calling_global_business_rule_task_with_sequential_multi_instance_id').toBeCallActivity({
            label: 'Call Activity Calling Global Business Rule Task With Sequential Multi-instance',
            markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE,
          });
          expect('call_activity_calling_global_business_rule_task_with_parallel_multi_instance_id').toBeCallActivity({
            label: 'Call Activity Calling Global Business Rule Task With Parallel Multi-instance',
            markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE,
          });
        });

        it('Calling Global Manual Task', async () => {
          expect('call_activity_calling_global_manual_task_id').toBeCallActivity({
            label: 'Call Activity Calling Global Manual Task',
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_MANUAL,
            verticalAlign: 'top',
          });
          expect('call_activity_calling_global_manual_task_with_loop_id').toBeCallActivity({
            label: 'Call Activity Calling Global Manual Task With Loop',
            markers: [ShapeBpmnMarkerKind.LOOP],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_MANUAL,
          });
          expect('call_activity_calling_global_manual_task_with_sequential_multi_instance_id').toBeCallActivity({
            label: 'Call Activity Calling Global Manual Task With Sequential Multi-instance',
            markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_MANUAL,
          });
          expect('call_activity_calling_global_manual_task_with_parallel_multi_instance_id').toBeCallActivity({
            label: 'Call Activity Calling Global Manual Task With Parallel Multi-instance',
            markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_MANUAL,
          });
        });

        it('Calling Global Script Task', async () => {
          expect('call_activity_calling_global_script_task_id').toBeCallActivity({
            label: 'Call Activity Calling Global Script Task',
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_SCRIPT,
            verticalAlign: 'top',
          });
          expect('call_activity_calling_global_script_task_with_loop_id').toBeCallActivity({
            label: 'Call Activity Calling Global Script Task With Loop',
            markers: [ShapeBpmnMarkerKind.LOOP],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_SCRIPT,
          });
          expect('call_activity_calling_global_script_task_with_sequential_multi_instance_id').toBeCallActivity({
            label: 'Call Activity Calling Global Script Task With Sequential Multi-instance',
            markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_SCRIPT,
          });
          expect('call_activity_calling_global_script_task_with_parallel_multi_instance_id').toBeCallActivity({
            label: 'Call Activity Calling Global Script Task With Parallel Multi-instance',
            markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_SCRIPT,
          });
        });

        it('Calling Global User Task', async () => {
          expect('call_activity_calling_global_user_task_id').toBeCallActivity({
            label: 'Call Activity Calling Global User Task',
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_USER,
            verticalAlign: 'top',
          });
          expect('call_activity_calling_global_user_task_with_loop_id').toBeCallActivity({
            label: 'Call Activity Calling Global User Task With Loop',
            markers: [ShapeBpmnMarkerKind.LOOP],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_USER,
          });
          expect('call_activity_calling_global_user_task_with_sequential_multi_instance_id').toBeCallActivity({
            label: 'Call Activity Calling Global User Task With Sequential Multi-instance',
            markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_USER,
          });
          expect('call_activity_calling_global_user_task_with_parallel_multi_instance_id').toBeCallActivity({
            label: 'Call Activity Calling Global User Task With Parallel Multi-instance',
            markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
            parentId: 'participant_1_id',
            globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_USER,
          });
        });
      });
    });

    describe('Tasks', () => {
      it('Abstract Task', async () => {
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
      });

      it('Service Task', async () => {
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
      });

      it('User Task', async () => {
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
      });

      it('Receive Task: Non instantiating', async () => {
        expect('receive_task_non_instantiating_id').toBeReceiveTask({
          label: 'Non-instantiating Receive Task',
          isInstantiating: false,
          parentId: 'participant_1_id',
        });
        expect('receive_task_non_instantiating_with_loop_id').toBeReceiveTask({
          label: 'Non-instantiating Receive Task With Loop',
          isInstantiating: false,
          markers: [ShapeBpmnMarkerKind.LOOP],
          parentId: 'participant_1_id',
        });
        expect('receive_task_non_instantiating_with_sequential_multi_instance_id').toBeReceiveTask({
          label: 'Non-instantiating Receive Task With Sequential Multi-instance',
          isInstantiating: false,
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
          parentId: 'participant_1_id',
        });
        expect('receive_task_non_instantiating_with_parallel_multi_instance_id').toBeReceiveTask({
          label: 'Non-instantiating Receive Task With Parallel Multi-instance',
          isInstantiating: false,
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
          parentId: 'participant_1_id',
        });
      });

      it('Receive Task: Instantiating', async () => {
        expect('receive_task_instantiating_id').toBeReceiveTask({
          label: 'Instantiating Receive Task',
          isInstantiating: true,
          parentId: 'participant_1_id',
        });
        expect('receive_task_instantiating_with_loop_id').toBeReceiveTask({
          label: 'Instantiating Receive Task With Loop',
          isInstantiating: true,
          markers: [ShapeBpmnMarkerKind.LOOP],
          parentId: 'participant_1_id',
        });
        expect('receive_task_instantiating_with_sequential_multi_instance_id').toBeReceiveTask({
          label: 'Instantiating Receive Task With Sequential Multi-instance',
          isInstantiating: true,
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
          parentId: 'participant_1_id',
        });
        expect('receive_task_instantiating_with_parallel_multi_instance_id').toBeReceiveTask({
          label: 'Instantiating Receive Task With Parallel Multi-instance',
          isInstantiating: true,
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
          parentId: 'participant_1_id',
        });
      });

      it('Send Task', async () => {
        expect('send_task_id').toBeSendTask({ font: expectedBoldFont, label: 'Send Task', parentId: 'participant_1_id', verticalAlign: 'top' });
        expect('send_task_with_loop_id').toBeSendTask({
          label: 'Send Task With Loop',
          markers: [ShapeBpmnMarkerKind.LOOP],
          parentId: 'participant_1_id',
        });
        expect('send_task_with_sequential_multi_instance_id').toBeSendTask({
          label: 'Send Task With Sequential Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
          parentId: 'participant_1_id',
        });
        expect('send_task_with_parallel_multi_instance_id').toBeSendTask({
          label: 'Send Task With Parallel Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
          parentId: 'participant_1_id',
        });
      });

      it('Manual Task', async () => {
        expect('manual_task_id').toBeManualTask({
          font: expectedBoldFont,
          label: 'Manual Task',
          parentId: 'participant_1_id',
          verticalAlign: 'top',
        });
        expect('manual_task_with_loop_id').toBeManualTask({
          label: 'Manual Task With Loop',
          markers: [ShapeBpmnMarkerKind.LOOP],
          parentId: 'participant_1_id',
        });
        expect('manual_task_with_sequential_multi_instance_id').toBeManualTask({
          label: 'Manual Task With Sequential Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
          parentId: 'participant_1_id',
        });
        expect('manual_task_with_parallel_multi_instance_id').toBeManualTask({
          label: 'Manual Task With Parallel Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
          parentId: 'participant_1_id',
        });
      });

      it('Script Task', async () => {
        expect('script_task_id').toBeScriptTask({
          font: expectedBoldFont,
          label: 'Script Task',
          parentId: 'participant_1_id',
          verticalAlign: 'top',
        });
        expect('script_task_with_loop_id').toBeScriptTask({
          label: 'Script Task With Loop',
          markers: [ShapeBpmnMarkerKind.LOOP],
          parentId: 'participant_1_id',
        });
        expect('script_task_with_sequential_multi_instance_id').toBeScriptTask({
          label: 'Script Task With Sequential Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
          parentId: 'participant_1_id',
        });
        expect('script_task_with_parallel_multi_instance_id').toBeScriptTask({
          label: 'Script Task With Parallel Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
          parentId: 'participant_1_id',
        });
      });

      it('Business Rule Task', async () => {
        expect('business_rule_task_id').toBeBusinessRuleTask({
          font: expectedBoldFont,
          label: 'Business Rule Task',
          parentId: 'participant_1_id',
          verticalAlign: 'top',
        });
        expect('business_rule_task_with_loop_id').toBeBusinessRuleTask({
          label: 'Business Rule Task With Loop',
          markers: [ShapeBpmnMarkerKind.LOOP],
          parentId: 'participant_1_id',
        });
        expect('business_rule_task_with_sequential_multi_instance_id').toBeBusinessRuleTask({
          label: 'Business Rule Task With Sequential Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
          parentId: 'participant_1_id',
        });
        expect('business_rule_task_with_parallel_multi_instance_id').toBeBusinessRuleTask({
          label: 'Business Rule Task With Parallel Multi-instance',
          markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
          parentId: 'participant_1_id',
        });
      });
    });

    it('text annotations', async () => {
      expect('text_annotation_id').toBeShape({
        kind: ShapeBpmnElementKind.TEXT_ANNOTATION,
        label: 'Annotation',
        parentId: 'participant_1_id',
        align: 'left',
      });
    });

    it('groups', async () => {
      expect('Group_0_in_collaboration').toBeShape({
        kind: ShapeBpmnElementKind.GROUP,
        label: 'Group in collaboration',
        styleShape: 'rectangle',
        verticalAlign: 'top',
        align: 'center',
      });
    });

    it('gateways', async () => {
      expect('inclusive_gateway_id').toBeShape({ kind: ShapeBpmnElementKind.GATEWAY_INCLUSIVE, label: 'Inclusive Gateway', parentId: 'participant_1_id', verticalAlign: 'top' });
      expect('parallel_gateway_id').toBeShape({ kind: ShapeBpmnElementKind.GATEWAY_PARALLEL, label: 'Parallel Gateway', parentId: 'participant_1_id', verticalAlign: 'top' });
      expect('exclusive_gateway_id').toBeShape({ kind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, label: 'Exclusive Gateway', parentId: 'participant_1_id', verticalAlign: 'top' });
      expect('gateway_event_based_id').toBeEventBasedGateway({
        label: 'Event-Based Gateway',
        parentId: 'participant_1_id',
        verticalAlign: 'top',
        isInstantiating: false,
      });
      expect('gateway_event_based_instantiate_id').toBeEventBasedGateway({
        label: 'Event-Based Gateway Instantiate',
        parentId: 'participant_1_id',
        verticalAlign: 'top',
        isInstantiating: true,
      });
      expect('gateway_event_based_instantiate_parallel_id').toBeEventBasedGateway({
        label: 'Event-Based Gateway Instantiate Parallel',
        parentId: 'participant_1_id',
        verticalAlign: 'top',
        isInstantiating: true,
        gatewayKind: ShapeBpmnEventBasedGatewayKind.Parallel,
      });
    });

    it('sequence flows', async () => {
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
        startArrow: mxgraph.mxConstants.ARROW_DIAMOND_THIN,
        parentId: 'participant_1_id',
        verticalAlign: 'bottom',
      });
      expect('conditional_sequence_flow_from_gateway_id').toBeSequenceFlow({
        sequenceFlowKind: SequenceFlowKind.CONDITIONAL_FROM_GATEWAY,
        parentId: 'participant_1_id',
        label: '',
        verticalAlign: 'bottom',
      });
    });

    it('message flows', async () => {
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
    });

    it('associations', async () => {
      expect('association_id').toBeAssociationFlow({ parentId: 'participant_1_id', verticalAlign: 'bottom' });
    });
  });

  it('BPMN elements should not be available in the mxGraph model, if they are attached to not existing elements', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-badly-attached-elements.bpmn'));

    // model is OK
    // boundary event: interrupting
    expect('boundary_event_interrupting_message_id').not.toBeCell();
    expect('boundary_event_interrupting_timer_id').not.toBeCell();
    expect('boundary_event_interrupting_conditional_id').not.toBeCell();
    expect('boundary_event_interrupting_escalation_id').not.toBeCell();

    // boundary event: non-interrupting
    expect('boundary_event_non_interrupting_message_id').not.toBeCell();
    expect('boundary_event_non_interrupting_timer_id').not.toBeCell();
    expect('boundary_event_non_interrupting_conditional_id').not.toBeCell();
    expect('boundary_event_non_interrupting_escalation_id').not.toBeCell();
  });

  it('BPMN element shape should have coordinates relative to the pool when no lane', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-coordinates-relative-to-pool.bpmn'));

    expect('Participant_1').toBeCellWithParentAndGeometry({
      // unchanged as this is a pool, coordinates are the ones from the bpmn source
      geometry: new mxgraph.mxGeometry(160, 80, 900, 180),
    });

    expect('StartEvent_1').toBeCellWithParentAndGeometry({
      parentId: 'Participant_1',
      geometry: new mxgraph.mxGeometry(
        150, // absolute coordinates: parent 160, cell 310
        80, // absolute coordinates: parent 80, cell 160
        40, // unchanged as no transformation on size
        40, // unchanged as no transformation on size
      ),
    });

    const sequenceFlowMxGeometry = new mxgraph.mxGeometry(0, 0, 0, 0);
    sequenceFlowMxGeometry.points = [
      new mxgraph.mxPoint(190, 100), // absolute coordinates: parent x="160" y="80", cell x="350" y="180"
      new mxgraph.mxPoint(350, 100), // absolute coordinates: parent x="160" y="80", cell x="510" y="180"
    ];
    expect('SequenceFlow_id').toBeCellWithParentAndGeometry({
      parentId: 'Participant_1',
      geometry: sequenceFlowMxGeometry,
    });

    const messageFlowMxGeometry = new mxgraph.mxGeometry(0, 0, 0, 0);
    messageFlowMxGeometry.points = [
      new mxgraph.mxPoint(334, 260), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="260"
      new mxgraph.mxPoint(334, 342), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="342"
    ];
    expect('MessageFlow_1').toBeCellWithParentAndGeometry({
      geometry: messageFlowMxGeometry,
    });
  });

  it('lanes and BPMN element shapes should have coordinates relative to the pool or the lane', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-coordinates-relative-to-pool-or-lane.bpmn'));

    expect('Participant_1').toBeCellWithParentAndGeometry({
      // unchanged as this is a pool, coordinates are the ones from the bpmn source
      geometry: new mxgraph.mxGeometry(160, 80, 900, 400),
    });

    expect('Lane_1_1').toBeCellWithParentAndGeometry({
      parentId: 'Participant_1',
      geometry: new mxgraph.mxGeometry(
        30, // absolute coordinates: parent 160, cell 190
        0, // absolute coordinates: parent 80, cell 80
        870, // unchanged as no transformation on size
        200, // unchanged as no transformation on size
      ),
    });

    expect('StartEvent_1').toBeCellWithParentAndGeometry({
      parentId: 'Lane_1_1',
      geometry: new mxgraph.mxGeometry(
        120, // absolute coordinates: parent 190, cell 310
        80, // absolute coordinates: parent 80, cell 160
        40, // unchanged as no transformation on size
        40, // unchanged as no transformation on size
      ),
    });

    expect('Lane_1_847987').not.toBeCellWithParentAndGeometry({
      parentId: 'Participant_1',
      geometry: new mxgraph.mxGeometry(
        30, // absolute coordinates: parent 160, cell 190
        200, // absolute coordinates: parent 80, cell 280
        870, // unchanged as no transformation on size
        200, // unchanged as no transformation on size
      ),
    });

    const sequenceFlowMxGeometry = new mxgraph.mxGeometry(0, 0, 0, 0);
    sequenceFlowMxGeometry.points = [
      new mxgraph.mxPoint(160, 100), // absolute coordinates: parent x="190" y="80", cell x="350" y="180"
      new mxgraph.mxPoint(320, 100), // absolute coordinates: parent x="190" y="80", cell x="510" y="180"
    ];
    expect('SequenceFlow_id').toBeCellWithParentAndGeometry({
      parentId: 'Lane_1_1',
      geometry: sequenceFlowMxGeometry,
    });

    const messageFlowMxGeometry = new mxgraph.mxGeometry(0, 0, 0, 0);
    messageFlowMxGeometry.points = [
      new mxgraph.mxPoint(334, 480), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="480"
      new mxgraph.mxPoint(334, 632), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="632"
    ];
    expect('MessageFlow_1').toBeCellWithParentAndGeometry({
      geometry: messageFlowMxGeometry,
    });
  });

  it('vertical pool, with vertical lanes & sub-lanes', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-vertical-pool-lanes-sub_lanes.bpmn'));

    // pool
    const minimalPoolModelElement: ExpectedShapeModelElement = { isHorizontal: false };
    expect('Participant_Vertical_With_Lanes').toBePool({ ...minimalPoolModelElement, label: 'Vertical Pool With Lanes' });

    // lane
    expect('Lane_Vertical_3').toBeLane({ ...minimalPoolModelElement, parentId: 'Participant_Vertical_With_Lanes' });
    expect('Lane_Vertical_1').toBeLane({ ...minimalPoolModelElement, label: 'Lane', parentId: 'Participant_Vertical_With_Lanes' });
    expect('Lane_Vertical_With_Sub_Lane').toBeLane({ ...minimalPoolModelElement, label: 'Lane with Sub-Lanes', parentId: 'Participant_Vertical_With_Lanes' });
    expect('SubLane_Vertical_1').toBeLane({ ...minimalPoolModelElement, label: 'Sub-Lane 1', parentId: 'Lane_Vertical_With_Sub_Lane' });
    expect('SubLane_Vertical_2').toBeLane({ ...minimalPoolModelElement, label: 'Sub-Lane 2', parentId: 'Lane_Vertical_With_Sub_Lane' });
  });

  describe('Special cases', () => {
    // There is no pool in the diagram so in the mxGraph model, the parent of cells is the default cell. mxGraph geometry and BPMN coordinates are the same.
    const defaultParentId = '1';

    it('Parse a diagram with large numbers and large decimals', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/xml-parsing/special/simple-start-task-end_large_numbers_and_large_decimals.bpmn'));

      expect('StartEvent_1').toBeCellWithParentAndGeometry({
        parentId: defaultParentId,
        geometry: new mxgraph.mxGeometry(
          156.10001,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          '81.3450000000000090', // 81.345000000000009 in the diagram
          '36.0003450001000002',
          36.0000001,
        ),
      });

      expect('Activity_1').toBeCellWithParentAndGeometry({
        parentId: defaultParentId,
        geometry: new mxgraph.mxGeometry(250, 59, 100, 80),
      });

      const mxGeometry = new mxgraph.mxGeometry(412, 81, 36, 36);
      mxGeometry.offset = new mxgraph.mxPoint(4.16e25, 1.24000000003e29);
      expect('EndEvent_1').toBeCellWithParentAndGeometry({
        parentId: defaultParentId,
        geometry: mxGeometry,
      });
    });

    it('Parse a diagram with numbers not parsable as number', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/xml-parsing/special/simple-start-task-end_numbers_not_parsable_as_number.bpmn'));

      expect('Activity_1').toBeCellWithParentAndGeometry({
        parentId: defaultParentId,
        geometry: new mxgraph.mxGeometry(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore malformed source, conversion result
          'not_a_number0', // from 'not_a_number'
          'not a number too0', // from 'not a number too'
          -100,
          -80,
        ),
      });
    });
  });

  // We have few tests here, to only test the integration within the mxGraph model.
  // The details are checked directly in the unit tests of the filtering.
  describe('Filtered pools at load time', () => {
    const bpmnDiagramToFilter = readFileSync('../fixtures/bpmn/filter/pools.bpmn');

    it('Filter a single pool by id', () => {
      // load BPMN
      bpmnVisualization.load(bpmnDiagramToFilter, {
        modelFilter: {
          pools: {
            id: 'Participant_1',
          },
        },
      });

      expect('Participant_1').toBePool({});
      expectPoolsInModel(1);

      expect('Participant_1_start_event').toBeStartEvent({
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        parentId: 'Participant_1',
        verticalAlign: 'middle',
      });
      expect('Participant_1_end_event').toBeEndEvent({
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        parentId: 'Participant_1',
        verticalAlign: 'middle',
      });
      expectShapesInModel('Participant_1', 3);
      // pool and its children
      expectTotalShapesInModel(4);

      // only check one sequence flow in details
      expect('Participant_1_sequence_flow_startMsg_activity').toBeSequenceFlow({
        parentId: 'Participant_1',
        verticalAlign: 'bottom',
      });
      expectEdgesInModel('Participant_1', 2);
      expectTotalEdgesInModel(2);
    });
  });
});
