/**
 * Copyright 2020 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { BpmnGraph } from '../BpmnGraph';
import type { Cell } from '@maxgraph/core';
import { Point } from '@maxgraph/core';

/**
 * @internal
 */
export default class CoordinatesTranslator {
  constructor(readonly graph: BpmnGraph) {}

  /**
   * Compute an absolute coordinate in relative coordinates in the parent cell referential.
   * @param parent the cell to use for the new coordinate referential
   * @param absoluteCoordinate
   */
  computeRelativeCoordinates(parent: Cell, absoluteCoordinate: Point): Point {
    const translateForRoot = this.getTranslateForRoot(parent);
    const relativeX = absoluteCoordinate.x + translateForRoot.x;
    const relativeY = absoluteCoordinate.y + translateForRoot.y;
    return new Point(relativeX, relativeY);
  }

  // Returns the translation to be applied to a cell whose Geometry x and y values are expressed with absolute coordinates
  // (i.e related to the graph default parent) you want to assign as parent to the cell passed as argument of this function.
  // That way, you will be able to express the cell coordinates as relative to its parent cell.
  //
  // This implementation is taken from the example described in the documentation of mxgraph#getTranslateForRoot (4.1.1)
  // The translation is generally negative
  private getTranslateForRoot(cell: Cell): Point {
    const offset = new Point(0, 0);

    while (cell != null) {
      const geo = cell.getGeometry();
      if (geo != null) {
        offset.x -= geo.x;
        offset.y -= geo.y;
      }
      cell = cell.getParent();
    }

    return offset;
  }

  /**
   * Compute the center of the provided `Cell` for absolute geometry: this is the center point of a segment whose edges
   * are the terminal points of the Cell geometry points. Returns `undefined` if the 2 terminal points are not available.
   *
   * The center coordinates are given in the same referential as the `Cell`, so relative to its parent.
   */
  computeEdgeCenter(mxEdge: Cell): Point {
    const points: Point[] = mxEdge.geometry.points;

    const p0 = points[0];
    const pe = points[points.length - 1];

    if (p0 != null && pe != null) {
      const dx = pe.x - p0.x;
      const dy = pe.y - p0.y;
      return new Point(p0.x + dx / 2, p0.y + dy / 2);
    }

    return undefined;
  }
}
