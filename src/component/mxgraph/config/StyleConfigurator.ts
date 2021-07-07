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

import { ShapeBpmnElementKind } from '../../../model/bpmn/internal/shape';
import ShapeUtil from '../../../model/bpmn/internal/shape/ShapeUtil';
import { SequenceFlowKind } from '../../../model/bpmn/internal/edge/SequenceFlowKind';
import { MarkerIdentifier, StyleDefault, StyleIdentifier } from '../StyleUtils';
import { FlowKind } from '../../../model/bpmn/internal/edge/FlowKind';
import { AssociationDirectionKind } from '../../../model/bpmn/internal/edge/AssociationDirectionKind';
import { BpmnMxGraph } from '../BpmnMxGraph';
import { mxgraph } from '../initializer';
import { mxStylesheet, StyleMap } from 'mxgraph'; // for types

/**
 * @internal
 */
export default class StyleConfigurator {
  private specificFlowStyles: Map<FlowKind, (style: StyleMap) => void> = new Map([
    [
      FlowKind.SEQUENCE_FLOW,
      (style: StyleMap) => {
        style[mxgraph.mxConstants.STYLE_ENDARROW] = mxgraph.mxConstants.ARROW_BLOCK_THIN;
      },
    ],
    [
      FlowKind.MESSAGE_FLOW,
      (style: StyleMap) => {
        style[mxgraph.mxConstants.STYLE_DASHED] = true;
        style[mxgraph.mxConstants.STYLE_DASH_PATTERN] = '8 5';
        style[mxgraph.mxConstants.STYLE_STARTARROW] = mxgraph.mxConstants.ARROW_OVAL;
        style[mxgraph.mxConstants.STYLE_STARTSIZE] = 8;
        style[mxgraph.mxConstants.STYLE_STARTFILL] = true;
        style[StyleIdentifier.EDGE_START_FILL_COLOR] = StyleDefault.MESSAGE_FLOW_MARKER_START_FILL_COLOR;
        style[mxgraph.mxConstants.STYLE_ENDARROW] = mxgraph.mxConstants.ARROW_BLOCK_THIN;
        style[mxgraph.mxConstants.STYLE_ENDFILL] = true;
        style[StyleIdentifier.EDGE_END_FILL_COLOR] = StyleDefault.MESSAGE_FLOW_MARKER_END_FILL_COLOR;
      },
    ],
    [
      FlowKind.ASSOCIATION_FLOW,
      (style: StyleMap) => {
        style[mxgraph.mxConstants.STYLE_DASHED] = true;
        style[mxgraph.mxConstants.STYLE_DASH_PATTERN] = '1 2';
        style[mxgraph.mxConstants.STYLE_ENDARROW] = mxgraph.mxConstants.ARROW_OPEN_THIN;
        style[mxgraph.mxConstants.STYLE_STARTARROW] = mxgraph.mxConstants.ARROW_OPEN_THIN;
        style[mxgraph.mxConstants.STYLE_STARTSIZE] = 12;
      },
    ],
  ]);
  private specificSequenceFlowStyles: Map<SequenceFlowKind, (style: StyleMap) => void> = new Map([
    [
      SequenceFlowKind.DEFAULT,
      (style: StyleMap) => {
        style[mxgraph.mxConstants.STYLE_STARTARROW] = MarkerIdentifier.ARROW_DASH;
      },
    ],
    [
      SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
      (style: StyleMap) => {
        style[mxgraph.mxConstants.STYLE_STARTARROW] = mxgraph.mxConstants.ARROW_DIAMOND_THIN;
        style[mxgraph.mxConstants.STYLE_STARTSIZE] = 18;
        style[mxgraph.mxConstants.STYLE_STARTFILL] = true;
        style[StyleIdentifier.EDGE_START_FILL_COLOR] = StyleDefault.SEQUENCE_FLOW_CONDITIONAL_FROM_ACTIVITY_MARKER_FILL_COLOR;
      },
    ],
  ]);
  private specificAssociationFlowStyles: Map<AssociationDirectionKind, (style: StyleMap) => void> = new Map([
    [
      AssociationDirectionKind.NONE,
      (style: StyleMap) => {
        style[mxgraph.mxConstants.STYLE_STARTARROW] = undefined;
        style[mxgraph.mxConstants.STYLE_ENDARROW] = undefined;
        style[mxgraph.mxConstants.STYLE_EDGE] = undefined; // ensure no orthogonal segments, see also https://github.com/process-analytics/bpmn-visualization-js/issues/295
      },
    ],
    [
      AssociationDirectionKind.ONE,
      (style: StyleMap) => {
        style[mxgraph.mxConstants.STYLE_STARTARROW] = undefined;
        style[mxgraph.mxConstants.STYLE_EDGE] = undefined; // ensure no orthogonal segments, see also https://github.com/process-analytics/bpmn-visualization-js/issues/295
      },
    ],
    [
      AssociationDirectionKind.BOTH,
      (style: StyleMap) => {
        style[mxgraph.mxConstants.STYLE_EDGE] = undefined; // ensure no orthogonal segments, see also https://github.com/process-analytics/bpmn-visualization-js/issues/295
      },
    ],
  ]);

