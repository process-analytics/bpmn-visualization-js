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

import type { CellState, CellOverlay } from '@maxgraph/core';
import { CellRenderer, Shape, Rectangle, ImageShape, Dictionary, SvgCanvas2D, constants } from '@maxgraph/core';

import { ShapeBpmnElementKind } from '../../../model/bpmn/internal';
import { EndEventShape, EventShape, IntermediateEventShape, ThrowIntermediateEventShape } from '../shape/event-shapes';
import { ComplexGatewayShape, EventBasedGatewayShape, ExclusiveGatewayShape, InclusiveGatewayShape, ParallelGatewayShape } from '../shape/gateway-shapes';
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
import { BpmnShapeIdentifier } from '../style';
import { computeAllBpmnClassNamesOfCell } from '../renderer/style-utils';
import { MaxGraphCustomOverlay } from '../overlay/custom-overlay';
import { OverlayBadgeShape } from '../overlay/shapes';
import { BpmnConnector } from '../shape/edges';
import type { BPMNCellStyle } from '../renderer/StyleComputer';

/**
 * @internal
 */
export default class ShapeConfigurator {
  configureShapes(): void {
    this.initMxSvgCanvasPrototype();
    this.initMxShapePrototype();
    this.registerShapes();
    this.initMxCellRendererCreateCellOverlays();
  }

  private registerShapes(): void {
    // events
    CellRenderer.registerShape(ShapeBpmnElementKind.EVENT_END, EndEventShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.EVENT_START, EventShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ThrowIntermediateEventShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, IntermediateEventShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.EVENT_BOUNDARY, IntermediateEventShape);
    // gateways
    CellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_COMPLEX, ComplexGatewayShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_EVENT_BASED, EventBasedGatewayShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, ExclusiveGatewayShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_INCLUSIVE, InclusiveGatewayShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_PARALLEL, ParallelGatewayShape);
    // activities
    CellRenderer.registerShape(ShapeBpmnElementKind.SUB_PROCESS, SubProcessShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.CALL_ACTIVITY, CallActivityShape);
    // tasks
    CellRenderer.registerShape(ShapeBpmnElementKind.TASK, TaskShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.TASK_SERVICE, ServiceTaskShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.TASK_USER, UserTaskShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.TASK_RECEIVE, ReceiveTaskShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.TASK_SEND, SendTaskShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.TASK_MANUAL, ManualTaskShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.TASK_SCRIPT, ScriptTaskShape);
    CellRenderer.registerShape(ShapeBpmnElementKind.TASK_BUSINESS_RULE, BusinessRuleTaskShape);
    // artifacts
    CellRenderer.registerShape(ShapeBpmnElementKind.TEXT_ANNOTATION, TextAnnotationShape);

    // shapes for flows
    CellRenderer.registerShape(BpmnShapeIdentifier.EDGE, BpmnConnector);
    CellRenderer.registerShape(BpmnShapeIdentifier.MESSAGE_FLOW_ICON, MessageFlowIconShape);
  }

  private initMxSvgCanvasPrototype(): void {
    // getTextCss is only used when creating foreignObject for label, so there is no impact on svg text that we use for Overlays.
    // Analysis done for mxgraph@4.1.1, still apply to mxgraph@4.2.2
    SvgCanvas2D.prototype.getTextCss = function () {
      const s = this.state;
      const lh = constants.ABSOLUTE_LINE_HEIGHT ? s.fontSize * constants.LINE_HEIGHT + 'px' : constants.LINE_HEIGHT * this.lineHeightCorrection;
      let css =
        'display: inline-block; font-size: ' +
        s.fontSize +
        'px; ' +
        'font-family: ' +
        s.fontFamily +
        '; color: ' +
        s.fontColor +
        '; line-height: ' +
        lh +
        // START Fix for issue #920 (https://github.com/process-analytics/bpmn-visualization-js/issues/920)
        // This cannot be generalized for all mxgraph use cases. For instance, in an editor mode, we should be able to edit the text by clicking on it.
        // Setting to 'none' prevent to capture click.
        '; pointer-events: none' +
        // (this.pointerEvents ? this.pointerEventsValue : 'none') +
        // END OF Fix for issue #920
        '; ';

      if ((s.fontStyle & constants.FONT.BOLD) == constants.FONT.BOLD) {
        css += 'font-weight: bold; ';
      }
      if ((s.fontStyle & constants.FONT.ITALIC) == constants.FONT.ITALIC) {
        css += 'font-style: italic; ';
      }

      const deco = [];
      if ((s.fontStyle & constants.FONT.UNDERLINE) == constants.FONT.UNDERLINE) {
        deco.push('underline');
      }
      if ((s.fontStyle & constants.FONT.STRIKETHROUGH) == constants.FONT.STRIKETHROUGH) {
        deco.push('line-through');
      }
      if (deco.length > 0) {
        css += 'text-decoration: ' + deco.join(' ') + '; ';
      }

      return css;
    };
  }

  private initMxShapePrototype(): void {
    // The following is copied from the mxgraph Shape implementation then converted to TypeScript and enriched for bpmn-visualization
    // It is needed for adding the custom attributes that permits identification of the BPMN elements in the DOM
    Shape.prototype.createSvgCanvas = function () {
      const canvas = new SvgCanvas2D(this.node, false);
      canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0;
      canvas.pointerEventsValue = this.svgPointerEvents;
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
        let allBpmnClassNames = computeAllBpmnClassNamesOfCell(cell, this.dialect === constants.DIALECT.STRICTHTML);
        const extraCssClasses = (this.state.style as BPMNCellStyle).bpmn.extra.css.classes;
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
        canvas.format = (value: number): number => {
          return Math.round(value);
        };
      }

      return canvas;
    };
  }

  initMxCellRendererCreateCellOverlays(): void {
    CellRenderer.prototype.createCellOverlays = function (state: CellState) {
      const graph = state.view.graph;
      const overlays = graph.getCellOverlays(state.cell);
      let dict = null;

      if (overlays != null) {
        dict = new Dictionary<CellOverlay, Shape>();

        for (const currentOverlay of overlays) {
          const shape = state.overlays != null ? state.overlays.remove(currentOverlay) : null;
          if (shape != null) {
            dict.put(currentOverlay, shape);
            continue;
          }

          let overlayShape: Shape;

          // START bpmn-visualization CUSTOMIZATION
          if (currentOverlay instanceof MaxGraphCustomOverlay) {
            overlayShape = new OverlayBadgeShape(currentOverlay.label, new Rectangle(0, 0, 0, 0), currentOverlay.style);
          } else {
            overlayShape = new ImageShape(new Rectangle(0, 0, 0, 0), currentOverlay.image.src);
            (<ImageShape>overlayShape).preserveImageAspect = false;
          }
          // END bpmn-visualization CUSTOMIZATION

          overlayShape.dialect = state.view.graph.dialect;
          overlayShape.overlay = currentOverlay;

          // The 'initializeOverlay' signature forces us to hardly cast the overlayShape
          this.initializeOverlay(state, <ImageShape>overlayShape);
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
        // prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
        state.overlays.visit(function (_id: string, shape: Shape) {
          shape.destroy();
        });
      }

      state.overlays = dict;
    };
  }
}
