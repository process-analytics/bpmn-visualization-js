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

import { getCellStyleClone, isShapeStyleUpdate, setCssClasses, setStyle, updateFill, updateFont, updateStroke } from './style/utils';
import { StyleManager } from './style/StyleManager';

import type { BpmnGraph } from './BpmnGraph';
import type { Overlay, StyleUpdate } from '../registry';
import type { CssRegistry } from '../registry/css-registry';
import { MxGraphCustomOverlay } from './overlay/custom-overlay';
import { ensureIsArray } from '../helpers/array-utils';
import { OverlayConverter } from './overlay/OverlayConverter';
import { messageFlowIconId } from './BpmnRenderer';
import { ensureOpacityValue } from '../helpers/validators';
import type { BpmnCellStyle } from './style/types';

/**
 * @internal
 */
export function newGraphCellUpdater(graph: BpmnGraph, cssRegistry: CssRegistry): GraphCellUpdater {
  return new GraphCellUpdater(graph, new OverlayConverter(), new StyleManager(cssRegistry, graph.getDataModel()));
}

/**
 * @internal
 */
export default class GraphCellUpdater {
  constructor(readonly graph: BpmnGraph, readonly overlayConverter: OverlayConverter, private readonly styleManager: StyleManager) {}

  clear(): void {
    this.styleManager.clear();
  }

  updateAndRefreshCssClassesOfCell(bpmnElementId: string, cssClasses: string[]): void {
    this.updateAndRefreshCssClassesOfElement(bpmnElementId, cssClasses);
    // special case: message flow icon is stored in a dedicated Cell, so it must be kept in sync
    this.updateAndRefreshCssClassesOfElement(messageFlowIconId(bpmnElementId), cssClasses);
  }

  private updateAndRefreshCssClassesOfElement(elementId: string, cssClasses: string[]): void {
    const model = this.graph.getDataModel();
    const cell = model.getCell(elementId);
    if (!cell) {
      return;
    }

    this.styleManager.ensureStyleIsStored(cell);

    const cellStyle: BpmnCellStyle = getCellStyleClone(cell);
    setCssClasses(cellStyle, cssClasses);

    model.setStyle(cell, cellStyle);
  }

  addOverlays(bpmnElementId: string, overlays: Overlay | Overlay[]): void {
    const cell = this.graph.getDataModel().getCell(bpmnElementId);
    if (!cell) {
      return;
    }
    ensureIsArray(overlays).forEach(overlay => {
      const bpmnOverlay = new MxGraphCustomOverlay(overlay.label, this.overlayConverter.convert(overlay));
      this.graph.addCellOverlay(cell, bpmnOverlay);
    });
  }

  removeAllOverlays(bpmnElementId: string): void {
    const cell = this.graph.getDataModel().getCell(bpmnElementId);
    if (!cell) {
      return;
    }
    this.graph.removeCellOverlays(cell);
  }

  updateStyle(bpmnElementIds: string | string[], styleUpdate: StyleUpdate): void {
    if (!styleUpdate) {
      // We don't want to create an empty transaction and verify if there are cells with id include in bpmnElementIds.
      // This could be improved by also stopping processing if styleUpdate has no relevant properties.
      return;
    }

    const model = this.graph.getDataModel();
    const cells = withCellIdsOfMessageFlowIcons(bpmnElementIds)
      .map(id => model.getCell(id))
      .filter(Boolean);
    if (cells.length == 0) {
      // We don't want to create an empty transaction
      return;
    }

    this.graph.batchUpdate(() => {
      for (const cell of cells) {
        this.styleManager.ensureStyleIsStored(cell);

        const cellStyle = getCellStyleClone(cell);
        setStyle(cellStyle, 'opacity', styleUpdate.opacity, ensureOpacityValue);
        updateStroke(cellStyle, styleUpdate.stroke);
        updateFont(cellStyle, styleUpdate.font);

        if (isShapeStyleUpdate(styleUpdate)) {
          updateFill(cellStyle, styleUpdate.fill);
        }

        model.setStyle(cell, cellStyle);
      }
    });
  }

  resetStyle(bpmnElementIds: string[]): void {
    this.graph.batchUpdate(() => {
      if (bpmnElementIds.length == 0) {
        this.styleManager.resetAllStyles();
      } else {
        for (const id of withCellIdsOfMessageFlowIcons(bpmnElementIds)) {
          this.styleManager.resetStyleIfIsStored(id);
        }
      }
    });
  }
}

// The message flow icon is stored in a dedicated Cell, so it must be kept in sync
function withCellIdsOfMessageFlowIcons(bpmnElementIds: string | string[]): string[] {
  const cellIds = ensureIsArray<string>(bpmnElementIds);
  return cellIds.concat(cellIds.map(id => messageFlowIconId(id)));
}
