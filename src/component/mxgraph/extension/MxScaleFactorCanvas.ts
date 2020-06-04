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

/**
 * Scale dimensions passed to the method of the original {@link mxgraph.mxXmlCanvas2D}
 *
 * @example vanilla canvas calls when a scale factor must be applied to positions
 * const scaleFactor = 0.26;
 * c.moveTo(8 * scaleFactor, 39 * scaleFactor);
 * c.lineTo(12 * scaleFactor, 25 * scaleFactor);
 *
 * @example with `MxScaleFactorCanvas`
 * const canvas = new MxScaleFactorCanvas(c, 0.26);
 * canvas.moveTo(8, 39);
 * canvas.lineTo(12, 25);
 */
export default class MxScaleFactorCanvas {
  constructor(private readonly c: mxgraph.mxXmlCanvas2D, readonly scaleFactor: number) {}

  arcTo(rx: number, ry: number, angle: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): void {
    this.c.arcTo(rx * this.scaleFactor, ry * this.scaleFactor, angle, largeArcFlag, sweepFlag, x * this.scaleFactor, y * this.scaleFactor);
  }

  begin(): void {
    this.c.begin();
  }

  close(): void {
    this.c.close();
  }

  curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
    this.c.curveTo(x1 * this.scaleFactor, y1 * this.scaleFactor, x2 * this.scaleFactor, y2 * this.scaleFactor, x3 * this.scaleFactor, y3 * this.scaleFactor);
  }

  fill(): void {
    this.c.fill();
  }

  fillAndStroke(): void {
    this.c.fillAndStroke();
  }

  lineTo(x: number, y: number): void {
    this.c.lineTo(x * this.scaleFactor, y * this.scaleFactor);
  }

  moveTo(x: number, y: number): void {
    this.c.moveTo(x * this.scaleFactor, y * this.scaleFactor);
  }

  rotate(theta: number, flipH: boolean, flipV: boolean, cx: number, cy: number): void {
    this.c.rotate(theta, flipH, flipV, cx, cy);
  }
}

export interface MxCanvasConfiguration {
  dx: number;
  dy: number;
  scale: number;
  alpha: number;
  fillAlpha: number;
  fillColor: any;
  strokeAlpha: number;
  strokeColor: any;
  strokeWidth: number;
  fontColor: string;
  fontBackgroundColor: any;
  fontBorderColor: any;
  fontSize: number;
  fontFamily: string;
  fontStyle: number;
  shadow: boolean;
  shadowColor: string;
  shadowAlpha: number;
  shadowDx: number;
  shadowDy: number;
  gradientFillAlpha: number;
  gradientColor: any;
  gradientAlpha: number;
  gradientDirection: any;
  dashed: boolean;
  dashPattern: string;
  fixDash: boolean;
  lineCap: string;
  lineJoin: string;
  miterLimit: number;
  rotation: number;
  rotationCx: number;
  rotationCy: number;
}

export class MxCanvasUtil {
  public static getConfiguredCanvas(
    canvas: mxgraph.mxXmlCanvas2D,
    parentWidth: number,
    parentHeight: number,
    iconOriginalSize: number,
    fillColor = '#FFF',
    strokeWidth = 1,
  ): MxScaleFactorCanvas {
    canvas.setStrokeWidth(strokeWidth);
    canvas.setFillColor(fillColor);

    const parentSize = Math.min(parentWidth, parentHeight);
    const ratioFromParent = 0.25;
    const scaleFactor = (parentSize / iconOriginalSize) * ratioFromParent;

    return new MxScaleFactorCanvas(canvas, scaleFactor);
  }

  /**
   * Moves canvas cursor to drawing starting point.
   * @param canvas
   * @param parentX
   * @param parentY
   * @param parentWidth
   * @param parentHeight
   * @param positionIndex - helps to define the position of the Icon relatively to top left corner
   */
  public static translateToStartingIconPosition(
    canvas: mxgraph.mxXmlCanvas2D,
    parentX: number,
    parentY: number,
    parentWidth: number,
    parentHeight: number,
    positionIndex: number,
  ): void {
    const xTranslation = parentX + parentWidth / positionIndex;
    const yTranslation = parentY + parentHeight / positionIndex;
    canvas.translate(xTranslation, yTranslation);
  }
}
