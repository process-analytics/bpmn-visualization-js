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
  // when all/more event types will be supported, we could move to a Record/MappedType
  private iconPainters: Map<ShapeBpmnEventKind, (c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number) => void> = new Map([
    [ShapeBpmnEventKind.MESSAGE, (c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number) => this.paintMessageIcon(c, x, y, w, h)],
    [ShapeBpmnEventKind.TERMINATE, (c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number) => this.paintTerminateIcon(c, x, y, w, h)],
  ]);
  protected withFilledIcon = false;

  protected constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintVertexShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    this.markNonFullyRenderedEvents(c);
    this.paintOuterShape(c, x, y, w, h);
    this.paintInnerShape(c, x, y, w, h);
  }

  // This will be removed when managing the render of all events
  private markNonFullyRenderedEvents(c: mxgraph.mxXmlCanvas2D): void {
    const eventKind = this.getBpmnEventKind();
    if (eventKind == ShapeBpmnEventKind.TIMER) {
      c.setFillColor('green');
      c.setFillAlpha(0.3);
    }
  }

  protected paintOuterShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintVertexShape(c, x, y, w, h);
  }

  protected paintInnerShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    const paintIcon =
      this.iconPainters.get(this.getBpmnEventKind()) || ((c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number) => this.paintEmptyIcon(c, x, y, w, h));
    paintIcon(c, x, y, w, h);
  }

  private getBpmnEventKind(): ShapeBpmnEventKind {
    return mxUtils.getValue(this.style, StyleConstant.BPMN_STYLE_EVENT_KIND, ShapeBpmnEventKind.NONE);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private paintEmptyIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // empty by nature
  }

  // this implementation is adapted from the draw.io BPMN 'message' symbol
  // https://github.com/jgraph/drawio/blob/0e19be6b42755790a749af30450c78c0d83be765/src/main/webapp/shapes/bpmn/mxBpmnShape2.js#L465
  private paintMessageIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    const isInverse = this.withFilledIcon;
    // Change the coordinate referential
    c.translate(x + w * 0.24, y + h * 0.34);
    w = w * 0.52;
    h = h * 0.32;

    // Paint
    const fc = mxUtils.getValue(this.style, 'fillColor', '#ffffff');
    const sc = mxUtils.getValue(this.style, 'strokeColor', '#000000');

    // Choose dark color for the envelope outline
    c.setStrokeWidth('inherit');
    c.setStrokeColor(sc);

    if (isInverse) {
      // Choose dark color for the envelope background
      c.setFillColor(sc);
    } else {
      // Choose light color for the envelope background
      c.setFillColor(fc);
    }

    // Paint the envelope outline
    c.rect(0, 0, w, h);
    c.fillAndStroke();

    if (isInverse) {
      // Choose light color for envelope closure
      c.setStrokeColor(fc);
    }

    // Paint the envelope closure
    c.begin();

    // V line
    c.moveTo(0, 0);
    c.lineTo(w * 0.5, h * 0.6);
    c.lineTo(w, 0);

    // First bottom line
    c.moveTo(0, h);
    c.lineTo(w / 3, h * 0.5);

    // Second bottom line
    c.moveTo(w, h);
    c.lineTo((w * 2) / 3, h * 0.5);

    c.stroke();
  }

  // highly inspired from mxDoubleEllipse
  private paintTerminateIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
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

export class StartEventShape extends EventShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }
}

export class EndEventShape extends EventShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THICK) {
    super(bounds, fill, stroke, strokewidth);
    this.withFilledIcon = true;
  }
}

abstract class IntermediateEventShape extends EventShape {
  protected constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  // this implementation is adapted from the draw.io BPMN 'throwing' outlines
  // https://github.com/jgraph/drawio/blob/0e19be6b42755790a749af30450c78c0d83be765/src/main/webapp/shapes/bpmn/mxBpmnShape2.js#L431
  protected paintOuterShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    c.ellipse(x, y, w, h);
    c.fillAndStroke();

    const inset = this.strokewidth * 1.5;
    c.ellipse(w * 0.02 + inset + x, h * 0.02 + inset + y, w * 0.96 - 2 * inset, h * 0.96 - 2 * inset);
    c.stroke();
  }
}

export class CatchIntermediateEventShape extends IntermediateEventShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth?: number) {
    super(bounds, fill, stroke, strokewidth);
  }
}

export class ThrowIntermediateEventShape extends IntermediateEventShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth?: number) {
    super(bounds, fill, stroke, strokewidth);
    this.withFilledIcon = true;
  }
}
