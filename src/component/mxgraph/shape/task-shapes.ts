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
import MxScaleFactorCanvas, { MxCanvasUtil } from '../extension/MxScaleFactorCanvas';

const mxRectangleShape: typeof mxgraph.mxRectangleShape = MxGraphFactoryService.getMxGraphProperty('mxRectangleShape');

abstract class BaseTaskShape extends mxRectangleShape {
  // TODO we need to declare this field here because it is missing in the current mxShape type definition
  isRounded: boolean;

  protected constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
    // enforced by BPMN
    this.isRounded = true;
  }

  public paintForeground(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintForeground(c, x, y, w, h);
    this.paintTaskIcon(c, x, y, w, h);
  }

  protected abstract paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void;
}

export class TaskShape extends BaseTaskShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // No symbol for the BPMN Task
  }
}

export class ServiceTaskShape extends BaseTaskShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  // this implementation is adapted from the draw.io BPMN 'Service Task' stencil
  // https://github.com/jgraph/drawio/blob/9394fb0f1430d2c869865827b2bbef5639f63478/src/main/webapp/stencils/bpmn.xml#L898
  protected paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // icon coordinates fill a 100x100 rectangle (approximately: 90x90 + foreground translation)
    const canvas = MxCanvasUtil.getConfiguredCanvas(c, w, h, 100);
    MxCanvasUtil.translateToStartingIconPosition(c, x, y, w, h, 20);

    // background
    this.drawIconBackground(canvas);

    // foreground
    const foregroundTranslation = 14 * canvas.scaleFactor;
    c.translate(foregroundTranslation, foregroundTranslation);
    this.drawIconForeground(canvas);
  }

  private drawIconBackground(canvas: MxScaleFactorCanvas): void {
    canvas.begin();
    canvas.moveTo(2.06, 24.62);
    canvas.lineTo(10.17, 30.95);
    canvas.lineTo(9.29, 37.73);
    canvas.lineTo(0, 41.42);
    canvas.lineTo(2.95, 54.24);
    canvas.lineTo(13.41, 52.92);
    canvas.lineTo(17.39, 58.52);
    canvas.lineTo(13.56, 67.66);
    canvas.lineTo(24.47, 74.44);
    canvas.lineTo(30.81, 66.33);
    canvas.lineTo(37.88, 67.21);
    canvas.lineTo(41.57, 76.5);
    canvas.lineTo(54.24, 73.55);
    canvas.lineTo(53.06, 62.94);
    canvas.lineTo(58.52, 58.52);
    canvas.lineTo(67.21, 63.09);
    canvas.lineTo(74.58, 51.88);
    canvas.lineTo(66.03, 45.25);
    canvas.lineTo(66.92, 38.62);
    canvas.lineTo(76.5, 34.93);
    canvas.lineTo(73.7, 22.26);
    canvas.lineTo(62.64, 23.44);
    canvas.lineTo(58.81, 18.42);
    canvas.lineTo(62.79, 8.7);
    canvas.lineTo(51.74, 2.21);
    canvas.lineTo(44.81, 10.47);
    canvas.lineTo(38.03, 9.43);
    canvas.lineTo(33.75, 0);
    canvas.lineTo(21.52, 3.24);
    canvas.lineTo(22.7, 13.56);
    canvas.lineTo(18.13, 17.54);
    canvas.lineTo(8.7, 13.56);
    canvas.close();

    const arcStartX = 24.8;
    const arcStartY = 39;
    this.drawInnerCircle(canvas, arcStartX, arcStartY);
  }

  private drawIconForeground(canvas: MxScaleFactorCanvas): void {
    canvas.begin();
    canvas.moveTo(16.46, 41.42);
    canvas.lineTo(24.57, 47.75);
    canvas.lineTo(23.69, 54.53);
    canvas.lineTo(14.4, 58.22);
    canvas.lineTo(17.35, 71.04);
    canvas.lineTo(27.81, 69.72);
    canvas.lineTo(31.79, 75.32);
    canvas.lineTo(27.96, 84.46);
    canvas.lineTo(38.87, 91.24);
    canvas.lineTo(45.21, 83.13);
    canvas.lineTo(52.28, 84.01);
    canvas.lineTo(55.97, 93.3);
    canvas.lineTo(68.64, 90.35);
    canvas.lineTo(67.46, 79.74);
    canvas.lineTo(72.92, 75.32);
    canvas.lineTo(81.61, 79.89);
    canvas.lineTo(88.98, 68.68);
    canvas.lineTo(80.43, 62.05);
    canvas.lineTo(81.32, 55.42);
    canvas.lineTo(90.9, 51.73);
    canvas.lineTo(88.1, 39.06);
    canvas.lineTo(77.04, 40.24);
    canvas.lineTo(73.21, 35.22);
    canvas.lineTo(77.19, 25.5);
    canvas.lineTo(66.14, 19.01);
    canvas.lineTo(59.21, 27.27);
    canvas.lineTo(52.43, 26.23);
    canvas.lineTo(48.15, 16.8);
    canvas.lineTo(35.92, 20.04);
    canvas.lineTo(37.1, 30.36);
    canvas.lineTo(32.53, 34.34);
    canvas.lineTo(23.1, 30.36);
    canvas.close();

    const arcStartX = 39.2;
    const arcStartY = 55.8;
    this.drawInnerCircle(canvas, arcStartX, arcStartY);

    // fill the inner circle to mask the background
    canvas.begin();
    this.drawInnerCircle(canvas, arcStartX, arcStartY);
  }

  private drawInnerCircle(canvas: MxScaleFactorCanvas, arcStartX: number, arcStartY: number): void {
    const arcRay = 13.5;
    canvas.moveTo(arcStartX, arcStartY);
    canvas.arcTo(arcRay, arcRay, 0, 1, 1, arcStartX + 2 * arcRay, arcStartY);
    canvas.arcTo(arcRay, arcRay, 0, 0, 1, arcStartX, arcStartY);
    canvas.close();
    canvas.fillAndStroke();
  }
}

export class UserTaskShape extends BaseTaskShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  // adapted from https://github.com/primer/octicons/blob/638c6683c96ec4b357576c7897be8f19c933c052/icons/person.svg
  // use mxgraph svg2xml to generate the xml stencil and port it to code
  protected paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // icon coordinates fill a 12x13 rectangle
    const canvas = MxCanvasUtil.getConfiguredCanvas(c, w, h, 13);
    MxCanvasUtil.translateToStartingIconPosition(c, x, y, w, h, 20);

    c.setFillColor(this.stroke);
    canvas.begin();
    canvas.moveTo(12, 13);
    canvas.arcTo(1, 1, 0, 0, 1, 11, 14);
    canvas.lineTo(1, 14);
    canvas.arcTo(1, 1, 0, 0, 1, 0, 13);
    canvas.lineTo(0, 12);
    canvas.curveTo(0, 9.37, 4, 8, 4, 8);
    canvas.curveTo(4, 8, 4.23, 8, 4, 8);
    canvas.curveTo(3.16, 6.38, 3.06, 5.41, 3, 3);
    canvas.curveTo(3.17, 0.59, 4.87, 0, 6, 0);
    canvas.curveTo(7.13, 0, 8.83, 0.59, 9, 3);
    canvas.curveTo(8.94, 5.41, 8.84, 6.38, 8, 8);
    canvas.curveTo(8, 8, 12, 9.37, 12, 12);
    canvas.lineTo(12, 13);
    canvas.close();
    canvas.fill();
  }
}
