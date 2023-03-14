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

import type { BpmnGraph } from './BpmnGraph';
import { mxgraph } from './initializer';
import { BpmnStyleIdentifier } from './style';
import type { Overlay, ShapeStyleUpdate, StyleUpdate } from '../registry';
import { MxGraphCustomOverlay } from './overlay/custom-overlay';
import { ensureIsArray } from '../helpers/array-utils';
import { OverlayConverter } from './overlay/OverlayConverter';
import { messageFowIconId } from './BpmnRenderer';
import { ShapeBpmnElementKind } from '../../model/bpmn/internal';

/**
 * @internal
 */
export function newGraphCellUpdater(graph: BpmnGraph): GraphCellUpdater {
  return new GraphCellUpdater(graph, new OverlayConverter());
}

/**
 * @internal
 */
export default class GraphCellUpdater {
  constructor(readonly graph: BpmnGraph, readonly overlayConverter: OverlayConverter) {}

  updateAndRefreshCssClassesOfCell(bpmnElementId: string, cssClasses: string[]): void {
    this.updateAndRefreshCssClassesOfElement(bpmnElementId, cssClasses);
    // special case: message flow icon is stored in a dedicated mxCell, so it must be kept in sync
    this.updateAndRefreshCssClassesOfElement(messageFowIconId(bpmnElementId), cssClasses);
  }

  private updateAndRefreshCssClassesOfElement(elementId: string, cssClasses: string[]): void {
    const mxCell = this.graph.getModel().getCell(elementId);
    if (!mxCell) {
      return;
    }
    const view = this.graph.getView();
    const state = view.getState(mxCell);
    state.style[BpmnStyleIdentifier.EXTRA_CSS_CLASSES] = cssClasses;
    state.shape.redraw();
    // Ensure that label classes are also updated. When there is no label, state.text is null
    state.text?.redraw();
  }

  addOverlays(bpmnElementId: string, overlays: Overlay | Overlay[]): void {
    const mxCell = this.graph.getModel().getCell(bpmnElementId);
    if (!mxCell) {
      return;
    }
    ensureIsArray(overlays).forEach(overlay => {
      const bpmnOverlay = new MxGraphCustomOverlay(overlay.label, this.overlayConverter.convert(overlay));
      this.graph.addCellOverlay(mxCell, bpmnOverlay);
    });
  }

  removeAllOverlays(bpmnElementId: string): void {
    const mxCell = this.graph.getModel().getCell(bpmnElementId);
    if (!mxCell) {
      return;
    }
    this.graph.removeCellOverlays(mxCell);
  }

  updateStyle(bpmnElementIds: string | string[], styleUpdate: StyleUpdate): void {
    if (!styleUpdate) {
      // We don't want to create an empty transaction and verify if there are cells with id include in bpmnElementIds
      return;
    }

    // In the future, this method can be optimized by not processing if styleUpdate has no relevant properties defined.
    const cells = ensureIsArray<string>(bpmnElementIds)
      .map(id => this.graph.getModel().getCell(id))
      .filter(Boolean);
    if (cells.length == 0) {
      // We don't want to create an empty transaction
      return;
    }

    this.graph.batchUpdate(() => {
      for (const cell of cells) {
        let cellStyle = cell.getStyle();
        // Only set the style when the key is set. Otherwise, mxGraph removes the related setting from the cellStyle which is equivalent to a reset of the style property
        styleUpdate.stroke?.color && (cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_STROKECOLOR, styleUpdate.stroke.color));

        const font = styleUpdate.font;
        if (font) {
          font.color && (cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTCOLOR, font.color));
          font.size && (cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTSIZE, font.size));
          font.family && (cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTFAMILY, font.family));

          font.isBold !== undefined && (cellStyle = mxgraph.mxUtils.setStyleFlag(cellStyle, mxgraph.mxConstants.STYLE_FONTSTYLE, mxgraph.mxConstants.FONT_BOLD, font.isBold));
          font.isItalic !== undefined && (cellStyle = mxgraph.mxUtils.setStyleFlag(cellStyle, mxgraph.mxConstants.STYLE_FONTSTYLE, mxgraph.mxConstants.FONT_ITALIC, font.isItalic));
          font.isUnderline !== undefined &&
            (cellStyle = mxgraph.mxUtils.setStyleFlag(cellStyle, mxgraph.mxConstants.STYLE_FONTSTYLE, mxgraph.mxConstants.FONT_UNDERLINE, font.isUnderline));
          font.isStrikeThrough !== undefined &&
            (cellStyle = mxgraph.mxUtils.setStyleFlag(cellStyle, mxgraph.mxConstants.STYLE_FONTSTYLE, mxgraph.mxConstants.FONT_STRIKETHROUGH, font.isStrikeThrough));

          // TODO To uncomment when we implement the Opacity in global/fill/font/stroke
          // font.opacity && (cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_TEXT_OPACITY, font.opacity));
        }

        if (isShapeStyleUpdate(styleUpdate)) {
          const fill = styleUpdate.fill;
          if (fill) {
            if (fill.color) {
              cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FILLCOLOR, fill.color);
              if (cellStyle.includes(ShapeBpmnElementKind.POOL) || cellStyle.includes(ShapeBpmnElementKind.LANE)) {
                cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_SWIMLANE_FILLCOLOR, fill.color);
              }
            }

            // TODO To uncomment when we implement the Opacity in global/fill/font/stroke
            // cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FILL_OPACITY, fill.opacity);
          }
        }

        this.graph.model.setStyle(cell, cellStyle);
      }
    });
  }
}

const isShapeStyleUpdate = (style: StyleUpdate): style is ShapeStyleUpdate => {
  return style && typeof style === 'object' && 'fill' in style;
};
