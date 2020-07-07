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
import { IconConfiguration, Size } from './render-types';

export interface BpmnCanvasConfiguration {
  mxCanvas: mxgraph.mxXmlCanvas2D; // TODO use mxAbstractCanvas2D when fully available in mxgraph-type-definitions
  shapeConfiguration: ShapeConfiguration;
  iconConfiguration: IconConfiguration;
}

/**
 * Scale dimensions passed to the method of the original {@link mxgraph.mxXmlCanvas2D}
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

  constructor(config: BpmnCanvasConfiguration) {
    this.c = config.mxCanvas;
    const parentSize = Math.min(config.shapeConfiguration.w, config.shapeConfiguration.h);

    const iconConfiguration = config.iconConfiguration;
    const iconOriginalSize = iconConfiguration.originalSize;
    this.scaleX = (parentSize / iconOriginalSize.width) * iconConfiguration.ratioFromShape;
    this.scaleY = (parentSize / iconOriginalSize.height) * iconConfiguration.ratioFromShape;
  }

  arcTo(rx: number, ry: number, angle: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): void {
    this.c.arcTo(rx * this.scaleX, ry * this.scaleY, angle, largeArcFlag, sweepFlag, x * this.scaleX, y * this.scaleY);
  }

  begin(): void {
    this.c.begin();
  }

  close(): void {
    this.c.close();
  }

  curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
    this.c.curveTo(x1 * this.scaleX, y1 * this.scaleY, x2 * this.scaleX, y2 * this.scaleY, x3 * this.scaleX, y3 * this.scaleY);
  }

  fill(): void {
    this.c.fill();
  }

  fillAndStroke(): void {
    this.c.fillAndStroke();
  }

  lineTo(x: number, y: number): void {
    this.c.lineTo(x * this.scaleX, y * this.scaleY);
  }

  moveTo(x: number, y: number): void {
    this.c.moveTo(x * this.scaleX, y * this.scaleY);
  }

  rotate(theta: number, flipH: boolean, flipV: boolean, cx: number, cy: number): void {
    this.c.rotate(theta, flipH, flipV, cx, cy);
  }

  translate(dx: number, dy: number): void {
    this.c.translate(this.scaleX * dx, this.scaleY * dy);
  }
}

export class MxCanvasUtil {
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
