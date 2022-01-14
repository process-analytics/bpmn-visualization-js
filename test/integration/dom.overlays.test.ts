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

import type { OverlayEdgePosition, OverlayShapePosition } from '../../src/bpmn-visualization';
import { readFileSync } from '../helpers/file-helper';
import { overlayEdgePositionValues, overlayShapePositionValues } from '../helpers/overlays';
import { initializeBpmnVisualization } from './helpers/bpmn-visualization-initialization';
import { HtmlElementLookup } from './helpers/html-utils';

describe('Bpmn Elements registry - Overlay management', () => {
  const bpmnVisualization = initializeBpmnVisualization();
  const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

  describe('BPMN Shape', () => {
    it('Add one overlay to a BPMN shape', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
      htmlElementLookup.expectServiceTask('serviceTask_1_2');

      // add a single overlay
      const overlayLabel = '123';
      bpmnVisualization.bpmnElementsRegistry.addOverlays('serviceTask_1_2', { label: overlayLabel, position: 'top-left' });

      htmlElementLookup.expectServiceTask('serviceTask_1_2', { overlayLabel });
    });

    it.each(overlayShapePositionValues)("Ensure no issue when adding one overlay at position '%s' to a BPMN Shape", (position: OverlayShapePosition) => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/overlays/overlays.start.flow.task.gateway.bpmn'));
      htmlElementLookup.expectExclusiveGateway('Gateway_1');

      bpmnVisualization.bpmnElementsRegistry.addOverlays('Gateway_1', { label: 'Yes', position: position });
      htmlElementLookup.expectExclusiveGateway('Gateway_1', { overlayLabel: 'Yes' });
    });

    it('Remove all overlays from a BPMN shape', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
      htmlElementLookup.expectServiceTask('serviceTask_1_2');

      // remove all overlays
      bpmnVisualization.bpmnElementsRegistry.addOverlays('serviceTask_1_2', { label: '8789', position: 'top-left' });
      bpmnVisualization.bpmnElementsRegistry.removeAllOverlays('serviceTask_1_2');

      htmlElementLookup.expectServiceTask('serviceTask_1_2');
    });
  });

  describe('BPMN Edge', () => {
    it.each(overlayEdgePositionValues)("Ensure no issue when adding one overlay at position '%s' to a BPMN Edge without waypoints", (position: OverlayEdgePosition) => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/overlays/overlays.start.flow.task.gateway.no.waypoints.bpmn'));
      htmlElementLookup.expectSequenceFlow('Flow_1');

      bpmnVisualization.bpmnElementsRegistry.addOverlays('Flow_1', { label: 'important', position: position });
      htmlElementLookup.expectSequenceFlow('Flow_1', { overlayLabel: 'important' });
    });
    it.each(overlayEdgePositionValues)("Ensure no issue when adding one overlay at position '%s' to a BPMN Edge with waypoints", (position: OverlayEdgePosition) => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/overlays/overlays.edges.associations.complex.paths.bpmn'));
      htmlElementLookup.expectAssociation('Association_3_waypoints');

      bpmnVisualization.bpmnElementsRegistry.addOverlays('Association_3_waypoints', { label: 'warning', position: position });
      htmlElementLookup.expectAssociation('Association_3_waypoints', { overlayLabel: 'warning' });
    });
  });
});
