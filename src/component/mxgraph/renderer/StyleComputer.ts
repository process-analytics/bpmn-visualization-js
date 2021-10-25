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
import Shape from '../../../model/bpmn/internal/shape/Shape';
import { Edge } from '../../../model/bpmn/internal/edge/edge';
import Bounds from '../../../model/bpmn/internal/Bounds';
import {
  ShapeBpmnActivity,
  ShapeBpmnBoundaryEvent,
  ShapeBpmnCallActivity,
  ShapeBpmnEvent,
  ShapeBpmnEventBasedGateway,
  ShapeBpmnStartEvent,
  ShapeBpmnSubProcess,
} from '../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { StyleIdentifier } from '../StyleUtils';
import { ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnMarkerKind, ShapeUtil } from '../../../model/bpmn/internal';
import { AssociationFlow, SequenceFlow } from '../../../model/bpmn/internal/edge/flows';
import { Font } from '../../../model/bpmn/internal/Label';

/**
 * @internal
 */
export default class StyleComputer {
  computeStyle(bpmnCell: Shape | Edge, labelBounds: Bounds): string {
    const styles: string[] = [bpmnCell.bpmnElement.kind as string];

    let shapeStyleValues;
    if (bpmnCell instanceof Shape) {
      shapeStyleValues = StyleComputer.computeShapeStyle(bpmnCell);
    } else {
      styles.push(...StyleComputer.computeEdgeStyle(bpmnCell));
      shapeStyleValues = new Map<string, string | number>();
    }

    const fontStyleValues = StyleComputer.computeFontStyleValues(bpmnCell);
    const labelStyleValues = StyleComputer.computeLabelStyleValues(bpmnCell, labelBounds);

    return [] //
      .concat([...styles])
      .concat([...shapeStyleValues, ...fontStyleValues, ...labelStyleValues].filter(([, v]) => v && v != 'undefined').map(([key, value]) => key + '=' + value))
      .join(';');
  }

  private static computeShapeStyle(shape: Shape): Map<string, string | number> {
    const styleValues = new Map<string, string | number>();
    const bpmnElement = shape.bpmnElement;

    if (bpmnElement instanceof ShapeBpmnEvent) {
      this.computeEventShapeStyle(bpmnElement, styleValues);
    } else if (bpmnElement instanceof ShapeBpmnActivity) {
      this.computeActivityShapeStyle(bpmnElement, styleValues);
    } else if (ShapeUtil.isPoolOrLane(bpmnElement.kind)) {
      // mxgraph.mxConstants.STYLE_HORIZONTAL is for the label
      // In BPMN, isHorizontal is for the Shape
      styleValues.set(mxgraph.mxConstants.STYLE_HORIZONTAL, shape.isHorizontal ? '0' : '1');
    } else if (bpmnElement instanceof ShapeBpmnEventBasedGateway) {
      styleValues.set(StyleIdentifier.BPMN_STYLE_INSTANTIATING, String(bpmnElement.instantiate));
      styleValues.set(StyleIdentifier.BPMN_STYLE_EVENT_BASED_GATEWAY_KIND, String(bpmnElement.gatewayKind));
    }

    return styleValues;
  }

  private static computeEventShapeStyle(bpmnElement: ShapeBpmnEvent, styleValues: Map<string, string | number>): void {
    styleValues.set(StyleIdentifier.BPMN_STYLE_EVENT_DEFINITION_KIND, bpmnElement.eventDefinitionKind);

    if (bpmnElement instanceof ShapeBpmnBoundaryEvent || (bpmnElement instanceof ShapeBpmnStartEvent && bpmnElement.isInterrupting !== undefined)) {
      styleValues.set(StyleIdentifier.BPMN_STYLE_IS_INTERRUPTING, String(bpmnElement.isInterrupting));
    }
  }

