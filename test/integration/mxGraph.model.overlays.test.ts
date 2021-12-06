/**
 * Copyright 2021 Bonitasoft S.A.
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
import { bpmnVisualization } from './helpers/model-expect';
import { readFileSync } from '../helpers/file-helper';
import { ShapeBpmnEventDefinitionKind } from '../../src/bpmn-visualization';

describe('mxGraph model - Overlays', () => {
  describe('Add overlays', () => {
    it('Add one or several overlays to one BPMN shape', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));

      // add a single overlay to a single shape
      bpmnVisualization.bpmnElementsRegistry.addOverlays('serviceTask_1_2', { position: 'top-left', label: '6' });
      expect('serviceTask_1_2').toBeServiceTask({
        label: 'Service Task 1.2',
        parentId: 'Lane_13kpaun',
        overlays: [{ label: '6', horizontalAlign: 'left', verticalAlign: 'top' }],
      });

      // add several overlays to single shape without overlay
      bpmnVisualization.bpmnElementsRegistry.addOverlays('endEvent_message_1', [
        { position: 'top-right', label: '7' },
        { position: 'bottom-left', label: '8' },
        { position: 'bottom-right', label: '99' },
      ]);
      expect('endEvent_message_1').toBeEndEvent({
        label: 'message end 2',
        parentId: 'lane_02',
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        overlays: [
          { label: '7', horizontalAlign: 'right', verticalAlign: 'top' },
          { label: '8', horizontalAlign: 'left', verticalAlign: 'bottom' },
          { label: '99', horizontalAlign: 'right', verticalAlign: 'bottom' },
        ],
      });

      // add several overlays to single shape with overlays
      bpmnVisualization.bpmnElementsRegistry.addOverlays('serviceTask_1_2', [
        { position: 'top-right', label: '7' },
        { position: 'bottom-left', label: '8' },
        { position: 'bottom-right', label: '99' },
      ]);
      expect('serviceTask_1_2').toBeServiceTask({
        label: 'Service Task 1.2',
        parentId: 'Lane_13kpaun',
        overlays: [
          { label: '6', horizontalAlign: 'left', verticalAlign: 'top' },
          { label: '7', horizontalAlign: 'right', verticalAlign: 'top' },
          { label: '8', horizontalAlign: 'left', verticalAlign: 'bottom' },
          { label: '99', horizontalAlign: 'right', verticalAlign: 'bottom' },
        ],
      });
    });

    it('Add one or several overlays to one BPMN edge', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));

      // add a single overlay to a single edge
      bpmnVisualization.bpmnElementsRegistry.addOverlays('Flow_1bewc4s', { position: 'start', label: '6' });
      expect('Flow_1bewc4s').toBeSequenceFlow({
        label: 'link',
        parentId: 'Lane_13kpaun',
        overlays: [{ label: '6', horizontalAlign: 'left', verticalAlign: 'top' }],
      });

      // add several overlays to single edge without overlay
      bpmnVisualization.bpmnElementsRegistry.addOverlays('Flow_1dmga1h', [
        { position: 'middle', label: '7' },
        { position: 'end', label: '8' },
      ]);
      expect('Flow_1dmga1h').toBeSequenceFlow({
        parentId: 'Lane_13kpaun',
        verticalAlign: 'bottom',
        overlays: [
          { label: '7', horizontalAlign: 'center', verticalAlign: 'top' },
          { label: '8', horizontalAlign: 'right', verticalAlign: 'top' },
        ],
      });

      // add several overlays to single edge with overlays
      bpmnVisualization.bpmnElementsRegistry.addOverlays('Flow_1bewc4s', [
        { position: 'middle', label: '7' },
        { position: 'end', label: '8' },
      ]);
      expect('Flow_1bewc4s').toBeSequenceFlow({
        label: 'link',
        parentId: 'Lane_13kpaun',
        overlays: [
          { label: '6', horizontalAlign: 'left', verticalAlign: 'top' },
          { label: '7', horizontalAlign: 'center', verticalAlign: 'top' },
          { label: '8', horizontalAlign: 'right', verticalAlign: 'top' },
        ],
      });
    });

    it('BPMN element does not exist', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

      const nonExistingBpmnId = 'i-do-not-exist-for-add';
      expect(nonExistingBpmnId).not.toBeCell();
      // this call ensures that there is not issue on the rendering part
      bpmnVisualization.bpmnElementsRegistry.addOverlays(nonExistingBpmnId, { position: 'top-left', label: '6' });
    });

    it('Style overlays', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));

      bpmnVisualization.bpmnElementsRegistry.addOverlays('serviceTask_1_2', {
        position: 'top-left',
        label: '6',
        style: {
          font: {
            color: 'Blue',
            size: 20,
          },
          fill: {
            color: 'Green',
            opacity: 63,
          },
          stroke: {
            color: 'Pink',
            width: 6,
          },
        },
      });
      expect('serviceTask_1_2').toBeServiceTask({
        label: 'Service Task 1.2',
        parentId: 'Lane_13kpaun',
        overlays: [
          {
            label: '6',
            horizontalAlign: 'left',
            verticalAlign: 'top',
            style: {
              font: {
                color: 'Blue',
                size: 20,
              },
              fill: {
                color: 'Green',
                opacity: 63,
              },
              stroke: {
                color: 'Pink',
                width: 6,
              },
            },
          },
        ],
      });
    });
  });

  describe('Remove all overlays', () => {
    it('Remove all overlays to one BPMN shape', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));

      bpmnVisualization.bpmnElementsRegistry.addOverlays('serviceTask_1_2', [
        { position: 'top-right', label: '7' },
        { position: 'bottom-left', label: '8' },
        { position: 'bottom-right', label: '99' },
      ]);
      bpmnVisualization.bpmnElementsRegistry.removeAllOverlays('serviceTask_1_2');
      expect('serviceTask_1_2').toBeServiceTask({
        label: 'Service Task 1.2',
        parentId: 'Lane_13kpaun',
        overlays: undefined,
      });
    });

    it('Remove all overlays to one BPMN edge', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));

      bpmnVisualization.bpmnElementsRegistry.addOverlays('Flow_1bewc4s', [
        { position: 'middle', label: '7' },
        { position: 'end', label: '8' },
      ]);
      bpmnVisualization.bpmnElementsRegistry.removeAllOverlays('Flow_1bewc4s');
      expect('Flow_1bewc4s').toBeSequenceFlow({
        label: 'link',
        parentId: 'Lane_13kpaun',
        overlays: undefined,
      });
    });

    it('BPMN element does not exist', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

      const nonExistingBpmnId = 'i-do-not-exist-for-add';
      expect(nonExistingBpmnId).not.toBeCell();
      // this call ensures that there is not issue on the rendering part
      bpmnVisualization.bpmnElementsRegistry.removeAllOverlays(nonExistingBpmnId);
    });
  });
});
