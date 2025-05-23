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

import type { StyleUpdate } from '../../registry';
import type { BpmnGraph } from '../BpmnGraph';
import type { mxCell, mxGraphModel } from 'mxgraph';

import { ensureIsArray } from '../../helpers/array-utils';
import { ensureOpacityValue } from '../../helpers/validators';
import { messageFlowIconId } from '../BpmnRenderer';
import { mxConstants } from '../initializer';

import { getStyleValue, isShapeStyleUpdate, setStyle, updateFill, updateFont, updateStroke } from './utils';

import { BpmnStyleIdentifier } from '.';

export function createNewStyleUpdater(graph: BpmnGraph): StyleUpdater {
  return new StyleUpdater(graph, new StyleManager(graph.getModel()));
}

// The message flow icon is stored in a dedicated Cell, so it must be kept in sync
const withCellIdsOfMessageFlowIcons = (bpmnElementIds: string | string[]): string[] => {
  const cellIds = ensureIsArray<string>(bpmnElementIds);
  cellIds.push(...cellIds.map(id => messageFlowIconId(id)));
  return cellIds;
};

export class StyleUpdater {
  constructor(
    private readonly graph: BpmnGraph,
    private readonly styleManager: StyleManager,
  ) {}

  clear(): void {
    this.styleManager.clear();
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
    if (cells.length === 0) {
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

        model.setStyle(cell, cellStyle);
      }
    });
  }

  resetStyle(bpmnElementIds: string | string[]): void {
    this.graph.batchUpdate(() => {
      if (bpmnElementIds || bpmnElementIds == '') {
        for (const id of withCellIdsOfMessageFlowIcons(bpmnElementIds)) {
          this.styleManager.resetStyleIfIsStored(id);
        }
      } else {
        this.styleManager.resetAllStyles();
      }
    });
  }
}

const cssClassesStyleIdentifier = BpmnStyleIdentifier.EXTRA_CSS_CLASSES;
class StyleManager {
  private readonly stylesCache = new Map<string, string>();

  constructor(private readonly model: mxGraphModel) {}

  clear(): void {
    this.stylesCache.clear();
  }

  resetAllStyles(): void {
    for (const cellId of this.stylesCache.keys()) {
      this.resetStyle(cellId, this.stylesCache.get(cellId));
    }
  }

  /**
   * Resets the style of a cell and applies its CSS classes.
   *
   * @param cellId The ID of the Cell whose style is to be reset.
   */
  resetStyleIfIsStored(cellId: string): void {
    const style = this.stylesCache.get(cellId);
    if (style) {
      this.resetStyle(cellId, style);
    }
  }

  private resetStyle(cellId: string, initialStyle: string): void {
    const cell = this.model.getCell(cellId);
    const cssClasses = getStyleValue(cell.getStyle(), cssClassesStyleIdentifier, '');
    const styleWithCssClasses = setStyle(initialStyle, cssClassesStyleIdentifier, cssClasses);
    this.model.setStyle(cell, styleWithCssClasses);

    this.stylesCache.delete(cellId);
  }

  ensureStyleIsStored(cell: mxCell): void {
    const cellId = cell.getId();
    if (!this.stylesCache.has(cellId)) {
      this.stylesCache.set(cellId, cell.getStyle());
    }
  }
}
