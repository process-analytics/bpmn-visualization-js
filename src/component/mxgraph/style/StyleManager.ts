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
   * Array that contains the steps of the command history.
   */
  private history: Map<mxCell, string> = new Map();

  constructor(readonly cssRegistry: CssRegistry, readonly model: mxGraphModel) {}

  /**
   * Reset the style in applying the CSS classes
   */
  resetStyle(cell: mxCell): void {
    if (this.history.get(cell)) {
      const cssClasses = this.cssRegistry.getClassNames(cell.getId());

      const style = setStyle(this.history.get(cell), BpmnStyleIdentifier.EXTRA_CSS_CLASSES, cssClasses.join(','));
      this.model.setStyle(cell, style);

      this.history.delete(cell);
    }
  }

  /**
   * Method to be called to add new undoable edits to the <history>.
   */
  storeStyleIfIsNotStored(cell: mxCell, style: string): void {
    if (!this.history.get(cell)) {
      this.history.set(cell, style);
    }
  }
}
