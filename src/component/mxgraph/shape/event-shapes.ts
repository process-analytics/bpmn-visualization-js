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
import { ShapeBpmnEventKind } from '../../../model/bpmn/shape/ShapeBpmnEventKind';
import { PaintParameter, buildPaintParameter, IconPainterProvider } from './render/IconPainter';
import StyleUtils, { StyleDefault } from '../StyleUtils';
import BpmnCanvas from './render/BpmnCanvas';

abstract class EventShape extends mxEllipse {
  protected iconPainter = IconPainterProvider.get();

  // TODO: when all/more event types will be supported, we could move to a Record/MappedType
  private iconPainters: Map<ShapeBpmnEventKind, (paintParameter: PaintParameter) => void> = new Map([
    [ShapeBpmnEventKind.MESSAGE, (paintParameter: PaintParameter) => this.iconPainter.paintEnvelopeIcon({ ...paintParameter, ratioFromParent: 0.5 })],
    [ShapeBpmnEventKind.TERMINATE, (paintParameter: PaintParameter) => this.iconPainter.paintCircleIcon({ ...paintParameter, ratioFromParent: 0.6 })],
    [
      ShapeBpmnEventKind.TIMER,
      (paintParameter: PaintParameter) => this.iconPainter.paintClockIcon({ ...paintParameter, setIconOrigin: (canvas: BpmnCanvas) => canvas.setIconOriginPosition(5) }),
    ],
    [
      ShapeBpmnEventKind.SIGNAL,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintTriangleIcon({
          ...paintParameter,
          ratioFromParent: 0.55,
          icon: { ...paintParameter.icon, strokeWidth: StyleDefault.STROKE_WIDTH_THIN.valueOf() },
          setIconOrigin: (canvas: BpmnCanvas) => canvas.setIconOriginPosition(4),
        }),
    ],
    [
      ShapeBpmnEventKind.LINK,
      (paintParameter: PaintParameter) => this.iconPainter.paintRightArrowIcon({ ...paintParameter, ratioFromParent: 0.55, icon: { ...paintParameter.icon, strokeWidth: 1.5 } }),
    ],
  ]);

  protected withFilledIcon = false;

  protected constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintVertexShape(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    this.markNonFullyRenderedEvents(c);
    const paintParameter = buildPaintParameter(c, x, y, w, h, this, 0.25, this.withFilledIcon);
    this.paintOuterShape(paintParameter);
    this.paintInnerShape(paintParameter);
  }

  // This will be removed after implementation of all supported events
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private markNonFullyRenderedEvents(c: mxAbstractCanvas2D): void {
    const eventKind = StyleUtils.getBpmnEventKind(this.style);
    if (eventKind == ShapeBpmnEventKind.ERROR) {
      c.setFillColor('deeppink');
      c.setFillAlpha(0.3);
    }
  }

  protected paintOuterShape({ c, shape: { x, y, w, h } }: PaintParameter): void {
    super.paintVertexShape(c, x, y, w, h);
  }

  protected paintInnerShape(paintParameter: PaintParameter): void {
    const paintIcon = this.iconPainters.get(StyleUtils.getBpmnEventKind(this.style)) || (() => this.iconPainter.paintEmptyIcon());
    paintIcon(paintParameter);
  }
}

export class StartEventShape extends EventShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }
}

export class EndEventShape extends EventShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THICK) {
    super(bounds, fill, stroke, strokewidth);
    this.withFilledIcon = true;
  }
}

abstract class IntermediateEventShape extends EventShape {
  protected constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  // this implementation is adapted from the draw.io BPMN 'throwing' outlines
  // https://github.com/jgraph/drawio/blob/0e19be6b42755790a749af30450c78c0d83be765/src/main/webapp/shapes/bpmn/mxBpmnShape2.js#L431
  protected paintOuterShape({ c, shape: { x, y, w, h, strokeWidth } }: PaintParameter): void {
    c.ellipse(x, y, w, h);
    c.fillAndStroke();

    const inset = strokeWidth * 1.5;
    c.ellipse(w * 0.02 + inset + x, h * 0.02 + inset + y, w * 0.96 - 2 * inset, h * 0.96 - 2 * inset);
    c.stroke();
  }
}

export class CatchIntermediateEventShape extends IntermediateEventShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number) {
    super(bounds, fill, stroke, strokewidth);
  }
}

export class ThrowIntermediateEventShape extends IntermediateEventShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number) {
    super(bounds, fill, stroke, strokewidth);
    this.withFilledIcon = true;
  }
}

export class BoundaryEventShape extends IntermediateEventShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintOuterShape(paintParameter: PaintParameter): void {
    const isInterrupting = StyleUtils.getBpmnIsInterrupting(this.style);
    if (isInterrupting === 'false') {
      paintParameter.c.setDashed(true, false);
      paintParameter.c.setDashPattern('3 2');
    }

    super.paintOuterShape(paintParameter);

    // Restore original configuration
    // TODO missing mxShape.configureCanvas in mxgraph-type-definitions (this will replace explicit function calls)
    // this.configureCanvas(c, x, y, w, h);
    paintParameter.c.setDashed(StyleUtils.isDashed(this.style), StyleUtils.isFixDash(this.style));
    paintParameter.c.setDashPattern(StyleUtils.getDashPattern(this.style));
  }
}
