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

import type { ExpectedShapeModelElement } from './helpers/model-expect';

import {
  bpmnVisualization,
  expectEdgesInModel,
  expectPoolsInModel,
  expectShapesInModel,
  expectTotalEdgesInModel,
  expectTotalShapesInModel,
  getDefaultParentId,
} from './helpers/model-expect';

import {
  MarkerIdentifier,
  MessageVisibleKind,
  SequenceFlowKind,
  ShapeBpmnElementKind,
  ShapeBpmnEventBasedGatewayKind,
  ShapeBpmnEventDefinitionKind,
  ShapeBpmnMarkerKind,
  ShapeBpmnSubProcessKind,
} from '@lib/bpmn-visualization';
import { mxConstants, mxgraph, mxPoint } from '@lib/component/mxgraph/initializer';
import { readFileSync } from '@test/shared/file-helper';

const mxGeometry = mxgraph.mxGeometry;

describe('mxGraph model - BPMN elements', () => {
  describe('BPMN elements should be available in the mxGraph model', () => {
    describe('Diagram with all the kind of elements', () => {
      beforeAll(() => {
        // load BPMN
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-complete-semantic.bpmn'));
      });

      const expectedBoldFont = {
        isBold: true,
        isItalic: false,
        isStrikeThrough: false,
        isUnderline: false,
        family: 'Arial',
        size: 11,
      };

      describe('BPMN containers', () => {
        const baseShapeModelElement: ExpectedShapeModelElement = { isSwimLaneLabelHorizontal: false };
        it('pool', () => {
          expect('participant_1_id').toBePool({ ...baseShapeModelElement, label: 'Pool 1' });
          expect('participant_2_id').toBePool(baseShapeModelElement);
          expect('participant_3_id').toBePool({ ...baseShapeModelElement, label: 'Black Box Process' });
          expect('participant_4_id').toBePool({ ...baseShapeModelElement, label: 'Pool containing sublanes' });
        });

        it('lane', () => {
          expect('lane_4_1_id').toBeLane({ ...baseShapeModelElement, label: 'Lane with child lanes', parentId: 'participant_4_id' });
          expect('lane_4_1_1_id').toBeLane({ ...baseShapeModelElement, label: 'Child Lane 1', parentId: 'lane_4_1_id' });
          expect('lane_4_1_2_id').toBeLane({ ...baseShapeModelElement, label: 'Child Lane 2', parentId: 'lane_4_1_id' });
          expect('lane_4_2_id').toBeLane({ ...baseShapeModelElement, label: 'Solo Lane', parentId: 'participant_4_id' });
        });
      });

      describe('BPMN events', () => {
        it('start event', () => {
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

        it('end event', () => {
          expect('end_event_terminate_id').toBeEndEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.TERMINATE,
            font: {
              isBold: false,
              isItalic: true,
              isStrikeThrough: false,
              isUnderline: false,
              family: 'Arial',
              size: 11,
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
              family: 'Arial',
              size: 11,
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

        it('throw intermediate event', () => {
          expect('intermediate_throw_event_none_id').toBeIntermediateThrowEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
            font: {
              isBold: false,
              isItalic: false,
              isStrikeThrough: true,
              isUnderline: false,
              family: 'Arial',
              size: 11,
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

        it('catch intermediate event', () => {
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

        it('boundary event: interrupting', () => {
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

        it('boundary event: non-interrupting', () => {
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
        it('Expanded embedded subprocess', () => {
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

        it('Collapsed embedded subprocess', () => {
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

        it('Expanded event subprocess', () => {
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

        it('Collapsed event subprocess', () => {
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

        it('Elements in expanded subprocess', () => {
          expect('start_event_in_sub_process_id').toBeStartEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
            label: 'Start Event In Sub-Process',
            parentId: 'expanded_embedded_sub_process_id',
          });
          expect('task_in_sub_process_id').toBeTask({
            label: 'Task In Sub-Process',
            parentId: 'expanded_embedded_sub_process_id',
          });
          expect('end_event_in_sub_process_id').toBeEndEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
            label: 'End Event In Sub-Process',
            parentId: 'expanded_embedded_sub_process_id',
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

        it('Elements of collapsed Sub Process', () => {
          expect('message_boundary_event_attached_to_collapsed_embedded_sub_process_id').toBeBoundaryEvent({
            eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
            label: 'Interrupting Message Boundary Event attached to collapsed Sub-Process',
            parentId: 'collapsed_embedded_sub_process_id',
            isInterrupting: true,
          });
          expect('task_in_collapsed_sub_process_id').not.toBeCell();
        });

        describe('Start Event in Event Sub Process', () => {
          it('Interrupting Start Event', () => {
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

          it('Non-interrupting Start Event', () => {
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

        describe('Transaction Sub Process', () => {
          describe('Expanded', () => {
            test('Without marker', () => {
              expect('expanded_transaction_sub_process_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.TRANSACTION,
                label: 'Expanded Transaction Sub-Process',
                parentId: 'participant_1_id',
                verticalAlign: 'top',
              });
            });
            test('With loop', () => {
              expect('expanded_transaction_sub_process_with_loop_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.TRANSACTION,
                label: 'Expanded Transaction Sub-Process With Loop',
                markers: [ShapeBpmnMarkerKind.LOOP],
                parentId: 'participant_1_id',
                verticalAlign: 'top',
              });
            });
            test('With multi instance sequential', () => {
              expect('expanded_transaction_sub_process_with_sequential_multi_instance_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.TRANSACTION,
                label: 'Expanded Transaction Sub-Process With Sequential Multi-instance',
                markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
                parentId: 'participant_1_id',
                verticalAlign: 'top',
              });
            });
            test('With multi instance parallel', () => {
              expect('expanded_transaction_sub_process_with_parallel_multi_instance_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.TRANSACTION,
                label: 'Expanded Transaction Sub-Process With Parallel Multi-instance',
                markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
                parentId: 'participant_1_id',
                verticalAlign: 'top',
              });
            });
          });

          describe('Collapsed', () => {
            test('Without marker', () => {
              expect('collapsed_transaction_sub_process_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.TRANSACTION,
                label: 'Collapsed Transaction Sub-Process',
                markers: [ShapeBpmnMarkerKind.EXPAND],
                parentId: 'participant_1_id',
              });
            });
            test('With loop', () => {
              expect('collapsed_transaction_sub_process_with_loop_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.TRANSACTION,
                label: 'Collapsed Transaction Sub-Process With Loop',
                markers: [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
                parentId: 'participant_1_id',
              });
            });
            test('With multi instance sequential', () => {
              expect('collapsed_transaction_sub_process_with_sequential_multi_instance_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.TRANSACTION,
                label: 'Collapsed Transaction Sub-Process With Sequential Multi-instance',
                markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
                parentId: 'participant_1_id',
              });
            });
            test('With multi instance parallel', () => {
              expect('collapsed_transaction_sub_process_with_parallel_multi_instance_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.TRANSACTION,
                label: 'Collapsed Transaction Sub-Process With Parallel Multi-instance',
                markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND],
                parentId: 'participant_1_id',
              });
            });
          });

          test('Elements in expanded Sub Process', () => {
            expect('start_event_in_transaction_sub_process_id').toBeStartEvent({
              eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
              label: 'Start Event In Transaction Sub-Process',
              parentId: 'expanded_transaction_sub_process_id',
            });
            expect('task_in_transaction_sub_process_id').toBeTask({
              label: 'Task In Transaction Sub-Process',
              parentId: 'expanded_transaction_sub_process_id',
            });
            expect('end_event_in_transaction_sub_process_id').toBeEndEvent({
              eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
              label: 'End Event In Transaction Sub-Process',
              parentId: 'expanded_transaction_sub_process_id',
            });
            expect('sequence_flow_in_transaction_sub_process_1_id').toBeSequenceFlow({
              parentId: 'expanded_transaction_sub_process_id',
              verticalAlign: 'bottom',
            });
            expect('sequence_flow_in_transaction_sub_process_2_id').toBeSequenceFlow({
              parentId: 'expanded_transaction_sub_process_id',
              verticalAlign: 'bottom',
            });
          });

          test('Elements of collapsed Sub Process', () => {
            expect('message_boundary_event_attached_to_collapsed_transaction_sub_process_id').toBeBoundaryEvent({
              eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
              label: 'Interrupting Message Boundary Event attached to collapsed Transaction Sub-Process',
              parentId: 'collapsed_transaction_sub_process_id',
              isInterrupting: true,
            });
            expect('task_in_collapsed_transaction_sub_process_id').not.toBeCell();
          });
        });

        describe('AdHoc Sub Process', () => {
          describe('Expanded', () => {
            test('Without marker', () => {
              expect('expanded_adHoc_sub_process_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.AD_HOC,
                label: 'Expanded AdHoc Sub-Process',
                parentId: 'participant_1_id',
                verticalAlign: 'top',
              });
            });
            test('With loop', () => {
              expect('expanded_adHoc_sub_process_with_loop_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.AD_HOC,
                label: 'Expanded AdHoc Sub-Process With Loop',
                markers: [ShapeBpmnMarkerKind.LOOP],
                parentId: 'participant_1_id',
                verticalAlign: 'top',
              });
            });
            test('With multi instance sequential', () => {
              expect('expanded_adHoc_sub_process_with_sequential_multi_instance_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.AD_HOC,
                label: 'Expanded AdHoc Sub-Process With Sequential Multi-instance',
                markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
                parentId: 'participant_1_id',
                verticalAlign: 'top',
              });
            });
            test('With multi instance parallel', () => {
              expect('expanded_adHoc_sub_process_with_parallel_multi_instance_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.AD_HOC,
                label: 'Expanded AdHoc Sub-Process With Parallel Multi-instance',
                markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
                parentId: 'participant_1_id',
                verticalAlign: 'top',
              });
            });
          });

          describe('Collapsed', () => {
            test('Without marker', () => {
              expect('collapsed_adHoc_sub_process_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.AD_HOC,
                label: 'Collapsed AdHoc Sub-Process',
                markers: [ShapeBpmnMarkerKind.EXPAND],
                parentId: 'participant_1_id',
              });
            });
            test('With loop', () => {
              expect('collapsed_adHoc_sub_process_with_loop_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.AD_HOC,
                label: 'Collapsed AdHoc Sub-Process With Loop',
                markers: [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
                parentId: 'participant_1_id',
              });
            });
            test('With multi instance sequential', () => {
              expect('collapsed_adHoc_sub_process_with_sequential_multi_instance_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.AD_HOC,
                label: 'Collapsed AdHoc Sub-Process With Sequential Multi-instance',
                markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
                parentId: 'participant_1_id',
              });
            });
            test('With multi instance parallel', () => {
              expect('collapsed_adHoc_sub_process_with_parallel_multi_instance_id').toBeSubProcess({
                subProcessKind: ShapeBpmnSubProcessKind.AD_HOC,
                label: 'Collapsed AdHoc Sub-Process With Parallel Multi-instance',
                markers: [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND],
                parentId: 'participant_1_id',
              });
            });
          });

          test('Elements in expanded Sub Process', () => {
            expect('start_event_in_adHoc_sub_process_id').toBeStartEvent({
              eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
              label: 'Start Event In AdHoc Sub-Process',
              parentId: 'expanded_adHoc_sub_process_id',
            });
            expect('task_in_adHoc_sub_process_id').toBeTask({
              label: 'Task In AdHoc Sub-Process',
              parentId: 'expanded_adHoc_sub_process_id',
            });
            expect('end_event_in_adHoc_sub_process_id').toBeEndEvent({
              eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
              label: 'End Event In AdHoc Sub-Process',
              parentId: 'expanded_adHoc_sub_process_id',
            });
            expect('sequence_flow_in_adHoc_sub_process_1_id').toBeSequenceFlow({
              parentId: 'expanded_adHoc_sub_process_id',
              verticalAlign: 'bottom',
            });
            expect('sequence_flow_in_adHoc_sub_process_2_id').toBeSequenceFlow({
              parentId: 'expanded_adHoc_sub_process_id',
              verticalAlign: 'bottom',
            });
          });

          test('Elements of collapsed Sub Process', () => {
            expect('message_boundary_event_attached_to_collapsed_adHoc_sub_process_id').toBeBoundaryEvent({
              eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
              label: 'Interrupting Message Boundary Event attached to collapsed AdHoc Sub-Process',
              parentId: 'collapsed_adHoc_sub_process_id',
              isInterrupting: true,
            });
            expect('task_in_collapsed_adHoc_sub_process_id').not.toBeCell();
          });
        });
      });

      describe('Call Activities', () => {
        describe('Call Activity calling process', () => {
          it('Expanded', () => {
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

          it('Collapsed', () => {
            expect('collapsed_call_activity_id').toBeCallActivity({
              label: 'Collapsed Call Activity',
              parentId: 'participant_1_id',
              markers: [ShapeBpmnMarkerKind.EXPAND],
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
          it('Calling Global Task', () => {
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

          it('Calling Global Business Rule Task', () => {
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

          it('Calling Global Manual Task', () => {
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

          it('Calling Global Script Task', () => {
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

          it('Calling Global User Task', () => {
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
        it('Abstract Task', () => {
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
              family: 'Arial',
              size: 11,
            },
            label: 'Task with Flows',
            parentId: 'participant_1_id',
            verticalAlign: 'top',
          });
        });

        it('Service Task', () => {
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

        it('User Task', () => {
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

        it('Receive Task: Non instantiating', () => {
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

        it('Receive Task: Instantiating', () => {
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

        it('Send Task', () => {
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

        it('Manual Task', () => {
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

        it('Script Task', () => {
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

        it('Business Rule Task', () => {
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

      it('text annotations', () => {
        expect('text_annotation_id').toBeTextAnnotation({
          label: 'Annotation',
          parentId: 'participant_1_id',
          align: 'left',
        });
      });
      it('text annotations in collaboration', () => {
        expect('text_annotation_in_collaboration_1').toBeTextAnnotation({
          label: 'Text Annotation in collaboration',
          parentId: getDefaultParentId(),
          align: 'left',
        });
      });

      it('groups', () => {
        expect('Group_0_in_collaboration').toBeGroup({
          label: 'Group in collaboration',
          styleShape: 'rectangle',
          verticalAlign: 'top',
          align: 'center',
        });
      });

      it('gateways', () => {
        expect('inclusive_gateway_id').toBeInclusiveGateway({ label: 'Inclusive Gateway', parentId: 'participant_1_id' });
        expect('parallel_gateway_id').toBeParallelGateway({ label: 'Parallel Gateway', parentId: 'participant_1_id' });
        expect('exclusive_gateway_id').toBeExclusiveGateway({ label: 'Exclusive Gateway', parentId: 'participant_1_id' });
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

      it('sequence flows', () => {
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
      });

      it('message flows', () => {
        expect('message_flow_initiating_message_id').toBeMessageFlow({
          label: 'Message Flow with initiating message',
          messageVisibleKind: MessageVisibleKind.INITIATING,
          verticalAlign: 'top',
        });
        expect('message_flow_non_initiating_message_id').toBeMessageFlow({
          label: 'Message Flow with non-initiating message',
          messageVisibleKind: MessageVisibleKind.NON_INITIATING,
          verticalAlign: 'top',
        });
        expect('message_flow_no_visible_id').toBeMessageFlow({ label: 'Message Flow without message', messageVisibleKind: MessageVisibleKind.NONE, verticalAlign: 'bottom' });
      });

      it('associations', () => {
        expect('association_id').toBeAssociationFlow({ parentId: 'participant_1_id', verticalAlign: 'bottom' });
      });

      it('associations in collaboration', () => {
        expect('association_in_collaboration_1').toBeAssociationFlow({ parentId: getDefaultParentId(), verticalAlign: 'bottom' });
      });
    });

    it('Diagram with a not displayed pool (without shape) with elements', () => {
      // load BPMN
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/bpmn-rendering/pools.04.not.displayed.with.elements.bpmn'));

      expectPoolsInModel(0);

      // Shapes
      expectTotalShapesInModel(3);
      expect('start_event_1').toBeStartEvent({
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
        parentId: getDefaultParentId(),
        verticalAlign: 'middle',
      });
      expect('task_1').toBeTask({ parentId: getDefaultParentId() });
      expect('end_event_1').toBeEndEvent({
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
        parentId: getDefaultParentId(),
        verticalAlign: 'middle',
      });

      // Edges
      expectTotalEdgesInModel(2);
      expect('sequence_flow_1').toBeSequenceFlow({ parentId: getDefaultParentId(), verticalAlign: 'bottom' });
      expect('sequence_flow_2').toBeSequenceFlow({ parentId: getDefaultParentId(), verticalAlign: 'bottom' });
    });
  });

  it('BPMN elements should not be available in the mxGraph model, if they are attached to not existing elements', () => {
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

  it('BPMN element shape should have coordinates relative to the pool when no lane', () => {
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

    const sequenceFlowGeometry = new mxGeometry(0, 0, 0, 0);
    sequenceFlowGeometry.points = [
      new mxPoint(190, 100), // absolute coordinates: parent x="160" y="80", cell x="350" y="180"
      new mxPoint(350, 100), // absolute coordinates: parent x="160" y="80", cell x="510" y="180"
    ];
    expect('SequenceFlow_id').toBeCellWithParentAndGeometry({
      parentId: 'Participant_1',
      geometry: sequenceFlowGeometry,
    });

    const messageFlowGeometry = new mxGeometry(0, 0, 0, 0);
    messageFlowGeometry.points = [
      new mxPoint(334, 260), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="260"
      new mxPoint(334, 342), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="342"
    ];
    expect('MessageFlow_1').toBeCellWithParentAndGeometry({
      geometry: messageFlowGeometry,
    });
  });

  it('lanes and BPMN element shapes should have coordinates relative to the pool or the lane', () => {
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

    const sequenceFlowGeometry = new mxGeometry(0, 0, 0, 0);
    sequenceFlowGeometry.points = [
      new mxPoint(160, 100), // absolute coordinates: parent x="190" y="80", cell x="350" y="180"
      new mxPoint(320, 100), // absolute coordinates: parent x="190" y="80", cell x="510" y="180"
    ];
    expect('SequenceFlow_id').toBeCellWithParentAndGeometry({
      parentId: 'Lane_1_1',
      geometry: sequenceFlowGeometry,
    });

    const messageFlowGeometry = new mxGeometry(0, 0, 0, 0);
    messageFlowGeometry.points = [
      new mxPoint(334, 480), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="480"
      new mxPoint(334, 632), // absolute coordinates: parent graph.getDefaultParent(), cell x="334" y="632"
    ];
    expect('MessageFlow_1').toBeCellWithParentAndGeometry({
      geometry: messageFlowGeometry,
    });
  });

  it('vertical pool, with vertical lanes & sub-lanes', () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-vertical-pool-lanes-sub_lanes.bpmn'));

    // pool
    const baseShapeModelElement: ExpectedShapeModelElement = { isSwimLaneLabelHorizontal: true };
    expect('Participant_Vertical_With_Lanes').toBePool({ ...baseShapeModelElement, label: 'Vertical Pool With Lanes' });

    // lane
    expect('Lane_Vertical_3').toBeLane({ ...baseShapeModelElement, parentId: 'Participant_Vertical_With_Lanes' });
    expect('Lane_Vertical_1').toBeLane({ ...baseShapeModelElement, label: 'Lane', parentId: 'Participant_Vertical_With_Lanes' });
    expect('Lane_Vertical_With_Sub_Lane').toBeLane({ ...baseShapeModelElement, label: 'Lane with Sub-Lanes', parentId: 'Participant_Vertical_With_Lanes' });
    expect('SubLane_Vertical_1').toBeLane({ ...baseShapeModelElement, label: 'Sub-Lane 1', parentId: 'Lane_Vertical_With_Sub_Lane' });
    expect('SubLane_Vertical_2').toBeLane({ ...baseShapeModelElement, label: 'Sub-Lane 2', parentId: 'Lane_Vertical_With_Sub_Lane' });
  });

  describe('Special cases', () => {
    // There is no pool in the diagram so in the mxGraph model, the parent of cells is the default cell. The mxGraph geometry and BPMN coordinates are the same.
    const defaultParentId = getDefaultParentId();

    it('Parse a diagram with large numbers and large decimals', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/xml-parsing/special/simple-start-task-end_large_numbers_and_large_decimals.bpmn'));

      const startEvent1Geometry = new mxGeometry(
        156.100_010_002_564_63,
        81.345_000_000_000_01, // 81.345000000000009 in the diagram
        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        36.000_345_000_100_000_2, // 36.0003450001000002 in the diagram
        36.000_000_100_354_96,
      );
      startEvent1Geometry.offset = new mxPoint(1.899_989_997_435_369_6, 42.654_999_999_999_99);
      expect('StartEvent_1').toBeCellWithParentAndGeometry({
        parentId: defaultParentId,
        geometry: startEvent1Geometry,
      });

      expect('Activity_1').toBeCellWithParentAndGeometry({
        parentId: defaultParentId,
        geometry: new mxGeometry(250, 59.795_444_2, 100.678_942_1, 80),
      });

      const endEvent1Geometry = new mxGeometry(412, 81, 36, 36);
      endEvent1Geometry.offset = new mxPoint(4.16e25, 1.240_000_000_03e29);
      expect('EndEvent_1').toBeCellWithParentAndGeometry({
        parentId: defaultParentId,
        geometry: endEvent1Geometry,
      });
    });

    it('Parse a diagram with numbers not parsable as number', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/xml-parsing/special/simple-start-task-end_numbers_not_parsable_as_number.bpmn'));

      expect('Activity_1').toBeCellWithParentAndGeometry({
        parentId: defaultParentId,
        geometry: new mxGeometry(
          Number.NaN, // from 'not_a_number'
          Number.NaN, // from 'not a number too'
          -100,
          -80,
        ),
      });
    });
  });

  // We have few tests here, to only test the integration within the mxGraph model.
  // The details are checked directly in the unit tests of the filtering.
  describe('Filtered pools at load time', () => {
    it('Filter a single pool by id', () => {
      // load BPMN
      const bpmnDiagramToFilter = readFileSync('../fixtures/bpmn/filter/pools.bpmn');
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

    it('Filter a "not displayed" pool with elements', () => {
      // load BPMN
      const bpmnDiagramToFilter = readFileSync('../fixtures/bpmn/filter/pools.not.displayed.with.elements.bpmn');
      bpmnVisualization.load(bpmnDiagramToFilter, {
        modelFilter: {
          pools: {
            id: 'participant_1',
          },
        },
      });

      expectPoolsInModel(0);

      // Shapes
      expectTotalShapesInModel(3);
      expect('start_event_1').toBeStartEvent({
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
        parentId: getDefaultParentId(),
      });
      expect('task_1').toBeTask({ parentId: getDefaultParentId() });
      expect('end_event_1').toBeEndEvent({
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
        parentId: getDefaultParentId(),
      });

      // Edges
      expectTotalEdgesInModel(2);
      expect('sequence_flow_1').toBeSequenceFlow({ parentId: getDefaultParentId(), verticalAlign: 'bottom' });
      expect('sequence_flow_2').toBeSequenceFlow({ parentId: getDefaultParentId(), verticalAlign: 'bottom' });
    });
  });
});
