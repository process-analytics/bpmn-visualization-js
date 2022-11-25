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
import type { AbstractCanvas2D } from '@maxgraph/core';
import { RhombusShape } from '@maxgraph/core';

import {ShapeBpmnEventBasedGatewayKind} from "../../../model/bpmn/internal";
import { StyleDefault } from '../style';
import type { PaintParameter } from './render';
import { IconPainterProvider } from './render';
import { buildPaintParameter } from './render/icon-painter';
import type { BPMNCellStyle } from "../renderer/StyleComputer";

abstract class GatewayShape extends RhombusShape {
  protected iconPainter = IconPainterProvider.get();

  protected abstract paintInnerShape(paintParameter: PaintParameter): void;

  override paintVertexShape(c: AbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    const paintParameter = buildPaintParameter({ canvas: c, x, y, width: w, height: h, shape: this });
    this.paintOuterShape(paintParameter);
    this.paintInnerShape(paintParameter);
  }

  protected paintOuterShape({ canvas, shapeConfig: { x, y, width, height } }: PaintParameter): void {
    super.paintVertexShape(canvas, x, y, width, height);
  }
}

/**
 * @internal
 */
export class ExclusiveGatewayShape extends GatewayShape {
  protected paintInnerShape(paintParameter: PaintParameter): void {
    this.iconPainter.paintXCrossIcon({
      ...paintParameter,
      iconStyleConfig: { ...paintParameter.iconStyleConfig, isFilled: true },
      ratioFromParent: 0.5,
    });
  }
}

/**
 * @internal
 */
export class ParallelGatewayShape extends GatewayShape {
  protected paintInnerShape(paintParameter: PaintParameter): void {
    this.iconPainter.paintPlusCrossIcon({
      ...paintParameter,
      iconStyleConfig: { ...paintParameter.iconStyleConfig, isFilled: true },
      ratioFromParent: 0.5,
    });
  }
}

/**
 * @internal
 */
export class InclusiveGatewayShape extends GatewayShape {
  protected paintInnerShape(paintParameter: PaintParameter): void {
    this.iconPainter.paintCircleIcon({
      ...paintParameter,
      ratioFromParent: 0.62,
      iconStyleConfig: { ...paintParameter.iconStyleConfig, isFilled: false, strokeWidth: StyleDefault.STROKE_WIDTH_THICK.valueOf() },
    });
  }
}

/**
 * @internal
 */
export class ComplexGatewayShape extends GatewayShape {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected paintInnerShape(paintParameter: PaintParameter): void {
    this.fill = 'red';
  }
}

/**
 * @internal
 */
export class EventBasedGatewayShape extends GatewayShape {
  protected paintInnerShape(paintParameter: PaintParameter): void {
    paintParameter = { ...paintParameter, iconStyleConfig: { ...paintParameter.iconStyleConfig, strokeWidth: 1 } };

    // circle (simple or double)
    this.iconPainter.paintCircleIcon({
      ...paintParameter,
      ratioFromParent: 0.55,
    });
    if (!(this.style as BPMNCellStyle).bpmn.isInstantiating) {
      this.iconPainter.paintCircleIcon({
        ...paintParameter,
        ratioFromParent: 0.45,
      });
    }

    // inner icon
    const innerIconPaintParameter = {
      ...paintParameter,
      ratioFromParent: 0.3,
    };
    if ((this.style as BPMNCellStyle).bpmn.gatewayKind == ShapeBpmnEventBasedGatewayKind.Parallel) {
      this.iconPainter.paintPlusCrossIcon(innerIconPaintParameter);
    } else {
      this.iconPainter.paintPentagon(innerIconPaintParameter);
    }
  }
}
