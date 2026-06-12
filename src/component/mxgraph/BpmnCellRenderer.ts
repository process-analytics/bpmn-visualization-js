/*
Copyright 2023 Bonitasoft S.A.

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

import type { IconPainter } from './shape/render';
import type { CellOverlay, CellState, Shape } from '@maxgraph/core';

import { CellRenderer, ImageShape, Rectangle } from '@maxgraph/core';

import { CustomCellOverlay } from './overlay/custom-overlay';
import { OverlayBadgeShape } from './overlay/shapes';
import { overrideCreateSvgCanvas } from './shape/utils';

export class BpmnCellRenderer extends CellRenderer {
  constructor(private readonly iconPainter: IconPainter) {
    super();
  }

  // maxGraph 0.16.0 introduced the createOverlayShape/configureOverlayShape extension points, so the whole
  // createCellOverlays() no longer needs to be reimplemented (the former implementation relied on mxDictionary,
  // removed in maxGraph 0.21.0).
  protected override createOverlayShape(_state: CellState, cellOverlay: CellOverlay): Shape {
    if (cellOverlay instanceof CustomCellOverlay) {
      return new OverlayBadgeShape(cellOverlay.label, new Rectangle(0, 0, 0, 0), cellOverlay.style);
    }
    const overlayShape = new ImageShape(new Rectangle(0, 0, 0, 0), cellOverlay.image.src);
    overlayShape.preserveImageAspect = false;
    return overlayShape;
  }

  protected override configureOverlayShape(state: CellState, cellOverlay: CellOverlay, overlayShape: Shape): void {
    // the default implementation sets the cursor based on the overlay configuration
    super.configureOverlayShape(state, cellOverlay, overlayShape);

    if (overlayShape instanceof OverlayBadgeShape) {
      overlayShape.node.classList.add('overlay-badge');
      overlayShape.node.dataset.bpmnId = state.cell.id;
    }
  }

  override createShape(state: CellState): Shape {
    const shape = super.createShape(state);
    if ('iconPainter' in shape) {
      shape.iconPainter = this.iconPainter;
    }
    overrideCreateSvgCanvas(shape);
    return shape;
  }

  override createLabel(state: CellState, value: string): void {
    super.createLabel(state, value);
    overrideCreateSvgCanvas(state.text);
  }
}