  constructor(private graph: BpmnMxGraph) {}

  public configureStyles(): void {
    mxgraph.mxConstants.RECTANGLE_ROUNDING_FACTOR = 0.1;
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

  private putCellStyle(name: ShapeBpmnElementKind, style: StyleMap): void {
    this.getStylesheet().putCellStyle(name, style);
  }

  private configureDefaultVertexStyle(): void {
    StyleConfigurator.configureCommonDefaultStyle(this.getStylesheet().getDefaultVertexStyle());
  }

  private configurePoolStyle(): void {
    const style: StyleMap = {};
    style[mxgraph.mxConstants.STYLE_SHAPE] = mxgraph.mxConstants.SHAPE_SWIMLANE;

    // TODO Remove when the bounds of the pool label is implemented
    style[mxgraph.mxConstants.STYLE_VERTICAL_ALIGN] = mxgraph.mxConstants.ALIGN_MIDDLE;
    style[mxgraph.mxConstants.STYLE_ALIGN] = mxgraph.mxConstants.ALIGN_CENTER;

    // TODO manage pool text area rendering. Maybe we can calculate it from the label size/bounds
    style[mxgraph.mxConstants.STYLE_STARTSIZE] = StyleDefault.POOL_LABEL_SIZE;
    style[mxgraph.mxConstants.STYLE_FILLCOLOR] = StyleDefault.POOL_LABEL_FILL_COLOR;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.POOL, style);
  }

