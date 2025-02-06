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
import type { Cell, CellStyle, GraphDataModel } from '@maxgraph/core';
import { getCellStyleClone, setCssClasses } from './utils';
import type { CssRegistry } from '../../registry/css-registry';
import type { BpmnCellStyle } from '../style/types';

export class StyleManager {
  private stylesCache: Map<string, CellStyle> = new Map();

  constructor(readonly cssRegistry: CssRegistry, readonly model: GraphDataModel) {}

  clear(): void {
    this.stylesCache.clear();
  }

  resetAllStyles(): void {
    for (const cellId of this.stylesCache.keys()) {
      const style = this.stylesCache.get(cellId);
      this.resetStyle(cellId, style);
    }
  }

  /**
   * Resets the style of a cell and applies its CSS classes.
   *
   * @param cellId The ID of the mxCell whose style is to be reset.
   */
  resetStyleIfIsStored(cellId: string): void {
    const style = this.stylesCache.get(cellId);
    if (style) {
      this.resetStyle(cellId, style);
    }
  }

  private resetStyle(cellId: string, style: BpmnCellStyle): void {
    const cell = this.model.getCell(cellId);
    const cssClasses = this.cssRegistry.getClassNames(cellId);

    // no need to copy the style, it is coming from the cache only and is later deleted from the cache
    setCssClasses(style, cssClasses);
    this.model.setStyle(cell, style);

    this.stylesCache.delete(cellId);
  }

  ensureStyleIsStored(cell: Cell): void {
    const cellId = cell.getId();
    if (!this.stylesCache.has(cellId)) {
      this.stylesCache.set(cellId, getCellStyleClone(cell));
    }
  }
}
