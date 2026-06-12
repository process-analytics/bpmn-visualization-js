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

import type Bounds from '../../../model/bpmn/internal/Bounds';
import type { Edge } from '../../../model/bpmn/internal/edge/edge';
import type { Font } from '../../../model/bpmn/internal/Label';
import type { StyleExtensionPoint } from '../../extension/extension-points';
import type { RendererOptions } from '../../options';
import type { BpmnCellStyle, BpmnCellStyleExtension } from '../style/types';

import { constants } from '@maxgraph/core';

import { MessageVisibleKind, ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnMarkerKind, ShapeUtil } from '../../../model/bpmn/internal';
import { AssociationFlow, SequenceFlow } from '../../../model/bpmn/internal/edge/flows';
import Shape from '../../../model/bpmn/internal/shape/Shape';
import {
  ShapeBpmnActivity,
  ShapeBpmnBoundaryEvent,
  ShapeBpmnCallActivity,
  ShapeBpmnEvent,
  ShapeBpmnEventBasedGateway,
  ShapeBpmnStartEvent,
  ShapeBpmnSubProcess,
} from '../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { bpmnInColorStyleExtension } from '../../extension/bpmn-in-color/style-extension';
import { BpmnStyleIdentifier } from '../style';

/**
 * @internal
 */
export default class StyleComputer {
  private readonly ignoreLabelStyles: boolean;
  private readonly styleExtensions: StyleExtensionPoint[];

  constructor(options?: RendererOptions) {
    this.ignoreLabelStyles = options?.ignoreLabelStyles ?? false;
    // The extension list is hardcoded on purpose: the extension mechanism is currently introduced internally
    // only; external injection (a public `bpmnExtensions` option) is deferred. See ADR 001 in
    // docs/contributors/adr/, section "Refactoring scope vs. follow-up work".
    this.styleExtensions = (options?.ignoreBpmnColors ?? true) ? [] : [bpmnInColorStyleExtension];
  }

  computeStyle(bpmnCell: Shape | Edge, labelBounds: Bounds): BpmnCellStyle {
    const bpmn: BpmnCellStyleExtension = { kind: bpmnCell.bpmnElement.kind };
    const baseStyleNames: string[] = [bpmnCell.bpmnElement.kind as string];
    const style: BpmnCellStyle = { baseStyleNames, bpmn };

    if (bpmnCell instanceof Shape) {
      this.computeShapeStyle(bpmnCell, style, bpmn);
    } else {
      baseStyleNames.push(...computeEdgeBaseStyleNames(bpmnCell));
      this.computeEdgeStyle(bpmnCell, style);
    }

    this.computeFontStyle(bpmnCell, style);
    computeLabelStyle(bpmnCell, labelBounds, style);

    return style;
  }

  private computeShapeStyle(shape: Shape, style: BpmnCellStyle, bpmn: BpmnCellStyleExtension): void {
    const bpmnElement = shape.bpmnElement;

    if (bpmnElement instanceof ShapeBpmnEvent) {
      computeEventShapeStyle(bpmnElement, bpmn);
    } else if (bpmnElement instanceof ShapeBpmnActivity) {
      computeActivityShapeStyle(bpmnElement, bpmn);
    } else if (ShapeUtil.isPoolOrLane(bpmnElement.kind)) {
      // 'style.horizontal' is for the label.
      // In BPMN, isHorizontal is for the Shape.
      // So we invert the value when we switch from the BPMN value to the maxGraph value.
      style.horizontal = !shape.isHorizontal;
    } else if (bpmnElement instanceof ShapeBpmnEventBasedGateway) {
      bpmn.isInstantiating = bpmnElement.instantiate;
      bpmn.gatewayKind = bpmnElement.gatewayKind;
    }

    for (const extension of this.styleExtensions) extension.enrichShapeStyle?.(shape, style);
  }

  private computeEdgeStyle(edge: Edge, style: BpmnCellStyle): void {
    for (const extension of this.styleExtensions) extension.enrichEdgeStyle?.(edge, style);
  }

