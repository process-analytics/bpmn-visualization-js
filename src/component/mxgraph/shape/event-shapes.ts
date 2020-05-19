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
import MxScaleFactorCanvas from '../extension/MxScaleFactorCanvas';

const mxEllipse: typeof mxgraph.mxEllipse = MxGraphFactoryService.getMxGraphProperty('mxEllipse');
const mxUtils: typeof mxgraph.mxUtils = MxGraphFactoryService.getMxGraphProperty('mxUtils');
const mxConstants: typeof mxgraph.mxConstants = MxGraphFactoryService.getMxGraphProperty('mxConstants');

abstract class EventShape extends mxEllipse {
  // when all/more event types will be supported, we could move to a Record/MappedType
  private iconPainters: Map<ShapeBpmnEventKind, (c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number) => void> = new Map([
    [ShapeBpmnEventKind.MESSAGE, (c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number) => this.paintMessageIcon(c, x, y, w, h)],
    [ShapeBpmnEventKind.TERMINATE, (c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number) => this.paintTerminateIcon(c, x, y, w, h)],
    [ShapeBpmnEventKind.TIMER, (c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number) => this.paintTimerIcon(c, x, y, w, h)],
  ]);
  protected withFilledIcon = false;

  protected constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintVertexShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // This will be removed after implementation of all supported events
    // this.markNonFullyRenderedEvents(c);
    this.paintOuterShape(c, x, y, w, h);
    this.paintInnerShape(c, x, y, w, h);
  }

  // This will be removed after implementation of all supported events
  // private markNonFullyRenderedEvents(c: mxgraph.mxXmlCanvas2D): void {
  //   const eventKind = this.getBpmnEventKind();
  //   if (eventKind == ShapeBpmnEventKind.TIMER) {
  //     c.setFillColor('green');
  //     c.setFillAlpha(0.3);
  //   }
  // }

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

  // implementation adapted from https://www.flaticon.com/free-icon/clock_223404
  private paintTimerIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    const canvas = this.configureCanvasForIcon(c, w, h, 152);
    this.translateToStartingIconPosition(c, x, y, w, h);
    c.setFillColor(this.fill);
    c.setStrokeWidth(0);

    canvas.begin();
    canvas.moveTo(184, 60);
    canvas.curveTo(188.4, 60, 192, 56.4, 192, 52);
    canvas.lineTo(192, 48);
    canvas.curveTo(192, 40, 188.4, 40, 184, 40);
    canvas.curveTo(179.6, 40, 176, 43.6, 176, 48);
    canvas.lineTo(176, 52);
    canvas.curveTo(176, 56.4, 179.6, 60, 184, 60);
    canvas.close();

    canvas.moveTo(184, 308);
    canvas.curveTo(179.6, 308, 176, 311.6, 176, 316);
    canvas.lineTo(176, 320);
    canvas.curveTo(176, 324.4, 179.6, 328, 184, 328);
    canvas.curveTo(188.4, 328, 192, 324.4, 192, 320);
    canvas.lineTo(192, 316);
    canvas.curveTo(192, 311.6, 188.4, 308, 184, 308);
    canvas.close();

    canvas.moveTo(52, 176);
    canvas.lineTo(48, 176);
    canvas.curveTo(43.6, 176, 40, 179.6, 40, 184);
    canvas.curveTo(40, 188.4, 43.6, 192, 48, 192);
    canvas.lineTo(52, 192);
    canvas.curveTo(56.4, 192, 69, 188.4, 60, 184);
    canvas.curveTo(60, 179.6, 56.4, 176, 52, 176);
    canvas.close();

    canvas.moveTo(320, 176);
    canvas.lineTo(316, 176);
    canvas.curveTo(311.6, 176, 308, 179.6, 308, 184);
    canvas.curveTo(308, 188.4, 311.6, 192, 316, 192);
    canvas.lineTo(320, 192);
    canvas.curveTo(324.4, 192, 328, 188.4, 328, 184);
    canvas.curveTo(328, 179.6, 324.4, 176, 320, 176);

    canvas.moveTo(93.6, 82.4);
    canvas.curveTo(90.4, 79.2, 85.6, 79.2, 82.4, 82.4);
    canvas.curveTo(79.2, 85.6, 79.2, 90.4, 82.4, 93.6);
    canvas.lineTo(85.2, 96.4);
    canvas.curveTo(86.8, 98, 88.8, 98.8, 90.8, 98.8);
    canvas.curveTo(92.8, 98.8, 94.4, 98, 96.4, 96.4);
    canvas.curveTo(99.6, 93.2, 99.6, 88.4, 96.4, 85.2);
    canvas.lineTo(93.6, 82.4);

    canvas.moveTo(85.2, 271.6);
    canvas.lineTo(82.4, 274.4);
    canvas.curveTo(79.2, 277.6, 79.2, 282.4, 82.4, 285.6);
    canvas.curveTo(84, 287.2, 86, 288, 88, 288);
    canvas.curveTo(90, 288, 92, 287.2, 93.6, 285.6);
    canvas.lineTo(96.4, 282.8);
    canvas.curveTo(99.6, 279.6, 99.6, 274.8, 96.4, 271.6);
    canvas.curveTo(93.2, 268.4, 88.4, 268.4, 85.2, 271.6);

    canvas.moveTo(274.4, 82.4);
    canvas.lineTo(271.6, 85.2);
    canvas.curveTo(268.4, 88.4, 268.4, 93.2, 271.6, 96.4);
    canvas.curveTo(273.298, 98, 275.2, 98.8, 277.2, 98.8);
    canvas.curveTo(279.2, 98.8, 281.2, 98, 282.8, 96.4);
    canvas.lineTo(285.6, 93.6);
    canvas.curveTo(288.8, 90.4, 288.8, 85.6, 285.6, 82.4);
    canvas.curveTo(282.4, 79.2, 277.6, 79.2, 274.4, 82.4);

    canvas.moveTo(192, 180.8);
    canvas.lineTo(192, 108);
    canvas.curveTo(192, 103.6, 188.4, 100, 184, 100);
    canvas.curveTo(179.6, 100, 176, 103.6, 176, 108);
    canvas.lineTo(176, 184);
    canvas.curveTo(176, 186, 176.8, 188, 178.4, 189.6);
    canvas.lineTo(266, 277.2);
    canvas.curveTo(267.6, 278.8, 269.6, 279.6, 271.6, 279.6);
    canvas.curveTo(273.6, 279.6, 275.6, 278.8, 277.2, 277.2);
    canvas.curveTo(280.4, 274, 280.4, 269.2, 277.2, 266);
    canvas.lineTo(192, 180.8);

    canvas.moveTo(184, 0);
    canvas.curveTo(82.4, 0, 0, 82.4, 0, 184);
    canvas.curveTo(0, 285.6, 82.4, 368, 184, 368);
    canvas.curveTo(285.6, 368, 368, 285.6, 368, 184);
    canvas.curveTo(368, 82.4, 285.6, 0, 184, 0);

    canvas.moveTo(184, 352);
    canvas.curveTo(91.2, 352, 16, 276.8, 16, 184);
    canvas.curveTo(16, 91.2, 91.2, 16, 184, 16);
    canvas.curveTo(276.8, 16, 352, 91.2, 352, 184);
    canvas.curveTo(352, 276.8, 276.8, 352, 184, 352);

    canvas.fillAndStroke();
  }

  protected configureCanvasForIcon(c: mxgraph.mxXmlCanvas2D, parentWidth: number, parentHeight: number, iconOriginalSize: number): MxScaleFactorCanvas {
    c.setStrokeWidth(1);
    c.setFillColor(this.stroke);

    const parentSize = Math.min(parentWidth, parentHeight);
    const ratioFromParent = 0.25;
    const scaleFactor = (parentSize / iconOriginalSize) * ratioFromParent;

    return new MxScaleFactorCanvas(c, scaleFactor);
  }

  protected translateToStartingIconPosition(c: mxgraph.mxXmlCanvas2D, parentX: number, parentY: number, parentWidth: number, parentHeight: number): void {
    const xTranslation = parentX + parentWidth / 5;
    const yTranslation = parentY + parentHeight / 5;
    c.translate(xTranslation, yTranslation);
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
