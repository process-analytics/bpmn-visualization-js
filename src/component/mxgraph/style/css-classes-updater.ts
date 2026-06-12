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

import type { BpmnGraph } from '../BpmnGraph';
import type { BpmnCellStyle } from './types';

import { messageFlowIconId } from '../BpmnRenderer';

import { setCssClasses } from './utils';

/**
 * @internal
 */
export function createNewCssClassesUpdater(graph: BpmnGraph): CssClassesUpdater {
  return new CssClassesUpdater(graph);
}

/**
 * @internal
 */
export class CssClassesUpdater {
  constructor(private readonly graph: BpmnGraph) {}

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

    // maxGraph#326: model.setStyle no-ops when handed the cell's own style instance, so mutate a clone.
    // See https://github.com/maxGraph/maxGraph/issues/326
    const cellStyle = cell.getClonedStyle() as BpmnCellStyle;
    setCssClasses(cellStyle, cssClasses);
    model.setStyle(cell, cellStyle);
  }
}
