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

import { mxConstants } from '../initializer';
import Shape from '../../../model/bpmn/internal/shape/Shape';
import type { Edge } from '../../../model/bpmn/internal/edge/edge';
import type Bounds from '../../../model/bpmn/internal/Bounds';
import {
  ShapeBpmnActivity,
  ShapeBpmnBoundaryEvent,
  ShapeBpmnCallActivity,
  ShapeBpmnEvent,
  ShapeBpmnEventBasedGateway,
  ShapeBpmnStartEvent,
  ShapeBpmnSubProcess,
} from '../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { BpmnStyleIdentifier } from '../style';
import { MessageVisibleKind, ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnMarkerKind, ShapeUtil } from '../../../model/bpmn/internal';
import { AssociationFlow, SequenceFlow } from '../../../model/bpmn/internal/edge/flows';
import type { Font } from '../../../model/bpmn/internal/Label';
import type { RendererOptions } from '../../options';

/**
 * @internal
 */
export default class StyleComputer {
  private readonly ignoreBpmnColors: boolean;

  constructor(options?: RendererOptions) {
    this.ignoreBpmnColors = options?.ignoreBpmnColors ?? true;
  }

  computeStyle(bpmnCell: Shape | Edge, labelBounds: Bounds): string {
    const styles: string[] = [bpmnCell.bpmnElement.kind as string];

    let mainStyleValues;
    if (bpmnCell instanceof Shape) {
      mainStyleValues = this.computeShapeStyleValues(bpmnCell);
    } else {
      styles.push(...StyleComputer.computeEdgeBaseStyles(bpmnCell));
      mainStyleValues = this.computeEdgeStyleValues(bpmnCell);
    }

    const fontStyleValues = this.computeFontStyleValues(bpmnCell);
    const labelStyleValues = StyleComputer.computeLabelStyleValues(bpmnCell, labelBounds);

    return styles //
      .concat(toArrayOfMxGraphStyleEntries([...mainStyleValues, ...fontStyleValues, ...labelStyleValues]))
      .join(';');
  }

  private computeShapeStyleValues(shape: Shape): Map<string, string | number> {
    const styleValues = new Map<string, string | number>();
    const bpmnElement = shape.bpmnElement;

    if (bpmnElement instanceof ShapeBpmnEvent) {
      StyleComputer.computeEventShapeStyle(bpmnElement, styleValues);
    } else if (bpmnElement instanceof ShapeBpmnActivity) {
      StyleComputer.computeActivityShapeStyle(bpmnElement, styleValues);
    } else if (ShapeUtil.isPoolOrLane(bpmnElement.kind)) {
      // mxConstants.STYLE_HORIZONTAL is for the label
      // In BPMN, isHorizontal is for the Shape
      // So we invert the value when we switch from the BPMN value to the mxGraph value.
      styleValues.set(mxConstants.STYLE_HORIZONTAL, shape.isHorizontal ? '0' : '1');
    } else if (bpmnElement instanceof ShapeBpmnEventBasedGateway) {
      styleValues.set(BpmnStyleIdentifier.IS_INSTANTIATING, String(bpmnElement.instantiate));
      styleValues.set(BpmnStyleIdentifier.EVENT_BASED_GATEWAY_KIND, String(bpmnElement.gatewayKind));
    }

    if (!this.ignoreBpmnColors) {
      const extensions = shape.extensions;
      const fillColor = extensions.fillColor;
      if (fillColor) {
        styleValues.set(mxConstants.STYLE_FILLCOLOR, fillColor);
        if (ShapeUtil.isPoolOrLane(bpmnElement.kind)) {
          styleValues.set(mxConstants.STYLE_SWIMLANE_FILLCOLOR, fillColor);
        }
      }
      extensions.strokeColor && styleValues.set(mxConstants.STYLE_STROKECOLOR, extensions.strokeColor);
    }

    return styleValues;
  }

  private static computeEventShapeStyle(bpmnElement: ShapeBpmnEvent, styleValues: Map<string, string | number>): void {
    styleValues.set(BpmnStyleIdentifier.EVENT_DEFINITION_KIND, bpmnElement.eventDefinitionKind);

    if (bpmnElement instanceof ShapeBpmnBoundaryEvent || (bpmnElement instanceof ShapeBpmnStartEvent && bpmnElement.isInterrupting !== undefined)) {
      styleValues.set(BpmnStyleIdentifier.IS_INTERRUPTING, String(bpmnElement.isInterrupting));
    }
  }

