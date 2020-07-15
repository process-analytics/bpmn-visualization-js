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
import { StyleDefault } from '../../StyleUtils';
import { IconConfiguration, IconStyleConfiguration, ShapeConfiguration, Size } from './render-types';

export interface BpmnCanvasConfiguration {
  mxCanvas: mxAbstractCanvas2D;
  shapeConfiguration: ShapeConfiguration;
  iconConfiguration: IconConfiguration;
}

/**
 * Wrapper of {@link mxAbstractCanvas2D} to simplify method calls when painting icons/markers of BPMN shapes.
 *
 * It can scale dimensions passed to the method of the original {@link mxAbstractCanvas2D}
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
  private c: mxAbstractCanvas2D;

  private iconOriginalSize: Size;
  private readonly scaleX: number;
  private readonly scaleY: number;

  private iconPaintingOriginX = 0;
  private iconPaintingOriginY = 0;

  private readonly shapeConfiguration: ShapeConfiguration;

  constructor(config: BpmnCanvasConfiguration) {
    this.c = config.mxCanvas;
    this.shapeConfiguration = config.shapeConfiguration; // TODO clone?

    const iconConfiguration = config.iconConfiguration;
    this.iconOriginalSize = iconConfiguration.originalSize;

    const ratioFromShape = iconConfiguration.ratioFromShape;
    if (ratioFromShape) {
      if (!iconConfiguration.computeAlternateScaling) {
        const parentSize = Math.min(this.shapeConfiguration.w, this.shapeConfiguration.h);
        this.scaleX = (parentSize / this.iconOriginalSize.width) * ratioFromShape;
        this.scaleY = (parentSize / this.iconOriginalSize.height) * ratioFromShape;
      } else {
        const scaledIconSize = BpmnCanvas.computeScaledIconSize(this.iconOriginalSize, iconConfiguration.style, this.shapeConfiguration, ratioFromShape);
        this.scaleX = scaledIconSize.width / this.iconOriginalSize.width;
        this.scaleY = scaledIconSize.height / this.iconOriginalSize.height;
      }
    } else {
      this.scaleX = 1;
      this.scaleY = 1;
    }

    this.updateCanvasStyle(config.iconConfiguration.style);
  }

  // TODO taken from IconPainter, temp solution before merging with the existing scaling function
  private static computeScaledIconSize(initialIconSize: Size, icon: IconStyleConfiguration, shape: ShapeConfiguration, ratioFromParent: number): Size {
    // Compute the icon size proportionally to the shape size
    // (the longest side of the icon has the same value of the same side of the shape)
    let iconWidthProportionalToShape;
    let iconHeightProportionalToShape;
    if (initialIconSize.height <= initialIconSize.width) {
      iconWidthProportionalToShape = shape.w;
      iconHeightProportionalToShape = (shape.w * initialIconSize.height) / initialIconSize.width;
    } else {
      iconWidthProportionalToShape = (shape.h * initialIconSize.width) / initialIconSize.height;
      iconHeightProportionalToShape = shape.h;
    }

    // Calculate icon size proportionally to the ratio define in the shape
    const inset = icon.strokeWidth ? (icon.strokeWidth - 1) * 2 : 0;
    const paintIconWidth = iconWidthProportionalToShape * ratioFromParent - inset;
    const paintIconHeight = iconHeightProportionalToShape * ratioFromParent - inset;
    return { width: paintIconWidth, height: paintIconHeight };
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

  setIconOriginToShapeCenter(): void {
    const shape = this.shapeConfiguration;
    // TODO manage scaling (will be done later with another refactoring)
    this.iconPaintingOriginX = shape.x + (shape.w - this.iconOriginalSize.width * this.scaleX) / 2;
    this.iconPaintingOriginY = shape.y + (shape.h - this.iconOriginalSize.height * this.scaleY) / 2;
  }

  setIconOriginToShapeBottomCenter(bottomMargin: number = StyleDefault.SHAPE_ACTIVITY_BOTTOM_MARGIN): void {
    const shape = this.shapeConfiguration;
    // TODO manage scaling (will be done later with another refactoring)
    this.iconPaintingOriginX = shape.x + (shape.w - this.iconOriginalSize.width) / 2;
    this.iconPaintingOriginY = shape.y + (shape.h - this.iconOriginalSize.height - bottomMargin);
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

  stroke(): void {
    this.c.stroke();
  }

  setStrokeColor(color: string): void {
    this.c.setStrokeColor(color);
  }

  lineTo(x: number, y: number): void {
    this.c.lineTo(this.computeScaleFromOriginX(x), this.computeScaleFromOriginY(y));
  }

  moveTo(x: number, y: number): void {
    this.c.moveTo(this.computeScaleFromOriginX(x), this.computeScaleFromOriginY(y));
  }

  rect(x: number, y: number, w: number, h: number): void {
    this.c.rect(this.computeScaleFromOriginX(x), this.computeScaleFromOriginY(y), w * this.scaleX, h * this.scaleY);
  }

  roundrect(x: number, y: number, w: number, h: number, dx: number, dy: number): void {
    this.c.roundrect(this.computeScaleFromOriginX(x), this.computeScaleFromOriginY(y), w * this.scaleX, h * this.scaleY, dx, dy);
  }

  ellipse(x: number, y: number, w: number, h: number): void {
    this.c.ellipse(this.computeScaleFromOriginX(x), this.computeScaleFromOriginY(y), w * this.scaleX, h * this.scaleY);
  }

  /**
   * IMPORTANT: the cx and cy parameters (coordinates of the center of the rotation) are relative to the icon origin BUT they are not scaled!
   */
  rotate(theta: number, flipH: boolean, flipV: boolean, cx: number, cy: number): void {
    this.c.rotate(theta, flipH, flipV, this.iconPaintingOriginX + cx, this.iconPaintingOriginY + cy);
  }
}
