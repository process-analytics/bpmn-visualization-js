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
    this.initMxSvgCanvasPrototype();
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

  // TODO hack
  private initMxSvgCanvasPrototype(): void {
    // Implementation taken from https://github.com/jgraph/mxgraph/blob/v4.1.0/javascript/src/js/util/mxSvgCanvas2D.js#L1615 and adapted with the fix provided in mxgraph@4.2.1
    // "Fixes ignored pointerEvents flag for text in SVG"
    // To remove when upgrading to mxgraph@4.2.1
    // See https://github.com/process-analytics/bpmn-visualization-js/issues/920 and https://github.com/process-analytics/bpmn-visualization-js/issues/919
    mxgraph.mxSvgCanvas2D.prototype.plainText = function (x, y, w, h, str, align, valign, wrap, overflow, clip, rotation, dir) {
      rotation = rotation != null ? rotation : 0;
      const s = this.state;
      const size = s.fontSize;
      const node = this.createElement('g');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore if transform doesn't exist, default to ''. Possible missing type in typed-mxgraph?
      let tr: string = s.transform || '';
      this.updateFont(node);

      // Ignores pointer events
      // eslint-disable-next-line no-console
      console.info('@@Called overridden mxSvgCanvas2D.prototype.plainText@@ custom fix cherry-pick from 4.2.1');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore this.originalRoot not in typed-mxgraph
      if (!this.pointerEvents && this.originalRoot == null) {
        node.setAttribute('pointer-events', 'none');
      }

      // Non-rotated text
      if (rotation != 0) {
        tr += 'rotate(' + rotation + ',' + this.format(x * s.scale) + ',' + this.format(y * s.scale) + ')';
      }

      if (dir != null) {
        node.setAttribute('direction', dir);
      }

      if (clip && w > 0 && h > 0) {
        let cx = x;
        let cy = y;

        if (align == mxgraph.mxConstants.ALIGN_CENTER) {
          cx -= w / 2;
        } else if (align == mxgraph.mxConstants.ALIGN_RIGHT) {
          cx -= w;
        }

        if (overflow != 'fill') {
          if (valign == mxgraph.mxConstants.ALIGN_MIDDLE) {
            cy -= h / 2;
          } else if (valign == mxgraph.mxConstants.ALIGN_BOTTOM) {
            cy -= h;
          }
        }

        // LATER: Remove spacing from clip rectangle
        const c = this.createClip(cx * s.scale - 2, cy * s.scale - 2, w * s.scale + 4, h * s.scale + 4);

        if (this.defs != null) {
          this.defs.appendChild(c);
        } else {
          // Makes sure clip is removed with referencing node
          this.root.appendChild(c);
        }

        if (!mxgraph.mxClient.IS_CHROMEAPP && !mxgraph.mxClient.IS_IE && !mxgraph.mxClient.IS_IE11 && !mxgraph.mxClient.IS_EDGE && this.root.ownerDocument == document) {
          // Workaround for potential base tag
          const base = this.getBaseUrl().replace(/([\(\)])/g, '\\$1');
          node.setAttribute('clip-path', 'url(' + base + '#' + c.getAttribute('id') + ')');
        } else {
          node.setAttribute('clip-path', 'url(#' + c.getAttribute('id') + ')');
        }
      }

      // Default is left
      const anchor = align == mxgraph.mxConstants.ALIGN_RIGHT ? 'end' : align == mxgraph.mxConstants.ALIGN_CENTER ? 'middle' : 'start';

      // Text-anchor start is default in SVG
      if (anchor != 'start') {
        node.setAttribute('text-anchor', anchor);
      }

      if (!this.styleEnabled || size != mxgraph.mxConstants.DEFAULT_FONTSIZE) {
        node.setAttribute('font-size', size * s.scale + 'px');
      }

      if (tr.length > 0) {
        node.setAttribute('transform', tr);
      }

      if (s.alpha < 1) {
        node.setAttribute('opacity', String(s.alpha));
      }

      const lines = str.split('\n');
      const lh = Math.round(size * mxgraph.mxConstants.LINE_HEIGHT);
      const textHeight = size + (lines.length - 1) * lh;

      let cy = y + size - 1;

      if (valign == mxgraph.mxConstants.ALIGN_MIDDLE) {
        if (overflow == 'fill') {
          cy -= h / 2;
        } else {
          const dy = (this.matchHtmlAlignment && clip && h > 0 ? Math.min(textHeight, h) : textHeight) / 2;
          cy -= dy;
        }
      } else if (valign == mxgraph.mxConstants.ALIGN_BOTTOM) {
        if (overflow == 'fill') {
          cy -= h;
        } else {
          const dy = this.matchHtmlAlignment && clip && h > 0 ? Math.min(textHeight, h) : textHeight;
          cy -= dy + 1;
        }
      }

      for (let i = 0; i < lines.length; i++) {
        // Workaround for bounding box of empty lines and spaces
        if (lines[i].length > 0 && mxgraph.mxUtils.trim(lines[i]).length > 0) {
          const text = this.createElement('text');
          // LATER: Match horizontal HTML alignment
          text.setAttribute('x', String(this.format(x * s.scale) + this.textOffset));
          text.setAttribute('y', String(this.format(cy * s.scale) + this.textOffset));

          mxgraph.mxUtils.write(text, lines[i]);
          node.appendChild(text);
        }

        cy += lh;
      }

      this.root.appendChild(node);
      this.addTextBackground(node, str, x, y, w, overflow == 'fill' ? h : textHeight, align, valign, overflow);
    };
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
