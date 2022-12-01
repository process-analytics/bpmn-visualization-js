/**
 * Copyright 2021 Bonitasoft S.A.
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
import type { CellState } from '@maxgraph/core';
import { CellOverlay, Point, Rectangle, constants } from '@maxgraph/core';

import type { OverlayStyle } from '../../registry';

export type VerticalAlignType = 'bottom' | 'middle' | 'top';
export type HorizontalAlignType = 'left' | 'center' | 'right';

export interface MaxGraphCustomOverlayOptions {
  position: MaxGraphCustomOverlayPosition;
  style: MaxGraphCustomOverlayStyle;
}

export interface MaxGraphCustomOverlayPosition {
  horizontalAlign?: HorizontalAlignType;
  verticalAlign?: VerticalAlignType;
}

export type MaxGraphCustomOverlayStyle = Required<OverlayStyle>;

export class MaxGraphCustomOverlay extends CellOverlay {
  readonly style: MaxGraphCustomOverlayStyle;

  constructor(public label: string, options: MaxGraphCustomOverlayOptions) {
    super(null, '', options.position.horizontalAlign, options.position.verticalAlign, null, 'default');
    this.style = options.style;
  }

  // Based on original method from CellOverlay (CellOverlay.prototype.getBounds)
  override getBounds(state: CellState): Rectangle {
    const isEdge = state.cell.isEdge();
    const s = state.view.scale;
    let pt;

    // START bpmn-visualization CUSTOMIZATION
    // 0 values to position the text overlays on extreme/center points
    const w = 0;
    const h = 0;
    // END bpmn-visualization CUSTOMIZATION

    if (isEdge) {
      pt = this.computeEdgeBounds(state);
    } else {
      pt = new Point();

      if (this.align == constants.ALIGN.LEFT) {
        pt.x = state.x;
      } else if (this.align == constants.ALIGN.CENTER) {
        pt.x = state.x + state.width / 2;
      } else {
        pt.x = state.x + state.width;
      }

      if (this.verticalAlign == constants.ALIGN.TOP) {
        pt.y = state.y;
      } else if (this.verticalAlign == constants.ALIGN.MIDDLE) {
        pt.y = state.y + state.height / 2;
      } else {
        pt.y = state.y + state.height;
      }
    }

    return new Rectangle(Math.round(pt.x - (w * this.defaultOverlap - this.offset.x) * s), Math.round(pt.y - (h * this.defaultOverlap - this.offset.y) * s), w * s, h * s);
  }

  private computeEdgeBounds(state: CellState): Point {
    const pts = state.absolutePoints;
    // 1st point for start position
    if (this.align == constants.ALIGN.LEFT) {
      return pts[0];
    }
    // middle point for middle position
    else if (this.align == constants.ALIGN.CENTER) {
      if (pts.length % 2 == 1) {
        return pts[Math.floor(pts.length / 2)];
      } else {
        const idx = pts.length / 2;
        const p0 = pts[idx - 1];
        const p1 = pts[idx];
        return new Point(p0.x + (p1.x - p0.x) / 2, p0.y + (p1.y - p0.y) / 2);
      }
    }
    // last point for end position
    else {
      return pts[pts.length - 1];
    }
  }
}
