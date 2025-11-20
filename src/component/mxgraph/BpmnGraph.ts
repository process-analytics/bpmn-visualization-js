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

import type { IconPainter } from './shape/render';
import type { mxCellRenderer, mxCellState, mxGraphView, mxPoint } from 'mxgraph';

import { BpmnCellRenderer } from './BpmnCellRenderer';
import { mxgraph } from './initializer';

/**
 * Temporary storage for iconPainter during BpmnGraph construction.
 *
 * **Problem**: The mxGraph super constructor calls `createCellRenderer()` to set the cellRenderer property
 * (via createGraphView at https://github.com/jgraph/mxgraph/blob/v4.2.2/javascript/src/js/view/mxGraph.js#L672).
 * However, in JavaScript/TypeScript, instance fields (including constructor parameters declared as fields)
 * are initialized AFTER the super() call completes. This means `this.iconPainter` is undefined when
 * `createCellRenderer()` is called during super() construction.
 *
 * **Root cause**: mxGraph uses the **factory method pattern** for initialization. The mxGraph class is in
 * charge of its own initialization by calling factory methods (`createCellRenderer()`, `createGraphView()`)
 * instead of relying on injected collaborators. This makes it impossible to inject dependencies cleanly.
 *
 * **Why we can't use other approaches**:
 * - Can't use `this` as WeakMap key: TypeScript/JavaScript doesn't allow accessing `this` before `super()` call
 * - Can't use `this.container` as key: It's set AFTER createGraphView completes
 *   (https://github.com/jgraph/mxgraph/blob/v4.2.2/javascript/src/js/view/mxGraph.js#L691)
 * - Can't use constructor parameter: Not accessible from `createCellRenderer()` method
 *
 * **Solution**: Use a module-level temporary variable. This is safe because JavaScript is single-threaded,
 * so only one constructor can be executing at a time. The variable is set before `super()`, used during
 * `createCellRenderer()`, then immediately cleaned up after construction.
 *
 * **Future**: If we migrate to maxGraph, this problem won't exist. maxGraph's BaseGraph accepts the
 * CellRenderer via constructor options (dependency injection), eliminating the need for this workaround.
 * See https://github.com/maxGraph/maxGraph/blob/cb16ce46d5b33df1ea7b2fbc8815c23420d3e658/packages/core/src/view/BaseGraph.ts#L36
 */
let pendingIconPainter: IconPainter | undefined;

export class BpmnGraph extends mxgraph.mxGraph {
  /**
   * @internal
   */
  constructor(container: HTMLElement, iconPainter: IconPainter) {
    // Store iconPainter in temporary variable BEFORE super() call
    // This makes it available in createCellRenderer() which is called during super() construction
    pendingIconPainter = iconPainter;

    super(container);

    if (this.container) {
      // ensure we don't have a select text cursor on label hover, see #294
      this.container.style.cursor = 'default';
    }

    // Clean up the temporary variable now that super() is complete
    pendingIconPainter = undefined;
  }

  /**
   * @internal
   */
  override createGraphView(): mxGraphView {
    return new BpmnGraphView(this);
  }

  /**
   * Called by mxGraph super constructor to create the cell renderer.
   *
   * This method is only called once during construction (by the mxGraph super constructor),
   * so we retrieve the iconPainter from the module-level temporary variable.
   *
   * @internal
   */
  override createCellRenderer(): mxCellRenderer {
    return new BpmnCellRenderer(pendingIconPainter);
  }

  /**
   * Shortcut for an update of the model within a transaction.
   *
   * This method is inspired from {@link https://github.com/maxGraph/maxGraph/blob/v0.1.0/packages/core/src/view/Graph.ts#L487-L494 maxGraph}.
   *
   * @param callbackFunction the update to be made in the transaction.
   *
   * @experimental subject to change, may move to a subclass of {@link mxGraphModel}
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
