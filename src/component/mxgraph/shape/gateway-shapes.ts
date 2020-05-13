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

abstract class GatewayShape extends mxRhombus {
  protected constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected abstract paintInnerShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void;

  public paintVertexShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    this.paintOuterShape(c, x, y, w, h);
    this.paintInnerShape(c, x, y, w, h);
  }

  protected paintOuterShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintVertexShape(c, x, y, w, h);
  }

  protected configureCanvasForIcon(c: mxgraph.mxXmlCanvas2D, parentWidth: number, parentHeight: number, iconOriginalSize: number): MxScaleFactorCanvas {
    // ensure we are not impacted by the configured shape stroke width
    c.setStrokeWidth(1);
    c.setFillColor(this.stroke);

    const parentSize = Math.min(parentWidth, parentHeight);
    const ratioFromParent = 0.25;
    const scaleFactor = (parentSize / iconOriginalSize) * ratioFromParent;

    return new MxScaleFactorCanvas(c, scaleFactor);
  }

  protected translateToStartingIconPosition(c: mxgraph.mxXmlCanvas2D, parentX: number, parentY: number, parentWidth: number, parentHeight: number): void {
    const xTranslation = parentX + parentWidth / 4;
    const yTranslation = parentY + parentHeight / 4;
    c.translate(xTranslation, yTranslation);
  }

  protected paintCrossIcon(canvas: MxScaleFactorCanvas): void {
    canvas.begin();
    canvas.moveTo(0.38, 0);
    canvas.lineTo(0.62, 0);
    canvas.lineTo(0.62, 0.38);
    canvas.lineTo(1, 0.38);
    canvas.lineTo(1, 0.62);
    canvas.lineTo(0.62, 0.62);
    canvas.lineTo(0.62, 1);
    canvas.lineTo(0.38, 1);
    canvas.lineTo(0.38, 0.62);
    canvas.lineTo(0, 0.62);
    canvas.lineTo(0, 0.38);
    canvas.lineTo(0.38, 0.38);
    canvas.close();
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
    const canvas = this.configureCanvasForIcon(c, w, h, 0.5);
    this.translateToStartingIconPosition(c, x, y, w, h);
    this.paintCrossIcon(canvas);
    const xRotation = w / 4;
    const yRotation = h / 4;
    canvas.rotate(45, false, false, xRotation, yRotation);
    canvas.fillAndStroke();
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
    const canvas = this.configureCanvasForIcon(c, w, h, 0.5);
    this.translateToStartingIconPosition(c, x, y, w, h);

    this.paintCrossIcon(canvas);
    canvas.fillAndStroke();
  }
}

export class InclusiveGatewayShape extends GatewayShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintInnerShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    this.addInclusiveGatewaySymbol(c, x, y, w, h);
  }

  private addInclusiveGatewaySymbol(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    const canvas = this.configureCanvasForIcon(c, w, h, 0.5);
    this.translateToStartingIconPosition(c, x, y, w, h);
    c.setFillColor(this.fill);
    c.setStrokeWidth(StyleConstant.STROKE_WIDTH_THICK);

    const arcRay = 1 / 6;
    const arcX = 1 / 6;
    const arcY = 1 / 6;
    canvas.begin();
    canvas.moveTo(arcX, arcY);
    canvas.arcTo(arcRay, arcRay, 0, 0, 0, 5 * arcX, 5 * arcY);
    canvas.arcTo(arcRay, arcRay, 0, 0, 0, arcX, arcY);
    canvas.close();

    canvas.fillAndStroke();
  }
}
