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
import type { mxCell, mxGraphModel } from 'mxgraph';
import { BpmnStyleIdentifier } from '.';
import { setStyle } from './utils';
import type { CssRegistry } from '../../registry/css-registry';

export class StyleManager {
  private stylesCache: Map<string, string> = new Map();

  constructor(
    readonly cssRegistry: CssRegistry,
    readonly model: mxGraphModel,
  ) {}

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

  private resetStyle(cellId: string, style: string): void {
    const cell = this.model.getCell(cellId);
    const cssClasses = this.cssRegistry.getClassNames(cellId);

    const styleWithCssClasses = setStyle(style, BpmnStyleIdentifier.EXTRA_CSS_CLASSES, cssClasses.join(','));
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
