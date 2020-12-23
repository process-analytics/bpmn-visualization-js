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
/*
import { ShapeBpmnElementKind, ShapeBpmnMarkerKind } from '../../../model/bpmn/internal/shape';
import ShapeUtil from '../../../model/bpmn/internal/shape/ShapeUtil';
import { SequenceFlowKind } from '../../../model/bpmn/internal/edge/SequenceFlowKind';
import Shape from '../../../model/bpmn/internal/shape/Shape';
import Edge from '../../../model/bpmn/internal/edge/Edge';
import Bounds from '../../../model/bpmn/internal/Bounds';
import ShapeBpmnElement, {
  ShapeBpmnActivity,
  ShapeBpmnBoundaryEvent,
  ShapeBpmnCallActivity,
  ShapeBpmnEvent,
  ShapeBpmnEventBasedGateway,
  ShapeBpmnStartEvent,
  ShapeBpmnSubProcess,
} from '../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { Font } from '../../../model/bpmn/internal/Label';
import { FlowKind } from '../../../model/bpmn/internal/edge/FlowKind';
import { AssociationFlow, SequenceFlow } from '../../../model/bpmn/internal/edge/Flow';
import { AssociationDirectionKind } from '../../../model/bpmn/internal/edge/AssociationDirectionKind';
import { Graph } from '@antv/g6';

export default class StyleConfigurator {
  private specificFlowStyles: Map<FlowKind, (style: StyleMap) => void> = new Map([
    [
      FlowKind.SEQUENCE_FLOW,
      (style: StyleMap) => {
        style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK_THIN;
      },
    ],
    [
      FlowKind.MESSAGE_FLOW,
      (style: StyleMap) => {
        style[mxConstants.STYLE_DASHED] = true;
        style[mxConstants.STYLE_DASH_PATTERN] = '8 5';
        style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_OVAL;
        style[mxConstants.STYLE_STARTSIZE] = 8;
        style[mxConstants.STYLE_STARTFILL] = false;
        style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK_THIN;
        style[mxConstants.STYLE_ENDFILL] = false;
      },
    ],
    [
      FlowKind.ASSOCIATION_FLOW,
      (style: StyleMap) => {
        style[mxConstants.STYLE_DASHED] = true;
        style[mxConstants.STYLE_DASH_PATTERN] = '1 2';
        style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OPEN_THIN;
        style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_OPEN_THIN;
        style[mxConstants.STYLE_STARTSIZE] = 12;
      },
    ],
  ]);
  private specificSequenceFlowStyles: Map<SequenceFlowKind, (style: StyleMap) => void> = new Map([
    [
      SequenceFlowKind.DEFAULT,
      (style: StyleMap) => {
        style[mxConstants.STYLE_STARTARROW] = MarkerIdentifier.ARROW_DASH;
      },
    ],
    [
      SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
      (style: StyleMap) => {
        style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_DIAMOND_THIN;
        style[mxConstants.STYLE_STARTSIZE] = 18;
        style[mxConstants.STYLE_STARTFILL] = false;
      },
    ],
  ]);
  private specificAssociationFlowStyles: Map<AssociationDirectionKind, (style: StyleMap) => void> = new Map([
    [
      AssociationDirectionKind.NONE,
      (style: StyleMap) => {
        style[mxConstants.STYLE_STARTARROW] = undefined;
        style[mxConstants.STYLE_ENDARROW] = undefined;
        style[mxConstants.STYLE_EDGE] = undefined; // ensure no orthogonal segments, see also https://github.com/process-analytics/bpmn-visualization-js/issues/295
      },
    ],
    [
      AssociationDirectionKind.ONE,
      (style: StyleMap) => {
        style[mxConstants.STYLE_STARTARROW] = undefined;
        style[mxConstants.STYLE_EDGE] = undefined; // ensure no orthogonal segments, see also https://github.com/process-analytics/bpmn-visualization-js/issues/295
      },
    ],
    [
      AssociationDirectionKind.BOTH,
      (style: StyleMap) => {
        style[mxConstants.STYLE_EDGE] = undefined; // ensure no orthogonal segments, see also https://github.com/process-analytics/bpmn-visualization-js/issues/295
      },
    ],
  ]);

  constructor(private graph: Graph) {}

  public configureStyles(): void {
    mxConstants.RECTANGLE_ROUNDING_FACTOR = 0.1;
    this.configureDefaultVertexStyle();

    this.configurePoolStyle();
    this.configureLaneStyle();

    this.configureTextAnnotationStyle();
    this.configureActivityStyles();
    this.configureEventStyles();
    this.configureGatewayStyles();

    this.configureDefaultEdgeStyle();
    this.configureFlowStyles();
  }

  private getStylesheet(): mxStylesheet {
    return this.graph.getStylesheet();
  }

  private getDefaultVertexStyle(): StyleMap {
    return this.getStylesheet().getDefaultVertexStyle();
  }

  private getDefaultEdgeStyle(): StyleMap {
    return this.getStylesheet().getDefaultEdgeStyle();
  }

  private cloneDefaultVertexStyle(): StyleMap {
    const defaultStyle = this.getDefaultVertexStyle();
    return mxUtils.clone(defaultStyle);
  }

  private cloneDefaultEdgeStyle(): StyleMap {
    const defaultStyle = this.getDefaultEdgeStyle();
    return mxUtils.clone(defaultStyle);
  }

  private putCellStyle(name: ShapeBpmnElementKind, style: StyleMap): void {
    this.getStylesheet().putCellStyle(name, style);
  }

  private configureDefaultVertexStyle(): void {
    const style = this.getDefaultVertexStyle();
    this.configureCommonDefaultStyle(style);
  }

  private configurePoolStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;

    // TODO Remove when the bounds of the pool label is implemented
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;

    // TODO manage pool text area rendering. Maybe we can calculate it from the label size/bounds
    // most of BPMN pool are ok when setting it to 30
    style[mxConstants.STYLE_STARTSIZE] = StyleDefault.POOL_LABEL_SIZE;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.POOL, style);
  }

  private configureLaneStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;

    // TODO Remove when the bounds of the lane label is implemented
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;

    style[mxConstants.STYLE_SWIMLANE_LINE] = 0; // hide the line between the title region and the content area

    // TODO manage lane text area rendering. there is no Label neither the size available (we have only attribute name="Text of the Label")
    // perhaps it can be calculated as a difference of starting point (either x or y) between pool, lane, sub-lane ?
    style[mxConstants.STYLE_STARTSIZE] = StyleDefault.LANE_LABEL_SIZE;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.LANE, style);
  }

  private configureEventStyles(): void {
    ShapeUtil.topLevelBpmnEventKinds().forEach(kind => {
      const style = this.cloneDefaultVertexStyle();
      style[mxConstants.STYLE_SHAPE] = kind;
      style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
      style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_BOTTOM;
      this.putCellStyle(kind, style);
    });
  }

  private configureTextAnnotationStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = ShapeBpmnElementKind.TEXT_ANNOTATION;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
    style[mxConstants.STYLE_SPACING_LEFT] = 5;
    this.putCellStyle(ShapeBpmnElementKind.TEXT_ANNOTATION, style);
  }

  private configureActivityStyles(): void {
    ShapeUtil.activityKinds().forEach(kind => {
      const style = this.cloneDefaultVertexStyle();
      style[mxConstants.STYLE_SHAPE] = kind;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
      this.putCellStyle(kind, style);
    });
  }

  private configureGatewayStyles(): void {
    ShapeUtil.gatewayKinds().forEach(kind => {
      const style = this.cloneDefaultVertexStyle();
      style[mxConstants.STYLE_SHAPE] = kind;
      style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;

      // Default positioning in case there is no BPMN LabelStyle
      style[mxConstants.STYLE_LABEL_POSITION] = mxConstants.ALIGN_LEFT;
      style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_TOP;

      this.putCellStyle(kind, style);
    });
  }

  private configureDefaultEdgeStyle(): void {
    const style = this.getDefaultEdgeStyle();
    style[mxConstants.STYLE_EDGE] = mxConstants.EDGESTYLE_SEGMENT;
    style[mxConstants.STYLE_ENDSIZE] = 12;
    style[mxConstants.STYLE_STROKEWIDTH] = 1.5;
    style[mxConstants.STYLE_ROUNDED] = 1;
    style[mxConstants.STYLE_ARCSIZE] = 5;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_BOTTOM;

    delete style[mxConstants.STYLE_ENDARROW];

    this.configureCommonDefaultStyle(style);
  }

  private configureCommonDefaultStyle(style: StyleMap): void {
    style[mxConstants.STYLE_FONTFAMILY] = StyleDefault.DEFAULT_FONT_FAMILY;
    style[mxConstants.STYLE_FONTSIZE] = StyleDefault.DEFAULT_FONT_SIZE;
    style[mxConstants.STYLE_FONTCOLOR] = StyleDefault.DEFAULT_FONT_COLOR;
    style[mxConstants.STYLE_FILLCOLOR] = StyleDefault.DEFAULT_FILL_COLOR;
    style[mxConstants.STYLE_STROKECOLOR] = StyleDefault.DEFAULT_STROKE_COLOR;
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = mxConstants.NONE;

    // only works with html labels (enabled by MxGraphConfigurator)
    style[mxConstants.STYLE_WHITE_SPACE] = 'wrap';
  }

  private configureEdgeStyles<T>(styleKinds: T[], specificStyles: Map<T, (style: StyleMap) => void>): void {
    styleKinds.forEach(kind => {
      const style = this.cloneDefaultEdgeStyle();
      const updateEdgeStyle =
        specificStyles.get(kind) ||
        (() => {
          // Do nothing
        });
      updateEdgeStyle(style);
      this.graph.getStylesheet().putCellStyle(kind.toString(), style);
    });
  }

  private configureSequenceFlowStyles(): void {
    this.configureEdgeStyles<SequenceFlowKind>(Object.values(SequenceFlowKind), this.specificSequenceFlowStyles);
  }

  private configureAssociationFlowStyles(): void {
    this.configureEdgeStyles<AssociationDirectionKind>(Object.values(AssociationDirectionKind), this.specificAssociationFlowStyles);
  }

  private configureFlowStyles(): void {
    this.configureEdgeStyles<FlowKind>(Object.values(FlowKind), this.specificFlowStyles);
    this.configureSequenceFlowStyles();
    this.configureAssociationFlowStyles();
  }

  computeStyle(bpmnCell: Shape | Edge, labelBounds: Bounds): string {
    const styleValues = new Map<string, string | number>();
    const styles: string[] = [bpmnCell.bpmnElement?.kind as string];

    const bpmnElement = bpmnCell.bpmnElement;
    if (bpmnCell instanceof Shape) {
      if (bpmnElement instanceof ShapeBpmnEvent) {
        styleValues.set(StyleIdentifier.BPMN_STYLE_EVENT_KIND, bpmnElement.eventKind);

        if (bpmnElement instanceof ShapeBpmnBoundaryEvent || (bpmnElement instanceof ShapeBpmnStartEvent && bpmnElement.isInterrupting !== undefined)) {
          styleValues.set(StyleIdentifier.BPMN_STYLE_IS_INTERRUPTING, String(bpmnElement.isInterrupting));
        }
      } else if (bpmnElement instanceof ShapeBpmnActivity) {
        if (bpmnElement instanceof ShapeBpmnSubProcess) {
          styleValues.set(StyleIdentifier.BPMN_STYLE_SUB_PROCESS_KIND, bpmnElement.subProcessKind);
        } else if (bpmnElement.kind === ShapeBpmnElementKind.TASK_RECEIVE) {
          styleValues.set(StyleIdentifier.BPMN_STYLE_INSTANTIATING, String(bpmnElement.instantiate));
        }

        const markers: ShapeBpmnMarkerKind[] = bpmnElement.markers;
        if (markers.length > 0) {
          styleValues.set(StyleIdentifier.BPMN_STYLE_MARKERS, markers.join(','));
        }
      } else if (ShapeUtil.isPoolOrLane((bpmnElement as ShapeBpmnElement).kind)) {
        // mxConstants.STYLE_HORIZONTAL is for the label
        // In BPMN, isHorizontal is for the Shape
        styleValues.set(mxConstants.STYLE_HORIZONTAL, bpmnCell.isHorizontal ? '0' : '1');
      } else if (bpmnElement instanceof ShapeBpmnEventBasedGateway) {
        styleValues.set(StyleIdentifier.BPMN_STYLE_INSTANTIATING, String(bpmnElement.instantiate));
        styleValues.set(StyleIdentifier.BPMN_STYLE_EVENT_BASED_GATEWAY_KIND, String(bpmnElement.gatewayKind));
      }
    } else {
      if (bpmnElement instanceof SequenceFlow) {
        styles.push(bpmnElement.sequenceFlowKind);
      }
      if (bpmnElement instanceof AssociationFlow) {
        styles.push(bpmnElement.associationDirectionKind);
      }
    }

    const font = bpmnCell.label?.font;
    if (font) {
      styleValues.set(mxConstants.STYLE_FONTFAMILY, font.name);
      styleValues.set(mxConstants.STYLE_FONTSIZE, font.size);
      styleValues.set(mxConstants.STYLE_FONTSTYLE, StyleConfigurator.getFontStyleValue(font));
    }

    if (labelBounds) {
      styleValues.set(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP);
      if (bpmnCell.bpmnElement.kind != ShapeBpmnElementKind.TEXT_ANNOTATION) {
        styleValues.set(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
      }

      if (bpmnCell instanceof Shape) {
        // arbitrarily increase width to relax too small bounds (for instance for reference diagrams from miwg-test-suite)
        styleValues.set(mxConstants.STYLE_LABEL_WIDTH, labelBounds.width + 1);
        // align settings
        styleValues.set(mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_TOP);
        styleValues.set(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_LEFT);
      }
    }
    // when no label bounds, adjust the default style dynamically
    else if (
      bpmnCell instanceof Shape &&
      (bpmnElement instanceof ShapeBpmnSubProcess || bpmnElement instanceof ShapeBpmnCallActivity) &&
      !bpmnElement.markers.includes(ShapeBpmnMarkerKind.EXPAND)
    ) {
      styleValues.set(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP);
    }

    return [] //
      .concat([...styles])
      .concat([...styleValues].filter(([, v]) => v && v != 'undefined').map(([key, value]) => key + '=' + value))
      .join(';');
  }

  computeMessageFlowIconStyle(edge: Edge): string {
    return `shape=${StyleIdentifier.BPMN_STYLE_MESSAGE_FLOW_ICON};${StyleIdentifier.BPMN_STYLE_IS_INITIATING}=${edge.messageVisibleKind}`;
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
*/
