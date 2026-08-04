/*
Copyright 2026 Bonitasoft S.A.

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

import type { BpmnCanvas, IconPainter } from '../../mxgraph/shape/render';
import type { RenderingExtensionPoint } from '../extension-points';
import type { mxAbstractCanvas2D, mxCellState, mxShape } from 'mxgraph';

import './types';

import { mxUtils } from '../../mxgraph/initializer';
import { buildPaintParameter } from '../../mxgraph/shape/render/icon-painter';

import { bonitaHasConnectorStyleIdentifier } from './identifiers';

/** The `iconPainter` is injected into the shape instances by the cell renderer. */
type BpmnTaskShape = mxShape & { paintTaskIcon: () => void; iconPainter: IconPainter };

// 'BaseTaskShape' is not exported by the library, so the presence of 'paintTaskIcon' is used to detect the shapes used
// for the BPMN tasks. This excludes the sub-process and call activity shapes.
function isTaskShape(shape: mxShape): shape is BpmnTaskShape {
  return 'paintTaskIcon' in shape;
}

function hasConnector(state: mxCellState): boolean {
  return mxUtils.getValue(state.style, bonitaHasConnectorStyleIdentifier, undefined) === 'true';
}

function paintConnectorIconAfterForeground(shape: BpmnTaskShape): void {
  const originalPaintForeground = shape.paintForeground.bind(shape);
  shape.paintForeground = (c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void => {
    originalPaintForeground(c, x, y, w, h);

    c.save(); // ensure the icon painting cannot leak canvas configuration (colors, ...) into the next painting
    // The method is injected into the icon painter at library initialization, hence the optional call: it is missing
    // when the extension is not registered.
    shape.iconPainter.paintBonitaConnectorIcon?.({
      ...buildPaintParameter({ canvas: c, x, y, width: w, height: h, shape, ratioFromParent: 0.22 }),
      setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopRightProportionally(20),
    });
    c.restore();
  };
}

export const bonitaConnectorRenderingExtension: RenderingExtensionPoint = {
  onShapeCreated(shape: mxShape, state: mxCellState): void {
    if (isTaskShape(shape) && hasConnector(state)) {
      paintConnectorIconAfterForeground(shape);
    }
  },
};
