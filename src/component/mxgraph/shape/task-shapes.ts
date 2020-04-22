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

  protected paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    const xTranslation = x + w / 20;
    const yTranslation = y + h / 20;

    c.translate(xTranslation, yTranslation);

    // ensure we are not impacted by the configured shape stroke width
    c.setStrokeWidth(1);
    //this.drawServiceTaskIcon(c, Math.min(w, h), 0.25);

    const parentSize = Math.min(w, h);
    const ratioFromParent = 0.25;
    // coordinates below fill a box of 100x100 (approximately: 90x90 + foreground translation)
    const scaleFactor = (parentSize / 100) * ratioFromParent;
    // const scaleFactor = (parentSize / 90) * ratioFromParent;

    // background
    this.drawIconBackground(c, scaleFactor);

    // foreground
    const foregroundTranslation = 13;
    c.translate(foregroundTranslation * scaleFactor, foregroundTranslation * scaleFactor);
    this.drawIconForeground(c, scaleFactor);

    // hack for translation that will  be needed when managing task markers
    // c.translate(-xTranslation, -yTranslation);
  }

  private drawIconBackground(c: mxgraph.mxXmlCanvas2D, scaleFactor: number): void {
    c.begin();
    c.moveTo(2.06 * scaleFactor, 24.62 * scaleFactor);
    c.lineTo(10.17 * scaleFactor, 30.95 * scaleFactor);
    c.lineTo(9.29 * scaleFactor, 37.73 * scaleFactor);
    c.lineTo(0 * scaleFactor, 41.42 * scaleFactor);
    c.lineTo(2.95 * scaleFactor, 54.24 * scaleFactor);
    c.lineTo(13.41 * scaleFactor, 52.92 * scaleFactor);
    c.lineTo(17.39 * scaleFactor, 58.52 * scaleFactor);
    c.lineTo(13.56 * scaleFactor, 67.66 * scaleFactor);
    c.lineTo(24.47 * scaleFactor, 74.44 * scaleFactor);
    c.lineTo(30.81 * scaleFactor, 66.33 * scaleFactor);
    c.lineTo(37.88 * scaleFactor, 67.21 * scaleFactor);
    c.lineTo(41.57 * scaleFactor, 76.5 * scaleFactor);
    c.lineTo(54.24 * scaleFactor, 73.55 * scaleFactor);
    c.lineTo(53.06 * scaleFactor, 62.94 * scaleFactor);
    c.lineTo(58.52 * scaleFactor, 58.52 * scaleFactor);
    c.lineTo(67.21 * scaleFactor, 63.09 * scaleFactor);
    c.lineTo(74.58 * scaleFactor, 51.88 * scaleFactor);
    c.lineTo(66.03 * scaleFactor, 45.25 * scaleFactor);
    c.lineTo(66.92 * scaleFactor, 38.62 * scaleFactor);
    c.lineTo(76.5 * scaleFactor, 34.93 * scaleFactor);
    c.lineTo(73.7 * scaleFactor, 22.26 * scaleFactor);
    c.lineTo(62.64 * scaleFactor, 23.44 * scaleFactor);
    c.lineTo(58.81 * scaleFactor, 18.42 * scaleFactor);
    c.lineTo(62.79 * scaleFactor, 8.7 * scaleFactor);
    c.lineTo(51.74 * scaleFactor, 2.21 * scaleFactor);
    c.lineTo(44.81 * scaleFactor, 10.47 * scaleFactor);
    c.lineTo(38.03 * scaleFactor, 9.43 * scaleFactor);
    c.lineTo(33.75 * scaleFactor, 0 * scaleFactor);
    c.lineTo(21.52 * scaleFactor, 3.24 * scaleFactor);
    c.lineTo(22.7 * scaleFactor, 13.56 * scaleFactor);
    c.lineTo(18.13 * scaleFactor, 17.54 * scaleFactor);
    c.lineTo(8.7 * scaleFactor, 13.56 * scaleFactor);
    c.close();

    const arc1Ray = 13.5 * scaleFactor;
    const arc1StartX = 24.8 * scaleFactor;
    const arc1StartY = 39 * scaleFactor;
    c.moveTo(arc1StartX, arc1StartY);
    c.arcTo(arc1Ray, arc1Ray, 0, 1, 1, arc1StartX + 2 * arc1Ray, arc1StartY);
    c.arcTo(arc1Ray, arc1Ray, 0, 0, 1, arc1StartX, arc1StartY);
    c.close();
    c.fillAndStroke();
  }

  private drawIconForeground(c: mxgraph.mxXmlCanvas2D, scaleFactor: number): void {
    c.begin();
    c.moveTo(16.46 * scaleFactor, 41.42 * scaleFactor);
    c.lineTo(24.57 * scaleFactor, 47.75 * scaleFactor);
    c.lineTo(23.69 * scaleFactor, 54.53 * scaleFactor);
    c.lineTo(14.4 * scaleFactor, 58.22 * scaleFactor);
    c.lineTo(17.35 * scaleFactor, 71.04 * scaleFactor);
    c.lineTo(27.81 * scaleFactor, 69.72 * scaleFactor);
    c.lineTo(31.79 * scaleFactor, 75.32 * scaleFactor);
    c.lineTo(27.96 * scaleFactor, 84.46 * scaleFactor);
    c.lineTo(38.87 * scaleFactor, 91.24 * scaleFactor);
    c.lineTo(45.21 * scaleFactor, 83.13 * scaleFactor);
    c.lineTo(52.28 * scaleFactor, 84.01 * scaleFactor);
    c.lineTo(55.97 * scaleFactor, 93.3 * scaleFactor);
    c.lineTo(68.64 * scaleFactor, 90.35 * scaleFactor);
    c.lineTo(67.46 * scaleFactor, 79.74 * scaleFactor);
    c.lineTo(72.92 * scaleFactor, 75.32 * scaleFactor);
    c.lineTo(81.61 * scaleFactor, 79.89 * scaleFactor);
    c.lineTo(88.98 * scaleFactor, 68.68 * scaleFactor);
    c.lineTo(80.43 * scaleFactor, 62.05 * scaleFactor);
    c.lineTo(81.32 * scaleFactor, 55.42 * scaleFactor);
    c.lineTo(90.9 * scaleFactor, 51.73 * scaleFactor);
    c.lineTo(88.1 * scaleFactor, 39.06 * scaleFactor);
    c.lineTo(77.04 * scaleFactor, 40.24 * scaleFactor);
    c.lineTo(73.21 * scaleFactor, 35.22 * scaleFactor);
    c.lineTo(77.19 * scaleFactor, 25.5 * scaleFactor);
    c.lineTo(66.14 * scaleFactor, 19.01 * scaleFactor);
    c.lineTo(59.21 * scaleFactor, 27.27 * scaleFactor);
    c.lineTo(52.43 * scaleFactor, 26.23 * scaleFactor);
    c.lineTo(48.15 * scaleFactor, 16.8 * scaleFactor);
    c.lineTo(35.92 * scaleFactor, 20.04 * scaleFactor);
    c.lineTo(37.1 * scaleFactor, 30.36 * scaleFactor);
    c.lineTo(32.53 * scaleFactor, 34.34 * scaleFactor);
    c.lineTo(23.1 * scaleFactor, 30.36 * scaleFactor);
    c.close();

    const arc2Ray = 13.5 * scaleFactor;
    const arc2StartX = 39.2 * scaleFactor;
    const arc2StartY = 55.8 * scaleFactor;
    c.moveTo(arc2StartX, arc2StartY);
    c.arcTo(arc2Ray, arc2Ray, 0, 1, 1, arc2StartX + 2 * arc2Ray, arc2StartY);
    c.arcTo(arc2Ray, arc2Ray, 0, 0, 1, arc2StartX, arc2StartY);

    c.close();
    c.fillAndStroke();

    // TODO fill the inner circle to mask the background
  }
}
