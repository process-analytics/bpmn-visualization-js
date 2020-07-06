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
import BpmnCanvas, { MxCanvasUtil } from './render/BpmnCanvas';
import StyleUtils from '../StyleUtils';
import { IconStyleConfiguration, Size } from './render/render-types';

export interface PaintParameter {
  c: mxgraph.mxXmlCanvas2D;
  shape: ShapeConfiguration;
  icon: IconStyleConfiguration;
  ratioFromParent?: number;
}

export interface ShapeConfiguration {
  x: number;
  y: number;
  w: number;
  h: number;
  strokeWidth?: number;
}

export default class IconPainter {
  public static buildPaintParameter(
    c: mxgraph.mxXmlCanvas2D,
    x: number,
    y: number,
    width: number,
    height: number,
    shape: mxgraph.mxShape,
    ratioFromParent = 0.25,
    isFilled = false,
    iconStrokeWidth = 0,
  ): PaintParameter {
    const shapeStrokeWidth = shape.strokewidth || StyleUtils.getStrokeWidth(shape.style);
    const fillColor = shape.fill || StyleUtils.getFillColor(shape.style);
    const strokeColor = shape.stroke || StyleUtils.getStrokeColor(shape.style);
    const margin = StyleUtils.getMargin(shape.style);

    return {
      c,
      ratioFromParent,
      shape: { x, y, w: width, h: height, strokeWidth: shapeStrokeWidth },
      icon: { isFilled, fillColor, strokeColor, strokeWidth: iconStrokeWidth, margin },
    };
  }

