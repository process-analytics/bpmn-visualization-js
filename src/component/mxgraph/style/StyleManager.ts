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
  /**
   * Contains the style of each cell.
   */
  private stylesByCell: Map<mxCell, string> = new Map();

  /**
   * Creates a new instance of the StyleManager.
   *
   * @param cssRegistry The CSS registry to get class names from.
   * @param model The mxGraphModel instance.
   */
  constructor(readonly cssRegistry: CssRegistry, readonly model: mxGraphModel) {}

  /**
   * Deletes all saved styles.
   */
  clear(): void {
    this.stylesByCell.clear();
  }

  /**
   * Resets the style of a cell and applies the CSS classes.
   *
   * @param cell The mxCell whose style is to be reset.
   */
  resetStyle(cell: mxCell): void {
    if (this.stylesByCell.get(cell)) {
      const cssClasses = this.cssRegistry.getClassNames(cell.getId());

      const style = setStyle(this.stylesByCell.get(cell), BpmnStyleIdentifier.EXTRA_CSS_CLASSES, cssClasses.join(','));
      this.model.setStyle(cell, style);

      this.stylesByCell.delete(cell);
    }
  }

  /**
   * Stores the style for a cell if it is not already stored.
   *
   * @param cell The mxCell for which the style is to be stored.
   * @param style The style to store.
   */
  storeStyleIfIsNotStored(cell: mxCell, style: string): void {
    if (!this.stylesByCell.get(cell)) {
      this.stylesByCell.set(cell, style);
    }
  }
}
