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

import BpmnCanvas from './BpmnCanvas';
import StyleUtils from '../../StyleUtils';
import { IconStyleConfiguration, ShapeConfiguration, Size } from './render-types';

export interface PaintParameter {
  c: mxAbstractCanvas2D;
  shape: ShapeConfiguration;
  icon: IconStyleConfiguration;
  ratioFromParent?: number;
  setIconOrigin: (canvas: BpmnCanvas) => void;
}

export function buildPaintParameter(
  c: mxAbstractCanvas2D,
  x: number,
  y: number,
  width: number,
  height: number,
  shape: mxShape,
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
    setIconOrigin: (canvas: BpmnCanvas) => canvas.setIconOriginForIconCentered(),
    shape: { x, y, w: width, h: height, strokeWidth: shapeStrokeWidth },
    icon: { isFilled, fillColor, strokeColor, strokeWidth: iconStrokeWidth, margin },
  };
}

export default class IconPainter {
  public paintEmptyIcon(): void {
    // empty by nature
  }

  /**
   * Utility paint icon methods to easily instantiate a {@link BpmnCanvas} from a {@link PaintParameter}.
   *
   * @param c                       mxgraph `mxAbstractCanvas2D` in charge of performing the paint operations.
   * @param ratioFromParent         the actual size of the icon will be computed from the shape dimensions using this ratio.
   * @param setIconOrigin           called function to set the origin of the icon. Generally, it calls a method of {@link BpmnCanvas}.
   * @param shape                   dimension and style of the shape where the icon is painted.
   * @param icon                    style of the icon.
   * @param originalIconSize        original size of the icon used to compute the scaling/ratio in {@link BpmnCanvas}.
   * @protected
   */
  protected newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter, originalIconSize: Size): BpmnCanvas {
    return new BpmnCanvas({
      mxCanvas: c,
      shapeConfiguration: shape,
      iconConfiguration: {
        originalSize: originalIconSize,
        style: icon,
        ratioFromShape: ratioFromParent,
        setIconOrigin,
      },
    });
  }

  /**
   * This icon is used by `message event`, `receive task`, `send task`.
   */
  public paintEnvelopeIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    // this implementation is adapted from the draw.io BPMN 'message' symbol
    // https://github.com/jgraph/drawio/blob/0e19be6b42755790a749af30450c78c0d83be765/src/main/webapp/shapes/bpmn/mxBpmnShape2.js#L465
    const originalIconSize = { width: 485.41, height: 321.76 };
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, originalIconSize);

    const w = originalIconSize.width;
    const h = originalIconSize.height;

    // Paint the envelope outline with dark color
    canvas.rect(0, 0, w, h);
    canvas.fillAndStroke();

    if (icon.isFilled) {
      // Choose light color for envelope closure
      canvas.setStrokeColor(icon.fillColor);
    }

    // Paint the envelope closure
    canvas.begin();

    // V line
    canvas.moveTo(0, 0);
    canvas.lineTo(w * 0.5, h * 0.6);
    canvas.lineTo(w, 0);

    // First bottom line
    canvas.moveTo(0, h);
    canvas.lineTo(w / 3, h * 0.45);

    // Second bottom line
    canvas.moveTo(w, h);
    canvas.lineTo((w * 2) / 3, h * 0.45);

    canvas.stroke();
  }

  /**
   * This icon is used by `inclusive gateway` and `terminate event`.
   */
  public paintCircleIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    // highly inspired from mxDoubleEllipse
    const originalIconSize = { width: shape.w, height: shape.h };
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, originalIconSize);

    const w = originalIconSize.width;
    const h = originalIconSize.height;
    if (w > 0 && h > 0) {
      canvas.ellipse(0, 0, w, h);
    }

    if (icon.isFilled) {
      canvas.fillAndStroke();
    } else {
      canvas.stroke();
    }
  }

  /**
   * This icon is used by `timer event`.
   */
  public paintClockIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    // implementation adapted from https://www.flaticon.com/free-icon/clock_223404
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, { height: 152, width: 152 });

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

  /**
   * This icon is used by `signal event`.
   */
  public paintTriangleIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    // implementation adapted from https://thenounproject.com/term/triangle/2452089/
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, { height: 735, width: 849 });

    canvas.begin();
    canvas.moveTo(497, 55);
    canvas.lineTo(817, 609);
    canvas.curveTo(849, 665, 808, 735, 744, 735);
    canvas.lineTo(105, 735);
    canvas.curveTo(40, 735, 0, 665, 32, 609);
    canvas.lineTo(352, 55);
    canvas.curveTo(384, 0, 465, 0, 497, 55);
    canvas.close();

    canvas.fillAndStroke();
  }

  /**
   * This icon is used by `exclusive gateway`.
   */
  public paintXCrossIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon: { ...icon, isFilled: true } }, { height: 0.5, width: 0.5 });

    IconPainter.drawCrossIcon(canvas);
    const rotationCenterX = shape.w / 4;
    const rotationCenterY = shape.h / 4;
    canvas.rotate(45, false, false, rotationCenterX, rotationCenterY);
    canvas.fillAndStroke();
  }

  /**
   * This icon is used by `parallel gateway`.
   */
  public paintPlusCrossIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon: { ...icon, isFilled: true } }, { height: 0.5, width: 0.5 });

    IconPainter.drawCrossIcon(canvas);
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

  /**
   * This icon is used by `user task`.
   */
  public paintUserIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    // implementation adapted from https://www.flaticon.com/free-icon/employees_554768
    // use https://github.com/process-analytics/mxgraph-svg2shape to generate the xml stencil and port it to code
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon: { ...icon, isFilled: true } }, { height: 239.68, width: 143.61 });

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

  /**
   * This icon is used by `service tasks`.
   */
  public paintGearIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    // this implementation is adapted from the draw.io BPMN 'Service Task' stencil
    // https://github.com/jgraph/drawio/blob/9394fb0f1430d2c869865827b2bbef5639f63478/src/main/webapp/stencils/bpmn.xml#L898
    // icon coordinates fill a 100x100 rectangle (approximately: 90x90 + foreground translation)
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, { height: 100, width: 100 });

    // background
    IconPainter.paintGearIconBackground(canvas);

    // foreground
    canvas.translateIconOrigin(14, 14);
    IconPainter.paintGearIconForeground(canvas);
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
    IconPainter.paintGearInnerCircle(canvas, arcStartX, arcStartY);
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
    IconPainter.paintGearInnerCircle(canvas, arcStartX, arcStartY);

    // fill the inner circle to mask the background
    canvas.begin();
    IconPainter.paintGearInnerCircle(canvas, arcStartX, arcStartY);
  }

  private static paintGearInnerCircle(canvas: BpmnCanvas, arcStartX: number, arcStartY: number): void {
    const arcRay = 13.5;
    canvas.moveTo(arcStartX, arcStartY);
    canvas.arcTo(arcRay, arcRay, 0, 1, 1, arcStartX + 2 * arcRay, arcStartY);
    canvas.arcTo(arcRay, arcRay, 0, 0, 1, arcStartX, arcStartY);
    canvas.close();
    canvas.fillAndStroke();
  }

  /**
   * This icon is used to display the `expand marker` on `activities`.
   */
  public paintExpandIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    const originalIconSize = { width: 16, height: 16 };
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, originalIconSize);

    const w = originalIconSize.width;
    const h = originalIconSize.height;

    // Rounded rectangle
    canvas.roundrect(0, 0, w, h, 2, 2);
    canvas.stroke();

    // Cross
    canvas.begin();
    canvas.moveTo(w / 2, h / 4);
    canvas.lineTo(w / 2, (h * 3) / 4);
    canvas.close();
    canvas.moveTo(w / 4, h / 2);
    canvas.lineTo((w * 3) / 4, h / 2);
    canvas.close();
    canvas.fillAndStroke();
  }

  /**
   * This icon is used to display the `loop marker` on `activities`.
   */
  paintLoopIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    // this implementation is adapted from the draw.io BPMN 'Loop'
    // https://github.com/jgraph/drawio/blob/9394fb0f1430d2c869865827b2bbef5639f63478/src/main/webapp/stencils/bpmn.xml#L543
    icon.fillColor = icon.strokeColor;
    const originalIconSize = { width: 22.49, height: 21.62 };
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, originalIconSize);

    // Loop
    canvas.begin();
    canvas.moveTo(5.5, 19.08);
    canvas.arcTo(8, 8, 0, 1, 1, 10.5, 21.08);
    canvas.stroke();

    // Arrow
    canvas.begin();
    canvas.moveTo(7.5, 14.08);
    canvas.lineTo(5.75, 19.08);
    canvas.lineTo(0, 17.08);
    canvas.close();
    canvas.fillAndStroke();
  }

  /**
   * This icon is used to display the `sequential multi-instance marker` on `activities`.
   */
  paintSequentialMultiInstanceIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    const originalIconSize = { width: 16, height: 16 };
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, originalIconSize);

    c.setFillColor(icon.strokeColor);
    const barWidth = originalIconSize.width;
    const barHeight = originalIconSize.height / 5; // 3 bars + 2 interspaces
    canvas.rect(0, 0, barWidth, barHeight);
    canvas.fill();
    canvas.rect(0, 2 * barHeight, barWidth, barHeight);
    canvas.fill();
    canvas.rect(0, 4 * barHeight, barWidth, barHeight);
    canvas.fill();
  }

  /**
   * This icon is used to display the `parallel multi-instance marker` on `activities`.
   */
  paintParallelMultiInstanceIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    const originalIconSize = { width: 16, height: 16 };
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, originalIconSize);

    c.setFillColor(icon.strokeColor);
    const barWidth = originalIconSize.width / 5; // 3 bars + 2 interspaces
    const barHeight = originalIconSize.height;
    canvas.begin();
    canvas.rect(0, 0, barWidth, barHeight);
    canvas.fill();
    canvas.rect(2 * barWidth, 0, barWidth, barHeight);
    canvas.fill();
    canvas.rect(4 * barWidth, 0, barWidth, barHeight);
    canvas.fill();
  }

  /**
   * This icon is used by `link event`.
   */
  paintRightArrowIcon({ setIconOrigin, c, shape, ratioFromParent, icon }: PaintParameter): void {
    // this implementation is adapted from https://www.flaticon.com/free-icon/right-arrow_222330
    const originalIconSize = { width: 512, height: 415.23 };
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, originalIconSize);
    canvas.setRoundLineJoin();

    canvas.begin();
    canvas.moveTo(512, 207.61);
    canvas.lineTo(304.38, 0);
    canvas.lineTo(304.38, 135.39);
    canvas.lineTo(0, 135.39);
    canvas.lineTo(0, 279.84);
    canvas.lineTo(304.38, 279.84);
    canvas.lineTo(304.38, 415.23);
    canvas.lineTo(512, 207.61);
    canvas.close();
    canvas.fillAndStroke();
  }

  /**
   * This icon is used by `error event`.
   */
  paintErrorIcon({ setIconOrigin, c, shape, ratioFromParent, icon }: PaintParameter): void {
    const originalIconSize = { width: 72.44, height: 71.82 };
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, originalIconSize);

    canvas.begin();
    canvas.moveTo(0, 53.32);
    canvas.lineTo(19.48, 0);
    canvas.lineTo(19.48, 0);
    canvas.lineTo(50.85, 40.07);
    canvas.lineTo(72.44, 18.21);
    canvas.lineTo(53.12, 71.82);
    canvas.lineTo(22.5, 31.37);
    canvas.close();
    canvas.fillAndStroke();
  }

  /**
   * This icon is used by `manual task`.
   */
  paintHandIcon({ setIconOrigin, c, shape, ratioFromParent, icon }: PaintParameter): void {
    const originalIconSize = { width: 368.08, height: 283.21 };
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, originalIconSize);

    canvas.begin();
    canvas.moveTo(281.81, 257.12);
    canvas.curveTo(281.81, 248.49, 277.56, 240.9, 271.09, 236.14);
    canvas.curveTo(274.85, 236.14, 304.96, 236.14, 308.73, 236.14);
    canvas.curveTo(308.77, 236.14, 308.81, 236.12, 308.86, 236.12);
    canvas.curveTo(308.9, 236.11, 308.94, 236.13, 308.98, 236.13);
    canvas.curveTo(323.71, 234.64, 334.81, 222.21, 334.81, 207.22);
    canvas.curveTo(334.81, 197.3, 329.85, 188.52, 322.31, 183.27);
    canvas.curveTo(324.1, 183.27, 338.43, 183.27, 340.23, 183.27);
    canvas.curveTo(340.25, 183.27, 340.26, 183.28, 340.28, 183.28);
    canvas.curveTo(355.61, 183.28, 368.08, 170.81, 368.08, 155.48);
    canvas.curveTo(368.08, 140.22, 355.72, 127.81, 340.49, 127.69);
    canvas.curveTo(340.42, 127.68, 340.36, 127.65, 340.28, 127.65);
    canvas.curveTo(338.36, 127.65, 323.07, 127.65, 321.15, 127.65);
    canvas.curveTo(328.42, 122.53, 333.19, 114.1, 333.19, 104.55);
    canvas.curveTo(333.19, 89.23, 320.98, 76.73, 305.8, 76.27);
    canvas.curveTo(305.78, 76.27, 305.77, 76.26, 305.75, 76.26);
    canvas.curveTo(305.73, 76.26, 305.6, 76.26, 305.58, 76.26);
    canvas.curveTo(305.37, 76.26, 305.16, 76.23, 304.94, 76.23);
    canvas.curveTo(304.88, 76.23, 304.84, 76.26, 304.78, 76.26);
    canvas.curveTo(294.03, 76.26, 240.28, 76.26, 143.53, 76.26);
    canvas.curveTo(167.07, 55.58, 180.15, 44.09, 182.77, 41.79);
    canvas.curveTo(182.83, 41.74, 182.91, 41.72, 182.97, 41.66);
    canvas.curveTo(183.07, 41.56, 183.16, 41.45, 183.25, 41.33);
    canvas.curveTo(184.47, 40.24, 185.51, 39.07, 186.21, 38.02);
    canvas.curveTo(189.3, 33.88, 190.95, 28.96, 190.95, 23.79);
    canvas.curveTo(190.95, 10.67, 180.24, 0, 167.08, 0);
    canvas.curveTo(163.25, 0, 159.61, 0.87, 156.27, 2.58);
    canvas.curveTo(156.26, 2.58, 156.26, 2.59, 156.25, 2.6);
    canvas.curveTo(156.19, 2.63, 156.12, 2.61, 156.06, 2.65);
    canvas.curveTo(145.21, 8.98, 58.39, 59.64, 47.54, 65.98);
    canvas.curveTo(47.52, 65.98, 47.52, 66, 47.5, 66.01);
    canvas.curveTo(47.48, 66.02, 47.46, 66.02, 47.44, 66.03);
    canvas.curveTo(17.74, 85.03, 0.01, 117.4, 0.01, 152.59);
    canvas.curveTo(0.01, 159.36, 0.01, 213.48, 0.01, 220.25);
    canvas.curveTo(0.01, 220.26, 0, 220.27, 0, 220.28);
    canvas.curveTo(0, 254.98, 33.17, 283.21, 73.93, 283.21);
    canvas.curveTo(92.11, 283.21, 237.49, 283.21, 255.66, 283.21);
    canvas.curveTo(255.68, 283.2, 255.7, 283.21, 255.71, 283.21);
    canvas.curveTo(270.11, 283.21, 281.81, 271.51, 281.81, 257.12);
    canvas.close();
    canvas.moveTo(5.12, 220.29);
    canvas.curveTo(5.12, 213.52, 5.12, 159.36, 5.12, 152.59);
    canvas.curveTo(5.12, 119.16, 21.96, 88.42, 50.17, 70.35);
    canvas.curveTo(60.99, 64.04, 147.5, 13.56, 158.32, 7.25);
    canvas.curveTo(158.35, 7.24, 158.37, 7.2, 158.4, 7.18);
    canvas.curveTo(158.47, 7.16, 158.53, 7.16, 158.59, 7.13);
    canvas.curveTo(161.22, 5.79, 164.07, 5.11, 167.08, 5.11);
    canvas.curveTo(177.42, 5.11, 185.83, 13.48, 185.83, 23.78);
    canvas.curveTo(185.83, 27.83, 184.54, 31.69, 182.02, 35.06);
    canvas.curveTo(181.45, 35.92, 180.58, 36.87, 179.59, 37.73);
    canvas.curveTo(179.55, 37.76, 179.54, 37.79, 179.52, 37.82);
    canvas.curveTo(175.07, 41.73, 139.49, 72.99, 135.04, 76.9);
    canvas.curveTo(135.02, 76.91, 135.02, 76.94, 135, 76.96);
    canvas.curveTo(134.79, 77.15, 134.64, 77.38, 134.5, 77.63);
    canvas.curveTo(134.47, 77.69, 134.41, 77.74, 134.39, 77.8);
    canvas.curveTo(134.25, 78.12, 134.17, 78.46, 134.17, 78.82);
    canvas.curveTo(134.17, 79.15, 134.24, 79.46, 134.36, 79.77);
    canvas.curveTo(134.41, 79.89, 134.49, 79.99, 134.56, 80.1);
    canvas.curveTo(134.64, 80.24, 134.69, 80.39, 134.81, 80.51);
    canvas.curveTo(134.83, 80.53, 134.86, 80.54, 134.88, 80.56);
    canvas.curveTo(135, 80.7, 135.16, 80.79, 135.31, 80.9);
    canvas.curveTo(135.44, 80.98, 135.55, 81.09, 135.68, 81.14);
    canvas.curveTo(135.81, 81.2, 135.96, 81.21, 136.1, 81.25);
    canvas.curveTo(136.29, 81.3, 136.46, 81.36, 136.65, 81.36);
    canvas.curveTo(136.68, 81.36, 136.7, 81.38, 136.73, 81.38);
    canvas.curveTo(153.58, 81.38, 288.41, 81.38, 305.26, 81.38);
    canvas.curveTo(317.86, 81.56, 328.07, 91.86, 328.07, 104.55);
    canvas.curveTo(328.07, 117.19, 317.86, 127.46, 305.26, 127.64);
    canvas.curveTo(294.78, 127.64, 210.94, 127.64, 200.46, 127.64);
    canvas.curveTo(199.05, 127.64, 197.9, 128.79, 197.9, 130.2);
    canvas.curveTo(197.9, 131.62, 199.05, 132.76, 200.46, 132.76);
    canvas.curveTo(210.89, 132.76, 294.35, 132.76, 304.78, 132.76);
    canvas.curveTo(304.84, 132.77, 304.88, 132.79, 304.94, 132.79);
    canvas.curveTo(305.15, 132.79, 305.36, 132.77, 305.58, 132.76);
    canvas.curveTo(309.03, 132.76, 336.66, 132.76, 340.11, 132.76);
    canvas.curveTo(340.17, 132.77, 340.22, 132.79, 340.27, 132.79);
    canvas.curveTo(352.77, 132.79, 362.95, 142.97, 362.95, 155.47);
    canvas.curveTo(362.95, 167.97, 352.8, 178.14, 340.31, 178.16);
    canvas.curveTo(340.3, 178.16, 340.29, 178.15, 340.27, 178.15);
    canvas.curveTo(325.79, 178.15, 209.98, 178.15, 195.5, 178.15);
    canvas.curveTo(194.09, 178.15, 192.94, 179.3, 192.94, 180.71);
    canvas.curveTo(192.94, 182.12, 194.09, 183.27, 195.5, 183.27);
    canvas.curveTo(206.55, 183.27, 294.95, 183.27, 306, 183.27);
    canvas.curveTo(306.02, 183.27, 306.03, 183.28, 306.05, 183.28);
    canvas.curveTo(319.09, 183.28, 329.69, 194.02, 329.69, 207.22);
    canvas.curveTo(329.69, 219.55, 320.61, 229.76, 308.54, 231.02);
    canvas.curveTo(295.07, 231.02, 187.3, 231.02, 173.83, 231.02);
    canvas.curveTo(172.42, 231.02, 171.27, 232.17, 171.27, 233.58);
    canvas.curveTo(171.27, 234.99, 172.42, 236.14, 173.83, 236.14);
    canvas.curveTo(182.02, 236.14, 247.53, 236.14, 255.71, 236.14);
    canvas.curveTo(267.28, 236.14, 276.69, 245.55, 276.69, 257.12);
    canvas.curveTo(276.69, 268.66, 267.31, 278.06, 255.77, 278.09);
    canvas.curveTo(255.76, 278.09, 255.76, 278.08, 255.75, 278.08);
    canvas.curveTo(237.56, 278.08, 92.11, 278.08, 73.93, 278.08);
    canvas.curveTo(36, 278.08, 5.14, 252.18, 5.12, 220.31);
    canvas.curveTo(5.12, 220.3, 5.12, 220.3, 5.12, 220.29);
    canvas.close();
    canvas.fillAndStroke();
    canvas.begin();
    canvas.moveTo(281.81, 257.12);
    canvas.curveTo(281.81, 248.49, 277.56, 240.9, 271.09, 236.14);
    canvas.curveTo(274.85, 236.14, 304.96, 236.14, 308.73, 236.14);
    canvas.curveTo(308.77, 236.14, 308.81, 236.12, 308.86, 236.12);
    canvas.curveTo(308.9, 236.11, 308.94, 236.13, 308.98, 236.13);
    canvas.curveTo(323.71, 234.64, 334.81, 222.21, 334.81, 207.22);
    canvas.curveTo(334.81, 197.3, 329.85, 188.52, 322.31, 183.27);
    canvas.curveTo(324.1, 183.27, 338.43, 183.27, 340.23, 183.27);
    canvas.curveTo(340.25, 183.27, 340.26, 183.28, 340.28, 183.28);
    canvas.curveTo(355.61, 183.28, 368.08, 170.81, 368.08, 155.48);
    canvas.curveTo(368.08, 140.22, 355.72, 127.81, 340.49, 127.69);
    canvas.curveTo(340.42, 127.68, 340.36, 127.65, 340.28, 127.65);
    canvas.curveTo(338.36, 127.65, 323.07, 127.65, 321.15, 127.65);
    canvas.curveTo(328.42, 122.53, 333.19, 114.1, 333.19, 104.55);
    canvas.curveTo(333.19, 89.23, 320.98, 76.73, 305.8, 76.27);
    canvas.curveTo(305.78, 76.27, 305.77, 76.26, 305.75, 76.26);
    canvas.curveTo(305.73, 76.26, 305.6, 76.26, 305.58, 76.26);
    canvas.curveTo(305.37, 76.26, 305.16, 76.23, 304.94, 76.23);
    canvas.curveTo(304.88, 76.23, 304.84, 76.26, 304.78, 76.26);
    canvas.curveTo(294.03, 76.26, 240.28, 76.26, 143.53, 76.26);
    canvas.curveTo(167.07, 55.58, 180.15, 44.09, 182.77, 41.79);
    canvas.curveTo(182.83, 41.74, 182.91, 41.72, 182.97, 41.66);
    canvas.curveTo(183.07, 41.56, 183.16, 41.45, 183.25, 41.33);
    canvas.curveTo(184.47, 40.24, 185.51, 39.07, 186.21, 38.02);
    canvas.curveTo(189.3, 33.88, 190.95, 28.96, 190.95, 23.79);
    canvas.curveTo(190.95, 10.67, 180.24, 0, 167.08, 0);
    canvas.curveTo(163.25, 0, 159.61, 0.87, 156.27, 2.58);
    canvas.curveTo(156.26, 2.58, 156.26, 2.59, 156.25, 2.6);
    canvas.curveTo(156.19, 2.63, 156.12, 2.61, 156.06, 2.65);
    canvas.curveTo(145.21, 8.98, 58.39, 59.64, 47.54, 65.98);
    canvas.curveTo(47.52, 65.98, 47.52, 66, 47.5, 66.01);
    canvas.curveTo(47.48, 66.02, 47.46, 66.02, 47.44, 66.03);
    canvas.curveTo(17.74, 85.03, 0.01, 117.4, 0.01, 152.59);
    canvas.curveTo(0.01, 159.36, 0.01, 213.48, 0.01, 220.25);
    canvas.curveTo(0.01, 220.26, 0, 220.27, 0, 220.28);
    canvas.curveTo(0, 254.98, 33.17, 283.21, 73.93, 283.21);
    canvas.curveTo(92.11, 283.21, 237.49, 283.21, 255.66, 283.21);
    canvas.curveTo(255.68, 283.2, 255.7, 283.21, 255.71, 283.21);
    canvas.curveTo(270.11, 283.21, 281.81, 271.51, 281.81, 257.12);
    canvas.close();
    canvas.moveTo(5.12, 220.29);
    canvas.curveTo(5.12, 213.52, 5.12, 159.36, 5.12, 152.59);
    canvas.curveTo(5.12, 119.16, 21.96, 88.42, 50.17, 70.35);
    canvas.curveTo(60.99, 64.04, 147.5, 13.56, 158.32, 7.25);
    canvas.curveTo(158.35, 7.24, 158.37, 7.2, 158.4, 7.18);
    canvas.curveTo(158.47, 7.16, 158.53, 7.16, 158.59, 7.13);
    canvas.curveTo(161.22, 5.79, 164.07, 5.11, 167.08, 5.11);
    canvas.curveTo(177.42, 5.11, 185.83, 13.48, 185.83, 23.78);
    canvas.curveTo(185.83, 27.83, 184.54, 31.69, 182.02, 35.06);
    canvas.curveTo(181.45, 35.92, 180.58, 36.87, 179.59, 37.73);
    canvas.curveTo(179.55, 37.76, 179.54, 37.79, 179.52, 37.82);
    canvas.curveTo(175.07, 41.73, 139.49, 72.99, 135.04, 76.9);
    canvas.curveTo(135.02, 76.91, 135.02, 76.94, 135, 76.96);
    canvas.curveTo(134.79, 77.15, 134.64, 77.38, 134.5, 77.63);
    canvas.curveTo(134.47, 77.69, 134.41, 77.74, 134.39, 77.8);
    canvas.curveTo(134.25, 78.12, 134.17, 78.46, 134.17, 78.82);
    canvas.curveTo(134.17, 79.15, 134.24, 79.46, 134.36, 79.77);
    canvas.curveTo(134.41, 79.89, 134.49, 79.99, 134.56, 80.1);
    canvas.curveTo(134.64, 80.24, 134.69, 80.39, 134.81, 80.51);
    canvas.curveTo(134.83, 80.53, 134.86, 80.54, 134.88, 80.56);
    canvas.curveTo(135, 80.7, 135.16, 80.79, 135.31, 80.9);
    canvas.curveTo(135.44, 80.98, 135.55, 81.09, 135.68, 81.14);
    canvas.curveTo(135.81, 81.2, 135.96, 81.21, 136.1, 81.25);
    canvas.curveTo(136.29, 81.3, 136.46, 81.36, 136.65, 81.36);
    canvas.curveTo(136.68, 81.36, 136.7, 81.38, 136.73, 81.38);
    canvas.curveTo(153.58, 81.38, 288.41, 81.38, 305.26, 81.38);
    canvas.curveTo(317.86, 81.56, 328.07, 91.86, 328.07, 104.55);
    canvas.curveTo(328.07, 117.19, 317.86, 127.46, 305.26, 127.64);
    canvas.curveTo(294.78, 127.64, 210.94, 127.64, 200.46, 127.64);
    canvas.curveTo(199.05, 127.64, 197.9, 128.79, 197.9, 130.2);
    canvas.curveTo(197.9, 131.62, 199.05, 132.76, 200.46, 132.76);
    canvas.curveTo(210.89, 132.76, 294.35, 132.76, 304.78, 132.76);
    canvas.curveTo(304.84, 132.77, 304.88, 132.79, 304.94, 132.79);
    canvas.curveTo(305.15, 132.79, 305.36, 132.77, 305.58, 132.76);
    canvas.curveTo(309.03, 132.76, 336.66, 132.76, 340.11, 132.76);
    canvas.curveTo(340.17, 132.77, 340.22, 132.79, 340.27, 132.79);
    canvas.curveTo(352.77, 132.79, 362.95, 142.97, 362.95, 155.47);
    canvas.curveTo(362.95, 167.97, 352.8, 178.14, 340.31, 178.16);
    canvas.curveTo(340.3, 178.16, 340.29, 178.15, 340.27, 178.15);
    canvas.curveTo(325.79, 178.15, 209.98, 178.15, 195.5, 178.15);
    canvas.curveTo(194.09, 178.15, 192.94, 179.3, 192.94, 180.71);
    canvas.curveTo(192.94, 182.12, 194.09, 183.27, 195.5, 183.27);
    canvas.curveTo(206.55, 183.27, 294.95, 183.27, 306, 183.27);
    canvas.curveTo(306.02, 183.27, 306.03, 183.28, 306.05, 183.28);
    canvas.curveTo(319.09, 183.28, 329.69, 194.02, 329.69, 207.22);
    canvas.curveTo(329.69, 219.55, 320.61, 229.76, 308.54, 231.02);
    canvas.curveTo(295.07, 231.02, 187.3, 231.02, 173.83, 231.02);
    canvas.curveTo(172.42, 231.02, 171.27, 232.17, 171.27, 233.58);
    canvas.curveTo(171.27, 234.99, 172.42, 236.14, 173.83, 236.14);
    canvas.curveTo(182.02, 236.14, 247.53, 236.14, 255.71, 236.14);
    canvas.curveTo(267.28, 236.14, 276.69, 245.55, 276.69, 257.12);
    canvas.curveTo(276.69, 268.66, 267.31, 278.06, 255.77, 278.09);
    canvas.curveTo(255.76, 278.09, 255.76, 278.08, 255.75, 278.08);
    canvas.curveTo(237.56, 278.08, 92.11, 278.08, 73.93, 278.08);
    canvas.curveTo(36, 278.08, 5.14, 252.18, 5.12, 220.31);
    canvas.curveTo(5.12, 220.3, 5.12, 220.3, 5.12, 220.29);
    canvas.close();
    canvas.fillAndStroke();
  }
}

export class IconPainterProvider {
  private static instance = new IconPainter();

  static get(): IconPainter {
    return this.instance;
  }
  static set(painter: IconPainter): void {
    this.instance = painter;
  }
}
