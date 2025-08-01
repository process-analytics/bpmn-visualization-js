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
import type { mxCellState, mxImageShape, mxShape } from 'mxgraph';

import { mxgraph, mxRectangle } from './initializer';
import { CustomCellOverlay } from './overlay/custom-overlay';
import { OverlayBadgeShape } from './overlay/shapes';
import { overrideCreateSvgCanvas } from './shape/utils';

export class BpmnCellRenderer extends mxgraph.mxCellRenderer {
  constructor(private readonly iconPainter: IconPainter) {
    super();
  }

  override createCellOverlays(state: mxCellState): void {
    const graph = state.view.graph;
    const overlays = graph.getCellOverlays(state.cell);
    let dict = null;

    if (overlays != null) {
      dict = new mxgraph.mxDictionary<mxShape>();

      for (const currentOverlay of overlays) {
        const shape = state.overlays == null ? null : state.overlays.remove(currentOverlay);
        if (shape != null) {
          dict.put(currentOverlay, shape);
          continue;
        }

        let overlayShape: mxShape;

        // START bpmn-visualization CUSTOMIZATION
        if (currentOverlay instanceof CustomCellOverlay) {
          overlayShape = new OverlayBadgeShape(currentOverlay.label, new mxRectangle(0, 0, 0, 0), currentOverlay.style);
        } else {
          overlayShape = new mxgraph.mxImageShape(new mxRectangle(0, 0, 0, 0), currentOverlay.image.src);
          (overlayShape as mxImageShape).preserveImageAspect = false;
        }
        // END bpmn-visualization CUSTOMIZATION

        overlayShape.dialect = state.view.graph.dialect;
        overlayShape.overlay = currentOverlay;

        // The 'initializeOverlay' signature forces us to hardly cast the overlayShape
        this.initializeOverlay(state, overlayShape as mxImageShape);
        this.installCellOverlayListeners(state, currentOverlay, overlayShape);

        if (currentOverlay.cursor != null) {
          overlayShape.node.style.cursor = currentOverlay.cursor;
        }

        // START bpmn-visualization CUSTOMIZATION
        if (overlayShape instanceof OverlayBadgeShape) {
          overlayShape.node.classList.add('overlay-badge');
          overlayShape.node.dataset.bpmnId = state.cell.id;
        }
        // END bpmn-visualization CUSTOMIZATION

        dict.put(currentOverlay, overlayShape);
      }
    }

    // Removes unused
    if (state.overlays != null) {
      // prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
      state.overlays.visit(function (_id: string, shape: mxShape) {
        shape.destroy();
      });
    }

    state.overlays = dict;
  }

  override createShape(state: mxCellState): mxShape {
    const shape = super.createShape(state);
    if ('iconPainter' in shape) {
      shape.iconPainter = this.iconPainter;
    }
    overrideCreateSvgCanvas(shape);
    return shape;
  }

  override createLabel(state: mxCellState, value: string): void {
    super.createLabel(state, value);
    overrideCreateSvgCanvas(state.text);
  }
}
