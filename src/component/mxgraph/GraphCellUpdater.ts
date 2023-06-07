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

import { isShapeStyleUpdate, setStyle, updateFill, updateFont, updateStroke } from './style/utils';
import type { mxEventObject, mxStyleChange, mxUndoableEdit } from 'mxgraph';
import { UndoManager } from './UndoManager';
import { isMxStyleChange } from './style/utils';

import type { BpmnGraph } from './BpmnGraph';
import { mxgraph } from './initializer';
import { BpmnStyleIdentifier } from './style';
import type { Overlay, StyleUpdate } from '../registry';
import { MxGraphCustomOverlay } from './overlay/custom-overlay';
import { ensureIsArray } from '../helpers/array-utils';
import { OverlayConverter } from './overlay/OverlayConverter';
import { messageFowIconId } from './BpmnRenderer';
import { ensureOpacityValue } from '../helpers/validators';

/**
 * @internal
 */
export function newGraphCellUpdater(graph: BpmnGraph): GraphCellUpdater {
  return new GraphCellUpdater(graph, new OverlayConverter());
}

/**
 * @internal
 */
export default class GraphCellUpdater {
  private readonly undoManager: UndoManager;

  constructor(readonly graph: BpmnGraph, readonly overlayConverter: OverlayConverter) {
    this.undoManager = new UndoManager();
    this.installUndoHandler();
  }

  private installUndoHandler(): void {
    const listener = mxgraph.mxUtils.bind(this, (sender: object, evt: mxEventObject) => {
      const edit: mxUndoableEdit = evt.getProperty('edit');
      const filter: mxStyleChange[] = edit.changes.filter(change => isMxStyleChange(change));
      if (filter.length >= 1) {
        // See https://github.com/jgraph/mxgraph/blob/ff141aab158417bd866e2dfebd06c61d40773cd2/javascript/src/js/view/mxGraph.js#L2114
        this.undoManager.registerUndoable(filter[0].cell, edit);
      }
    });

    // Mandatory
    this.graph.getModel().addListener(mxgraph.mxEvent.UNDO, listener);
    this.graph.getView().addListener(mxgraph.mxEvent.UNDO, listener);
  }

  updateAndRefreshCssClassesOfCell(bpmnElementId: string, cssClasses: string[]): void {
    this.updateAndRefreshCssClassesOfElement(bpmnElementId, cssClasses);
    // special case: message flow icon is stored in a dedicated mxCell, so it must be kept in sync
    this.updateAndRefreshCssClassesOfElement(messageFowIconId(bpmnElementId), cssClasses);
  }

  private updateAndRefreshCssClassesOfElement(elementId: string, cssClasses: string[]): void {
    const cell = this.graph.getModel().getCell(elementId);
    if (!cell) {
      return;
    }

    let cellStyle = cell.getStyle();
    cellStyle = setStyle(cellStyle, BpmnStyleIdentifier.EXTRA_CSS_CLASSES, cssClasses.join(','));
    this.graph.model.setStyle(cell, cellStyle);
  }

  addOverlays(bpmnElementId: string, overlays: Overlay | Overlay[]): void {
    const mxCell = this.graph.getModel().getCell(bpmnElementId);
    if (!mxCell) {
      return;
    }
    ensureIsArray(overlays).forEach(overlay => {
      const bpmnOverlay = new MxGraphCustomOverlay(overlay.label, this.overlayConverter.convert(overlay));
      this.graph.addCellOverlay(mxCell, bpmnOverlay);
    });
  }

  removeAllOverlays(bpmnElementId: string): void {
    const mxCell = this.graph.getModel().getCell(bpmnElementId);
    if (!mxCell) {
      return;
    }
    this.graph.removeCellOverlays(mxCell);
  }

  updateStyle(bpmnElementIds: string | string[], styleUpdate: StyleUpdate): void {
    if (!styleUpdate) {
      // We don't want to create an empty transaction and verify if there are cells with id include in bpmnElementIds
      return;
    }

    // In the future, this method can be optimized by not processing if styleUpdate has no relevant properties defined.
    const cells = ensureIsArray<string>(bpmnElementIds)
      .map(id => this.graph.getModel().getCell(id))
      .filter(Boolean);
    if (cells.length == 0) {
      // We don't want to create an empty transaction
      return;
    }

    this.graph.batchUpdate(() => {
      for (const cell of cells) {
        let cellStyle = cell.getStyle();
        cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_OPACITY, styleUpdate.opacity, ensureOpacityValue);
        cellStyle = updateStroke(cellStyle, styleUpdate.stroke);
        cellStyle = updateFont(cellStyle, styleUpdate.font);

        if (isShapeStyleUpdate(styleUpdate)) {
          cellStyle = updateFill(cellStyle, styleUpdate.fill);
        }

        this.graph.model.setStyle(cell, cellStyle);
      }
    });
  }

  resetStyle(bpmnElementIds: string[]): void {
    this.graph.batchUpdate(() => {
      if (bpmnElementIds.length == 0) {
        const allCells = this.graph.getModel().getChildCells(this.graph.getDefaultParent());
        for (const cell of allCells) {
          this.undoManager.undo(cell);
        }
      } else {
        for (const bpmnElementId of bpmnElementIds) {
          const cell = this.graph.getModel().getCell(bpmnElementId);
          this.undoManager.undo(cell);
        }
      }

      // Redraw the graph with the updated style
      this.graph.refresh();
    });
  }
}
