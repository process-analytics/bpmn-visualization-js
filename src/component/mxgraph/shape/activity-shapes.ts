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
import StyleUtils, { StyleDefault } from '../StyleUtils';
import { buildPaintParameter, IconPainterProvider, PaintParameter } from './render/IconPainter';
import { ShapeBpmnSubProcessKind } from '../../../model/bpmn/shape/ShapeBpmnSubProcessKind';
import { ShapeBpmnMarkerKind } from '../../../model/bpmn/shape/ShapeBpmnMarkerKind';
import BpmnCanvas from './render/BpmnCanvas';

function paintEnvelopeIcon(paintParameter: PaintParameter, isFilled: boolean): void {
  IconPainterProvider.get().paintEnvelopeIcon({
    ...paintParameter,
    setIconOrigin: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeft(),
    ratioFromParent: 0.2,
    icon: { ...paintParameter.icon, isFilled: isFilled },
  });
}

export abstract class BaseActivityShape extends mxRectangleShape {
  protected iconPainter = IconPainterProvider.get();

  // TODO missing in mxgraph-type-definitions mxShape
  isRounded: boolean;
  // TODO missing in mxgraph-type-definitions mxShape
  gradient: string;

  protected constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
    // enforced by BPMN
    this.isRounded = true;
  }

  public paintForeground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintForeground(c, x, y, w, h);
    this.paintMarkerIcons(buildPaintParameter(c, x, y, w, h, this, 0.17, false, 1.5));
  }

  protected paintMarkerIcons(paintParameter: PaintParameter): void {
    const markers = StyleUtils.getBpmnMarkers(this.style);
    if (markers) {
      markers.split(',').forEach((marker, idx, allMarkers) => {
        paintParameter = {
          ...paintParameter,
          setIconOrigin: this.getIconOriginForMarkerIcon(allMarkers.length, idx + 1),
        };
        switch (marker) {
          case ShapeBpmnMarkerKind.LOOP:
            this.iconPainter.paintLoopIcon(paintParameter);
            break;
          case ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL:
            this.iconPainter.paintSequentialMultiInstanceIcon(paintParameter);
            break;
          case ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL:
            this.iconPainter.paintParallelMultiInstanceIcon(paintParameter);
            break;
          case ShapeBpmnMarkerKind.EXPAND:
            this.iconPainter.paintExpandIcon(paintParameter);
            break;
        }
        // Restore original configuration to avoid side effects if the iconPainter changed the canvas configuration (colors, ....)
        // TODO missing mxShape.configureCanvas in mxgraph-type-definitions (this will replace explicit function calls)
        // this.configureCanvas(c, x, y, w, h);
        paintParameter.c.setStrokeColor(StyleUtils.getStrokeColor(this.style));
        paintParameter.c.setFillColor(StyleUtils.getFillColor(this.style));
      });
    }
  }

  private getIconOriginForMarkerIcon(allMarkers: number, markerOrder: number): (canvas: BpmnCanvas) => void {
    let setIconOrigin: (canvas: BpmnCanvas) => void;
    if (allMarkers === 1) {
      setIconOrigin = (canvas: BpmnCanvas) => canvas.setIconOriginForIconBottomCentered();
    } else if (allMarkers === 2) {
      setIconOrigin = (canvas: BpmnCanvas) => {
        canvas.setIconOriginForIconBottomCentered();
        const xTranslation = Math.pow(-1, markerOrder) * (StyleDefault.SHAPE_ACTIVITY_MARKER_ICON_SIZE / 2 + StyleDefault.SHAPE_ACTIVITY_MARKER_ICON_MARGIN);
        canvas.translateIconOrigin(xTranslation, 0);
      };
    } else {
      // TODO: once we support 3 markers in a group
      throw new Error('NOT_IMPLEMENTED - to have a group of >2 markers in a row, centered in the task, implement this piece of code');
    }
    return setIconOrigin;
  }
}

abstract class BaseTaskShape extends BaseActivityShape {
  protected constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintForeground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintForeground(c, x, y, w, h);
    this.paintTaskIcon(buildPaintParameter(c, x, y, w, h, this));
  }

  protected abstract paintTaskIcon(paintParameter: PaintParameter): void;
}

export class TaskShape extends BaseTaskShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected paintTaskIcon(paintParameter: PaintParameter): void {
    // No symbol for the BPMN Task
    this.iconPainter.paintEmptyIcon();
  }
}

export class ServiceTaskShape extends BaseTaskShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintTaskIcon(paintParameter: PaintParameter): void {
    this.iconPainter.paintGearIcon({ ...paintParameter, setIconOrigin: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(20) });
  }
}

export class UserTaskShape extends BaseTaskShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintTaskIcon(paintParameter: PaintParameter): void {
    this.iconPainter.paintUserIcon({ ...paintParameter, setIconOrigin: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(20) });
  }
}

export class ReceiveTaskShape extends BaseTaskShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintTaskIcon(paintParameter: PaintParameter): void {
    if (!StyleUtils.getBpmnIsInstantiating(this.style)) {
      paintEnvelopeIcon(paintParameter, false);
      return;
    }

    const leftMargin = 4;
    const topMargin = 4;

    // paint a fixed size circle
    const circleShapeConfiguration = { ...paintParameter.shape, w: 20, h: 20 };
    this.iconPainter.paintCircleIcon({
      c: paintParameter.c,
      shape: circleShapeConfiguration,
      icon: { ...paintParameter.icon, isFilled: false },
      ratioFromParent: undefined, // ensure we will paint the icon with its original size
      setIconOrigin: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeft(topMargin, leftMargin),
    });

    // paint an envelope centered inside the circle, with dimensions proportional to the circle dimensions
    // set the actual origin of the circle icon: this is what 'setIconOriginToShapeTopLeft' has done prior painting the circle icon
    circleShapeConfiguration.x += leftMargin;
    circleShapeConfiguration.y += topMargin;

    this.iconPainter.paintEnvelopeIcon({
      ...paintParameter,
      shape: circleShapeConfiguration,
      ratioFromParent: 0.65,
      setIconOrigin: (canvas: BpmnCanvas) => canvas.setIconOriginForIconCentered(),
    });
  }
}

export class SendTaskShape extends BaseTaskShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintTaskIcon(paintParameter: PaintParameter): void {
    paintEnvelopeIcon(paintParameter, true);
  }
}

export class CallActivityShape extends BaseActivityShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THICK) {
    super(bounds, fill, stroke, strokewidth);
  }
}

export class SubProcessShape extends BaseActivityShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintBackground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    const subProcessKind = StyleUtils.getBpmnSubProcessKind(this.style);
    if (subProcessKind === ShapeBpmnSubProcessKind.EVENT) {
      c.setDashed(true, false);
      c.setDashPattern('1 2');
    }

    super.paintBackground(c, x, y, w, h);

    // TODO temp. missing in mxgraph-type-definitions mxShape
    // this.configureCanvas(c, x, y, w, h);
    c.setDashed(StyleUtils.isDashed(this.style), StyleUtils.isFixDash(this.style));
    c.setDashPattern(StyleUtils.getDashPattern(this.style));
  }
}
