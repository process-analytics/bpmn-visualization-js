/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { IconPainter } from './render';
import type { AbstractCanvas2D } from '@maxgraph/core';

import { mxRectangleShape, mxUtils } from '../initializer';
import { BpmnStyleIdentifier } from '../style';

import { buildPaintParameter } from './render/icon-painter';

/**
 * @internal
 */
export class MessageFlowIconShape extends mxRectangleShape {
  // The actual value is injected at runtime by BpmnCellRenderer
  protected iconPainter: IconPainter = undefined;

  override paintVertexShape(c: AbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    const paintParameter = buildPaintParameter({
      canvas: c,
      x,
      y,
      width: w,
      height: h,
      shape: this,
      ratioFromParent: 1,
      isFilled: mxUtils.getValue(this.style, BpmnStyleIdentifier.IS_INITIATING, 'true') == 'false',
    });

    this.iconPainter.paintEnvelopeIcon(paintParameter);
  }
}
