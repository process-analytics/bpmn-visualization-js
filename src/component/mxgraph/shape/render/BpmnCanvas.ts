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
import { ShapeConfiguration } from '../IconPainter';
import { StyleDefault } from '../../StyleUtils';
import { IconConfiguration, IconStyleConfiguration, Size } from './render-types';

export interface BpmnCanvasConfiguration {
  mxCanvas: mxgraph.mxXmlCanvas2D; // TODO use mxAbstractCanvas2D when fully available in mxgraph-type-definitions
  shapeConfiguration: ShapeConfiguration;
  iconConfiguration: IconConfiguration;
}

/**
 * Wrapper of {@link mxAbstractCanvas2D} to simplify method calls when painting icons/markers of BPMN shapes.
 *
 * It can scale dimensions passed to the method of the original {@link mxgraph.mxXmlCanvas2D}
 *
 * @example vanilla canvas calls when a scale factor must be applied to positions
 * const scaleX = 0.26;
 * const scaleY = 0.35;
 * c.moveTo(8 * scaleX, 39 * scaleY);
 * c.lineTo(12 * scaleX, 25 * scaleY);
 *
 * @example with `BpmnCanvas`
 * const canvas = new BpmnCanvas(c, 0.26, 0.35);
 * canvas.moveTo(8, 39);
 * canvas.lineTo(12, 25);
 */
export default class BpmnCanvas {
  private c: mxgraph.mxXmlCanvas2D; // TODO use mxAbstractCanvas2D when fully available in mxgraph-type-definitions
  private readonly scaleX: number;
  private readonly scaleY: number;

  private iconPaintingOriginX = 0;
  private iconPaintingOriginY = 0;

  private shapeConfiguration: ShapeConfiguration;

  constructor(config: BpmnCanvasConfiguration) {
    this.c = config.mxCanvas;
    this.shapeConfiguration = config.shapeConfiguration; // TODO clone?

    const parentSize = Math.min(this.shapeConfiguration.w, this.shapeConfiguration.h);
    const iconConfiguration = config.iconConfiguration;
    const iconOriginalSize = iconConfiguration.originalSize;
    this.scaleX = (parentSize / iconOriginalSize.width) * iconConfiguration.ratioFromShape;
    this.scaleY = (parentSize / iconOriginalSize.height) * iconConfiguration.ratioFromShape;

    this.updateCanvasStyle(config.iconConfiguration.style);
  }

  /**
   * Set the icon origin from the top left corner of the shape.
   *
   * @param shapePositionIndex proportion of the width/height used to translate the icon origin from the shape origin.
   */
  setIconOriginPosition(shapePositionIndex: number): void {
    const shape = this.shapeConfiguration;
    this.iconPaintingOriginX = shape.x + shape.w / shapePositionIndex;
    this.iconPaintingOriginY = shape.y + shape.h / shapePositionIndex;
  }

  /**
   * Translate the icon origin using the scale factor associated to the horizontal and vertical directions.
   *
   * The values should be given with using the icon original size (as translated values will be scaled as other values passed to method of this class).
   *
   * @param dx the horizontal translation
   * @param dy the vertical translation
   */
  translateIconOrigin(dx: number, dy: number): void {
    this.iconPaintingOriginX += this.scaleX * dx;
    this.iconPaintingOriginY += this.scaleY * dy;
  }

  private computeScaleFromOriginX(x: number): number {
    return this.iconPaintingOriginX + x * this.scaleX;
  }

  private computeScaleFromOriginY(y: number): number {
    return this.iconPaintingOriginY + y * this.scaleY;
  }

  private updateCanvasStyle({ isFilled, strokeColor, fillColor, strokeWidth }: IconStyleConfiguration): void {
    if (isFilled) {
      this.c.setFillColor(strokeColor);
    } else {
      this.c.setFillColor(fillColor);
    }

    this.c.setStrokeWidth(strokeWidth);
  }

  arcTo(rx: number, ry: number, angle: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): void {
    this.c.arcTo(rx * this.scaleX, ry * this.scaleY, angle, largeArcFlag, sweepFlag, this.computeScaleFromOriginX(x), this.computeScaleFromOriginY(y));
  }

  begin(): void {
    this.c.begin();
  }

  close(): void {
    this.c.close();
  }

  curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
    this.c.curveTo(
      this.computeScaleFromOriginX(x1),
      this.computeScaleFromOriginY(y1),
      this.computeScaleFromOriginX(x2),
      this.computeScaleFromOriginY(y2),
      this.computeScaleFromOriginX(x3),
      this.computeScaleFromOriginY(y3),
    );
  }

  fill(): void {
    this.c.fill();
  }

  fillAndStroke(): void {
    this.c.fillAndStroke();
  }

  lineTo(x: number, y: number): void {
    this.c.lineTo(this.computeScaleFromOriginX(x), this.computeScaleFromOriginY(y));
  }

  moveTo(x: number, y: number): void {
    this.c.moveTo(this.computeScaleFromOriginX(x), this.computeScaleFromOriginY(y));
  }

  /**
   * IMPORTANT: the cx and cy parameters (coordinates of the center of the rotation) are relative to the icon origin BUT they are not scaled!
   */
  rotate(theta: number, flipH: boolean, flipV: boolean, cx: number, cy: number): void {
    this.c.rotate(theta, flipH, flipV, this.iconPaintingOriginX + cx, this.iconPaintingOriginY + cy);
  }
}

export class MxCanvasUtil {
  public static translateIconToShapeCenter(c: mxgraph.mxXmlCanvas2D, shape: ShapeConfiguration, iconSize: Size): void {
    // Change the coordinate referential
    const insetW = (shape.w - iconSize.width) / 2;
    const insetH = (shape.h - iconSize.height) / 2;
    c.translate(shape.x + insetW, shape.y + insetH);
  }

  public static translateIconToShapeBottomCenter(canvas: mxgraph.mxXmlCanvas2D, shape: ShapeConfiguration, iconSize: Size): void {
    const insetW = (shape.w - iconSize.width) / 2;
    const insetH = shape.h - iconSize.height - StyleDefault.TASK_SHAPE_BOTTOM_MARGIN;
    canvas.translate(shape.x + insetW, shape.y + insetH);
  }
}
