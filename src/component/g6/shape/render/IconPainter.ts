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

/*
import BpmnCanvas from './BpmnCanvas';
import { IconStyleConfiguration, ShapeConfiguration, Size } from './render-types';
import { mxAbstractCanvas2D, mxShape } from 'mxgraph'; // for types

export interface PaintParameter {
  // c: mxAbstractCanvas2D;
  shape: ShapeConfiguration;
  icon: IconStyleConfiguration;
  ratioFromParent?: number;
  setIconOrigin: (canvas: BpmnCanvas) => void;
}
export default class IconPainter {}
/*
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
  paintEmptyIcon(): void {
    // empty by nature
  }

  /!**
   * Utility paint icon methods to easily instantiate a {@link BpmnCanvas} from a {@link PaintParameter}.
   *
   * @param c                       mxgraph `mxAbstractCanvas2D` in charge of performing the paint operations.
   * @param ratioFromParent         the actual size of the icon will be computed from the shape dimensions using this ratio.
   * @param setIconOrigin           called function to set the origin of the icon. Generally, it calls a method of {@link BpmnCanvas}.
   * @param shape                   dimension and style of the shape where the icon is painted.
   * @param icon                    style of the icon.
   * @param originalIconSize        original size of the icon used to compute the scaling/ratio in {@link BpmnCanvas}.
   * @protected
   *!/
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

  /!**
   * This icon is used by `message event`, `receive task`, `send task`.
   *!/
  paintEnvelopeIcon(paintParameter: PaintParameter): void {
    // this implementation is adapted from the draw.io BPMN 'message' symbol
    // https://github.com/jgraph/drawio/blob/0e19be6b42755790a749af30450c78c0d83be765/src/main/webapp/shapes/bpmn/mxBpmnShape2.js#L465
    const originalIconSize = { width: 485.41, height: 321.76 };
    const canvas = this.newBpmnCanvas(paintParameter, originalIconSize);

    const w = originalIconSize.width;
    const h = originalIconSize.height;

    // Paint the envelope outline with dark color
    canvas.rect(0, 0, w, h);
    canvas.fillAndStroke();

    const { icon } = paintParameter;
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

  /!**
   * This icon is used by `inclusive gateway` and `terminate event`.
   *!/
  paintCircleIcon(paintParameter: PaintParameter): void {
    // highly inspired from mxDoubleEllipse
    const originalIconSize = { width: paintParameter.shape.w, height: paintParameter.shape.h };
    const canvas = this.newBpmnCanvas(paintParameter, originalIconSize);

    const w = originalIconSize.width;
    const h = originalIconSize.height;
    if (w > 0 && h > 0) {
      canvas.ellipse(0, 0, w, h);
    }

    if (paintParameter.icon.isFilled) {
      canvas.fillAndStroke();
    } else {
      canvas.stroke();
    }
  }

  /!**
   * This icon is used by `timer event`.
   *!/
  paintClockIcon(paintParameter: PaintParameter): void {
    // implementation adapted from https://www.flaticon.com/free-icon/clock_223404
    const canvas = this.newBpmnCanvas(paintParameter, { height: 152, width: 152 });

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

  /!**
   * This icon is used by `signal event`.
   *!/
  paintTriangleIcon(paintParameter: PaintParameter): void {
    // implementation adapted from https://thenounproject.com/term/triangle/2452089/
    const canvas = this.newBpmnCanvas(paintParameter, { height: 735, width: 849 });

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

  /!**
   * This icon is used by `escalation event`.
   *!/
  paintUpArrowheadIcon(paintParameter: PaintParameter): void {
    const canvas = this.newBpmnCanvas(paintParameter, { height: 50, width: 40 });

    canvas.begin();
    canvas.moveTo(0, 49.5);
    canvas.lineTo(19.5, 1);
    canvas.curveTo(19.75, 0.25, 20, 0, 20.25, 0.25);
    canvas.lineTo(40, 49.5);
    canvas.curveTo(40, 49.5, 39.75, 50, 39.6, 49.75);
    canvas.lineTo(20, 30);
    canvas.lineTo(0.4, 49.75);
    canvas.curveTo(0.4, 49.75, 0.25, 50, 0, 49.5);
    canvas.close();
    canvas.fillAndStroke();
  }

  /!**
   * This icon is used by `compensation event`.
   *!/
  paintDoubleLeftArrowheadsIcon(paintParameter: PaintParameter): void {
    const canvas = this.newBpmnCanvas(paintParameter, { height: 53.5, width: 105 });

    canvas.begin();
    canvas.moveTo(91.4, 0);
    canvas.curveTo(91.4, 0, 91.2, 0, 91, 0.2);
    canvas.lineTo(50, 25);
    canvas.curveTo(47.9, 25.8, 46.7, 26.6, 46.4, 27.3);
    canvas.lineTo(46.4, 0);
    canvas.curveTo(46.4, 0, 46.2, 0, 46, 0.2);
    canvas.lineTo(4.9, 25);
    canvas.curveTo(2, 26.2, 0, 27.3, 4.9, 28.5);
    canvas.lineTo(45.8, 53);
    canvas.curveTo(46, 53.3, 46.2, 53.5, 46.4, 53.5);
    canvas.lineTo(46.4, 27);
    canvas.curveTo(46.6, 27.3, 47.8, 28.1, 49.9, 29.9);
    canvas.lineTo(90.8, 53.3);
    canvas.curveTo(91, 53.3, 91.2, 53.5, 91.4, 53.5);
    canvas.lineTo(91.4, 0);
    canvas.close();
    canvas.fillAndStroke();
  }

  private drawCrossIcon(paintParameter: PaintParameter): BpmnCanvas {
    const canvas = this.newBpmnCanvas(paintParameter, { height: 1, width: 1 });
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
    return canvas;
  }

  /!**
   * This icon is used by `conditional event`.
   *!/
  paintListIcon(paintParameter: PaintParameter): void {
    const canvas = this.newBpmnCanvas(paintParameter, { height: 60, width: 60 });

    canvas.begin();
    canvas.moveTo(0, 0);
    canvas.lineTo(60, 0);
    canvas.lineTo(60, 60);
    canvas.lineTo(0, 60);
    canvas.lineTo(0, 0);
    canvas.close();
    canvas.moveTo(5, 5);
    canvas.lineTo(55, 5);
    canvas.close();
    canvas.moveTo(5, 21.6);
    canvas.lineTo(55, 21.6);
    canvas.close();
    canvas.moveTo(5, 38.3);
    canvas.lineTo(55, 38.3);
    canvas.close();
    canvas.moveTo(5, 55);
    canvas.lineTo(55, 55);
    canvas.close();
    canvas.fillAndStroke();
  }

  /!**
   * This icon is used by `exclusive gateway`.
   *!/
  paintXCrossIcon(paintParameter: PaintParameter): void {
    const canvas = this.drawCrossIcon(paintParameter);
    canvas.rotateOnIconCenter(45);
    canvas.fillAndStroke();
  }

  /!**
<<<<<<< HEAD:src/component/g6/shape/IconPainter.ts
   * This icon is used by `parallel gateway` and 'event-based gateway'.
   *!/
  paintPlusCrossIcon(paintParameter: PaintParameter): void {
    this.drawCrossIcon(paintParameter).fillAndStroke();
=======
   * This icon is used by `parallel gateway`.
   *!/
  public paintPlusCrossIcon({ c, ratioFromParent, setIconOrigin, shape, icon }: PaintParameter): void {
    const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon: { ...icon, isFilled: true } }, { height: 0.5, width: 0.5 });

    IconPainter.drawCrossIcon(canvas);
    canvas.fillAndStroke();
>>>>>>> 41cb26c... Copy old mxGraph files conf:src/component/g6/node/render/IconPainter.ts
  }

  /!**
   * This icon is used by `user task`.
   *!/
  paintPersonIcon(paintParameter: PaintParameter): void {
    // implementation adapted from https://www.flaticon.com/free-icon/employees_554768
    // use https://github.com/process-analytics/mxgraph-svg2shape to generate the xml stencil and port it to code
    const canvas = this.newBpmnCanvas({ ...paintParameter, icon: { ...paintParameter.icon, isFilled: true } }, { height: 239.68, width: 143.61 });

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

  /!**
   * This icon is used by `service tasks`.
   *!/
  paintGearIcon(paintParameter: PaintParameter): void {
    // this implementation is adapted from the draw.io BPMN 'Service Task' stencil
    // https://github.com/jgraph/drawio/blob/9394fb0f1430d2c869865827b2bbef5639f63478/src/main/webapp/stencils/bpmn.xml#L898
    // icon coordinates fill a 100x100 rectangle (approximately: 90x90 + foreground translation)
    const canvas = this.newBpmnCanvas(paintParameter, { height: 100, width: 100 });

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

  /!**
   * This icon is used to display the `expand marker` on `activities`.
   *!/
  paintExpandIcon(paintParameter: PaintParameter): void {
    const originalIconSize = { width: 16, height: 16 };
    const canvas = this.newBpmnCanvas(paintParameter, originalIconSize);

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

  /!**
   * This icon is used to display the `loop marker` on `activities`.
   *!/
  paintLoopIcon(paintParameter: PaintParameter): void {
    // this implementation is adapted from the draw.io BPMN 'Loop'
    // https://github.com/jgraph/drawio/blob/9394fb0f1430d2c869865827b2bbef5639f63478/src/main/webapp/stencils/bpmn.xml#L543
    const { icon } = paintParameter;
    icon.fillColor = icon.strokeColor;
    const canvas = this.newBpmnCanvas(paintParameter, { width: 22.49, height: 21.62 });

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

  /!**
   * This icon is used to display the `sequential multi-instance marker` on `activities`.
   *!/
  paintSequentialMultiInstanceIcon(paintParameter: PaintParameter): void {
    const originalIconSize = { width: 16, height: 16 };
    const canvas = this.newBpmnCanvas(paintParameter, originalIconSize);
    const { c, icon } = paintParameter;
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

  /!**
   * This icon is used to display the `parallel multi-instance marker` on `activities`.
   *!/
  paintParallelMultiInstanceIcon(paintParameter: PaintParameter): void {
    const originalIconSize = { width: 16, height: 16 };
    const canvas = this.newBpmnCanvas(paintParameter, originalIconSize);
    const { c, icon } = paintParameter;
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

  /!**
   * This icon is used by `link event`.
   *!/
  paintRightArrowIcon(paintParameter: PaintParameter): void {
    // this implementation is adapted from https://www.flaticon.com/free-icon/right-arrow_222330
    const canvas = this.newBpmnCanvas(paintParameter, { width: 512, height: 415.23 });
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

  /!**
   * This icon is used by `error event`.
   *!/
  paintErrorIcon(paintParameter: PaintParameter): void {
    const canvas = this.newBpmnCanvas(paintParameter, { width: 72.44, height: 71.82 });

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

  /!**
   * This icon is used by `manual task`.
   *!/
  paintHandIcon(paintParameter: PaintParameter): void {
    // this implementation is adapted from the noun project 'hand' icon
    // https://thenounproject.com/term/hand/7660/
    const canvas = this.newBpmnCanvas(paintParameter, { width: 343.65, height: 354.12 });

    canvas.begin();
    canvas.moveTo(231.66, 336.39);
    canvas.curveTo(240.84, 316.9, 220.53, 306.92, 220.53, 306.92);
    canvas.curveTo(215.2, 303.67, 188.58, 287.43, 140.67, 258.19);
    canvas.lineTo(146.33, 248.39);
    canvas.curveTo(223.98, 269.38, 267.12, 281.04, 275.75, 283.38);
    canvas.curveTo(275.75, 283.38, 297.25, 288, 301.42, 267.77);
    canvas.curveTo(306.34, 245.29, 288.32, 238.63, 288.32, 238.63);
    canvas.curveTo(279.91, 236.44, 237.86, 225.48, 162.18, 205.75);
    canvas.lineTo(165.2, 194.8);
    canvas.curveTo(255.88, 204.4, 306.27, 209.73, 316.34, 210.8);
    canvas.curveTo(316.34, 210.8, 339.89, 212.16, 341.76, 189.55);
    canvas.curveTo(343.65, 166.93, 320.5, 164.13, 320.5, 164.13);
    canvas.curveTo(310.43, 163.1, 260.04, 157.99, 169.35, 148.77);
    canvas.lineTo(169.35, 138.97);
    canvas.curveTo(253.41, 132.12, 300.11, 128.32, 309.45, 127.56);
    canvas.curveTo(309.45, 127.56, 332.27, 122.38, 332.27, 102.61);
    canvas.curveTo(332.27, 82.85, 305.48, 81.87, 305.48, 81.87);
    canvas.curveTo(293.99, 82.2, 236.54, 83.88, 133.13, 86.9);
    canvas.lineTo(127.61, 81.87);
    canvas.curveTo(145.3, 59.39, 155.12, 46.9, 157.09, 44.41);
    canvas.curveTo(157.09, 44.41, 171.12, 26.8, 156.78, 12.72);
    canvas.curveTo(143.83, 0, 124.08, 14.49, 124.08, 14.49);
    canvas.curveTo(116.45, 19.41, 78.35, 44.06, 9.77, 88.43);
    canvas.lineTo(0, 251.94);
    canvas.curveTo(122.84, 308.79, 191.09, 340.37, 204.74, 346.69);
    canvas.curveTo(204.74, 346.69, 222.91, 354.12, 231.66, 336.39);
    canvas.fillAndStroke();
  }

  /!**
   * This icon is used by `script task`.
   *!/
  paintScriptIcon(paintParameter: PaintParameter): void {
    // this implementation is adapted from the noun project 'script' icon
    // https://thenounproject.com/term/script/2331578/
    paintParameter.icon.fillColor = paintParameter.icon.strokeColor;
    const canvas = this.newBpmnCanvas(paintParameter, { width: 458.75, height: 461.64 });

    // Shape
    canvas.begin();
    canvas.moveTo(67.85, 0.57);
    canvas.curveTo(50.73, 0, 33.26, 8.86, 22.35, 18.84);
    canvas.curveTo(8.11, 32.15, 0, 50.77, 0, 70.26);
    canvas.curveTo(0, 73.15, 0, 87.59, 0, 113.6);
    canvas.curveTo(55.4, 113.6, 86.18, 113.6, 92.33, 113.6);
    canvas.curveTo(94.92, 150.46, 85.64, 180.4, 74.22, 211.27);
    canvas.curveTo(40.16, 298.07, 30.77, 339.83, 55.56, 410.87);
    canvas.curveTo(63.72, 438.26, 87.59, 457.85, 114.91, 461.09);
    canvas.curveTo(216.96, 460.85, 294.9, 461.64, 388.41, 461.2);
    canvas.curveTo(407.2, 461.09, 425.14, 453.55, 438.3, 440.13);
    canvas.curveTo(451.46, 426.71, 458.75, 403.06, 458.46, 384.26);
    canvas.curveTo(458.43, 382.23, 458.18, 365.93, 458.15, 363.89);
    canvas.curveTo(432.12, 364.24, 406.09, 364.04, 380.06, 364.04);
    canvas.curveTo(377.61, 347.52, 377.24, 337.58, 378.28, 324.48);
    canvas.curveTo(380.5, 296.47, 389.08, 273.36, 398.59, 247.1);
    canvas.curveTo(408.11, 220.83, 418.41, 191.47, 420.86, 154.24);
    canvas.curveTo(422.11, 135.34, 421.4, 110.24, 417.77, 86.75);
    canvas.curveTo(417.76, 86.71, 417.73, 86.54, 417.69, 86.22);
    canvas.curveTo(417.64, 85.95, 417.61, 85.79, 417.6, 85.76);
    canvas.curveTo(414.03, 68.13, 410.49, 48.84, 399.79, 31.47);
    canvas.curveTo(389.09, 14.11, 366.95, 0.59, 341.75, 0.59);
    canvas.curveTo(286.97, 0.59, 122.63, 0.57, 67.85, 0.57);
    canvas.close();
    canvas.moveTo(85.04, 72.68);
    canvas.curveTo(80.63, 72.68, 45.33, 72.68, 40.92, 72.68);
    canvas.curveTo(40.46, 58.4, 47.15, 51.87, 50.27, 48.75);
    canvas.curveTo(55.8, 44.28, 59.84, 41, 73.82, 41);
    canvas.curveTo(78.45, 52.13, 82.23, 62.71, 85.04, 72.68);
    canvas.close();
    canvas.moveTo(364.94, 52.9);
    canvas.curveTo(370, 61.11, 373.9, 76.44, 377.38, 93.51);
    canvas.curveTo(380.35, 113.1, 381.01, 136.42, 380.02, 151.57);
    canvas.curveTo(377.97, 182.76, 369.51, 207.12, 360.1, 233.1);
    canvas.curveTo(350.69, 259.09, 340.27, 286.77, 337.53, 321.27);
    canvas.curveTo(336.38, 335.86, 336.72, 346.69, 338.87, 364.01);
    canvas.curveTo(326.35, 364.01, 263.75, 364.01, 151.06, 364.01);
    canvas.curveTo(151.06, 382.2, 151.06, 392.31, 151.06, 394.33);
    canvas.curveTo(147.77, 404.8, 138.9, 418.2, 127.43, 419.94);
    canvas.curveTo(111.49, 422.35, 97.86, 411.8, 94.75, 399.19);
    canvas.curveTo(65.14, 321.99, 94.93, 275.54, 112.57, 225.47);
    canvas.curveTo(130.14, 177.95, 137.92, 117.41, 112.71, 42.09);
    canvas.curveTo(192.88, 41.9, 274.33, 42.21, 342.89, 41.98);
    canvas.curveTo(357.15, 42.03, 359.83, 44.61, 364.94, 52.9);
    canvas.close();
    canvas.moveTo(409.96, 399.48);
    canvas.curveTo(409.96, 408.42, 398.54, 425.67, 392.02, 425.67);
    canvas.curveTo(325.19, 425.79, 252.29, 425.67, 185.23, 425.67);
    canvas.curveTo(189.88, 424.43, 194.66, 405.64, 194.66, 399.48);
    canvas.curveTo(237.72, 399.48, 388.43, 399.48, 409.96, 399.48);
    canvas.close();
    canvas.fill();

    // Lines
    canvas.begin();
    canvas.moveTo(182.1, 131.2);
    canvas.lineTo(182.1, 151.68);
    canvas.lineTo(321.89, 151.68);
    canvas.lineTo(321.89, 131.2);
    canvas.lineTo(182.1, 131.2);
    canvas.close();
    canvas.moveTo(162.25, 251.09);
    canvas.lineTo(162.25, 271.49);
    canvas.lineTo(301.96, 271.49);
    canvas.lineTo(301.96, 251.09);
    canvas.lineTo(162.25, 251.09);
    canvas.close();
    canvas.fill();
  }

  /!**
   * This icon is used by `business rule task`.
   *!/
  paintTableIcon(paintParameter: PaintParameter): void {
    const canvas = this.newBpmnCanvas(paintParameter, { width: 640, height: 640 });

    // Shape
    canvas.begin();
    canvas.moveTo(0.19, 0.1);
    canvas.lineTo(298.78, 0.1);
    canvas.lineTo(298.78, 198.88);
    canvas.lineTo(0.19, 198.88);
    canvas.lineTo(0.19, 0.1);
    canvas.close();
    canvas.fillAndStroke();
    canvas.begin();
    canvas.moveTo(0, 0);
    canvas.lineTo(298.78, 0);
    canvas.lineTo(298.78, 48.88);
    canvas.lineTo(0, 48.88);
    canvas.lineTo(0, 0);
    canvas.close();
    canvas.fillAndStroke();
    canvas.begin();
    canvas.moveTo(0, 48.88);
    canvas.lineTo(98.78, 48.88);
    canvas.lineTo(98.78, 198.88);
    canvas.lineTo(0, 198.88);
    canvas.lineTo(0, 48.88);
    canvas.close();
    canvas.fillAndStroke();
    canvas.begin();
    canvas.moveTo(1.09, 122.69);
    canvas.lineTo(298.78, 122.69);
    canvas.close();
    canvas.fillAndStroke();

    canvas.setFillColor(paintParameter.icon.strokeColor);
    canvas.begin();
    canvas.moveTo(0, 0);
    canvas.lineTo(298.78, 0);
    canvas.lineTo(298.78, 48.88);
    canvas.lineTo(0, 48.88);
    canvas.lineTo(0, 0);
    canvas.close();
    canvas.fillAndStroke();
  }

  /!**
   * This icon is used by `event-based gateway`.
   *!/
  paintPentagon(paintParameter: PaintParameter): void {
    const canvas = this.newBpmnCanvas(paintParameter, { width: 16, height: 16 });

    // Shape
    canvas.begin();
    canvas.moveTo(16, 6.5);
    canvas.lineTo(8, 0);
    canvas.lineTo(0, 6.5);
    canvas.lineTo(3, 16);
    canvas.lineTo(13, 16);
    canvas.lineTo(16, 6.5);
    canvas.lineTo(8, 0); // extra line to ensure the path is fully closed (otherwise, there is a glitch on the latest corner)
    canvas.stroke();
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
*/
