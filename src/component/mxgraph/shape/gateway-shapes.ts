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
import MxScaleFactorCanvas from '../extension/MxScaleFactorCanvas';

const mxRhombus: typeof mxgraph.mxRhombus = MxGraphFactoryService.getMxGraphProperty('mxRhombus');
const mxUtils: typeof mxgraph.mxUtils = MxGraphFactoryService.getMxGraphProperty('mxUtils');
const mxConstants: typeof mxgraph.mxConstants = MxGraphFactoryService.getMxGraphProperty('mxConstants');

abstract class GatewayShape extends mxRhombus {
  protected constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected abstract paintInnerShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void;

  public paintVertexShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    this.paintOuterShape(c, x, y, w, h);
    c.setFillColor(this.stroke);
    c.setStrokeWidth(0);
    this.paintInnerShape(c, x, y, w, h);
  }

  protected paintOuterShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintVertexShape(c, x, y, w, h);
  }

  // TODO: will be removed when exclusive gateway will use MXScaleFactorCanvas
  protected getScaledGeometry(x: number, y: number, w: number, h: number): { xS: number; yS: number; wS: number; hS: number } {
    const symbolScale = this.getInnerSymbolScale(w, h);
    return {
      xS: x + symbolScale,
      yS: y + symbolScale,
      wS: w - 2 * symbolScale,
      hS: h - 2 * symbolScale,
    };
  }

  // TODO: will be removed when exclusive gateway will use MXScaleFactorCanvas
  private getInnerSymbolScale(w: number, h: number): number {
    return 3 * mxUtils.getValue(this.style, mxConstants.STYLE_MARGIN, Math.min(3 + this.strokewidth, Math.min(w / 5, h / 5)));
  }

  protected configureCanvasForIcon(c: mxgraph.mxXmlCanvas2D, parentWidth: number, parentHeight: number, iconOriginalSize: number): MxScaleFactorCanvas {
    // ensure we are not impacted by the configured shape stroke width
    c.setStrokeWidth(1);

    const parentSize = Math.min(parentWidth, parentHeight);
    const ratioFromParent = 0.25;
    const scaleFactor = iconOriginalSize !== 0 ? (parentSize / iconOriginalSize) * ratioFromParent : 0.5;

    return new MxScaleFactorCanvas(c, scaleFactor);
  }

  protected translateToStartingIconPosition(c: mxgraph.mxXmlCanvas2D, parentX: number, parentY: number, parentWidth: number, parentHeight: number): void {
    const xTranslation = parentX + parentWidth / 4;
    const yTranslation = parentY + parentHeight / 4;
    c.translate(xTranslation, yTranslation);
  }
}

export class ExclusiveGatewayShape extends GatewayShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintInnerShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    this.addExclusiveGatewaySymbol(c, x, y, w, h);
  }

  private addExclusiveGatewaySymbol(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    const { xS, yS, wS, hS } = this.getScaledGeometry(x, y, w, h);

    c.begin();
    c.moveTo(xS + wS * 0.105, yS);
    c.lineTo(xS + wS * 0.5, yS + hS * 0.38);
    c.lineTo(xS + wS * 0.895, yS);
    c.lineTo(xS + wS, yS + hS * 0.11);
    c.lineTo(xS + wS * 0.6172, yS + hS * 0.5);
    c.lineTo(xS + wS, yS + hS * 0.89);
    c.lineTo(xS + wS * 0.895, yS + hS);
    c.lineTo(xS + wS * 0.5, yS + hS * 0.62);
    c.lineTo(xS + wS * 0.105, yS + hS);
    c.lineTo(xS, yS + hS * 0.89);
    c.lineTo(xS + wS * 0.3808, yS + hS * 0.5);
    c.lineTo(xS, yS + hS * 0.11);
    c.close();

    c.fillAndStroke();
  }
}

export class ParallelGatewayShape extends GatewayShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintInnerShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    this.addParallelGatewaySymbol(c, x, y, w, h);
  }

  private addParallelGatewaySymbol(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    const canvas = this.configureCanvasForIcon(c, w, h, 0);
    this.translateToStartingIconPosition(c, x, y, w, h);

    canvas.begin();
    canvas.moveTo(w * 0.38, 0);
    canvas.lineTo(w * 0.62, 0);
    canvas.lineTo(w * 0.62, h * 0.38);
    canvas.lineTo(w, h * 0.38);
    canvas.lineTo(w, h * 0.62);
    canvas.lineTo(w * 0.62, h * 0.62);
    canvas.lineTo(w * 0.62, h);
    canvas.lineTo(w * 0.38, h);
    canvas.lineTo(w * 0.38, h * 0.62);
    canvas.lineTo(0, h * 0.62);
    canvas.lineTo(0, h * 0.38);
    canvas.lineTo(w * 0.38, h * 0.38);
    canvas.close();

    canvas.fillAndStroke();
  }
}
