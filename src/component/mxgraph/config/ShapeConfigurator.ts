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

import { mxgraph } from '../initializer';
import { mxCellState, mxImageShape, mxShape } from 'mxgraph'; // for types
import { ShapeBpmnElementKind } from '../../../model/bpmn/internal';
import { EndEventShape, EventShape, IntermediateEventShape, ThrowIntermediateEventShape } from '../shape/event-shapes';
import { EventBasedGatewayShape, ExclusiveGatewayShape, InclusiveGatewayShape, ParallelGatewayShape } from '../shape/gateway-shapes';
import {
  BusinessRuleTaskShape,
  CallActivityShape,
  ManualTaskShape,
  ReceiveTaskShape,
  ScriptTaskShape,
  SendTaskShape,
  ServiceTaskShape,
  SubProcessShape,
  TaskShape,
  UserTaskShape,
} from '../shape/activity-shapes';
import { TextAnnotationShape } from '../shape/text-annotation-shapes';
import { MessageFlowIconShape } from '../shape/flow-shapes';
import { BpmnStyleIdentifier } from '../style';
import { computeAllBpmnClassNamesOfCell } from '../renderer/style-utils';
import { MxGraphCustomOverlay } from '../overlay/custom-overlay';
import { OverlayBadgeShape } from '../overlay/shapes';
import { BpmnConnector } from '../shape/edges';

/**
 * @internal
 */
export default class ShapeConfigurator {
  configureShapes(): void {
    this.initMxShapePrototype();
    this.registerShapes();
    this.initMxCellRendererCreateCellOverlays();
  }

  private registerShapes(): void {
    // events
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_END, EndEventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_START, EventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ThrowIntermediateEventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, IntermediateEventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_BOUNDARY, IntermediateEventShape);
    // gateways
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_EVENT_BASED, EventBasedGatewayShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, ExclusiveGatewayShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_INCLUSIVE, InclusiveGatewayShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_PARALLEL, ParallelGatewayShape);
    // activities
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.SUB_PROCESS, SubProcessShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.CALL_ACTIVITY, CallActivityShape);
    // tasks
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK, TaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SERVICE, ServiceTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_USER, UserTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_RECEIVE, ReceiveTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SEND, SendTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_MANUAL, ManualTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SCRIPT, ScriptTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_BUSINESS_RULE, BusinessRuleTaskShape);
    // artifacts
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TEXT_ANNOTATION, TextAnnotationShape);

    // shapes for flows
    mxgraph.mxCellRenderer.registerShape(BpmnStyleIdentifier.EDGE, BpmnConnector);
    mxgraph.mxCellRenderer.registerShape(BpmnStyleIdentifier.MESSAGE_FLOW_ICON, MessageFlowIconShape);
  }

  private initMxShapePrototype(): void {
    // The following is copied from the mxgraph mxShape implementation then converted to TypeScript and enriched for bpmn-visualization
    // It is needed for adding the custom attributes that permits identification of the BPMN elements in the DOM
    mxgraph.mxShape.prototype.createSvgCanvas = function () {
      const canvas = new mxgraph.mxSvgCanvas2D(this.node, false);
      canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0;
      canvas.pointerEventsValue = this.svgPointerEvents;
      // When bumping mxgraph to 4.1.1, remove this commented code. It has been removed in mxgraph@4.1.1
      //((canvas as unknown) as mxgraph.mxSvgCanvas2D).blockImagePointerEvents = isFF;
      const off = this.getSvgScreenOffset();

      if (off != 0) {
        this.node.setAttribute('transform', 'translate(' + off + ',' + off + ')');
      } else {
        this.node.removeAttribute('transform');
      }

      // START bpmn-visualization CUSTOMIZATION
      // add attributes to be able to identify elements in DOM
      if (this.state && this.state.cell) {
        // 'this.state.style' = the style definition associated with the cell
        // 'this.state.cell.style' = the style applied to the cell: 1st element: style name = bpmn shape name
        const cell = this.state.cell;
        // dialect = strictHtml is set means that current node holds an html label
        let allBpmnClassNames = computeAllBpmnClassNamesOfCell(cell, this.dialect === mxgraph.mxConstants.DIALECT_STRICTHTML);
        const extraCssClasses = this.state.style[BpmnStyleIdentifier.EXTRA_CSS_CLASSES];
        if (extraCssClasses) {
          allBpmnClassNames = allBpmnClassNames.concat(extraCssClasses);
        }

        this.node.setAttribute('class', allBpmnClassNames.join(' '));
        this.node.setAttribute('data-bpmn-id', this.state.cell.id);
      }
      // END bpmn-visualization CUSTOMIZATION
      canvas.minStrokeWidth = this.minSvgStrokeWidth;

      if (!this.antiAlias) {
        // Rounds all numbers in the SVG output to integers
        canvas.format = function (value: string) {
          return Math.round(parseFloat(value));
        };
      }

      return canvas;
    };
  }

  initMxCellRendererCreateCellOverlays(): void {
    mxgraph.mxCellRenderer.prototype.createCellOverlays = function (state: mxCellState) {
      const graph = state.view.graph;
      const overlays = graph.getCellOverlays(state.cell);
      let dict = null;

      if (overlays != null) {
        dict = new mxgraph.mxDictionary<mxShape>();

        for (const currentOverlay of overlays) {
          const shape = state.overlays != null ? state.overlays.remove(currentOverlay) : null;
          if (shape != null) {
            dict.put(currentOverlay, shape);
            continue;
          }

          let overlayShape: mxShape;

          // START bpmn-visualization CUSTOMIZATION
          if (currentOverlay instanceof MxGraphCustomOverlay) {
            overlayShape = new OverlayBadgeShape(currentOverlay.label, new mxgraph.mxRectangle(0, 0, 0, 0), currentOverlay.style);
          } else {
            overlayShape = new mxgraph.mxImageShape(new mxgraph.mxRectangle(0, 0, 0, 0), currentOverlay.image.src);
            (<mxImageShape>overlayShape).preserveImageAspect = false;
          }
          // END bpmn-visualization CUSTOMIZATION

          overlayShape.dialect = state.view.graph.dialect;
          overlayShape.overlay = currentOverlay;

          // The 'initializeOverlay' signature forces us to hardly cast the overlayShape
          this.initializeOverlay(state, <mxImageShape>overlayShape);
          this.installCellOverlayListeners(state, currentOverlay, overlayShape);

          if (currentOverlay.cursor != null) {
            overlayShape.node.style.cursor = currentOverlay.cursor;
          }

          // START bpmn-visualization CUSTOMIZATION
          if (overlayShape instanceof OverlayBadgeShape) {
            overlayShape.node.classList.add('overlay-badge');
            overlayShape.node.setAttribute('data-bpmn-id', state.cell.id);
          }
          // END bpmn-visualization CUSTOMIZATION

          dict.put(currentOverlay, overlayShape);
        }
      }

      // Removes unused
      if (state.overlays != null) {
        state.overlays.visit(function (id: string, shape: mxShape) {
          shape.destroy();
        });
      }

      state.overlays = dict;
    };
  }
}
