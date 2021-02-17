/**
 * Copyright 2021 Bonitasoft S.A.
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
import { mxgraph } from '../initializer';
import { mxAbstractCanvas2D, mxRectangle } from 'mxgraph';
import { buildPaintParameter, IconPainterProvider, PaintParameter } from './render';
import { StyleDefault } from '../StyleUtils';

export class OverlayBadgeShape extends mxgraph.mxText {
  public constructor(value: string, bounds: mxRectangle) {
    super(value, bounds);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.border = 'black';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.background = 'white';
  }
}

export class OverlayBadgeEllipseShape extends mxgraph.mxEllipse {
  protected iconPainter = IconPainterProvider.get();
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintOuterShape({ c, shape: { x, y, w, h } }: PaintParameter): void {
    super.paintVertexShape(c, x, y, w, h);
  }

  public paintVertexShape(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    const paintParameter = buildPaintParameter(c, x, y, w, h, this, 0.25, false);
    this.paintOuterShape(paintParameter);
    this.paintInnerShape(paintParameter);
  }

  protected paintInnerShape(paintParameter: PaintParameter): void {
    this.iconPainter.paintXCrossIcon({
      ...paintParameter,
      icon: { ...paintParameter.icon, isFilled: true },
      ratioFromParent: 0.5,
    });
  }
}
