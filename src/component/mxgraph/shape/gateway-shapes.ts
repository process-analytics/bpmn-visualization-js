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

const mxRhombus: typeof mxgraph.mxRhombus = MxGraphFactoryService.getMxGraphProperty('mxRhombus');
const mxUtils: typeof mxgraph.mxUtils = MxGraphFactoryService.getMxGraphProperty('mxUtils');
const mxConstants: typeof mxgraph.mxConstants = MxGraphFactoryService.getMxGraphProperty('mxConstants');

abstract class GatewayShape extends mxRhombus {
  protected constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintVertexShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    this.paintOuterShape(c, x, y, w, h);
    this.paintInnerShape(c, x, y, w, h);
  }

  protected paintOuterShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintVertexShape(c, x, y, w, h);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected paintInnerShape(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // do nothing by default
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
    const symbolScale = 3 * mxUtils.getValue(this.style, mxConstants.STYLE_MARGIN, Math.min(3 + this.strokewidth, Math.min(w / 5, h / 5)));
    x += symbolScale;
    y += symbolScale;
    w -= 2 * symbolScale;
    h -= 2 * symbolScale;
    c.setFillColor(this.stroke);
    c.setStrokeWidth(0);

    c.begin();
    c.moveTo(x + w * 0.105, y);
    c.lineTo(x + w * 0.5, y + h * 0.38);
    c.lineTo(x + w * 0.895, y);
    c.lineTo(x + w, y + h * 0.11);
    c.lineTo(x + w * 0.6172, y + h * 0.5);
    c.lineTo(x + w, y + h * 0.89);
    c.lineTo(x + w * 0.895, y + h);
    c.lineTo(x + w * 0.5, y + h * 0.62);
    c.lineTo(x + w * 0.105, y + h);
    c.lineTo(x, y + h * 0.89);
    c.lineTo(x + w * 0.3808, y + h * 0.5);
    c.lineTo(x, y + h * 0.11);
    c.close();

    c.fillAndStroke();
  }
}
