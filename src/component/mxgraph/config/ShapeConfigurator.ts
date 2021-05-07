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
import { MxGraphCustomOverlay } from '../overlay/custom-overlay';
import { OverlayBadgeShape } from '../overlay/shapes';

/**
 * @internal
 */
export default class ShapeConfigurator {
  public configureShapes(): void {
    this.adjustPaddingForOverlays();
    this.initMxShapePrototype();
    this.registerShapes();
    this.initMxCellRendererCreateCellOverlays();
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
        const extraCssClasses =  this.state.style[StyleIdentifier.BPMN_STYLE_EXTRA_CSS_CLASSES];
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

  /**
   * The adjustment here is done to have equal paddings in overlays (badges)
   * without this adjustment the right and bottom spacing appears not equal to left and top spacing
   */
  private adjustPaddingForOverlays() {
    mxgraph.mxSvgCanvas2D.prototype.addTextBackground = function(node, str, x, y, w, h, align, valign, overflow) {
      const s = this.state;

      if (s.fontBackgroundColor != null || s.fontBorderColor != null) {
        var bbox = null;

        if (overflow == 'fill' || overflow == 'width') {
          if (align == mxgraph.mxConstants.ALIGN_CENTER) {
            x -= w / 2;
          } else if (align == mxgraph.mxConstants.ALIGN_RIGHT) {
            x -= w;
          }

          if (valign == mxgraph.mxConstants.ALIGN_MIDDLE) {
            y -= h / 2;
          } else if (valign == mxgraph.mxConstants.ALIGN_BOTTOM) {
            y -= h;
          }

          bbox = new mxgraph.mxRectangle((x + 1) * s.scale, y * s.scale, (w - 2) * s.scale, (h + 2) * s.scale);
        } else { // @ts-ignore
          if (node.getBBox != null && this.root.ownerDocument == document) {
            // Uses getBBox only if inside document for correct size
            try {
              // @ts-ignore
              bbox = node.getBBox();
              const ie = mxgraph.mxClient.IS_IE && mxgraph.mxClient.IS_SVG;
              bbox = new mxgraph.mxRectangle(bbox.x, bbox.y + ((ie) ? 0 : 1), bbox.width, bbox.height + ((ie) ? 1 : 0));
            } catch (e) {
              // Ignores NS_ERROR_FAILURE in FF if container display is none.
            }
          }
        }

        if (bbox == null || bbox.width == 0 || bbox.height == 0) {
          // Computes size if not in document or no getBBox available
          const div = document.createElement('div');

          // Wrapping and clipping can be ignored here
          div.style.lineHeight = (mxgraph.mxConstants.ABSOLUTE_LINE_HEIGHT) ? (s.fontSize * mxgraph.mxConstants.LINE_HEIGHT) + 'px' : mxgraph.mxConstants.LINE_HEIGHT + 'px';
          div.style.fontSize = s.fontSize + 'px';
          div.style.fontFamily = s.fontFamily;
          div.style.whiteSpace = 'nowrap';
          div.style.position = 'absolute';
          div.style.visibility = 'hidden';
          div.style.display = (mxgraph.mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
          div.style.zoom = '1';

          if ((s.fontStyle & mxgraph.mxConstants.FONT_BOLD) == mxgraph.mxConstants.FONT_BOLD) {
            div.style.fontWeight = 'bold';
          }

          if ((s.fontStyle & mxgraph.mxConstants.FONT_ITALIC) == mxgraph.mxConstants.FONT_ITALIC) {
            div.style.fontStyle = 'italic';
          }

          // @ts-ignore
          str = mxgraph.mxUtils.htmlEntities(str, false);
          div.innerHTML = str.replace(/\n/g, '<br/>');

          document.body.appendChild(div);
          const w = div.offsetWidth;
          const h = div.offsetHeight;
          div.parentNode.removeChild(div);

          if (align == mxgraph.mxConstants.ALIGN_CENTER) {
            x -= w / 2;
          } else if (align == mxgraph.mxConstants.ALIGN_RIGHT) {
            x -= w;
          }

          if (valign == mxgraph.mxConstants.ALIGN_MIDDLE) {
            y -= h / 2;
          } else if (valign == mxgraph.mxConstants.ALIGN_BOTTOM) {
            y -= h;
          }

          bbox = new mxgraph.mxRectangle((x + 1) * s.scale, (y + 2) * s.scale, w * s.scale, (h + 1) * s.scale);
        }

        if (bbox != null) {
          const n = this.createElement('rect');
          n.setAttribute('fill', s.fontBackgroundColor || 'none');
          n.setAttribute('stroke', s.fontBorderColor || 'none');
          n.setAttribute('x', String(Math.floor(bbox.x - 1)));
          n.setAttribute('y', String(Math.floor(bbox.y - 1)));

          // START bpmn-visualization CUSTOMIZATION
          // n.setAttribute('width', String(Math.ceil(bbox.width + 2)));
          // n.setAttribute('height', String(Math.ceil(bbox.height)));
          n.setAttribute('width', String(Math.ceil(bbox.width + 2 + s.scale)));
          n.setAttribute('height', String(Math.ceil(bbox.height + s.scale)));
          // END bpmn-visualization CUSTOMIZATION

          const sw = (s.fontBorderColor != null) ? Math.max(1, this.format(String(s.scale))) : 0;
          n.setAttribute('stroke-width', String(sw));

          // Workaround for crisp rendering - only required if not exporting
          if (this.root.ownerDocument == document && mxgraph.mxUtils.mod(sw, 2) == 1) {
            n.setAttribute('transform', 'translate(0.5, 0.5)');
          }

          node.insertBefore(n, node.firstChild);
        }
      }
    };
  }

  initMxCellRendererCreateCellOverlays(): void {
    mxgraph.mxCellRenderer.prototype.createCellOverlays = function(state: mxCellState) {
      const graph = state.view.graph;
      const overlays = graph.getCellOverlays(state.cell);
      let dict = null;

      if (overlays != null) {
        dict = new mxgraph.mxDictionary<mxShape>();

        for (let currentOverlay of overlays) {
          const shape = (state.overlays != null) ? state.overlays.remove(currentOverlay) : null;
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
        state.overlays.visit(function(id: string, shape: mxShape) {
          shape.destroy();
        });
      }

      state.overlays = dict;
    };
  }
}
