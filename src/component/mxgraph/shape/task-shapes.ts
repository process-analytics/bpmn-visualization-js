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

  protected translateToStartingIconPosition(c: mxgraph.mxXmlCanvas2D, parentX: number, parentY: number, parentWidth: number, parentHeight: number): void {
    const xTranslation = parentX + parentWidth / 20;
    const yTranslation = parentY + parentHeight / 20;
    c.translate(xTranslation, yTranslation);
  }

  protected configureCanvasForIcon(c: mxgraph.mxXmlCanvas2D, parentWidth: number, parentHeight: number, iconOriginalSize: number): MxScaleFactorCanvas {
    // ensure we are not impacted by the configured shape stroke width
    c.setStrokeWidth(1);

    const parentSize = Math.min(parentWidth, parentHeight);
    const ratioFromParent = 0.25;
    const scaleFactor = (parentSize / iconOriginalSize) * ratioFromParent;

    return new MxScaleFactorCanvas(c, scaleFactor);
  }
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
    const canvas = this.configureCanvasForIcon(c, w, h, 100);
    this.translateToStartingIconPosition(c, x, y, w, h);

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
    // // icon coordinates fill a 12x13 rectangle
    // const canvas = this.configureCanvasForIcon(c, w, h, 13);
    // this.translateToStartingIconPosition(c, x, y, w, h);
    //
    // c.setFillColor(this.stroke);
    // canvas.begin();
    // canvas.moveTo(12, 13);
    // canvas.arcTo(1, 1, 0, 0, 1, 11, 14);
    // canvas.lineTo(1, 14);
    // canvas.arcTo(1, 1, 0, 0, 1, 0, 13);
    // canvas.lineTo(0, 12);
    // canvas.curveTo(0, 9.37, 4, 8, 4, 8);
    // canvas.curveTo(4, 8, 4.23, 8, 4, 8);
    // canvas.curveTo(3.16, 6.38, 3.06, 5.41, 3, 3);
    // canvas.curveTo(3.17, 0.59, 4.87, 0, 6, 0);
    // canvas.curveTo(7.13, 0, 8.83, 0.59, 9, 3);
    // canvas.curveTo(8.94, 5.41, 8.84, 6.38, 8, 8);
    // canvas.curveTo(8, 8, 12, 9.37, 12, 12);
    // canvas.lineTo(12, 13);
    // canvas.close();
    // canvas.fill();

    this.paintWoman(c, x, y, w, h);
  }

  private paintWoman(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // icon coordinates fill a 40x46 rectangle
    const canvas = this.configureCanvasForIcon(c, w, h, 46);
    this.translateToStartingIconPosition(c, x, y, w, h);

    canvas.begin();
    canvas.moveTo(19.87, 0);
    canvas.curveTo(11.98, 0, 5.55, 6.42, 5.55, 14.32);
    canvas.lineTo(5.55, 18.4);
    canvas.curveTo(5.55, 27.16, 3.64, 31.16, 3.62, 31.2);
    canvas.curveTo(3.48, 31.47, 3.47, 31.8, 3.6, 32.08);
    canvas.curveTo(3.72, 32.37, 3.97, 32.58, 4.27, 32.67);
    canvas.curveTo(4.32, 32.69, 8.74, 33.98, 12.13, 35.09);
    canvas.lineTo(4.53, 38.58);
    canvas.curveTo(1.89, 39.79, 0.15, 42.4, 0, 45.26);
    canvas.curveTo(0.12, 45.26, 0.23, 45.26, 0.35, 45.26);
    canvas.curveTo(0.39, 45.26, 0.43, 45.26, 0.46, 45.26);
    canvas.curveTo(0.56, 45.23, 0.67, 45.2, 0.81, 45.19);
    canvas.curveTo(1.02, 45.18, 1.24, 45.2, 1.44, 45.25);
    canvas.curveTo(1.62, 45.27, 1.68, 45.27, 1.9, 45.26);
    canvas.curveTo(1.97, 45.26, 2.04, 45.26, 2.1, 45.26);
    canvas.curveTo(2.18, 44.2, 2.55, 43.2, 3.16, 42.35);
    canvas.lineTo(5.49, 45.16);
    canvas.curveTo(5.49, 45.16, 5.5, 45.16, 5.5, 45.16);
    canvas.curveTo(5.76, 45.17, 6.02, 45.15, 6.28, 45.15);
    canvas.curveTo(6.61, 45.15, 6.94, 45.15, 7.28, 45.15);
    canvas.curveTo(7.53, 45.17, 7.78, 45.13, 8.03, 45.15);
    canvas.curveTo(8.08, 45.16, 8.13, 45.17, 8.18, 45.18);
    canvas.curveTo(8.01, 44.92, 7.83, 44.68, 7.63, 44.44);
    canvas.lineTo(4.67, 40.89);
    canvas.curveTo(4.9, 40.74, 5.15, 40.6, 5.4, 40.49);
    canvas.lineTo(10.44, 38.18);
    canvas.curveTo(11.87, 42.09, 15.62, 44.75, 19.85, 44.75);
    canvas.curveTo(24.1, 44.75, 27.83, 42.09, 29.27, 38.18);
    canvas.lineTo(34.3, 40.49);
    canvas.curveTo(34.55, 40.6, 34.8, 40.74, 35.03, 40.89);
    canvas.lineTo(32.07, 44.44);
    canvas.curveTo(31.75, 44.82, 31.48, 45.22, 31.24, 45.65);
    canvas.curveTo(31.24, 45.65, 31.25, 45.64, 31.25, 45.64);
    canvas.lineTo(31.3, 45.64);
    canvas.lineTo(31.46, 45.64);
    canvas.curveTo(31.53, 45.64, 31.61, 45.64, 31.68, 45.64);
    canvas.curveTo(31.73, 45.64, 31.78, 45.64, 31.83, 45.64);
    canvas.curveTo(31.88, 45.64, 31.93, 45.64, 31.97, 45.64);
    canvas.curveTo(32.01, 45.65, 32.04, 45.64, 32.08, 45.64);
    canvas.curveTo(32.08, 45.64, 32.08, 45.64, 32.09, 45.64);
    canvas.curveTo(32.1, 45.64, 32.1, 45.64, 32.1, 45.64);
    canvas.curveTo(32.11, 45.64, 32.12, 45.64, 32.13, 45.64);
    canvas.curveTo(32.13, 45.64, 32.15, 45.65, 32.16, 45.65);
    canvas.curveTo(32.18, 45.65, 32.21, 45.64, 32.23, 45.64);
    canvas.curveTo(32.24, 45.64, 32.26, 45.64, 32.27, 45.64);
    canvas.curveTo(32.27, 45.64, 32.28, 45.64, 32.28, 45.64);
    canvas.curveTo(32.29, 45.64, 32.3, 45.64, 32.31, 45.64);
    canvas.curveTo(32.34, 45.64, 32.37, 45.64, 32.4, 45.64);
    canvas.curveTo(32.43, 45.64, 32.46, 45.64, 32.49, 45.64);
    canvas.curveTo(32.5, 45.64, 32.49, 45.63, 32.5, 45.62);
    canvas.curveTo(32.5, 45.62, 32.5, 45.62, 32.49, 45.62);
    canvas.curveTo(32.49, 45.63, 32.5, 45.62, 32.51, 45.61);
    canvas.lineTo(32.51, 45.61);
    canvas.curveTo(32.52, 45.6, 32.51, 45.59, 32.52, 45.59);
    canvas.curveTo(32.54, 45.57, 32.58, 45.59, 32.61, 45.59);
    canvas.curveTo(32.62, 45.6, 32.63, 45.6, 32.65, 45.6);
    canvas.curveTo(32.65, 45.6, 32.65, 45.6, 32.66, 45.6);
    canvas.curveTo(32.68, 45.59, 32.71, 45.59, 32.74, 45.59);
    canvas.curveTo(32.75, 45.6, 32.81, 45.61, 32.81, 45.62);
    canvas.curveTo(32.81, 45.63, 32.79, 45.62, 32.79, 45.62);
    canvas.curveTo(32.8, 45.62, 32.8, 45.62, 32.81, 45.62);
    canvas.curveTo(32.82, 45.62, 32.84, 45.62, 32.84, 45.62);
    canvas.curveTo(32.84, 45.62, 32.85, 45.62, 32.85, 45.62);
    canvas.curveTo(32.87, 45.62, 32.88, 45.61, 32.89, 45.61);
    canvas.curveTo(32.95, 45.6, 33.03, 45.63, 33.09, 45.64);
    canvas.curveTo(33.13, 45.64, 33.17, 45.65, 33.22, 45.65);
    canvas.curveTo(33.27, 45.65, 33.31, 45.64, 33.36, 45.64);
    canvas.curveTo(33.37, 45.64, 33.37, 45.65, 33.37, 45.65);
    canvas.curveTo(33.4, 45.65, 33.44, 45.64, 33.47, 45.64);
    canvas.curveTo(33.48, 45.65, 33.49, 45.64, 33.5, 45.64);
    canvas.curveTo(33.5, 45.65, 33.51, 45.65, 33.51, 45.65);
    canvas.curveTo(33.51, 45.65, 33.52, 45.65, 33.52, 45.64);
    canvas.curveTo(33.58, 45.63, 33.64, 45.65, 33.69, 45.65);
    canvas.curveTo(33.7, 45.65, 33.71, 45.65, 33.72, 45.65);
    canvas.curveTo(33.74, 45.65, 33.75, 45.64, 33.76, 45.64);
    canvas.curveTo(33.78, 45.63, 33.8, 45.63, 33.81, 45.62);
    canvas.curveTo(33.82, 45.62, 33.82, 45.62, 33.82, 45.62);
    canvas.lineTo(36.54, 42.35);
    canvas.curveTo(37.22, 43.29, 37.6, 44.43, 37.61, 45.62);
    canvas.curveTo(37.62, 45.62, 37.62, 45.62, 37.62, 45.62);
    canvas.curveTo(37.65, 45.62, 37.67, 45.62, 37.7, 45.62);
    canvas.curveTo(37.7, 45.63, 37.71, 45.63, 37.72, 45.63);
    canvas.curveTo(37.75, 45.64, 37.77, 45.64, 37.8, 45.64);
    canvas.curveTo(37.85, 45.65, 37.9, 45.65, 37.95, 45.64);
    canvas.curveTo(38.02, 45.64, 38.09, 45.65, 38.17, 45.65);
    canvas.curveTo(38.21, 45.65, 38.26, 45.63, 38.3, 45.62);
    canvas.curveTo(38.36, 45.61, 38.41, 45.62, 38.46, 45.62);
    canvas.curveTo(38.47, 45.62, 38.47, 45.62, 38.48, 45.63);
    canvas.curveTo(38.49, 45.63, 38.49, 45.62, 38.49, 45.63);
    canvas.curveTo(38.49, 45.63, 38.48, 45.64, 38.49, 45.63);
    canvas.curveTo(38.49, 45.63, 38.5, 45.63, 38.51, 45.62);
    canvas.curveTo(38.54, 45.61, 38.56, 45.61, 38.59, 45.6);
    canvas.lineTo(38.73, 45.6);
    canvas.curveTo(38.78, 45.6, 38.82, 45.6, 38.87, 45.6);
    canvas.curveTo(38.92, 45.6, 38.98, 45.6, 39.04, 45.6);
    canvas.curveTo(39.1, 45.6, 39.17, 45.6, 39.24, 45.6);
    canvas.curveTo(39.3, 45.6, 39.36, 45.6, 39.42, 45.6);
    canvas.curveTo(39.49, 45.6, 39.55, 45.6, 39.62, 45.6);
    canvas.curveTo(39.63, 45.61, 39.67, 45.59, 39.69, 45.58);
    canvas.curveTo(39.69, 45.58, 39.69, 45.58, 39.7, 45.58);
    canvas.curveTo(39.67, 42.6, 37.91, 39.83, 35.17, 38.58);
    canvas.lineTo(27.59, 35.1);
    canvas.curveTo(31.01, 33.98, 35.42, 32.69, 35.47, 32.67);
    canvas.curveTo(35.77, 32.58, 36.01, 32.37, 36.14, 32.09);
    canvas.curveTo(36.26, 31.8, 36.25, 31.48, 36.12, 31.2);
    canvas.curveTo(36.1, 31.16, 34.19, 27.16, 34.19, 18.4);
    canvas.lineTo(34.19, 14.32);
    canvas.curveTo(34.19, 6.42, 27.76, 0, 19.87, 0);
    canvas.close();
    canvas.moveTo(32.61, 45.59);
    canvas.curveTo(32.59, 45.59, 32.57, 45.6, 32.55, 45.61);
    canvas.curveTo(32.58, 45.61, 32.61, 45.61, 32.63, 45.61);
    canvas.curveTo(32.63, 45.61, 32.62, 45.6, 32.62, 45.6);
    canvas.curveTo(32.61, 45.6, 32.61, 45.59, 32.61, 45.59);
    canvas.close();
    canvas.moveTo(19.87, 2.1);
    canvas.curveTo(26.6, 2.1, 32.09, 7.58, 32.09, 14.32);
    canvas.lineTo(32.09, 18.4);
    canvas.curveTo(32.09, 25.08, 33.14, 29.15, 33.78, 30.98);
    canvas.curveTo(32.04, 31.5, 28.61, 32.54, 26.06, 33.39);
    canvas.lineTo(26.06, 30.85);
    canvas.curveTo(27.83, 29.69, 29.27, 28.02, 30.16, 26.01);
    canvas.curveTo(30.69, 24.81, 30.98, 23.47, 31.02, 22.15);
    canvas.curveTo(31.13, 17.77, 27.4, 16.67, 23.46, 15.51);
    canvas.curveTo(20.19, 14.54, 16.49, 13.45, 13.46, 10.5);
    canvas.curveTo(13.04, 10.1, 12.38, 10.11, 11.97, 10.52);
    canvas.curveTo(11.57, 10.94, 11.58, 11.6, 11.99, 12.01);
    canvas.curveTo(15.39, 15.32, 19.53, 16.54, 22.86, 17.52);
    canvas.curveTo(27, 18.74, 28.99, 19.45, 28.92, 22.1);
    canvas.curveTo(28.89, 23.15, 28.65, 24.21, 28.23, 25.16);
    canvas.curveTo(26.77, 28.47, 23.49, 30.62, 19.87, 30.62);
    canvas.curveTo(15.46, 30.62, 11.67, 27.46, 10.88, 23.12);
    canvas.curveTo(10.69, 22.1, 9.74, 21.35, 8.71, 21.43);
    canvas.curveTo(8.61, 21.43, 8.51, 21.43, 8.41, 21.4);
    canvas.curveTo(7.98, 21.3, 7.65, 20.83, 7.65, 20.3);
    canvas.lineTo(7.65, 19.52);
    canvas.curveTo(7.65, 19, 8.01, 18.52, 8.46, 18.45);
    canvas.curveTo(8.84, 18.38, 9.2, 18.52, 9.43, 18.82);
    canvas.curveTo(9.62, 19.07, 9.88, 19.25, 10.18, 19.34);
    canvas.curveTo(10.62, 19.48, 11.09, 19.4, 11.46, 19.14);
    canvas.curveTo(12.31, 18.54, 13.03, 17.78, 13.59, 16.89);
    canvas.curveTo(13.9, 16.4, 13.76, 15.75, 13.27, 15.44);
    canvas.curveTo(12.78, 15.13, 12.13, 15.27, 11.82, 15.76);
    canvas.curveTo(11.5, 16.27, 11.12, 16.72, 10.68, 17.09);
    canvas.curveTo(9.98, 16.48, 9.04, 16.21, 8.09, 16.38);
    canvas.curveTo(7.94, 16.4, 7.79, 16.44, 7.65, 16.49);
    canvas.lineTo(7.65, 14.32);
    canvas.curveTo(7.65, 7.58, 13.13, 2.1, 19.87, 2.1);
    canvas.close();
    canvas.moveTo(7.45, 23.29);
    canvas.curveTo(7.6, 23.35, 7.76, 23.41, 7.93, 23.45);
    canvas.curveTo(8.22, 23.51, 8.52, 23.54, 8.81, 23.53);
    canvas.curveTo(9.39, 26.6, 11.18, 29.19, 13.64, 30.83);
    canvas.lineTo(13.64, 33.38);
    canvas.curveTo(11.11, 32.53, 7.69, 31.5, 5.96, 30.98);
    canvas.curveTo(6.42, 29.65, 7.11, 27.13, 7.45, 23.29);
    canvas.close();
    canvas.moveTo(15.74, 31.93);
    canvas.curveTo(17.03, 32.43, 18.42, 32.71, 19.87, 32.71);
    canvas.curveTo(21.3, 32.71, 22.68, 32.44, 23.96, 31.94);
    canvas.lineTo(23.96, 33.63);
    canvas.curveTo(23.96, 34.92, 24.71, 36.09, 25.88, 36.63);
    canvas.lineTo(27.35, 37.3);
    canvas.curveTo(26.26, 40.48, 23.27, 42.65, 19.85, 42.65);
    canvas.curveTo(16.45, 42.65, 13.44, 40.48, 12.35, 37.3);
    canvas.lineTo(13.82, 36.63);
    canvas.curveTo(14.99, 36.09, 15.74, 34.92, 15.74, 33.63);
    canvas.close();
    canvas.moveTo(32.66, 45.61);
    canvas.curveTo(32.66, 45.61, 32.66, 45.61, 32.67, 45.61);
    canvas.curveTo(32.67, 45.61, 32.67, 45.61, 32.68, 45.61);
    canvas.curveTo(32.68, 45.62, 32.66, 45.61, 32.66, 45.61);
    canvas.close();
    canvas.moveTo(33.77, 45.65);
    canvas.curveTo(33.76, 45.65, 33.75, 45.66, 33.74, 45.67);
    canvas.curveTo(33.75, 45.67, 33.77, 45.67, 33.78, 45.67);
    canvas.lineTo(33.78, 45.67);
    canvas.lineTo(33.79, 45.65);
    canvas.curveTo(33.78, 45.65, 33.78, 45.64, 33.77, 45.65);
    canvas.close();
    canvas.fillAndStroke();
  }
}
