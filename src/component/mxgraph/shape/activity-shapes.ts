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
import StyleUtils, { StyleConstant } from '../StyleUtils';
import IconPainter, { PaintParameter } from './IconPainter';
import { ShapeBpmnSubProcessKind } from '../../../model/bpmn/shape/ShapeBpmnSubProcessKind';

export abstract class BaseActivityShape extends mxRectangleShape {
  // TODO missing in mxgraph-type-definitions@1.0.2 mxShape
  isRounded: boolean;
  // TODO missing in mxgraph-type-definitions@1.0.2 mxShape
  gradient: string;

  protected constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
    // enforced by BPMN
    this.isRounded = true;
  }
}

abstract class BaseTaskShape extends BaseActivityShape {
  protected constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintForeground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintForeground(c, x, y, w, h);

    // TODO temp before removing ts-mxgraph (xxx as unknown as mxgraph.yyy)
    const paintParameter = IconPainter.buildPaintParameter((c as unknown) as mxgraph.mxXmlCanvas2D, x, y, w, h, (this as unknown) as mxgraph.mxShape);
    this.paintTaskIcon(paintParameter);
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
    IconPainter.paintEmptyIcon();
  }
}

export class ServiceTaskShape extends BaseTaskShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintTaskIcon(paintParameter: PaintParameter): void {
    IconPainter.paintGearIcon(paintParameter);
  }
}

export class UserTaskShape extends BaseTaskShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  protected paintTaskIcon(paintParameter: PaintParameter): void {
    IconPainter.paintWomanIcon(paintParameter);
  }
}

export class ReceiveTaskShape extends BaseTaskShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
    this.gradient = 'Salmon';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  protected paintTaskIcon(paintParameter: PaintParameter): void {}
}

export class CallActivityShape extends BaseActivityShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintVertexShape(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    c.setStrokeColor('#2C6DA3');
    c.setStrokeWidth(4);

    super.paintVertexShape(c, x, y, w, h);
  }
}

export class SubProcessShape extends BaseActivityShape {
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintVertexShape(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    const isExpanded = StyleUtils.getBpmnIsExpanded(this.style);
    const processKind = StyleUtils.getBpmnSubProcessKind(this.style);
    if (isExpanded === 'false' && processKind === ShapeBpmnSubProcessKind.EMBEDDED) {
      c.setFillColor('Lavender');
    } else if (processKind === ShapeBpmnSubProcessKind.EVENT) {
      c.setFillColor('LightCyan');
    }

    if (isExpanded === 'true') {
      if (processKind === ShapeBpmnSubProcessKind.EVENT) {
        c.setStrokeColor('Chartreuse');
      }
    } else {
      c.setStrokeColor('Fuchsia');
    }

    super.paintVertexShape(c, x, y, w, h);
  }
}
