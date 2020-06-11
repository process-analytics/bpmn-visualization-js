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
import { StyleConstant } from '../StyleUtils';
import IconPainter, { PaintParameter } from './IconPainter';

const mxRhombus: typeof mxgraph.mxRhombus = MxGraphFactoryService.getMxGraphProperty('mxRhombus');

abstract class GatewayShape extends mxRhombus {
  protected constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected abstract paintInnerShape(paintParameter: PaintParameter): void;

  public paintVertexShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    const paintParameter = IconPainter.buildPaintParameter(c, x, y, w, h, this);
    this.paintOuterShape(paintParameter);
    this.paintInnerShape(paintParameter);
  }

  protected paintOuterShape({ canvas, shape: { x, y, width, height } }: PaintParameter): void {
    super.paintVertexShape(canvas, x, y, width, height);
  }
}

export class ExclusiveGatewayShape extends GatewayShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintInnerShape(paintParameter: PaintParameter): void {
    IconPainter.paintXCrossIcon(paintParameter);
  }
}

export class ParallelGatewayShape extends GatewayShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintInnerShape(paintParameter: PaintParameter): void {
    IconPainter.paintPlusCrossIcon(paintParameter);
  }
}

export class InclusiveGatewayShape extends GatewayShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintInnerShape(paintParameter: PaintParameter): void {
    IconPainter.paintCircleIcon({
      ...paintParameter,
      ratioFromParent: 0.6,
      icon: { ...paintParameter.icon, isFilled: false, strokeWidth: StyleConstant.STROKE_WIDTH_THICK.valueOf() },
    });
  }
}