  private static computeActivityShapeStyle(bpmnElement: ShapeBpmnActivity, styleValues: Map<string, string | number>): void {
    if (bpmnElement instanceof ShapeBpmnSubProcess) {
      styleValues.set(StyleIdentifier.BPMN_STYLE_SUB_PROCESS_KIND, bpmnElement.subProcessKind);
    } else if (bpmnElement.kind === ShapeBpmnElementKind.TASK_RECEIVE) {
      styleValues.set(StyleIdentifier.BPMN_STYLE_INSTANTIATING, String(bpmnElement.instantiate));
    } else if (bpmnElement instanceof ShapeBpmnCallActivity) {
      styleValues.set(StyleIdentifier.BPMN_STYLE_GLOBAL_TASK_KIND, bpmnElement.globalTaskKind);
    }

    const markers: ShapeBpmnMarkerKind[] = bpmnElement.markers;
    if (markers.length > 0) {
      styleValues.set(StyleIdentifier.BPMN_STYLE_MARKERS, markers.join(','));
    }
  }

  private static computeEdgeStyle(edge: Edge): string[] {
    const styles: string[] = [];

    const bpmnElement = edge.bpmnElement;
    if (bpmnElement instanceof SequenceFlow) {
      styles.push(bpmnElement.sequenceFlowKind);
    }
    if (bpmnElement instanceof AssociationFlow) {
      styles.push(bpmnElement.associationDirectionKind);
    }

    return styles;
  }

  private static computeFontStyleValues(bpmnCell: Shape | Edge): Map<string, string | number> {
    const styleValues = new Map<string, string | number>();

    const font = bpmnCell.label?.font;
    if (font) {
      styleValues.set(mxgraph.mxConstants.STYLE_FONTFAMILY, font.name);
      styleValues.set(mxgraph.mxConstants.STYLE_FONTSIZE, font.size);
      styleValues.set(mxgraph.mxConstants.STYLE_FONTSTYLE, StyleComputer.getFontStyleValue(font));
    }

    return styleValues;
  }

  private static computeLabelStyleValues(bpmnCell: Shape | Edge, labelBounds: Bounds): Map<string, string | number> {
    const styleValues = new Map<string, string | number>();

    const bpmnElement = bpmnCell.bpmnElement;
    if (labelBounds) {
      styleValues.set(mxgraph.mxConstants.STYLE_VERTICAL_ALIGN, mxgraph.mxConstants.ALIGN_TOP);
      if (bpmnCell.bpmnElement.kind != ShapeBpmnElementKind.TEXT_ANNOTATION) {
        styleValues.set(mxgraph.mxConstants.STYLE_ALIGN, mxgraph.mxConstants.ALIGN_CENTER);
      }

      if (bpmnCell instanceof Shape) {
        // arbitrarily increase width to relax too small bounds (for instance for reference diagrams from miwg-test-suite)
        styleValues.set(mxgraph.mxConstants.STYLE_LABEL_WIDTH, labelBounds.width + 1);
        // align settings
        styleValues.set(mxgraph.mxConstants.STYLE_LABEL_POSITION, mxgraph.mxConstants.ALIGN_TOP);
        styleValues.set(mxgraph.mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxgraph.mxConstants.ALIGN_LEFT);
      }
    }
    // when no label bounds, adjust the default style dynamically
    else if (
      bpmnCell instanceof Shape &&
      (bpmnElement instanceof ShapeBpmnSubProcess ||
        (bpmnElement instanceof ShapeBpmnCallActivity && bpmnElement.callActivityKind === ShapeBpmnCallActivityKind.CALLING_PROCESS)) &&
      !bpmnElement.markers.includes(ShapeBpmnMarkerKind.EXPAND)
    ) {
      styleValues.set(mxgraph.mxConstants.STYLE_VERTICAL_ALIGN, mxgraph.mxConstants.ALIGN_TOP);
    }

    return styleValues;
  }

  computeMessageFlowIconStyle(edge: Edge): string {
    return `shape=${StyleIdentifier.BPMN_STYLE_MESSAGE_FLOW_ICON};${StyleIdentifier.BPMN_STYLE_IS_INITIATING}=${edge.messageVisibleKind}`;
  }

  private static getFontStyleValue(font: Font): number {
    let value = 0;
    if (font.isBold) {
      value += mxgraph.mxConstants.FONT_BOLD;
    }
    if (font.isItalic) {
      value += mxgraph.mxConstants.FONT_ITALIC;
    }
    if (font.isStrikeThrough) {
      value += mxgraph.mxConstants.FONT_STRIKETHROUGH;
    }
    if (font.isUnderline) {
      value += mxgraph.mxConstants.FONT_UNDERLINE;
    }
    return value;
  }
}
