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
import type { Fill, Font, Overlay, ShapeStyleUpdate, Stroke, StyleUpdate } from '../registry';
import { MxGraphCustomOverlay } from './overlay/custom-overlay';
import { ensureIsArray } from '../helpers/array-utils';
import { OverlayConverter } from './overlay/OverlayConverter';
import { messageFowIconId } from './BpmnRenderer';
import { ShapeBpmnElementKind } from '../../model/bpmn/internal';
import { ensureOpacityValue, ensureStrokeWidthValue } from '../helpers/validators';

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
    const cell = this.graph.getModel().getCell(elementId);
    if (!cell) {
      return;
    }

    let cellStyle = cell.getStyle();
    cellStyle = setStyle(cellStyle, BpmnStyleIdentifier.EXTRA_CSS_CLASSES, cssClasses.join(','));
    this.graph.model.setStyle(cell, cellStyle);
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
        cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_OPACITY, styleUpdate.opacity, ensureOpacityValue);
        cellStyle = updateStroke(cellStyle, styleUpdate.stroke);
        cellStyle = updateFont(cellStyle, styleUpdate.font);

        if (isShapeStyleUpdate(styleUpdate)) {
          cellStyle = updateFill(cellStyle, styleUpdate.fill);
        }

        this.graph.model.setStyle(cell, cellStyle);
      }
    });
  }
}

const convertDefaultValue = (value: string): string | undefined => (value == 'default' ? undefined : value);

const updateStroke = (cellStyle: string, stroke: Stroke): string => {
  if (stroke) {
    cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_STROKECOLOR, stroke.color, convertDefaultValue);
    cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_STROKE_OPACITY, stroke.opacity, ensureOpacityValue);
    cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_STROKEWIDTH, stroke.width, ensureStrokeWidthValue);
  }
  return cellStyle;
};

const setStyle = <T extends string | number>(cellStyle: string, key: string, value: T | undefined, converter: (value: T) => T | undefined = (value: T) => value): string => {
  return value == undefined ? cellStyle : mxgraph.mxUtils.setStyle(cellStyle, key, converter(value));
};

const setStyleFlag = (cellStyle: string, key: string, flag: number, value: boolean | undefined): string =>
  value == undefined ? cellStyle : mxgraph.mxUtils.setStyleFlag(cellStyle, key, flag, value);

const updateFont = (cellStyle: string, font: Font): string => {
  if (font) {
    cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTCOLOR, font.color, convertDefaultValue);
    cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTSIZE, font.size);
    cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTFAMILY, font.family);

    cellStyle = setStyleFlag(cellStyle, mxgraph.mxConstants.STYLE_FONTSTYLE, mxgraph.mxConstants.FONT_BOLD, font.isBold);
    cellStyle = setStyleFlag(cellStyle, mxgraph.mxConstants.STYLE_FONTSTYLE, mxgraph.mxConstants.FONT_ITALIC, font.isItalic);
    cellStyle = setStyleFlag(cellStyle, mxgraph.mxConstants.STYLE_FONTSTYLE, mxgraph.mxConstants.FONT_UNDERLINE, font.isUnderline);
    cellStyle = setStyleFlag(cellStyle, mxgraph.mxConstants.STYLE_FONTSTYLE, mxgraph.mxConstants.FONT_STRIKETHROUGH, font.isStrikeThrough);

    cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_TEXT_OPACITY, font.opacity, ensureOpacityValue);
  }
  return cellStyle;
};

const updateFill = (cellStyle: string, fill: Fill): string => {
  if (fill.color) {
    cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_FILLCOLOR, fill.color, convertDefaultValue);

    if (cellStyle.includes(ShapeBpmnElementKind.POOL) || cellStyle.includes(ShapeBpmnElementKind.LANE)) {
      cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_SWIMLANE_FILLCOLOR, fill.color, convertDefaultValue);
    }
  }

  cellStyle = setStyle(cellStyle, mxgraph.mxConstants.STYLE_FILL_OPACITY, fill.opacity, ensureOpacityValue);

  return cellStyle;
};

const isShapeStyleUpdate = (style: StyleUpdate): style is ShapeStyleUpdate => {
  return style && typeof style === 'object' && 'fill' in style;
};