  private static computeActivityShapeStyle(bpmnElement: ShapeBpmnActivity, styleValues: Map<string, string | number>): void {
    if (bpmnElement instanceof ShapeBpmnSubProcess) {
      styleValues.set(BpmnStyleIdentifier.SUB_PROCESS_KIND, bpmnElement.subProcessKind);
    } else if (bpmnElement.kind === ShapeBpmnElementKind.TASK_RECEIVE) {
      styleValues.set(BpmnStyleIdentifier.IS_INSTANTIATING, String(bpmnElement.instantiate));
    } else if (bpmnElement instanceof ShapeBpmnCallActivity) {
      styleValues.set(BpmnStyleIdentifier.GLOBAL_TASK_KIND, bpmnElement.globalTaskKind);
    }

    const markers: ShapeBpmnMarkerKind[] = bpmnElement.markers;
    if (markers.length > 0) {
      styleValues.set(BpmnStyleIdentifier.MARKERS, markers.join(','));
    }
  }

  private static computeEdgeBaseStyles(edge: Edge): string[] {
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

  private computeEdgeStyleValues(edge: Edge): Map<string, string | number> {
    const styleValues = new Map<string, string | number>();

    if (!this.ignoreBpmnColors) {
      const extensions = edge.extensions;
      extensions.strokeColor && styleValues.set(mxConstants.STYLE_STROKECOLOR, extensions.strokeColor);
    }

    return styleValues;
  }

  private computeFontStyleValues(bpmnCell: Shape | Edge): Map<string, string | number> {
    const styleValues = new Map<string, string | number>();

    const font = bpmnCell.label?.font;
    if (font) {
      styleValues.set(mxConstants.STYLE_FONTFAMILY, font.name);
      styleValues.set(mxConstants.STYLE_FONTSIZE, font.size);
      styleValues.set(mxConstants.STYLE_FONTSTYLE, getFontStyleValue(font));
    }

    if (!this.ignoreBpmnColors) {
      const extensions = bpmnCell.label?.extensions;
      extensions?.color && styleValues.set(mxConstants.STYLE_FONTCOLOR, extensions.color);
    }

    return styleValues;
  }

  private static computeLabelStyleValues(bpmnCell: Shape | Edge, labelBounds: Bounds): Map<string, string | number> {
    const styleValues = new Map<string, string | number>();

    const bpmnElement = bpmnCell.bpmnElement;
    if (labelBounds) {
      styleValues.set(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP);
      if (bpmnCell.bpmnElement.kind != ShapeBpmnElementKind.TEXT_ANNOTATION) {
        styleValues.set(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
      }

      if (bpmnCell instanceof Shape) {
        // arbitrarily increase width to relax too small bounds (for instance for reference diagrams from miwg-test-suite)
        styleValues.set(mxConstants.STYLE_LABEL_WIDTH, labelBounds.width + 1);
        // align settings
        // According to the documentation, "label position" can only take values in left, center, right with default=center
        // However, there is undocumented behavior when the value is not one of these and this behavior is exactly what we want.
        // See https://github.com/jgraph/mxgraph/blob/v4.2.2/javascript/src/js/view/mxGraphView.js#L1183-L1252
        styleValues.set(mxConstants.STYLE_LABEL_POSITION, 'ignore');
        styleValues.set(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
      }
    }
    // when no label bounds, adjust the default style dynamically
    else if (
      bpmnCell instanceof Shape &&
      (bpmnElement instanceof ShapeBpmnSubProcess ||
        (bpmnElement instanceof ShapeBpmnCallActivity && bpmnElement.callActivityKind === ShapeBpmnCallActivityKind.CALLING_PROCESS)) &&
      !bpmnElement.markers.includes(ShapeBpmnMarkerKind.EXPAND)
    ) {
      styleValues.set(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP);
    }

    return styleValues;
  }

  computeMessageFlowIconStyle(edge: Edge): string {
    const styleValues: [string, string][] = [];
    styleValues.push(['shape', BpmnStyleIdentifier.MESSAGE_FLOW_ICON]);
    styleValues.push([BpmnStyleIdentifier.IS_INITIATING, String(edge.messageVisibleKind === MessageVisibleKind.INITIATING)]);
    if (!this.ignoreBpmnColors) {
      edge.extensions.strokeColor && styleValues.push([mxConstants.STYLE_STROKECOLOR, edge.extensions.strokeColor]);
    }

    return toArrayOfMxGraphStyleEntries(styleValues).join(';');
  }
}

/**
 * @internal
 * @private
 */
export function getFontStyleValue(font: Font): number {
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

function toArrayOfMxGraphStyleEntries(styleValues: [string, string | number][]): string[] {
  return styleValues.filter(([, v]) => v && v != 'undefined').map(([key, value]) => `${key}=${value}`);
}
