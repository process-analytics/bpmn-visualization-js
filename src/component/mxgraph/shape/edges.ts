/*
Copyright 2021 Bonitasoft S.A.

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

import type { AbstractCanvas2D, Point } from '@maxgraph/core';

import { ConnectorShape, SvgCanvas2D } from '@maxgraph/core';

/**
 * Custom connector kept only to restrict click capture to the edge stroke (the `paintEdgeLine` pointer-events tweak).
 *
 * The marker fill colors are now handled natively by maxGraph through the `startFillColor`/`endFillColor` styles
 * (maxGraph#157), so this shape no longer needs to set them; that was the other responsibility of `BpmnConnector` with
 * mxGraph. It is still registered under the `bpmn.edge` shape name and used as the default edge shape.
 */
export class BpmnConnector extends ConnectorShape {
  override paintEdgeShape(c: AbstractCanvas2D, pts: Point[]): void {
    // The indirection via functions for markers is needed in
    // order to apply the offsets before painting the line and
    // paint the markers after painting the line.
    const sourceMarker = this.createMarker(c, pts, true);
    const targetMarker = this.createMarker(c, pts, false);

    this.paintEdgeLine(c, pts);

    // Disables shadows, dashed styles
    c.setShadow(false);
    c.setDashed(false, false);

    // The marker fill colors are applied natively by maxGraph from the startFillColor/endFillColor styles.
    sourceMarker?.();
    targetMarker?.();
  }

  // taken from PolylineShape, required as we cannot call the PolylineShape method here (parent of the parent)
  // we only support non-curved edges here (curved is possible with the parent class)
  private paintEdgeLine(c: AbstractCanvas2D, pts: Point[]): void {
    if (c instanceof SvgCanvas2D) {
      // restrict click capture to the edge stroke
      const previous = c.pointerEventsValue;
      c.pointerEventsValue = 'stroke';
      this.paintLine(c, pts, this.isRounded);
      c.pointerEventsValue = previous;
    } else {
      this.paintLine(c, pts, this.isRounded);
    }
  }
}
