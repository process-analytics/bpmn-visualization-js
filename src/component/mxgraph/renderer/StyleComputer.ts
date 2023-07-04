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
import { BpmnStyleIdentifier, FONT } from '../style';
import type {
  AssociationDirectionKind,
  FlowKind,
  GlobalTaskKind,
  SequenceFlowKind,
  ShapeBpmnEventBasedGatewayKind,
  ShapeBpmnEventDefinitionKind,
  ShapeBpmnSubProcessKind,
} from '../../../model/bpmn/internal';
import { MessageVisibleKind, ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnMarkerKind, ShapeUtil } from '../../../model/bpmn/internal';
import { AssociationFlow, SequenceFlow } from '../../../model/bpmn/internal/edge/flows';
import type { Font } from '../../../model/bpmn/internal/Label';
import type { RendererOptions } from '../../options';

// TODO magraph@0.1.0 this type should probably be part of the API (so it should be exported)
export interface BPMNCellStyle extends CellStyle {
  // TODO magraph@0.1.0 the shape property is defined as 'ShapeValue'. It should be 'ShapeValue | string'
  // Omit<CellStyle, 'shape'> {
  // shape?: ShapeValue | string;
  // TODO magraph@0.1.0 make bpmn mandatory?
  bpmn?: {
    // TODO magraph@0.1.0 sort properties in alphabetical order for clarity (and as done in maxGraph CellStyle) and provide documentation about each property
    // TODO magraph@0.1.0 make kind mandatory?
    kind?: ShapeBpmnElementKind | FlowKind;
    isInstantiating?: boolean;
    gatewayKind?: ShapeBpmnEventBasedGatewayKind;
    eventDefinitionKind?: ShapeBpmnEventDefinitionKind;
    isInterrupting?: boolean;
    subProcessKind?: ShapeBpmnSubProcessKind;
    globalTaskKind?: GlobalTaskKind;
    markers?: ShapeBpmnMarkerKind[];
    sequenceFlowKind?: SequenceFlowKind;
    associationDirectionKind?: AssociationDirectionKind;
    // TODO magraph@0.1.0 isNonInitiating: previously we add a string, this introduces extra changes. If we want to keep this, do it in the master branch
    isNonInitiating?: boolean; // TODO magraph@0.1.0 why not 'isInitiating' for consistency with other boolean value? Negate doesn't make things easier to understand
    extra?: {
      css: {
        classes: string[];
      };
    };
    edge?: {
      endFillColor?: string;
      startFillColor?: string;
    };
  };
}

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
      // TODO magraph@0.1.0 find a better way for the merge
      StyleComputer.enrichStyleWithShapeInfo(style, bpmnCell);
    } else {
      baseStyleNames.push(...StyleComputer.computeEdgeBaseStyleNames(bpmnCell));
    }

    const fontStyleValues = this.computeFontStyleValues(bpmnCell);
    const labelStyleValues = StyleComputer.computeLabelStyleValues(bpmnCell, labelBounds);

    return { baseStyleNames: baseStyleNames, ...style, ...fontStyleValues, ...labelStyleValues };
  }

  private static enrichStyleWithShapeInfo(style: BPMNCellStyle, shape: Shape): void {
    const bpmnElement = shape.bpmnElement;

    if (bpmnElement instanceof ShapeBpmnEvent) {
      StyleComputer.computeEventShapeStyle(bpmnElement, style);
    } else if (bpmnElement instanceof ShapeBpmnActivity) {
      StyleComputer.computeActivityShapeStyle(bpmnElement, style);
    } else if (ShapeUtil.isPoolOrLane(bpmnElement.kind)) {
      // 'style.horizontal' is for the label
      // In BPMN, isHorizontal is for the Shape
      // TODO rebase adapt comment
      // mxConstants.STYLE_HORIZONTAL is for the label
      // In BPMN, isHorizontal is for the Shape
      // So we invert the value when we switch from the BPMN value to the mxGraph value.
      style.horizontal = !(shape.isHorizontal ?? true);
    } else if (bpmnElement instanceof ShapeBpmnEventBasedGateway) {
      style.bpmn.isInstantiating = bpmnElement.instantiate;
      style.bpmn.gatewayKind = bpmnElement.gatewayKind;
    }

    // TODO rebase adapt for maxGraph
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

  // TODO magraph@0.1.0 switch from static method to function (same in other places of this class) --> TODO in master branch
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

  private computeEdgeStyleValues(edge: Edge): Map<string, string | number> {
    const styleValues = new Map<string, string | number>();

    if (!this.ignoreBpmnColors) {
      const extensions = edge.extensions;
      extensions.strokeColor && styleValues.set(mxConstants.STYLE_STROKECOLOR, extensions.strokeColor);
    }

    return styleValues;
  }

  private computeFontStyleValues(bpmnCell: Shape | Edge): CellStyle {
    const style: CellStyle = {};

    const font = bpmnCell.label?.font;
    if (font) {
      font.name && (style.fontFamily = font.name);
      font.size && (style.fontSize = font.size);
      style.fontStyle = StyleComputer.getFontStyleValue(font);
    }

    // TODO rebase adapt for maxGraph
    if (!this.ignoreBpmnColors) {
      const extensions = bpmnCell.label?.extensions;
      extensions?.color && styleValues.set(mxConstants.STYLE_FONTCOLOR, extensions.color);
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
        // align settings
        // According to the documentation, "label position" can only take values in left, center, right with default=center
        // However, there is undocumented behavior when the value is not one of these and this behavior is exactly what we want.
        // See https://github.com/jgraph/mxgraph/blob/v4.2.2/javascript/src/js/view/mxGraphView.js#L1183-L1252
        // FIXME magraph@0.1.0 values were inverted in the mxGraph implementation, this was probably wrong as they were set like this in StyleConfigurator (fixed in master branch)
        // styleValues.set(mxConstants.STYLE_LABEL_POSITION, 'ignore');
        // styleValues.set(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
        // TODO rebase adapt label position for maxGraph
        style.labelPosition = 'left';
        style.verticalLabelPosition = 'top';
        // end of fixme
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
    return {
      // TODO magraph@0.1.0 remove forcing type when maxGraph fixes its types
      shape: <ShapeValue>BpmnStyleIdentifier.MESSAGE_FLOW_ICON,
      // TODO rebase, isNonInitiating --> isInitiating
      //     styleValues.push([BpmnStyleIdentifier.IS_INITIATING, String(edge.messageVisibleKind === MessageVisibleKind.INITIATING)]);
      bpmn: { isNonInitiating: edge.messageVisibleKind === MessageVisibleKind.NON_INITIATING },
    };
    // TODO rebase for maxGraph, handle bpmn in color
    //     if (!this.ignoreBpmnColors) {
    //       edge.extensions.strokeColor && styleValues.push([mxConstants.STYLE_STROKECOLOR, edge.extensions.strokeColor]);
    //     }
  }
}

/**
 * @internal
 * @private
 */
export function getFontStyleValue(font: Font): number {
  let value = 0;
  if (font.isBold) {
    value += FONT.BOLD;
  }
  if (font.isItalic) {
    value += FONT.ITALIC;
  }
  if (font.isStrikeThrough) {
    value += FONT.STRIKETHROUGH;
  }
  if (font.isUnderline) {
    value += FONT.UNDERLINE;
  }
  return value;
}
