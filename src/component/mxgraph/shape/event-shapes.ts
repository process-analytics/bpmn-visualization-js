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

import { MxGraphFactoryService } from '../../../service/MxGraphFactoryService';
import { mxgraph } from 'ts-mxgraph';
import { StyleConstant } from '../StyleConfigurator';
import { ShapeBpmnEventKind } from '../../../model/bpmn/shape/ShapeBpmnEventKind';

const mxEllipse: typeof mxgraph.mxEllipse = MxGraphFactoryService.getMxGraphProperty('mxEllipse');
const mxUtils: typeof mxgraph.mxUtils = MxGraphFactoryService.getMxGraphProperty('mxUtils');
const mxConstants: typeof mxgraph.mxConstants = MxGraphFactoryService.getMxGraphProperty('mxConstants');

abstract class EventShape extends mxEllipse {
  protected constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintVertexShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    this.paintOuterShape(c, x, y, w, h);
    this.paintInnerShape(c, x, y, w, h);
  }

  protected paintOuterShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintVertexShape(c, x, y, w, h);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected paintInnerShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // do nothing by default
  }

  protected getBpmnEventKind(): ShapeBpmnEventKind {
    return mxUtils.getValue(this.style, StyleConstant.BPMN_STYLE_EVENT_KIND, ShapeBpmnEventKind.NONE);
  }
}

export class StartEventShape extends EventShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintOuterShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    const eventKind = this.getBpmnEventKind();
    // will be removed when managing the timer rendering
    if (eventKind == ShapeBpmnEventKind.TIMER) {
      c.setFillColor('green');
      c.setFillAlpha(0.3);
    }

    super.paintOuterShape(c, x, y, w, h);
  }
}

export class EndEventShape extends EventShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THICK) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintInnerShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    const eventKind = this.getBpmnEventKind();
    if (eventKind == ShapeBpmnEventKind.TERMINATE) {
      this.paintTerminateEventIcon(c, x, y, w, h);
    }
  }

  // highly inspired from mxDoubleEllipse
  private paintTerminateEventIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    c.setFillColor(this.stroke);
    c.setStrokeWidth(0);
    const inset = mxUtils.getValue(this.style, mxConstants.STYLE_MARGIN, Math.min(3 + this.strokewidth, Math.min(w / 5, h / 5)));
    x += inset;
    y += inset;
    w -= 2 * inset;
    h -= 2 * inset;

    if (w > 0 && h > 0) {
      c.ellipse(x, y, w, h);
    }

    c.fillAndStroke();
  }
}

export class ThrowIntermediateEventShape extends EventShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  // this implementation is adapted from the draw.io BPMN 'throwing' outlines
  // https://github.com/jgraph/drawio/blob/master/src/main/webapp/shapes/bpmn/mxBpmnShape2.js#L431
  protected paintOuterShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    c.ellipse(x, y, w, h);
    c.fillAndStroke();

    const inset = this.strokewidth * 2;
    c.ellipse(w * 0.02 + inset + x, h * 0.02 + inset + y, w * 0.96 - 2 * inset, h * 0.96 - 2 * inset);
    c.stroke();
  }
}
