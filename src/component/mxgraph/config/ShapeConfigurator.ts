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
import { ShapeBpmnElementKind } from '../../../model/bpmn/internal/shape';
import { BoundaryEventShape, CatchIntermediateEventShape, EndEventShape, StartEventShape, ThrowIntermediateEventShape } from '../shape/event-shapes';
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
import { StyleIdentifier } from '../StyleUtils';
import { computeAllBpmnClassNames, extractBpmnKindFromStyle } from '../style-helper';
import { mxCellState, mxImageShape, mxShape } from 'mxgraph';
import { BpmnOverlay } from '../../registry/bpmn-elements-registry';
import { OverlayKind } from '../../../model/bpmn/internal/overlay/OverlayKind';
import { OverlayBadgeEllipseShape, OverlayBadgeShape } from '../shape/overlay-shapes'; // for types

export default class ShapeConfigurator {
  public configureShapes(): void {
    this.initMxShapePrototype();
    this.initMxCellRendererPrototype();
    this.registerShapes();
  }

  private registerShapes(): void {
    // events
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_END, EndEventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_START, StartEventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ThrowIntermediateEventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, CatchIntermediateEventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_BOUNDARY, BoundaryEventShape);
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
    mxgraph.mxCellRenderer.registerShape(StyleIdentifier.BPMN_STYLE_MESSAGE_FLOW_ICON, MessageFlowIconShape);

    // shapes for overlays
    mxgraph.mxCellRenderer.registerShape(OverlayKind.BADGE_TEXT, OverlayBadgeShape);
    mxgraph.mxCellRenderer.registerShape(OverlayKind.BADGE_ELLIPSE, OverlayBadgeEllipseShape);
  }

  private initMxShapePrototype(): void {
    // The following is copied from the mxgraph mxShape implementation then converted to TypeScript and enriched for bpmn-visualization
    // It is needed for adding the custom attributes that permits identification of the BPMN elements in the DOM
    mxgraph.mxShape.prototype.createSvgCanvas = function () {
      const canvas = new mxgraph.mxSvgCanvas2D(this.node, false);
      canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0;
      canvas.pointerEventsValue = this.svgPointerEvents;
      // TODO remove this commented code (has been removed in mxgraph@4.1.1
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
        let allBpmnClassNames = computeAllBpmnClassNames(extractBpmnKindFromStyle(cell), this.dialect === mxgraph.mxConstants.DIALECT_STRICTHTML);
        const extraCssClasses = this.state.style[StyleIdentifier.BPMN_STYLE_EXTRA_CSS_CLASSES];
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

  initMxCellRendererPrototype(): void {
    mxgraph.mxCellRenderer.prototype.redrawCellOverlays = function(state: StateWithOverlays, forced: boolean) {
      this.createCellOverlays(state);

      if (state.overlays != null) {
        const rot = mxgraph.mxUtils.mod(mxgraph.mxUtils.getValue(state.style, mxgraph.mxConstants.STYLE_ROTATION, 0), 90);
        const rad = mxgraph.mxUtils.toRadians(rot);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        state.overlays.visit(function(id: string, shape: mxShape) {
          let bounds: any;
          bounds = (<ShapeWithOverlay>shape).overlay.getBounds(state);

          if (!state.view.graph.getModel().isEdge(state.cell)) {
            if (state.shape != null && rot != 0) {
              let cx = bounds.getCenterX();
              let cy = bounds.getCenterY();

              const point = mxgraph.mxUtils.getRotatedPoint(new mxgraph.mxPoint(cx, cy), cos, sin,
                new mxgraph.mxPoint(state.getCenterX(), state.getCenterY()));

              cx = point.x;
              cy = point.y;
              bounds.x = Math.round(cx - bounds.width / 2);
              bounds.y = Math.round(cy - bounds.height / 2);
            }
          }

          if (forced || shape.bounds == null || shape.scale != state.view.scale ||
            !shape.bounds.equals(bounds)) {
            shape.bounds = bounds;
            shape.scale = state.view.scale;
            shape.redraw();
          }
        });
      }
    };

    /**
     * Function: createCellOverlays
     *
     * Creates the actual shape for showing the overlay for the given cell state.
     *
     * Parameters:
     *
     * state - <mxCellState> for which the overlay should be created.
     */
    mxgraph.mxCellRenderer.prototype.createCellOverlays = function(state: StateWithOverlays) {
      const graph = state.view.graph;
      const overlays = graph.getCellOverlays(state.cell);
      let dict = null;

      if (overlays != null) {
        dict = new mxgraph.mxDictionary();

        for (let i = 0; i < overlays.length; i++) {
          const currentOverlay = overlays[i];
          const shape = (state.overlays != null) ? state.overlays.remove(currentOverlay) : null;

          if (shape == null) {
            let tmp: mxShape;
            if (currentOverlay instanceof BpmnOverlay) {
              if (currentOverlay.kind === OverlayKind.BADGE_ELLIPSE) {
                tmp = new OverlayBadgeEllipseShape(new mxgraph.mxRectangle(0, 0, 0, 0), 'chartreuse', 'black');
              } else {
                tmp = new OverlayBadgeShape(currentOverlay.value, new mxgraph.mxRectangle(0, 0, 0, 0));
              }
              tmp.dialect = state.view.graph.dialect;
            } else {
              tmp = new mxgraph.mxImageShape(new mxgraph.mxRectangle(0, 0, 0, 0), currentOverlay.image.src);
              tmp.dialect = state.view.graph.dialect;
              (<mxImageShape>tmp).preserveImageAspect = false;
            }
            (<ShapeWithOverlay>tmp).overlay = currentOverlay;

            // TODO: find solution to not cast tmp into mxImageShape
            this.initializeOverlay(state, <mxImageShape>tmp);
            this.installCellOverlayListeners(state, currentOverlay, tmp);

            if (currentOverlay.cursor != null) {
              tmp.node.style.cursor = currentOverlay.cursor;
            }

            if (currentOverlay instanceof BpmnOverlay) {
              tmp.node.classList.add('badge-overlay');
            }

            dict.put(currentOverlay, tmp);
          } else {
            dict.put(currentOverlay, shape);
          }
        }
      }

      // Removes unused
      if (state.overlays != null) {
        state.overlays.visit(function(id: string, shape: mxShape) {
          shape.destroy();
        });
      }

      state.overlays = dict;
    };
  }
}

interface StateWithOverlays extends mxCellState {
  overlays: any
}

interface ShapeWithOverlay extends mxShape {
  overlay: any
}
