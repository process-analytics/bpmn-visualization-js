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
import Shape from '../../../model/bpmn/shape/Shape';
import Edge from '../../../model/bpmn/edge/Edge';
import Bounds from '../../../model/bpmn/Bounds';
import { ShapeBpmnBoundaryEvent, ShapeBpmnEvent, ShapeBpmnSubProcess } from '../../../model/bpmn/shape/ShapeBpmnElement';
import { StyleIdentifier } from '../StyleUtils';
import { Font } from '../../../model/bpmn/Label';

export class StyleComputer {
  computeStyle(bpmnCell: Shape | Edge, labelBounds: Bounds): string {
    const styleValues = new Map<string, string | number>();

    const font = bpmnCell.label?.font;
    if (font) {
      styleValues.set(mxConstants.STYLE_FONTFAMILY, font.name);
      styleValues.set(mxConstants.STYLE_FONTSIZE, font.size);
      styleValues.set(mxConstants.STYLE_FONTSTYLE, StyleComputer.getFontStyleValue(font));
    }

    const bpmnElement = bpmnCell.bpmnElement;
    if (bpmnCell instanceof Shape) {
      if (bpmnElement instanceof ShapeBpmnEvent) {
        styleValues.set(StyleIdentifier.BPMN_STYLE_EVENT_KIND, bpmnElement.eventKind);
      }

      if (bpmnElement instanceof ShapeBpmnBoundaryEvent) {
        styleValues.set(StyleIdentifier.BPMN_STYLE_IS_INTERRUPTING, String(bpmnElement.isInterrupting));
      }

      if (bpmnElement instanceof ShapeBpmnSubProcess) {
        styleValues.set(StyleIdentifier.BPMN_STYLE_SUB_PROCESS_KIND, bpmnElement.subProcessKind);
        styleValues.set(StyleIdentifier.BPMN_STYLE_IS_EXPANDED, String(bpmnCell.isExpanded));
      }
    }

    if (labelBounds) {
      styleValues.set(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP);
      styleValues.set(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
      if (bpmnCell instanceof Shape) {
        // arbitrarily increase width to relax too small bounds (for instance for reference diagrams from miwg-test-suite)
        styleValues.set(mxConstants.STYLE_LABEL_WIDTH, labelBounds.width + 1);
        // align settings
        styleValues.set(mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_TOP);
        styleValues.set(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_LEFT);
      }
    }
    // when no label bounds, adjust the default style dynamically
    else if (bpmnCell instanceof Shape && bpmnCell.isExpanded && bpmnElement instanceof ShapeBpmnSubProcess) {
      styleValues.set(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP);
    }

    return [bpmnElement.kind as string] //
      .concat([...styleValues].filter(([, v]) => v).map(([key, value]) => key + '=' + value))
      .join(';');
  }

  private static getFontStyleValue(font: Font): number {
    let value = 0;
    if (font.isBold) {
      value += mxConstants.FONT_BOLD;
    }
    if (font.isItalic) {
      value += mxConstants.FONT_ITALIC;
    }
    if (font.isStrikeThrough) {
      value += mxConstants.FONT_STRIKETHROUGH;
    }
    if (font.isUnderline) {
      value += mxConstants.FONT_UNDERLINE;
    }
    return value;
  }
}
