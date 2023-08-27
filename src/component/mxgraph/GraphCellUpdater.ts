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
import { StyleManager } from './style/StyleManager';

import type { BpmnGraph } from './BpmnGraph';
import { mxConstants } from './initializer';
import { BpmnStyleIdentifier } from './style';
import type { StyleUpdate } from '../registry';
import type { CssRegistry } from '../registry/css-registry';
import { ensureIsArray } from '../helpers/array-utils';
import { messageFlowIconId } from './BpmnRenderer';
import { ensureOpacityValue } from '../helpers/validators';

/**
 * @internal
 */
export function newGraphCellUpdater(graph: BpmnGraph, cssRegistry: CssRegistry): GraphCellUpdater {
  return new GraphCellUpdater(graph, new StyleManager(cssRegistry, graph.getModel()));
}

/**
 * @internal
 */
export default class GraphCellUpdater {
  constructor(
    readonly graph: BpmnGraph,
    private readonly styleManager: StyleManager,
  ) {}

  clear(): void {
    this.styleManager.clear();
  }

  updateAndRefreshCssClassesOfCell(bpmnElementId: string, cssClasses: string[]): void {
    this.updateAndRefreshCssClassesOfElement(bpmnElementId, cssClasses);
    // special case: message flow icon is stored in a dedicated Cell, so it must be kept in sync
    this.updateAndRefreshCssClassesOfElement(messageFlowIconId(bpmnElementId), cssClasses);
  }

  private updateAndRefreshCssClassesOfElement(elementId: string, cssClasses: string[]): void {
    const model = this.graph.getModel();
    const cell = model.getCell(elementId);
    if (!cell) {
      return;
    }

    let cellStyle = cell.getStyle();
    cellStyle = setStyle(cellStyle, BpmnStyleIdentifier.EXTRA_CSS_CLASSES, cssClasses.join(','));
    model.setStyle(cell, cellStyle);
  }

  updateStyle(bpmnElementIds: string | string[], styleUpdate: StyleUpdate): void {
    if (!styleUpdate) {
      // We don't want to create an empty transaction and verify if there are cells with id include in bpmnElementIds.
      // This could be improved by also stopping processing if styleUpdate has no relevant properties.
      return;
    }

    const model = this.graph.getModel();
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

        let cellStyle = cell.getStyle();
        cellStyle = setStyle(cellStyle, mxConstants.STYLE_OPACITY, styleUpdate.opacity, ensureOpacityValue);
        cellStyle = updateStroke(cellStyle, styleUpdate.stroke);
        cellStyle = updateFont(cellStyle, styleUpdate.font);

        if (isShapeStyleUpdate(styleUpdate)) {
          cellStyle = updateFill(cellStyle, styleUpdate.fill);
        }

        this.graph.model.setStyle(cell, cellStyle);
      }
    });
  }

  resetStyle(bpmnElementIds: string | string[]): void {
    this.graph.batchUpdate(() => {
      if (!bpmnElementIds) {
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
