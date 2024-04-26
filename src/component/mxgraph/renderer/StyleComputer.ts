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

import type { CellStyle, ShapeValue } from '@maxgraph/core';
import { constants } from '@maxgraph/core';

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
import type { BPMNCellStyle } from '../style/types';

/**
 * @internal
 */
export default class StyleComputer {
  private readonly ignoreBpmnColors: boolean;

  constructor(options?: RendererOptions) {
    this.ignoreBpmnColors = options?.ignoreBpmnColors ?? true;
  }

  computeStyle(bpmnCell: Shape | Edge, labelBounds: Bounds): BPMNCellStyle {
    const style: BPMNCellStyle = {
      bpmn: { kind: bpmnCell.bpmnElement.kind },
    };

    const baseStyleNames: string[] = [bpmnCell.bpmnElement.kind as string];

    if (bpmnCell instanceof Shape) {
      // TODO maxgraph@0.1.0 find a better way for the merge - computeShapeBaseStylesValues and returns a CellStyle for consistency with other methods
      this.enrichStyleWithShapeInfo(style, bpmnCell);
    } else {
      baseStyleNames.push(...StyleComputer.computeEdgeBaseStyleNames(bpmnCell));
      // TODO maxgraph@0.1.0 find a better way for the merge - computeEdgeBaseStylesValues and returns a CellStyle for consistency with other methods
      this.enrichStyleWithEdgeInfo(style, bpmnCell);
    }

    const fontStyleValues = this.computeFontStyleValues(bpmnCell);
    const labelStyleValues = StyleComputer.computeLabelStyleValues(bpmnCell, labelBounds);

    return { baseStyleNames, ...style, ...fontStyleValues, ...labelStyleValues };
  }

  private enrichStyleWithShapeInfo(style: BPMNCellStyle, shape: Shape): void {
    const bpmnElement = shape.bpmnElement;

    if (bpmnElement instanceof ShapeBpmnEvent) {
      StyleComputer.computeEventShapeStyle(bpmnElement, style);
    } else if (bpmnElement instanceof ShapeBpmnActivity) {
      StyleComputer.computeActivityShapeStyle(bpmnElement, style);
    } else if (ShapeUtil.isPoolOrLane(bpmnElement.kind)) {
      // 'style.horizontal' is for the label
      // In BPMN, isHorizontal is for the Shape
      // So we invert the value when we switch from the BPMN value to the mxGraph value.
      style.horizontal = !shape.isHorizontal;
    } else if (bpmnElement instanceof ShapeBpmnEventBasedGateway) {
      style.bpmn.isInstantiating = bpmnElement.instantiate;
      style.bpmn.gatewayKind = bpmnElement.gatewayKind;
    }

    if (!this.ignoreBpmnColors) {
      const extensions = shape.extensions;
      const fillColor = extensions.fillColor;
      if (fillColor) {
        style.fillColor = fillColor;
        if (ShapeUtil.isPoolOrLane(bpmnElement.kind)) {
          style.swimlaneFillColor = fillColor;
        }
      }
      extensions.strokeColor && (style.strokeColor = extensions.strokeColor);
    }
  }

  private static computeEventShapeStyle(bpmnElement: ShapeBpmnEvent, style: BPMNCellStyle): void {
    style.bpmn.eventDefinitionKind = bpmnElement.eventDefinitionKind;

    if (bpmnElement instanceof ShapeBpmnBoundaryEvent || (bpmnElement instanceof ShapeBpmnStartEvent && bpmnElement.isInterrupting !== undefined)) {
      style.bpmn.isInterrupting = bpmnElement.isInterrupting;
    }
  }