  private computeFontStyle(bpmnCell: Shape | Edge, style: BpmnCellStyle): void {
    const font = bpmnCell.label?.font;
    if (font && !this.ignoreLabelStyles) {
      font.name && (style.fontFamily = font.name);
      font.size && (style.fontSize = font.size);
      // Do not set fontStyle to 0: an explicit 0 would override the default and is not meaningful.
      const fontStyleValue = getFontStyleValue(font);
      fontStyleValue && (style.fontStyle = fontStyleValue);
    }
  }

  computeMessageFlowIconStyle(edge: Edge): BpmnCellStyle {
    const style: BpmnCellStyle = {
      shape: BpmnStyleIdentifier.MESSAGE_FLOW_ICON,
      bpmn: { isInitiating: edge.messageVisibleKind === MessageVisibleKind.INITIATING },
    };

    for (const extension of this.styleExtensions) extension.enrichMessageFlowIconStyle?.(edge, style);

    return style;
  }
}

function computeEventShapeStyle(bpmnElement: ShapeBpmnEvent, bpmn: BpmnCellStyleExtension): void {
  bpmn.eventDefinitionKind = bpmnElement.eventDefinitionKind;

  if (bpmnElement instanceof ShapeBpmnBoundaryEvent || (bpmnElement instanceof ShapeBpmnStartEvent && bpmnElement.isInterrupting !== undefined)) {
    bpmn.isInterrupting = bpmnElement.isInterrupting;
  }
}

function computeActivityShapeStyle(bpmnElement: ShapeBpmnActivity, bpmn: BpmnCellStyleExtension): void {
  if (bpmnElement instanceof ShapeBpmnSubProcess) {
    bpmn.subProcessKind = bpmnElement.subProcessKind;
  } else if (bpmnElement.kind === ShapeBpmnElementKind.TASK_RECEIVE) {
    bpmn.isInstantiating = bpmnElement.instantiate;
  } else if (bpmnElement instanceof ShapeBpmnCallActivity) {
    bpmn.globalTaskKind = bpmnElement.globalTaskKind;
  }

  bpmn.markers = bpmnElement.markers;
}

function computeEdgeBaseStyleNames(edge: Edge): string[] {
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

function computeLabelStyle(bpmnCell: Shape | Edge, labelBounds: Bounds, style: BpmnCellStyle): void {
  const bpmnElement = bpmnCell.bpmnElement;
  if (labelBounds) {
    style.verticalAlign = 'top';
    if (bpmnCell.bpmnElement.kind != ShapeBpmnElementKind.TEXT_ANNOTATION) {
      style.align = 'center';
    }

    if (bpmnCell instanceof Shape) {
      // arbitrarily increase width to relax too small bounds (for instance for reference diagrams from miwg-test-suite)
      style.labelWidth = labelBounds.width + 1;
      // According to the documentation, "label position" can only take values in left, center, right with default=center.
      // However, there is undocumented behavior when the value is not one of these and this behavior is exactly what we want.
      // The behavior carried over from mxGraph to maxGraph; the 'ignore' value is part of the maxGraph CellStyle type.
      style.labelPosition = 'ignore';
      style.verticalLabelPosition = 'middle';
    }
  }
  // when no label bounds, adjust the default style dynamically
  else if (
    bpmnCell instanceof Shape &&
    (bpmnElement instanceof ShapeBpmnSubProcess || (bpmnElement instanceof ShapeBpmnCallActivity && bpmnElement.callActivityKind === ShapeBpmnCallActivityKind.CALLING_PROCESS)) &&
    !bpmnElement.markers.includes(ShapeBpmnMarkerKind.EXPAND)
  ) {
    style.verticalAlign = 'top';
  }
}

/**
 * @internal
 * @private
 */
export function getFontStyleValue(font: Font): number {
  let value = 0;
  if (font.isBold) {
    value += constants.FONT_STYLE_MASK.BOLD;
  }
  if (font.isItalic) {
    value += constants.FONT_STYLE_MASK.ITALIC;
  }
  if (font.isStrikeThrough) {
    value += constants.FONT_STYLE_MASK.STRIKETHROUGH;
  }
  if (font.isUnderline) {
    value += constants.FONT_STYLE_MASK.UNDERLINE;
  }
  return value;
}
