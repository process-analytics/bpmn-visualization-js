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
import { BpmnShapeIdentifier, FONT } from '../style';
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

// TODO this type should probably be part of the API
export interface BPMNCellStyle extends CellStyle {
  // TODO the maxGraph@0.1.0 shape property is defined as 'ShapeValue'. It should be 'ShapeValue | string'
  // Omit<CellStyle, 'shape'> {
  // shape?: ShapeValue | string;
  // TODO make bpmn mandatory?
  bpmn?: {
    // TODO make kind mandatory?
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
    // eslint-disable-next-line no-console
    console.info('computeStyle - bpmnCell', bpmnCell);
    const style: BPMNCellStyle = {
      bpmn: { kind: bpmnCell.bpmnElement.kind },
    };

    const baseStyleNames: string[] = [bpmnCell.bpmnElement.kind as string];

    if (bpmnCell instanceof Shape) {
      // TODO find a better way for the merge
      StyleComputer.enrichStyleWithShapeInfo(style, bpmnCell);
      // style = { ...style, ...StyleComputer.computeShapeStyle(bpmnCell) };
    } else {
      baseStyleNames.push(...StyleComputer.computeEdgeBaseStyleNames(bpmnCell));
    }

    const fontStyleValues = StyleComputer.computeFontStyleValues(bpmnCell);
    const labelStyleValues = StyleComputer.computeLabelStyleValues(bpmnCell, labelBounds);

    const returnedStyle = { baseStyleNames: baseStyleNames, ...style, ...fontStyleValues, ...labelStyleValues };
    // eslint-disable-next-line no-console
    console.info('computeStyle - return', returnedStyle);
    return returnedStyle;
  }

  private static enrichStyleWithShapeInfo(style: BPMNCellStyle, shape: Shape): void {
    // private static computeShapeStyle(shape: Shape): BPMNCellStyle {
    //   const style: BPMNCellStyle = { bpmn: {} };
    const bpmnElement = shape.bpmnElement;

    if (bpmnElement instanceof ShapeBpmnEvent) {
      this.computeEventShapeStyle(bpmnElement, style);
    } else if (bpmnElement instanceof ShapeBpmnActivity) {
      this.computeActivityShapeStyle(bpmnElement, style);
    } else if (ShapeUtil.isPoolOrLane(bpmnElement.kind)) {
      // style.horizontal is for the label
      // In BPMN, isHorizontal is for the Shape
      style.horizontal = shape.isHorizontal;
    } else if (bpmnElement instanceof ShapeBpmnEventBasedGateway) {
      style.bpmn.isInstantiating = bpmnElement.instantiate;
      style.bpmn.gatewayKind = bpmnElement.gatewayKind;
    }

    // return style;
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

  // TODO switch from static method to function
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

  private static computeFontStyleValues(bpmnCell: Shape | Edge): CellStyle {
    const style: CellStyle = {};

    const font = bpmnCell.label?.font;
    if (font) {
      style.fontFamily = font.name;
      style.fontSize = font.size;
      style.fontStyle = StyleComputer.getFontStyleValue(font);
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
        style.labelPosition = 'left';
        style.verticalLabelPosition = 'top';
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
      // TODO remove forcing type when maxGraph fixes its types
      shape: <ShapeValue>BpmnShapeIdentifier.MESSAGE_FLOW_ICON,
      bpmn: { isNonInitiating: edge.messageVisibleKind === MessageVisibleKind.NON_INITIATING },
    };
  }

  private static getFontStyleValue(font: Font): number {
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
}
