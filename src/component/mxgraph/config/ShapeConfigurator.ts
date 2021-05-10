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
import { mxCellOverlay, mxCellState, mxImageShape, mxShape } from 'mxgraph'; // for types
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
    this.initMxShapePrototype();
    this.registerShapes();
    this.initMxCellRendererCreateCellOverlays();
    this.mxSvgCanvas2DForOverlays();
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


  /**
   * The adjustment here is done to have equal paddings in overlays (badges)
   * without this adjustment the right and bottom spacing appears not equal to left and top spacing
   */
  private mxSvgCanvas2DForOverlays() {
    console.info('#### Custom configuration mxSvgCanvas2DForOverlays');

    // TODO here we could have a smaller dedicated implementation for overlays
    // delegate to original function otherwise
    mxgraph.mxSvgCanvas2D.prototype.plainText = function(x, y, w, h, str, align, valign, wrap, overflow, clip, rotation, dir): void
    {
      // @ts-ignore
      this.rotation = (rotation != null) ? rotation : 0;
      var s = this.state;
      var size = s.fontSize;
      var node = this.createElement('g');
      // @ts-ignore
      var tr = s.transform || '';
      this.updateFont(node);

      // Ignores pointer events
      // @ts-ignore
      if (!this.pointerEvents && this.originalRoot == null)
      {
        node.setAttribute('pointer-events', 'none');
      }

      // Non-rotated text
      if (rotation != 0)
      {
        // @ts-ignore
        tr += 'rotate(' + rotation  + ',' + this.format(x * s.scale) + ',' + this.format(y * s.scale) + ')';
      }

      if (dir != null)
      {
        node.setAttribute('direction', dir);
      }

      // no clip support in bpmn-visualization
      // if (clip && w > 0 && h > 0)
      // {
      //   var cx = x;
      //   var cy = y;
      //
      //   if (align == mxConstants.ALIGN_CENTER)
      //   {
      //     cx -= w / 2;
      //   }
      //   else if (align == mxConstants.ALIGN_RIGHT)
      //   {
      //     cx -= w;
      //   }
      //
      //   if (overflow != 'fill')
      //   {
      //     if (valign == mxConstants.ALIGN_MIDDLE)
      //     {
      //       cy -= h / 2;
      //     }
      //     else if (valign == mxConstants.ALIGN_BOTTOM)
      //     {
      //       cy -= h;
      //     }
      //   }
      //
      //   // LATER: Remove spacing from clip rectangle
      //   var c = this.createClip(cx * s.scale - 2, cy * s.scale - 2, w * s.scale + 4, h * s.scale + 4);
      //
      //   if (this.defs != null)
      //   {
      //     this.defs.appendChild(c);
      //   }
      //   else
      //   {
      //     // Makes sure clip is removed with referencing node
      //     this.root.appendChild(c);
      //   }
      //
      //   if (!mxClient.IS_CHROMEAPP && !mxClient.IS_IE && !mxClient.IS_IE11 &&
      //     !mxClient.IS_EDGE && this.root.ownerDocument == document)
      //   {
      //     // Workaround for potential base tag
      //     var base = this.getBaseUrl().replace(/([\(\)])/g, '\\$1');
      //     node.setAttribute('clip-path', 'url(' + base + '#' + c.getAttribute('id') + ')');
      //   }
      //   else
      //   {
      //     node.setAttribute('clip-path', 'url(#' + c.getAttribute('id') + ')');
      //   }
      // }

      // Default is left
      var anchor = (align == mxgraph.mxConstants.ALIGN_RIGHT) ? 'end' :
        (align == mxgraph.mxConstants.ALIGN_CENTER) ? 'middle' :
          'start';

      // Text-anchor start is default in SVG
      if (anchor != 'start')
      {
        node.setAttribute('text-anchor', anchor);
      }

      if (!this.styleEnabled || size != mxgraph.mxConstants.DEFAULT_FONTSIZE)
      {
        node.setAttribute('font-size', (size * s.scale) + 'px');
      }

      if (tr.length > 0)
      {
        node.setAttribute('transform', tr);
      }

      if (s.alpha < 1)
      {
        node.setAttribute('opacity', `${s.alpha}`);
      }

      var lines = str.split('\n');
      var lh = Math.round(size * mxgraph.mxConstants.LINE_HEIGHT);
      // START bpmn-visualization CUSTOMIZATION
      // const isOverlayBadge = (<SVGGElement>node.parentNode).classList.contains('overlay-badge');
      const isOverlayBadge = (this.root).classList.contains('overlay-badge');
      console.info('@@@@custom canvas plainText - isOverlayBadge', isOverlayBadge);
      const textHeight = isOverlayBadge ? lines.length * lh: size + (lines.length - 1) * lh;
      // var textHeight = size + (lines.length - 1) * lh;
      // END bpmn-visualization CUSTOMIZATION

      var cy = y + size - 1;

      if (valign == mxgraph.mxConstants.ALIGN_MIDDLE)
      {
        if (overflow == 'fill')
        {
          cy -= h / 2;
        }
        else
        {
          var dy = ((this.matchHtmlAlignment && clip && h > 0) ? Math.min(textHeight, h) : textHeight) / 2;
          cy -= dy;
        }
      }
      else if (valign == mxgraph.mxConstants.ALIGN_BOTTOM)
      {
        if (overflow == 'fill')
        {
          cy -= h;
        }
        else
        {
          var dy = (this.matchHtmlAlignment && clip && h > 0) ? Math.min(textHeight, h) : textHeight;
          cy -= dy + 1;
        }
      }

      for (var i = 0; i < lines.length; i++)
      {
        // Workaround for bounding box of empty lines and spaces
        if (lines[i].length > 0 && mxgraph.mxUtils.trim(lines[i], '\\s').length > 0)
        {
          var text = this.createElement('text');
          // LATER: Match horizontal HTML alignment
          // TODO wrong signature in typed-mxgraph for canvas format method
          // @ts-ignore
          text.setAttribute('x', this.format(x * s.scale) + this.textOffset);
          // @ts-ignore
          text.setAttribute('y', this.format(cy * s.scale) + this.textOffset);

          mxgraph.mxUtils.write(text, lines[i]);
          node.appendChild(text);
        }

        cy += lh;
      }

      this.root.appendChild(node);
      this.addTextBackground(node, str, x, y, w, (overflow == 'fill') ? h : textHeight, align, valign, overflow);
    };





    // mxgraph.mxSvgCanvas2D.prototype.addTextBackground = function(node, str, x, y, w, h, align, valign, overflow) {
    //   console.log(arguments);
    //   const s = this.state;
    //
    //   if (s.fontBackgroundColor != null || s.fontBorderColor != null) {
    //     var bbox = null;
    //
    //     if (overflow == 'fill' || overflow == 'width') {
    //       if (align == mxgraph.mxConstants.ALIGN_CENTER) {
    //         x -= w / 2;
    //       } else if (align == mxgraph.mxConstants.ALIGN_RIGHT) {
    //         x -= w;
    //       }
    //
    //       if (valign == mxgraph.mxConstants.ALIGN_MIDDLE) {
    //         y -= h / 2;
    //       } else if (valign == mxgraph.mxConstants.ALIGN_BOTTOM) {
    //         y -= h;
    //       }
    //
    //       bbox = new mxgraph.mxRectangle((x + 1) * s.scale, y * s.scale, (w - 2) * s.scale, (h + 2) * s.scale);
    //       // @ts-ignore
    //     } else if (node.getBBox != null && this.root.ownerDocument == document) {
    //       // Uses getBBox only if inside document for correct size
    //       try {
    //         // @ts-ignore
    //         bbox = node.getBBox();
    //         const ie = mxgraph.mxClient.IS_IE && mxgraph.mxClient.IS_SVG;
    //         bbox = new mxgraph.mxRectangle(bbox.x, bbox.y + ((ie) ? 0 : 1), bbox.width, bbox.height + ((ie) ? 1 : 0));
    //       } catch (e) {
    //         // Ignores NS_ERROR_FAILURE in FF if container display is none.
    //       }
    //     } else {
    //       // Computes size if not in document or no getBBox available
    //       const div = document.createElement('div');
    //
    //       // Wrapping and clipping can be ignored here
    //       div.style.lineHeight = (mxgraph.mxConstants.ABSOLUTE_LINE_HEIGHT) ? (s.fontSize * mxgraph.mxConstants.LINE_HEIGHT) + 'px' : mxgraph.mxConstants.LINE_HEIGHT + 'px';
    //       div.style.fontSize = s.fontSize + 'px';
    //       div.style.fontFamily = s.fontFamily;
    //       div.style.whiteSpace = 'nowrap';
    //       div.style.position = 'absolute';
    //       div.style.visibility = 'hidden';
    //       div.style.display = (mxgraph.mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
    //       div.style.zoom = '1';
    //
    //       if ((s.fontStyle & mxgraph.mxConstants.FONT_BOLD) == mxgraph.mxConstants.FONT_BOLD) {
    //         div.style.fontWeight = 'bold';
    //       }
    //
    //       if ((s.fontStyle & mxgraph.mxConstants.FONT_ITALIC) == mxgraph.mxConstants.FONT_ITALIC) {
    //         div.style.fontStyle = 'italic';
    //       }
    //
    //       // @ts-ignore
    //       str = mxgraph.mxUtils.htmlEntities(str, false);
    //       div.innerHTML = str.replace(/\n/g, '<br/>');
    //
    //       document.body.appendChild(div);
    //       const w = div.offsetWidth;
    //       const h = div.offsetHeight;
    //       div.parentNode.removeChild(div);
    //
    //       if (align == mxgraph.mxConstants.ALIGN_CENTER) {
    //         x -= w / 2;
    //       } else if (align == mxgraph.mxConstants.ALIGN_RIGHT) {
    //         x -= w;
    //       }
    //
    //       if (valign == mxgraph.mxConstants.ALIGN_MIDDLE) {
    //         y -= h / 2;
    //       } else if (valign == mxgraph.mxConstants.ALIGN_BOTTOM) {
    //         y -= h;
    //       }
    //
    //       bbox = new mxgraph.mxRectangle((x + 1) * s.scale, (y + 2) * s.scale, w * s.scale, (h + 1) * s.scale);
    //     }
    //
    //     if (bbox != null) {
    //       const n = this.createElement('rect');
    //       n.setAttribute('fill', s.fontBackgroundColor || 'none');
    //       n.setAttribute('stroke', s.fontBorderColor || 'none');
    //       n.setAttribute('x', String(Math.floor(bbox.x - 1)));
    //       n.setAttribute('y', String(Math.floor(bbox.y - 1)));
    //
    //       // START bpmn-visualization CUSTOMIZATION
    //       // Adjust the padding for badges only
    //       if((<SVGGElement>node.parentNode).classList.contains('overlay-badge')) {
    //         n.setAttribute('width', String(Math.ceil(bbox.width + 2 + s.scale)));
    //         n.setAttribute('height', String(Math.ceil(bbox.height + 1)));
    //       } else {
    //         n.setAttribute('width', String(Math.ceil(bbox.width + 2)));
    //         n.setAttribute('height', String(Math.ceil(bbox.height)));
    //       }
    //       // END bpmn-visualization CUSTOMIZATION
    //
    //       const sw = (s.fontBorderColor != null) ? Math.max(1, this.format(String(s.scale))) : 0;
    //       n.setAttribute('stroke-width', String(sw));
    //
    //       // Workaround for crisp rendering - only required if not exporting
    //       if (this.root.ownerDocument == document && mxgraph.mxUtils.mod(sw, 2) == 1) {
    //         n.setAttribute('transform', 'translate(0.5, 0.5)');
    //       }
    //
    //       node.insertBefore(n, node.firstChild);
    //     }
    //   }
    // };
  }
}