  private static calculateIconSize(initialIconSize: Size, icon: IconStyleConfiguration, shape: ShapeConfiguration, ratioFromParent: number): Size {
    // Calculate the icon size proportionally to the shape size
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

  // TODO duplicated with BpmnCanvas.updateCanvasStyle
  // This will be removed when all paint functions will use updateCanvasStyle
  private static updateCanvasStyle(canvas: mxgraph.mxXmlCanvas2D, { isFilled, strokeColor, fillColor, strokeWidth }: IconStyleConfiguration): void {
    if (isFilled) {
      // Choose dark color to fill the icon
      canvas.setFillColor(strokeColor);
    } else {
      // Choose light color to fill the icon
      canvas.setFillColor(fillColor);
    }

    canvas.setStrokeWidth(strokeWidth);
  }

  public static paintEmptyIcon(): void {
    // empty by nature
  }

  // this implementation is adapted from the draw.io BPMN 'message' symbol
  // https://github.com/jgraph/drawio/blob/0e19be6b42755790a749af30450c78c0d83be765/src/main/webapp/shapes/bpmn/mxBpmnShape2.js#L465
  public static paintEnvelopeIcon({ c, ratioFromParent, shape, icon }: PaintParameter): void {
    this.updateCanvasStyle(c, icon);

    const initialIconSize = { width: 485.41, height: 321.76 };
    const iconSize = this.calculateIconSize(initialIconSize, icon, shape, ratioFromParent);
    MxCanvasUtil.translateIconToShapeCenter(c, shape, iconSize);

    const w = iconSize.width;
    const h = iconSize.height;

    // Paint the envelope outline with dark color
    c.rect(0, 0, w, h);
    c.fillAndStroke();

    if (icon.isFilled) {
      // Choose light color for envelope closure
      c.setStrokeColor(icon.fillColor);
    }

    // Paint the envelope closure
    c.begin();

    // V line
    c.moveTo(0, 0);
    c.lineTo(w * 0.5, h * 0.6);
    c.lineTo(w, 0);

    // First bottom line
    c.moveTo(0, h);
    c.lineTo(w / 3, h * 0.45);

    // Second bottom line
    c.moveTo(w, h);
    c.lineTo((w * 2) / 3, h * 0.45);

    c.stroke();
  }

  // highly inspired from mxDoubleEllipse
  public static paintCircleIcon({ c, ratioFromParent, shape, icon }: PaintParameter): void {
    this.updateCanvasStyle(c, icon);

    const initialIconSize = { width: shape.w, height: shape.h };
    const iconSize = this.calculateIconSize(initialIconSize, icon, shape, ratioFromParent);
    MxCanvasUtil.translateIconToShapeCenter(c, shape, iconSize);

    const w = iconSize.width;
    const h = iconSize.height;
    if (w > 0 && h > 0) {
      c.ellipse(0, 0, w, h);
    }

    if (icon.isFilled) {
      c.fillAndStroke();
    } else {
      c.stroke();
    }
  }

  // implementation adapted from https://www.flaticon.com/free-icon/clock_223404
  public static paintClockIcon({ c, ratioFromParent, shape: { x, y, w, h }, icon }: PaintParameter): void {
    const canvas = new BpmnCanvas({
      mxCanvas: c,
      shapeConfiguration: { x, y, w, h },
      iconConfiguration: {
        originalSize: { height: 152, width: 152 },
        ratioFromShape: ratioFromParent,
        style: icon,
      },
    });
    canvas.setIconOriginPosition(5);

    canvas.begin();
    canvas.moveTo(184, 60);
    canvas.curveTo(188.4, 60, 192, 56.4, 192, 52);
    canvas.lineTo(192, 48);
    canvas.curveTo(192, 40, 188.4, 40, 184, 40);
    canvas.curveTo(179.6, 40, 176, 43.6, 176, 48);
    canvas.lineTo(176, 52);
    canvas.curveTo(176, 56.4, 179.6, 60, 184, 60);
    canvas.close();

    canvas.moveTo(184, 308);
    canvas.curveTo(179.6, 308, 176, 311.6, 176, 316);
    canvas.lineTo(176, 320);
    canvas.curveTo(176, 324.4, 179.6, 328, 184, 328);
    canvas.curveTo(188.4, 328, 192, 324.4, 192, 320);
    canvas.lineTo(192, 316);
    canvas.curveTo(192, 311.6, 188.4, 308, 184, 308);
    canvas.close();

    canvas.moveTo(52, 176);
    canvas.lineTo(48, 176);
    canvas.curveTo(43.6, 176, 40, 179.6, 40, 184);
    canvas.curveTo(40, 188.4, 43.6, 192, 48, 192);
    canvas.lineTo(52, 192);
    canvas.curveTo(56.4, 192, 69, 188.4, 60, 184);
    canvas.curveTo(60, 179.6, 56.4, 176, 52, 176);
    canvas.close();

    canvas.moveTo(320, 176);
    canvas.lineTo(316, 176);
    canvas.curveTo(311.6, 176, 308, 179.6, 308, 184);
    canvas.curveTo(308, 188.4, 311.6, 192, 316, 192);
    canvas.lineTo(320, 192);
    canvas.curveTo(324.4, 192, 328, 188.4, 328, 184);
    canvas.curveTo(328, 179.6, 324.4, 176, 320, 176);

    canvas.moveTo(93.6, 82.4);
    canvas.curveTo(90.4, 79.2, 85.6, 79.2, 82.4, 82.4);
    canvas.curveTo(79.2, 85.6, 79.2, 90.4, 82.4, 93.6);
    canvas.lineTo(85.2, 96.4);
    canvas.curveTo(86.8, 98, 88.8, 98.8, 90.8, 98.8);
    canvas.curveTo(92.8, 98.8, 94.4, 98, 96.4, 96.4);
    canvas.curveTo(99.6, 93.2, 99.6, 88.4, 96.4, 85.2);
    canvas.lineTo(93.6, 82.4);

    canvas.moveTo(85.2, 271.6);
    canvas.lineTo(82.4, 274.4);
    canvas.curveTo(79.2, 277.6, 79.2, 282.4, 82.4, 285.6);
    canvas.curveTo(84, 287.2, 86, 288, 88, 288);
    canvas.curveTo(90, 288, 92, 287.2, 93.6, 285.6);
    canvas.lineTo(96.4, 282.8);
    canvas.curveTo(99.6, 279.6, 99.6, 274.8, 96.4, 271.6);
    canvas.curveTo(93.2, 268.4, 88.4, 268.4, 85.2, 271.6);

    canvas.moveTo(274.4, 82.4);
    canvas.lineTo(271.6, 85.2);
    canvas.curveTo(268.4, 88.4, 268.4, 93.2, 271.6, 96.4);
    canvas.curveTo(273.298, 98, 275.2, 98.8, 277.2, 98.8);
    canvas.curveTo(279.2, 98.8, 281.2, 98, 282.8, 96.4);
    canvas.lineTo(285.6, 93.6);
    canvas.curveTo(288.8, 90.4, 288.8, 85.6, 285.6, 82.4);
    canvas.curveTo(282.4, 79.2, 277.6, 79.2, 274.4, 82.4);

    canvas.moveTo(192, 180.8);
    canvas.lineTo(192, 108);
    canvas.curveTo(192, 103.6, 188.4, 100, 184, 100);
    canvas.curveTo(179.6, 100, 176, 103.6, 176, 108);
    canvas.lineTo(176, 184);
    canvas.curveTo(176, 186, 176.8, 188, 178.4, 189.6);
    canvas.lineTo(266, 277.2);
    canvas.curveTo(267.6, 278.8, 269.6, 279.6, 271.6, 279.6);
    canvas.curveTo(273.6, 279.6, 275.6, 278.8, 277.2, 277.2);
    canvas.curveTo(280.4, 274, 280.4, 269.2, 277.2, 266);
    canvas.lineTo(192, 180.8);

    canvas.moveTo(184, 0);
    canvas.curveTo(82.4, 0, 0, 82.4, 0, 184);
    canvas.curveTo(0, 285.6, 82.4, 368, 184, 368);
    canvas.curveTo(285.6, 368, 368, 285.6, 368, 184);
    canvas.curveTo(368, 82.4, 285.6, 0, 184, 0);

    canvas.moveTo(184, 352);
    canvas.curveTo(91.2, 352, 16, 276.8, 16, 184);
    canvas.curveTo(16, 91.2, 91.2, 16, 184, 16);
    canvas.curveTo(276.8, 16, 352, 91.2, 352, 184);
    canvas.curveTo(352, 276.8, 276.8, 352, 184, 352);

    canvas.fillAndStroke();
  }

  public static paintXCrossIcon({ c, ratioFromParent, shape: { x, y, w, h }, icon }: PaintParameter): void {
    const canvas = new BpmnCanvas({
      mxCanvas: c,
      shapeConfiguration: { x, y, w, h },
      iconConfiguration: {
        originalSize: { height: 0.5, width: 0.5 },
        ratioFromShape: ratioFromParent,
        style: { ...icon, isFilled: true },
      },
    });
    canvas.setIconOriginPosition(4);

    this.drawCrossIcon(canvas);
    const rotationCenterX = w / 4;
    const rotationCenterY = h / 4;
    canvas.rotate(45, false, false, rotationCenterX, rotationCenterY);
    canvas.fillAndStroke();
  }

  public static paintPlusCrossIcon({ c, ratioFromParent, shape: { x, y, w, h }, icon }: PaintParameter): void {
    const canvas = new BpmnCanvas({
      mxCanvas: c,
      shapeConfiguration: { x, y, w, h },
      iconConfiguration: {
        originalSize: { height: 0.5, width: 0.5 },
        ratioFromShape: ratioFromParent,
        style: { ...icon, isFilled: true },
      },
    });
    canvas.setIconOriginPosition(4);

    this.drawCrossIcon(canvas);
    canvas.fillAndStroke();
  }

  private static drawCrossIcon(canvas: BpmnCanvas): void {
    canvas.begin();
    canvas.moveTo(0.38, 0);
    canvas.lineTo(0.62, 0);
    canvas.lineTo(0.62, 0.38);
    canvas.lineTo(1, 0.38);
    canvas.lineTo(1, 0.62);
    canvas.lineTo(0.62, 0.62);
    canvas.lineTo(0.62, 1);
    canvas.lineTo(0.38, 1);
    canvas.lineTo(0.38, 0.62);
    canvas.lineTo(0, 0.62);
    canvas.lineTo(0, 0.38);
    canvas.lineTo(0.38, 0.38);
    canvas.close();
  }

  // implementation adapted from https://www.flaticon.com/free-icon/employees_554768
  // use https://github.com/process-analytics/mxgraph-svg2shape to generate the xml stencil and port it to code
  public static paintWomanIcon({ c, ratioFromParent, shape: { x, y, w, h }, icon }: PaintParameter): void {
    const canvas = new BpmnCanvas({
      mxCanvas: c,
      shapeConfiguration: { x, y, w, h },
      iconConfiguration: {
        originalSize: { height: 239, width: 239 }, // TODO use h="239.68" w="143.61"
        ratioFromShape: ratioFromParent,
        style: { ...icon, isFilled: true },
      },
    });
    canvas.setIconOriginPosition(20);

    canvas.begin();
    canvas.moveTo(124.31, 150.29);
    canvas.lineTo(99.66, 141.03);
    canvas.arcTo(6.43, 6.43, 0, 0, 1, 95.51, 135.03);
    canvas.lineTo(95.51, 130.66);
    canvas.arcTo(47.75, 47.75, 0, 0, 0, 119.51, 89.25);
    canvas.lineTo(119.51, 71.25);
    canvas.arcTo(47.62, 47.62, 0, 0, 0, 101.18, 33.64);
    canvas.arcTo(29.35, 29.35, 0, 0, 0, 101.52, 29.14);
    canvas.arcTo(29.68, 29.68, 0, 0, 0, 42.17, 29.14);
    canvas.arcTo(29.24, 29.24, 0, 0, 0, 42.53, 33.63);
    canvas.arcTo(47.65, 47.65, 0, 0, 0, 24.14, 71.23);
    canvas.lineTo(24.14, 89.23);
    canvas.arcTo(47.7, 47.7, 0, 0, 0, 48.19, 130.63);
    canvas.lineTo(48.19, 135.03);
    canvas.arcTo(6.43, 6.43, 0, 0, 1, 44.03, 141.03);
    canvas.lineTo(19.31, 150.29);
    canvas.arcTo(29.81, 29.81, 0, 0, 0, 0.09, 178.03);
    canvas.lineTo(0.09, 233.51);
    canvas.arcTo(5.63, 5.63, 0, 1, 0, 11.34, 233.51);
    canvas.lineTo(11.34, 178.03);
    canvas.arcTo(18.19, 18.19, 0, 0, 1, 11.57, 175.17);
    canvas.lineTo(20.5, 184.11);
    canvas.arcTo(12.32, 12.32, 0, 0, 1, 24.14, 192.89);
    canvas.lineTo(24.14, 233.51);
    canvas.arcTo(5.63, 5.63, 0, 1, 0, 35.39, 233.51);
    canvas.lineTo(35.39, 192.93);
    canvas.arcTo(23.5, 23.5, 0, 0, 0, 28.46, 176.2);
    canvas.lineTo(17.04, 164.78);
    canvas.arcTo(18.34, 18.34, 0, 0, 1, 23.29, 160.78);
    canvas.lineTo(43.65, 153.15);
    canvas.lineTo(66.22, 175.72);
    canvas.lineTo(66.22, 233.51);
    canvas.arcTo(5.63, 5.63, 0, 1, 0, 77.47, 233.51);
    canvas.lineTo(77.47, 175.76);
    canvas.lineTo(100.04, 153.19);
    canvas.lineTo(120.4, 160.82);
    canvas.arcTo(18.39, 18.39, 0, 0, 1, 126.65, 164.82);
    canvas.lineTo(115.24, 176.24);
    canvas.arcTo(23.5, 23.5, 0, 0, 0, 108.31, 192.93);
    canvas.lineTo(108.31, 233.55);
    canvas.arcTo(5.63, 5.63, 0, 1, 0, 119.56, 233.55);
    canvas.lineTo(119.56, 192.93);
    canvas.arcTo(12.35, 12.35, 0, 0, 1, 123.19, 184.15);
    canvas.lineTo(132.13, 175.22);
    canvas.arcTo(18, 18, 0, 0, 1, 132.36, 178.08);
    canvas.lineTo(132.36, 233.56);
    canvas.arcTo(5.63, 5.63, 0, 0, 0, 143.61, 233.56);
    canvas.lineTo(143.61, 178.03);
    canvas.arcTo(29.81, 29.81, 0, 0, 0, 124.31, 150.29);
    canvas.close();
    canvas.moveTo(71.85, 10.72);
    canvas.arcTo(18.46, 18.46, 0, 0, 1, 90.17, 27.18);
    canvas.arcTo(47.68, 47.68, 0, 0, 0, 53.53, 27.18);
    canvas.arcTo(18.44, 18.44, 0, 0, 1, 71.85, 10.72);
    canvas.close();
    canvas.moveTo(35.39, 71.23);
    canvas.arcTo(36.46, 36.46, 0, 0, 1, 108.31, 71.23);
    canvas.lineTo(108.31, 77.4);
    canvas.curveTo(82.12, 75.4, 56.97, 60.55, 56.71, 60.4);
    canvas.arcTo(5.62, 5.62, 0, 0, 0, 48.78, 62.71);
    canvas.curveTo(46.24, 67.79, 40.45, 71.89, 35.39, 74.62);
    canvas.close();
    canvas.moveTo(35.39, 89.23);
    canvas.lineTo(35.39, 87.08);
    canvas.curveTo(40.55, 84.85, 49.73, 80.08, 55.67, 72.66);
    canvas.curveTo(64.83, 77.46, 85.92, 87.21, 108.31, 88.66);
    canvas.lineTo(108.31, 89.24);
    canvas.arcTo(36.46, 36.46, 0, 1, 1, 35.39, 89.24);
    canvas.close();
    canvas.moveTo(71.85, 165.45);
    canvas.lineTo(54.06, 147.69);
    canvas.arcTo(17.7, 17.7, 0, 0, 0, 59.43, 135.32);
    canvas.arcTo(47.57, 47.57, 0, 0, 0, 84.27, 135.32);
    canvas.arcTo(17.7, 17.7, 0, 0, 0, 89.64, 147.69);
    canvas.close();
    canvas.fill();
  }

  // this implementation is adapted from the draw.io BPMN 'Service Task' stencil
  // https://github.com/jgraph/drawio/blob/9394fb0f1430d2c869865827b2bbef5639f63478/src/main/webapp/stencils/bpmn.xml#L898
  public static paintGearIcon({ c, ratioFromParent, shape: { x, y, w, h }, icon }: PaintParameter): void {
    const canvas = new BpmnCanvas({
      mxCanvas: c,
      shapeConfiguration: { x, y, w, h },
      iconConfiguration: {
        // icon coordinates fill a 100x100 rectangle (approximately: 90x90 + foreground translation)
        originalSize: { height: 100, width: 100 },
        ratioFromShape: ratioFromParent,
        style: icon,
      },
    });
    canvas.setIconOriginPosition(20);

    // background
    this.paintGearIconBackground(canvas);

    // foreground
    canvas.translateIconOrigin(14, 14);
    this.paintGearIconForeground(canvas);
  }

  private static paintGearIconBackground(canvas: BpmnCanvas): void {
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
    this.paintInnerCircle(canvas, arcStartX, arcStartY);
  }

  private static paintGearIconForeground(canvas: BpmnCanvas): void {
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
    this.paintInnerCircle(canvas, arcStartX, arcStartY);

    // fill the inner circle to mask the background
    canvas.begin();
    this.paintInnerCircle(canvas, arcStartX, arcStartY);
  }

  private static paintInnerCircle(canvas: BpmnCanvas, arcStartX: number, arcStartY: number): void {
    const arcRay = 13.5;
    canvas.moveTo(arcStartX, arcStartY);
    canvas.arcTo(arcRay, arcRay, 0, 1, 1, arcStartX + 2 * arcRay, arcStartY);
    canvas.arcTo(arcRay, arcRay, 0, 0, 1, arcStartX, arcStartY);
    canvas.close();
    canvas.fillAndStroke();
  }

  public static paintExpandIcon({ c, ratioFromParent, shape, icon }: PaintParameter): void {
    this.updateCanvasStyle(c, icon);

    const initialIconSize = { width: 16, height: 16 };
    const iconSize = this.calculateIconSize(initialIconSize, icon, shape, ratioFromParent);
    MxCanvasUtil.translateIconToShapeBottomCenter(c, shape, iconSize);

    const w = iconSize.width;
    const h = iconSize.height;

    // Rounded rectangle
    c.roundrect(0, 0, w, h, 2, 2);
    c.stroke();

    // Cross
    c.begin();
    c.moveTo(w / 2, h / 4);
    c.lineTo(w / 2, (h * 3) / 4);
    c.close();
    c.moveTo(w / 4, h / 2);
    c.lineTo((w * 3) / 4, h / 2);
    c.close();
    c.fillAndStroke();
  }
}
