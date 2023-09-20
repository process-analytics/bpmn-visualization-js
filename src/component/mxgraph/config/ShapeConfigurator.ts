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

import { ShapeBpmnElementKind } from '../../../model/bpmn/internal';
import { mxgraph, mxCellRenderer, mxConstants, mxSvgCanvas2D } from '../initializer';
import { computeAllBpmnClassNamesOfCell } from '../renderer/style-utils';
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
import { BpmnConnector } from '../shape/edges';
import { EndEventShape, EventShape, IntermediateEventShape, ThrowIntermediateEventShape } from '../shape/event-shapes';
import { MessageFlowIconShape } from '../shape/flow-shapes';
import { ComplexGatewayShape, EventBasedGatewayShape, ExclusiveGatewayShape, InclusiveGatewayShape, ParallelGatewayShape } from '../shape/gateway-shapes';
import { TextAnnotationShape } from '../shape/text-annotation-shapes';
import { BpmnStyleIdentifier } from '../style';

/**
 * @internal
 */
export default class ShapeConfigurator {
  configureShapes(): void {
    this.initMxSvgCanvasPrototype();
    this.initMxShapePrototype();
    this.registerShapes();
  }

  private registerShapes(): void {
    // events
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_END, EndEventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_START, EventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ThrowIntermediateEventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, IntermediateEventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_BOUNDARY, IntermediateEventShape);
    // gateways
    mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_COMPLEX, ComplexGatewayShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_EVENT_BASED, EventBasedGatewayShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, ExclusiveGatewayShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_INCLUSIVE, InclusiveGatewayShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_PARALLEL, ParallelGatewayShape);
    // activities
    mxCellRenderer.registerShape(ShapeBpmnElementKind.SUB_PROCESS, SubProcessShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.CALL_ACTIVITY, CallActivityShape);
    // tasks
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK, TaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SERVICE, ServiceTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_USER, UserTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_RECEIVE, ReceiveTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SEND, SendTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_MANUAL, ManualTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SCRIPT, ScriptTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_BUSINESS_RULE, BusinessRuleTaskShape);
    // artifacts
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TEXT_ANNOTATION, TextAnnotationShape);

    // shapes for flows
    mxCellRenderer.registerShape(BpmnStyleIdentifier.EDGE, BpmnConnector);
    mxCellRenderer.registerShape(BpmnStyleIdentifier.MESSAGE_FLOW_ICON, MessageFlowIconShape);
  }

  private initMxSvgCanvasPrototype(): void {
    // getTextCss is only used when creating foreignObject for label, so there is no impact on svg text that we use for Overlays.
    // Analysis done for mxgraph@4.1.1, still apply to mxgraph@4.2.2
    mxSvgCanvas2D.prototype.getTextCss = function () {
      const s = this.state;
      const lh = mxConstants.ABSOLUTE_LINE_HEIGHT ? s.fontSize * mxConstants.LINE_HEIGHT + 'px' : mxConstants.LINE_HEIGHT * this.lineHeightCorrection;
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

      if ((s.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) {
        css += 'font-weight: bold; ';
      }
      if ((s.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC) {
        css += 'font-style: italic; ';
      }

      const deco = [];
      if ((s.fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE) {
        deco.push('underline');
      }
      if ((s.fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH) {
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
    mxgraph.mxShape.prototype.createSvgCanvas = function () {
      const canvas = new mxSvgCanvas2D(this.node, false);
      canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0;
      canvas.pointerEventsValue = this.svgPointerEvents;
      const off = this.getSvgScreenOffset();

      if (off == 0) {
        this.node.removeAttribute('transform');
      } else {
        this.node.setAttribute('transform', 'translate(' + off + ',' + off + ')');
      }

      // START bpmn-visualization CUSTOMIZATION
      // add attributes to be able to identify elements in DOM
      if (this.state?.cell) {
        // 'this.state.style' = the style definition associated with the cell
        // 'this.state.cell.style' = the style applied to the cell: 1st element: style name = bpmn shape name
        const cell = this.state.cell;
        // dialect = strictHtml is set means that current node holds an HTML label
        let allBpmnClassNames = computeAllBpmnClassNamesOfCell(cell, this.dialect === mxConstants.DIALECT_STRICTHTML);
        const extraCssClasses = this.state.style[BpmnStyleIdentifier.EXTRA_CSS_CLASSES];
        if (typeof extraCssClasses == 'string') {
          allBpmnClassNames = [...allBpmnClassNames, ...extraCssClasses.split(',')];
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
}
