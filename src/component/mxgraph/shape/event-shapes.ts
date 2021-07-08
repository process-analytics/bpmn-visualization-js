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

import { ShapeBpmnEventDefinitionKind } from '../../../model/bpmn/internal';
import { BpmnCanvas, PaintParameter, IconPainterProvider } from './render';
import { buildPaintParameter } from './render/icon-painter';
import { StyleDefault, StyleUtils } from '../style';
import type { mxAbstractCanvas2D } from 'mxgraph';
import { mxgraph } from '../initializer';

/**
 * @internal
 */
export class EventShape extends mxgraph.mxEllipse {
  protected iconPainter = IconPainterProvider.get();

  // refactor: when all/more event types will be supported, we could move to a Record/MappedType
  private iconPainters: Map<ShapeBpmnEventDefinitionKind, (paintParameter: PaintParameter) => void> = new Map([
    [ShapeBpmnEventDefinitionKind.MESSAGE, (paintParameter: PaintParameter) => this.iconPainter.paintEnvelopeIcon({ ...paintParameter, ratioFromParent: 0.5 })],
    [ShapeBpmnEventDefinitionKind.TERMINATE, (paintParameter: PaintParameter) => this.iconPainter.paintCircleIcon({ ...paintParameter, ratioFromParent: 0.6 })],
    [
      ShapeBpmnEventDefinitionKind.TIMER,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintClockIcon({ ...paintParameter, setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(5) }),
    ],
    [
      ShapeBpmnEventDefinitionKind.SIGNAL,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintTriangleIcon({
          ...paintParameter,
          ratioFromParent: 0.55,
          iconStyleConfig: { ...paintParameter.iconStyleConfig, strokeWidth: StyleDefault.STROKE_WIDTH_THIN.valueOf() },
          setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(4),
        }),
    ],
    [
      ShapeBpmnEventDefinitionKind.LINK,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintRightArrowIcon({ ...paintParameter, ratioFromParent: 0.55, iconStyleConfig: { ...paintParameter.iconStyleConfig, strokeWidth: 1.5 } }),
    ],
    [
      ShapeBpmnEventDefinitionKind.ERROR,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintErrorIcon({ ...paintParameter, ratioFromParent: 0.55, iconStyleConfig: { ...paintParameter.iconStyleConfig, strokeWidth: 1.5 } }),
    ],
    [
      ShapeBpmnEventDefinitionKind.COMPENSATION,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintDoubleLeftArrowheadsIcon({ ...paintParameter, ratioFromParent: 0.7, iconStyleConfig: { ...paintParameter.iconStyleConfig, strokeWidth: 1.5 } }),
    ],
    [ShapeBpmnEventDefinitionKind.CANCEL, (paintParameter: PaintParameter) => this.iconPainter.paintXCrossIcon({ ...paintParameter, ratioFromParent: 0.78 })],
    [
      ShapeBpmnEventDefinitionKind.ESCALATION,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintUpArrowheadIcon({
          ...paintParameter,
          ratioFromParent: 0.55,
          iconStyleConfig: { ...paintParameter.iconStyleConfig, strokeWidth: StyleDefault.STROKE_WIDTH_THIN.valueOf() },
        }),
    ],
    [
      ShapeBpmnEventDefinitionKind.CONDITIONAL,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintListIcon({ ...paintParameter, ratioFromParent: 0.6, iconStyleConfig: { ...paintParameter.iconStyleConfig, strokeWidth: 1.5 } }),
    ],
  ]);

  protected withFilledIcon = false;

  constructor() {
    super(undefined, undefined, undefined); // the configuration is passed with the styles at runtime
  }

  paintVertexShape(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    const paintParameter = buildPaintParameter({ canvas: c, x, y, width: w, height: h, shape: this, isFilled: this.withFilledIcon });

    EventShape.setDashedOuterShapePattern(paintParameter, StyleUtils.getBpmnIsInterrupting(this.style));
    this.paintOuterShape(paintParameter);
    EventShape.restoreOriginalOuterShapePattern(paintParameter);

    this.paintInnerShape(paintParameter);
  }

  protected paintOuterShape({ canvas, shapeConfig: { x, y, width, height } }: PaintParameter): void {
    super.paintVertexShape(canvas, x, y, width, height);
  }

  private paintInnerShape(paintParameter: PaintParameter): void {
    const paintIcon = this.iconPainters.get(StyleUtils.getBpmnEventDefinitionKind(this.style)) || (() => this.iconPainter.paintEmptyIcon());
    paintIcon(paintParameter);
  }

  private static setDashedOuterShapePattern(paintParameter: PaintParameter, isInterrupting: string): void {
    paintParameter.canvas.save(); // ensure we can later restore the configuration
    if (isInterrupting === 'false') {
      paintParameter.canvas.setDashed(true, false);
      paintParameter.canvas.setDashPattern('3 2');
    }
  }

  private static restoreOriginalOuterShapePattern(paintParameter: PaintParameter): void {
    paintParameter.canvas.restore();
  }
}

/**
 * @internal
 */
export class EndEventShape extends EventShape {
  constructor() {
    super();
    this.withFilledIcon = true;
  }
}

/**
 * @internal
 */
export class IntermediateEventShape extends EventShape {
  // this implementation is adapted from the draw.io BPMN 'throwing' outlines
  // https://github.com/jgraph/drawio/blob/0e19be6b42755790a749af30450c78c0d83be765/src/main/webapp/shapes/bpmn/mxBpmnShape2.js#L431
  protected paintOuterShape({ canvas, shapeConfig: { x, y, width, height, strokeWidth } }: PaintParameter): void {
    canvas.ellipse(x, y, width, height);
    canvas.fillAndStroke();

    const inset = strokeWidth * 1.5;
    canvas.ellipse(width * 0.02 + inset + x, height * 0.02 + inset + y, width * 0.96 - 2 * inset, height * 0.96 - 2 * inset);
    canvas.stroke();
  }
}

/**
 * @internal
 */
export class ThrowIntermediateEventShape extends IntermediateEventShape {
  constructor() {
    super();
    this.withFilledIcon = true;
  }
}
