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
import type { BpmnCellStyle } from './types';
import type { Cell, GraphDataModel } from '@maxgraph/core';

import { ensureIsArray } from '../../helpers/array-utils';
import { ensureOpacityValue } from '../../helpers/validators';
import { messageFlowIconId } from '../BpmnRenderer';

import { isShapeStyleUpdate, setCssClasses, setStyle, updateFill, updateFont, updateStroke } from './utils';

export function createNewStyleUpdater(graph: BpmnGraph): StyleUpdater {
  return new StyleUpdater(graph, new StyleManager(graph.getDataModel()));
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

    const model = this.graph.getDataModel();
    const cells = withCellIdsOfMessageFlowIcons(bpmnElementIds)
      .map(id => model.getCell(id))
      .filter(Boolean) as Cell[];
    if (cells.length === 0) {
      // We don't want to create an empty transaction
      return;
    }

    this.graph.batchUpdate(() => {
      for (const cell of cells) {
        this.styleManager.ensureStyleIsStored(cell);

        // maxGraph#326: model.setStyle no-ops when handed the cell's own style instance, so mutate a clone.
        // This was the root cause of the "CSS classes disappear on navigation" bug in the 0.20.0 POC.
        // See https://github.com/maxGraph/maxGraph/issues/326
        const cellStyle = cell.getClonedStyle();
        setStyle(cellStyle, 'opacity', styleUpdate.opacity, ensureOpacityValue);
        updateStroke(cellStyle, styleUpdate.stroke);
        updateFont(cellStyle, styleUpdate.font);

        if (isShapeStyleUpdate(styleUpdate)) {
          updateFill(cellStyle as BpmnCellStyle, styleUpdate.fill);
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

class StyleManager {
  private readonly stylesCache = new Map<string, BpmnCellStyle>();

  constructor(private readonly model: GraphDataModel) {}

  clear(): void {
    this.stylesCache.clear();
  }

  resetAllStyles(): void {
    for (const [cellId, style] of [...this.stylesCache]) {
      this.resetStyle(cellId, style);
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

  private resetStyle(cellId: string, initialStyle: BpmnCellStyle): void {
    this.stylesCache.delete(cellId);

    const cell = this.model.getCell(cellId);
    if (!cell) {
      return;
    }

    // The CSS classes are managed independently (by the CSS classes updater) and must survive a style reset.
    const extraCssClasses = (cell.style as BpmnCellStyle).bpmn?.extraCssClasses;
    // maxGraph#326: build a fresh style object (not the cell's own instance) so setStyle propagates the change.
    const styleToApply: BpmnCellStyle = { ...initialStyle, bpmn: { ...initialStyle.bpmn } };
    setCssClasses(styleToApply, extraCssClasses ?? []);
    this.model.setStyle(cell, styleToApply);
  }

  ensureStyleIsStored(cell: Cell): void {
    const cellId = cell.getId();
    if (cellId && !this.stylesCache.has(cellId)) {
      this.stylesCache.set(cellId, cell.getClonedStyle() as BpmnCellStyle);
    }
  }
}
