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
import { mxgraph } from '../initializer';
import { mxCellState, mxRectangle } from 'mxgraph';

export type VerticalAlignType = 'bottom' | 'middle' | 'top';
export type HorizontalAlignType = 'left' | 'center' | 'right';

export interface MxGraphCustomOverlayOptions {
  horizontalAlign?: HorizontalAlignType;
  verticalAlign?: VerticalAlignType;
}

export class MxGraphCustomOverlay extends mxgraph.mxCellOverlay {
  constructor(public label: string, options?: MxGraphCustomOverlayOptions) {
    super(null, '', options?.horizontalAlign, options?.verticalAlign, null, 'default');
  }
  // Based on original method from mxCellOverlay (mxCellOverlay.prototype.getBounds)
  getBounds(state: mxCellState): mxRectangle {
    const isEdge = state.view.graph.getModel().isEdge(state.cell);
    const s = state.view.scale;
    let pt;

    // START bpmn-visualization CUSTOMIZATION
    // 0 values to position the text overlays on extreme/center points
    const w = 0;
    const h = 0;
    // END bpmn-visualization CUSTOMIZATION

    if (isEdge) {
      const pts = state.absolutePoints;

      if (pts.length % 2 == 1) {
        pt = pts[Math.floor(pts.length / 2)];
      } else {
        const idx = pts.length / 2;
        const p0 = pts[idx - 1];
        const p1 = pts[idx];
        pt = new mxgraph.mxPoint(p0.x + (p1.x - p0.x) / 2, p0.y + (p1.y - p0.y) / 2);
      }
    } else {
      pt = new mxgraph.mxPoint();

      if (this.align == mxgraph.mxConstants.ALIGN_LEFT) {
        pt.x = state.x;
      } else if (this.align == mxgraph.mxConstants.ALIGN_CENTER) {
        pt.x = state.x + state.width / 2;
      } else {
        pt.x = state.x + state.width;
      }

      if (this.verticalAlign == mxgraph.mxConstants.ALIGN_TOP) {
        pt.y = state.y;
      } else if (this.verticalAlign == mxgraph.mxConstants.ALIGN_MIDDLE) {
        pt.y = state.y + state.height / 2;
      } else {
        pt.y = state.y + state.height;
      }
    }

    return new mxgraph.mxRectangle(
      Math.round(pt.x - (w * this.defaultOverlap - this.offset.x) * s),
      Math.round(pt.y - (h * this.defaultOverlap - this.offset.y) * s),
      w * s,
      h * s,
    );
  }
}