  private static computeActivityShapeStyle(bpmnElement: ShapeBpmnActivity, style: BPMNCellStyle): void {
    if (bpmnElement instanceof ShapeBpmnSubProcess) {
      style.bpmn.subProcessKind = bpmnElement.subProcessKind;
    } else if (bpmnElement.kind === ShapeBpmnElementKind.TASK_RECEIVE) {
      style.bpmn.isInstantiating = bpmnElement.instantiate;
    } else if (bpmnElement instanceof ShapeBpmnCallActivity) {
      style.bpmn.globalTaskKind = bpmnElement.globalTaskKind;
    }

    style.bpmn.markers = bpmnElement.markers;
  }

  // TODO maxgraph@0.1.0 switch from static method to function (same in other places of this class) --> this has been done in master branch
  // This applies to the current implementation and to all static methods of this class
  private static computeEdgeBaseStyleNames(edge: Edge): string[] {
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

  private enrichStyleWithEdgeInfo(style: BPMNCellStyle, edge: Edge): void {
    if (!this.ignoreBpmnColors) {
      const extensions = edge.extensions;
      extensions.strokeColor && (style.strokeColor = extensions.strokeColor);
    }
  }

  private computeFontStyleValues(bpmnCell: Shape | Edge): CellStyle {
    const style: CellStyle = {};

    const font = bpmnCell.label?.font;
    if (font) {
      font.name && (style.fontFamily = font.name);
      font.size && (style.fontSize = font.size);
      const fontStyleValue = getFontStyleValue(font);
      fontStyleValue && (style.fontStyle = fontStyleValue);
    }

    if (!this.ignoreBpmnColors) {
      const extensions = bpmnCell.label?.extensions;
      extensions?.color && (style.fontColor = extensions.color);
    }

    return style;
  }

  private static computeLabelStyleValues(bpmnCell: Shape | Edge, labelBounds: Bounds): CellStyle {
    const style: CellStyle = {};

    const bpmnElement = bpmnCell.bpmnElement;
    if (labelBounds) {
      style.verticalAlign = 'top';
      if (bpmnCell.bpmnElement.kind != ShapeBpmnElementKind.TEXT_ANNOTATION) {
        style.align = 'center';
      }

      if (bpmnCell instanceof Shape) {
        // arbitrarily increase width to relax too small bounds (for instance for reference diagrams from miwg-test-suite)
        style.labelWidth = labelBounds.width + 1;
        style.labelPosition = 'ignore';
        style.verticalLabelPosition = 'middle';
      }
    }
    // when no label bounds, adjust the default style dynamically
    else if (
      bpmnCell instanceof Shape &&
      (bpmnElement instanceof ShapeBpmnSubProcess ||
        (bpmnElement instanceof ShapeBpmnCallActivity && bpmnElement.callActivityKind === ShapeBpmnCallActivityKind.CALLING_PROCESS)) &&
      !bpmnElement.markers.includes(ShapeBpmnMarkerKind.EXPAND)
    ) {
      style.verticalAlign = 'top';
    }

    return style;
  }

  computeMessageFlowIconStyle(edge: Edge): BPMNCellStyle {
    const style: BPMNCellStyle = {
      // TODO maxgraph@0.1.0 remove forcing type when maxGraph fixes its types
      shape: <ShapeValue>BpmnStyleIdentifier.MESSAGE_FLOW_ICON,
      bpmn: { isInitiating: edge.messageVisibleKind === MessageVisibleKind.INITIATING },
    };
    if (!this.ignoreBpmnColors) {
      edge.extensions.strokeColor && (style.strokeColor = edge.extensions.strokeColor);
    }
    return style;
  }
}

/**
 * @internal
 * @private
 */
export function getFontStyleValue(font: Font): number {
  let value = 0;
  if (font.isBold) {
    value += constants.FONT.BOLD;
  }
  if (font.isItalic) {
    value += constants.FONT.ITALIC;
  }
  if (font.isStrikeThrough) {
    value += constants.FONT.STRIKETHROUGH;
  }
  if (font.isUnderline) {
    value += constants.FONT.UNDERLINE;
  }
  return value;
}
