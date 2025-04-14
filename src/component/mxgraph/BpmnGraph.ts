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

import type { mxCellRenderer, mxCellState, mxGraphView, mxPoint } from 'mxgraph';

import { BpmnCellRenderer } from './BpmnCellRenderer';
import { mxgraph } from './initializer';
import { IconPainterProvider } from './shape/render';

export class BpmnGraph extends mxgraph.mxGraph {
  /**
   * @internal
   */
  constructor(container: HTMLElement) {
    super(container);
    if (this.container) {
      // ensure we don't have a select text cursor on label hover, see #294
      this.container.style.cursor = 'default';
    }
  }

  /**
   * @internal
   */
  override createGraphView(): mxGraphView {
    return new BpmnGraphView(this);
  }

  override createCellRenderer(): mxCellRenderer {
    // in the future, the IconPainter could be configured at library initialization and the provider could be removed
    return new BpmnCellRenderer(IconPainterProvider.get());
  }

  /**
   * Shortcut for an update of the model within a transaction.
   *
   * This method is inspired from {@link https://github.com/maxGraph/maxGraph/blob/v0.1.0/packages/core/src/view/Graph.ts#L487-L494 maxGraph}.
   *
   * @param callbackFunction the update to be made in the transaction.
   *
   * @experimental subject to change, may move to a subclass of `mxGraphModel`
   * @alpha
   */
  batchUpdate(callbackFunction: () => void): void {
    this.model.beginUpdate();
    try {
      callbackFunction();
    } finally {
      this.model.endUpdate();
    }
  }
}

class BpmnGraphView extends mxgraph.mxGraphView {
  override getFloatingTerminalPoint(edge: mxCellState, start: mxCellState, end: mxCellState, source: boolean): mxPoint {
    // some values may be null: the first and the last values are null prior computing floating terminal points
    const edgePoints = edge.absolutePoints.filter(Boolean);
    // when there is no BPMN waypoint, all values are null
    const needsFloatingTerminalPoint = edgePoints.length < 2;
    if (needsFloatingTerminalPoint) {
      return super.getFloatingTerminalPoint(edge, start, end, source);
    }
    const pts = edge.absolutePoints;
    return source ? pts[1] : pts.at(-2);
  }
}
