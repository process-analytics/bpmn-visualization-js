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

import { CellRenderer, constants, Rectangle, Shape, ShapeRegistry, SvgCanvas2D, SwimlaneShape } from '@maxgraph/core';
import type { CellOverlay, CellState, ShapeConstructor, StyleShapeValue } from '@maxgraph/core';

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
import { BpmnStyleIdentifier } from '../style';
import { computeAllBpmnClassNamesOfCell } from '../renderer/style-utils';
import type { BpmnCellStateStyle } from '../style/types';
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
    // Inspired by the default shapes registration done in maxGraph
    const shapesToRegister: [StyleShapeValue, ShapeConstructor][] = [
      // events
      [ShapeBpmnElementKind.EVENT_END, EndEventShape],
      [ShapeBpmnElementKind.EVENT_START, EventShape],
      [ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ThrowIntermediateEventShape],
      [ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, IntermediateEventShape],
      [ShapeBpmnElementKind.EVENT_BOUNDARY, IntermediateEventShape],
      // gateways
      [ShapeBpmnElementKind.GATEWAY_COMPLEX, ComplexGatewayShape],
      [ShapeBpmnElementKind.GATEWAY_EVENT_BASED, EventBasedGatewayShape],
      [ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, ExclusiveGatewayShape],
      [ShapeBpmnElementKind.GATEWAY_INCLUSIVE, InclusiveGatewayShape],
      [ShapeBpmnElementKind.GATEWAY_PARALLEL, ParallelGatewayShape],
      // activities
      [ShapeBpmnElementKind.SUB_PROCESS, SubProcessShape],
      [ShapeBpmnElementKind.CALL_ACTIVITY, CallActivityShape],
      // tasks
      [ShapeBpmnElementKind.TASK, TaskShape],
      [ShapeBpmnElementKind.TASK_SERVICE, ServiceTaskShape],
      [ShapeBpmnElementKind.TASK_USER, UserTaskShape],
      [ShapeBpmnElementKind.TASK_RECEIVE, ReceiveTaskShape],
      [ShapeBpmnElementKind.TASK_SEND, SendTaskShape],
      [ShapeBpmnElementKind.TASK_MANUAL, ManualTaskShape],
      [ShapeBpmnElementKind.TASK_SCRIPT, ScriptTaskShape],
      [ShapeBpmnElementKind.TASK_BUSINESS_RULE, BusinessRuleTaskShape],
      // artifacts
      [ShapeBpmnElementKind.TEXT_ANNOTATION, TextAnnotationShape],
      // pool and lanes
      ['swimlane', SwimlaneShape],
      // shapes for flows
      [BpmnStyleIdentifier.EDGE, BpmnConnector],
      [BpmnStyleIdentifier.MESSAGE_FLOW_ICON, MessageFlowIconShape],
    ];
    for (const [shapeName, shapeClass] of shapesToRegister) {
      ShapeRegistry.add(shapeName, shapeClass);
    }
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

      if ((s.fontStyle & constants.FONT_STYLE_MASK.BOLD) == constants.FONT_STYLE_MASK.BOLD) {
        css += 'font-weight: bold; ';
      }
      if ((s.fontStyle & constants.FONT_STYLE_MASK.ITALIC) == constants.FONT_STYLE_MASK.ITALIC) {
        css += 'font-style: italic; ';
      }

      const deco = [];
      if ((s.fontStyle & constants.FONT_STYLE_MASK.UNDERLINE) == constants.FONT_STYLE_MASK.UNDERLINE) {
        deco.push('underline');
      }
      if ((s.fontStyle & constants.FONT_STYLE_MASK.STRIKETHROUGH) == constants.FONT_STYLE_MASK.STRIKETHROUGH) {
        deco.push('line-through');
      }
      if (deco.length > 0) {
        css += 'text-decoration: ' + deco.join(' ') + '; ';
      }

      return css;
    };
  }

  private initMxShapePrototype(): void {
    // The following is copied from the mxgraph mxShape implementation then converted to TypeScript and enriched for bpmn-visualization
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
      if (this.state?.cell) {
        // 'this.state.style' = the style definition associated with the cell
        // 'this.state.cell.style' = the style applied to the cell: 1st element: style name = bpmn shape name
        const cell = this.state.cell;
        // dialect = strictHtml is set means that current node holds an HTML label
        let allBpmnClassNames = computeAllBpmnClassNamesOfCell(cell, this.dialect === 'strictHtml');
        const extraCssClasses = (this.state.style as BpmnCellStateStyle).bpmn?.extraCssClasses;
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
    // TODO maxgraph@0.20.0 - adapted using new overlay extension features, to reapply to the Custom CellRenderer in new versions of bpmn-visu (no prototype modification)
    // new extension points: https://github.com/maxGraph/maxGraph/issues/28

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore createOverlayShape is protected
    const originalCreateOverlayShape = CellRenderer.prototype.createOverlayShape;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore createOverlayShape is protected
    CellRenderer.prototype.createOverlayShape = function (_state: CellState, cellOverlay: CellOverlay): Shape {
      if (cellOverlay instanceof MxGraphCustomOverlay) {
        return new OverlayBadgeShape(cellOverlay.label, new Rectangle(0, 0, 0, 0), cellOverlay.style);
      }
      return originalCreateOverlayShape.call(this, _state, cellOverlay);
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore configureOverlayShape is protected
    const originalConfigureOverlayShape = CellRenderer.prototype.configureOverlayShape;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore configureOverlayShape is protected
    CellRenderer.prototype.configureOverlayShape = function (state: CellState, cellOverlay: CellOverlay, overlayShape: Shape) {
      originalConfigureOverlayShape.call(this, state, cellOverlay, overlayShape);

      if (overlayShape instanceof OverlayBadgeShape) {
        overlayShape.node.classList.add('overlay-badge');
        overlayShape.node.setAttribute('data-bpmn-id', state.cell.id);
      }
    };
  }
}