  private configureLaneStyle(): void {
    const style: StyleMap = {};
    style[mxgraph.mxConstants.STYLE_SHAPE] = mxgraph.mxConstants.SHAPE_SWIMLANE;

    // TODO Remove when the bounds of the lane label is implemented
    style[mxgraph.mxConstants.STYLE_VERTICAL_ALIGN] = mxgraph.mxConstants.ALIGN_MIDDLE;
    style[mxgraph.mxConstants.STYLE_ALIGN] = mxgraph.mxConstants.ALIGN_CENTER;

    style[mxgraph.mxConstants.STYLE_SWIMLANE_LINE] = 0; // hide the line between the title region and the content area

    // TODO manage lane text area rendering. there is no Label neither the size available (we have only attribute name="Text of the Label")
    // perhaps it can be calculated as a difference of starting point (either x or y) between pool, lane, sub-lane ?
    style[mxgraph.mxConstants.STYLE_STARTSIZE] = StyleDefault.LANE_LABEL_SIZE;
    style[mxgraph.mxConstants.STYLE_FILLCOLOR] = StyleDefault.LANE_LABEL_FILL_COLOR;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.LANE, style);
  }

  private configureEventStyles(): void {
    ShapeUtil.topLevelBpmnEventKinds().forEach(kind => {
      const style: StyleMap = {};
      style[mxgraph.mxConstants.STYLE_SHAPE] = kind;
      style[mxgraph.mxConstants.STYLE_PERIMETER] = mxgraph.mxPerimeter.EllipsePerimeter;
      style[mxgraph.mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxgraph.mxConstants.ALIGN_BOTTOM;
      this.putCellStyle(kind, style);
    });
  }

  private configureTextAnnotationStyle(): void {
    const style: StyleMap = {};
    style[mxgraph.mxConstants.STYLE_SHAPE] = ShapeBpmnElementKind.TEXT_ANNOTATION;
    style[mxgraph.mxConstants.STYLE_VERTICAL_ALIGN] = mxgraph.mxConstants.ALIGN_MIDDLE;
    style[mxgraph.mxConstants.STYLE_ALIGN] = mxgraph.mxConstants.ALIGN_LEFT;
    style[mxgraph.mxConstants.STYLE_SPACING_LEFT] = 5;
    style[mxgraph.mxConstants.STYLE_FILLCOLOR] = StyleDefault.TEXT_ANNOTATION_FILL_COLOR;
    this.putCellStyle(ShapeBpmnElementKind.TEXT_ANNOTATION, style);
  }

  private configureActivityStyles(): void {
    ShapeUtil.activityKinds().forEach(kind => {
      const style: StyleMap = {};
      style[mxgraph.mxConstants.STYLE_SHAPE] = kind;
      style[mxgraph.mxConstants.STYLE_VERTICAL_ALIGN] = mxgraph.mxConstants.ALIGN_MIDDLE;
      this.putCellStyle(kind, style);
    });
  }

  private configureGatewayStyles(): void {
    ShapeUtil.gatewayKinds().forEach(kind => {
      const style: StyleMap = {};
      style[mxgraph.mxConstants.STYLE_SHAPE] = kind;
      style[mxgraph.mxConstants.STYLE_PERIMETER] = mxgraph.mxPerimeter.RhombusPerimeter;
      style[mxgraph.mxConstants.STYLE_VERTICAL_ALIGN] = mxgraph.mxConstants.ALIGN_TOP;

      // Default positioning in case there is no BPMN LabelStyle
      style[mxgraph.mxConstants.STYLE_LABEL_POSITION] = mxgraph.mxConstants.ALIGN_LEFT;
      style[mxgraph.mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxgraph.mxConstants.ALIGN_TOP;

      this.putCellStyle(kind, style);
    });
  }

  private configureDefaultEdgeStyle(): void {
    const style = this.getStylesheet().getDefaultEdgeStyle();
    style[mxgraph.mxConstants.STYLE_SHAPE] = StyleIdentifier.EDGE;
    style[mxgraph.mxConstants.STYLE_EDGE] = mxgraph.mxConstants.EDGESTYLE_SEGMENT;
    style[mxgraph.mxConstants.STYLE_ENDSIZE] = 12;
    style[mxgraph.mxConstants.STYLE_STROKEWIDTH] = 1.5;
    style[mxgraph.mxConstants.STYLE_ROUNDED] = 1;
    style[mxgraph.mxConstants.STYLE_ARCSIZE] = 5;
    style[mxgraph.mxConstants.STYLE_VERTICAL_ALIGN] = mxgraph.mxConstants.ALIGN_BOTTOM;

    delete style[mxgraph.mxConstants.STYLE_ENDARROW];

    StyleConfigurator.configureCommonDefaultStyle(style);
  }

  private static configureCommonDefaultStyle(style: StyleMap): void {
    style[mxgraph.mxConstants.STYLE_FONTFAMILY] = StyleDefault.DEFAULT_FONT_FAMILY;
    style[mxgraph.mxConstants.STYLE_FONTSIZE] = StyleDefault.DEFAULT_FONT_SIZE;
    style[mxgraph.mxConstants.STYLE_FONTCOLOR] = StyleDefault.DEFAULT_FONT_COLOR;
    style[mxgraph.mxConstants.STYLE_FILLCOLOR] = StyleDefault.DEFAULT_FILL_COLOR;
    style[mxgraph.mxConstants.STYLE_STROKECOLOR] = StyleDefault.DEFAULT_STROKE_COLOR;
    style[mxgraph.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = mxgraph.mxConstants.NONE;

    // only works with html labels (enabled by MxGraphConfigurator)
    style[mxgraph.mxConstants.STYLE_WHITE_SPACE] = 'wrap';
  }

  private configureEdgeStyles<T>(styleKinds: T[], specificStyles: Map<T, (style: StyleMap) => void>): void {
    styleKinds.forEach(kind => {
      const style: StyleMap = {};
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
}
