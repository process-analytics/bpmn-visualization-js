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

import { constants } from '@maxgraph/core';
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
import { BpmnShapeIdentifier } from '../style';
import type {
  FlowKind,
  ShapeBpmnEventBasedGatewayKind,
  ShapeBpmnEventDefinitionKind,
  ShapeBpmnSubProcessKind,
  GlobalTaskKind,
  SequenceFlowKind,
  AssociationDirectionKind,
} from '../../../model/bpmn/internal';
import { MessageVisibleKind, ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnMarkerKind, ShapeUtil } from '../../../model/bpmn/internal';
import { AssociationFlow, SequenceFlow } from '../../../model/bpmn/internal/edge/flows';
import type { Font } from '../../../model/bpmn/internal/Label';

export interface BPMNCellStyle extends CellStyle {
  // TODO the maxGraph@0.1.0 shape property is defined as 'ShapeValue'. It should be 'ShapeValue | string'
  // Omit<CellStyle, 'shape'> {
  // shape?: ShapeValue | string;
  bpmn?: {
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
    isNonInitiating?: boolean;
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
  computeStyle(bpmnCell: Shape | Edge, labelBounds: Bounds): BPMNCellStyle {
    const style: BPMNCellStyle = {
      bpmn: { kind: bpmnCell.bpmnElement.kind },
      ...(bpmnCell instanceof Shape ? StyleComputer.computeShapeStyle(bpmnCell) : StyleComputer.computeEdgeStyle(bpmnCell)),
    };

    const fontStyleValues = StyleComputer.computeFontStyleValues(bpmnCell);
    const labelStyleValues = StyleComputer.computeLabelStyleValues(bpmnCell, labelBounds);

    return { ...style, ...fontStyleValues, ...labelStyleValues };
  }

  private static computeShapeStyle(shape: Shape): BPMNCellStyle {
    const style: BPMNCellStyle = { bpmn: {} };
    const bpmnElement = shape.bpmnElement;

    if (bpmnElement instanceof ShapeBpmnEvent) {
      this.computeEventShapeStyle(bpmnElement, style);
    } else if (bpmnElement instanceof ShapeBpmnActivity) {
      this.computeActivityShapeStyle(bpmnElement, style);
    } else if (ShapeUtil.isPoolOrLane(bpmnElement.kind)) {
      // In BPMN, isHorizontal is for the Shape
      style.horizontal = shape.isHorizontal;
    } else if (bpmnElement instanceof ShapeBpmnEventBasedGateway) {
      style.bpmn.isInstantiating = bpmnElement.instantiate;
      style.bpmn.gatewayKind = bpmnElement.gatewayKind;
    }

    return style;
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

  private static computeEdgeStyle(edge: Edge): BPMNCellStyle {
    const style: BPMNCellStyle = { bpmn: {} };

    const bpmnElement = edge.bpmnElement;
    if (bpmnElement instanceof SequenceFlow) {
      style.bpmn.sequenceFlowKind = bpmnElement.sequenceFlowKind;
    } else if (bpmnElement instanceof AssociationFlow) {
      style.bpmn.associationDirectionKind = bpmnElement.associationDirectionKind;
    }

    return style;
  }

  private static computeFontStyleValues(bpmnCell: Shape | Edge): BPMNCellStyle {
    const style: BPMNCellStyle = { bpmn: {} };

    const font = bpmnCell.label?.font;
    if (font) {
      style.fontFamily = font.name;
      style.fontSize = font.size;
      style.fontStyle = StyleComputer.getFontStyleValue(font);
    }

    return style;
  }

  private static computeLabelStyleValues(bpmnCell: Shape | Edge, labelBounds: Bounds): BPMNCellStyle {
    const style: BPMNCellStyle = { bpmn: {} };

    const bpmnElement = bpmnCell.bpmnElement;
    if (labelBounds) {
      style.verticalAlign = constants.ALIGN.TOP;
      if (bpmnCell.bpmnElement.kind != ShapeBpmnElementKind.TEXT_ANNOTATION) {
        style.align = constants.ALIGN.CENTER;
      }

      if (bpmnCell instanceof Shape) {
        // arbitrarily increase width to relax too small bounds (for instance for reference diagrams from miwg-test-suite)
        style.labelWidth = labelBounds.width + 1;
        // align settings
        style.labelPosition = constants.ALIGN.LEFT;
        style.verticalLabelPosition = constants.ALIGN.TOP;
      }
    }
    // when no label bounds, adjust the default style dynamically
    else if (
      bpmnCell instanceof Shape &&
      (bpmnElement instanceof ShapeBpmnSubProcess ||
        (bpmnElement instanceof ShapeBpmnCallActivity && bpmnElement.callActivityKind === ShapeBpmnCallActivityKind.CALLING_PROCESS)) &&
      !bpmnElement.markers.includes(ShapeBpmnMarkerKind.EXPAND)
    ) {
      style.verticalAlign = constants.ALIGN.TOP;
    }

    return style;
  }

  computeMessageFlowIconStyle(edge: Edge): BPMNCellStyle {
    return {
      // TODO remove forcing type when maxGraph fixes its types
      shape: <ShapeValue>BpmnShapeIdentifier.MESSAGE_FLOW_ICON,
      bpmn: { isNonInitiating: edge.messageVisibleKind === MessageVisibleKind.NON_INITIATING },
    };
  }

  private static getFontStyleValue(font: Font): number {
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
}
