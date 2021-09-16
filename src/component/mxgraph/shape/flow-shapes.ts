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

import { IconPainterProvider } from './render';
import { buildPaintParameter } from './render/icon-painter';
import StyleUtils from '../StyleUtils';
import { MessageVisibleKind } from '../../../model/bpmn/internal/edge/kinds';
import { mxgraph } from '../initializer';
import { mxAbstractCanvas2D, mxRectangle } from 'mxgraph'; // for types

/**
 * @internal
 */
export class MessageFlowIconShape extends mxgraph.mxRectangleShape {
  protected iconPainter = IconPainterProvider.get();

  constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  override paintVertexShape(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    const withFilledIcon = StyleUtils.getBpmnIsInitiating(this.style) === MessageVisibleKind.NON_INITIATING;
    const paintParameter = buildPaintParameter({ canvas: c, x, y, width: w, height: h, shape: this, ratioFromParent: 1, isFilled: withFilledIcon });

    this.iconPainter.paintEnvelopeIcon(paintParameter);
  }
}
