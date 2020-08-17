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
import { mxgraph } from 'ts-mxgraph';
import { ShapeBpmnElementKind } from '../../../model/bpmn/shape/ShapeBpmnElementKind';
import { BoundaryEventShape, CatchIntermediateEventShape, EndEventShape, StartEventShape, ThrowIntermediateEventShape } from '../shape/event-shapes';
import { ExclusiveGatewayShape, InclusiveGatewayShape, ParallelGatewayShape } from '../shape/gateway-shapes';
import { CallActivityShape, ReceiveTaskShape, SendTaskShape, ServiceTaskShape, SubProcessShape, TaskShape, UserTaskShape } from '../shape/activity-shapes';
import { TextAnnotationShape } from '../shape/text-annotation-shapes';
import { SketchySvgCanvas } from '../extension/SketchySvgCanvas';

// TODO unable to load mxClient from mxgraph-type-definitions@1.0.2
declare const mxClient: typeof mxgraph.mxClient;

export default class ShapeConfigurator {
  public configureShapes(): void {
    this.initMxShapePrototype(mxClient.IS_FF);
    this.registerShapes();
  }

  private registerShapes(): void {
    // events
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_END, EndEventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_START, StartEventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ThrowIntermediateEventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, CatchIntermediateEventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_BOUNDARY, BoundaryEventShape);
    // gateways
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
    // artifacts
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TEXT_ANNOTATION, TextAnnotationShape);
  }

  private initMxShapePrototype(isFF: boolean): void {
    // this change is needed for adding the custom attributes that permits identification of the BPMN elements
    mxShape.prototype.createSvgCanvas = function () {
      // const canvas = new mxSvgCanvas2D(this.node, false);
      const canvas = ShapeConfigurator.newSvgCanvas(this.node, this);
      canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0;
      canvas.pointerEventsValue = this.svgPointerEvents;
      // TODO existed in mxgraph-type-definitions@1.0.2, no more in mxgraph-type-definitions@1.0.3
      // this is probably because mxSvgCanvas2D definition matches mxgraph@4.1.1 and we are using  mxgraph@4.1.0
      ((canvas as unknown) as mxgraph.mxSvgCanvas2D).blockImagePointerEvents = isFF;
      const off = this.getSvgScreenOffset();

      if (off != 0) {
        this.node.setAttribute('transform', 'translate(' + off + ',' + off + ')');
      } else {
        this.node.removeAttribute('transform');
      }

      // add attributes to be able to identify elements in DOM
      if (this.state && this.state.cell) {
        this.node.setAttribute('class', 'class-state-cell-style-' + this.state.cell.style.replace(';', '-'));
        this.node.setAttribute('data-cell-id', this.state.cell.id);
      }
      //
      canvas.minStrokeWidth = this.minSvgStrokeWidth;

      if (!this.antiAlias) {
        // Rounds all numbers in the SVG output to integers
        canvas.format = function (value: string) {
          return Math.round(parseFloat(value));
        };
      }

      return canvas;
    };

    // TODO see if we need this (need adaptation)
    // Overrides for event handling on transparent background for sketch style
    // var shapePaint = mxShape.prototype.paint;
    // mxShape.prototype.paint = function(c)
    // {
    //   var fillStyle = null;
    //   var events = true;
    //
    //   if (this.style != null)
    //   {
    //     events = mxUtils.getValue(this.style, mxConstants.STYLE_POINTER_EVENTS, '1') == '1';
    //     fillStyle = mxUtils.getValue(this.style, 'fillStyle', 'auto');
    //
    //     if (this.state != null && fillStyle == 'auto')
    //     {
    //       var bg = this.state.view.graph.defaultPageBackgroundColor;
    //
    //       if (this.fill != null && (this.gradient != null || (bg != null &&
    //         this.fill.toLowerCase() == bg.toLowerCase())))
    //       {
    //         fillStyle = 'solid';
    //       }
    //     }
    //   }
    //
    //   if (events && c.handJiggle != null && c.handJiggle.constructor == RoughCanvas &&
    //     !this.outline && (this.fill == null || this.fill == mxConstants.NONE ||
    //       fillStyle != 'solid'))
    //   {
    //     // Save needed for possible transforms applied during paint
    //     c.save();
    //     var fill = this.fill;
    //     var stroke = this.stroke;
    //     this.fill = null;
    //     this.stroke = null;
    //     c.handJiggle.passThrough = true;
    //
    //     shapePaint.apply(this, arguments);
    //
    //     c.handJiggle.passThrough = false;
    //     this.fill = fill;
    //     this.stroke = stroke;
    //     c.restore();
    //   }
    //
    //   shapePaint.apply(this, arguments);
    // };
  }

  // private static newSvgCanvas(node: HTMLElement, style: { [key: string]: unknown }): mxSvgCanvas2D {
  private static newSvgCanvas(node: HTMLElement, shape: mxShape): mxSvgCanvas2D {
    if (mxUtils.getValue(shape.style, 'sketch', 'false') == 'true') {
      return new SketchySvgCanvas(node, shape);
    }
    return new mxSvgCanvas2D(node, false);
  }
}
