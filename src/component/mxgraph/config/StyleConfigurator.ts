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

import { AssociationDirectionKind, FlowKind, SequenceFlowKind, ShapeBpmnElementKind, ShapeUtil } from '../../../model/bpmn/internal';
import { BpmnStyleIdentifier, MarkerIdentifier, StyleDefault } from '../style';
import type { BpmnGraph } from '../BpmnGraph';
import type { StyleMap } from 'mxgraph';
import type { Stylesheet } from '@maxgraph/core';
import { constants } from '@maxgraph/core';

/**
 * Configure the styles used for BPMN rendering.
 *
 * **WARN**: You may use it to customize the BPMN Theme as suggested in the examples. But be aware that the way the default BPMN theme can be modified is subject to change.
 *
 * @category BPMN Theme
 * @experimental
 */
export class StyleConfigurator {
  private specificFlowStyles = new MapWithDefault<FlowKind>([
    [
      FlowKind.SEQUENCE_FLOW,
      (style: StyleMap) => {
        style[constants.STYLE_ENDARROW] = constants.ARROW_BLOCK_THIN;
      },
    ],
    [
      FlowKind.MESSAGE_FLOW,
      (style: StyleMap) => {
        style[constants.STYLE_DASHED] = true;
        style[constants.STYLE_DASH_PATTERN] = '8 5';
        style[constants.STYLE_STARTARROW] = constants.ARROW_OVAL;
        style[constants.STYLE_STARTSIZE] = 8;
        style[constants.STYLE_STARTFILL] = true;
        style[BpmnStyleIdentifier.EDGE_START_FILL_COLOR] = StyleDefault.MESSAGE_FLOW_MARKER_START_FILL_COLOR;
        style[constants.STYLE_ENDARROW] = constants.ARROW_BLOCK_THIN;
        style[constants.STYLE_ENDFILL] = true;
        style[BpmnStyleIdentifier.EDGE_END_FILL_COLOR] = StyleDefault.MESSAGE_FLOW_MARKER_END_FILL_COLOR;
      },
    ],
    [
      FlowKind.ASSOCIATION_FLOW,
      (style: StyleMap) => {
        style[constants.STYLE_DASHED] = true;
        style[constants.STYLE_DASH_PATTERN] = '1 2';
        style[constants.STYLE_ENDARROW] = constants.ARROW_OPEN_THIN;
        style[constants.STYLE_STARTARROW] = constants.ARROW_OPEN_THIN;
        style[constants.STYLE_STARTSIZE] = 12;
      },
    ],
  ]);
  private specificSequenceFlowStyles = new MapWithDefault<SequenceFlowKind>([
    [
      SequenceFlowKind.DEFAULT,
      (style: StyleMap) => {
        style[constants.STYLE_STARTARROW] = MarkerIdentifier.ARROW_DASH;
      },
    ],
    [
      SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
      (style: StyleMap) => {
        style[constants.STYLE_STARTARROW] = constants.ARROW_DIAMOND_THIN;
        style[constants.STYLE_STARTSIZE] = 18;
        style[constants.STYLE_STARTFILL] = true;
        style[BpmnStyleIdentifier.EDGE_START_FILL_COLOR] = StyleDefault.SEQUENCE_FLOW_CONDITIONAL_FROM_ACTIVITY_MARKER_FILL_COLOR;
      },
    ],
  ]);
  private specificAssociationFlowStyles = new MapWithDefault<AssociationDirectionKind>([
    [
      AssociationDirectionKind.NONE,
      (style: StyleMap) => {
        style[constants.STYLE_STARTARROW] = undefined;
        style[constants.STYLE_ENDARROW] = undefined;
      },
    ],
    [
      AssociationDirectionKind.ONE,
      (style: StyleMap) => {
        style[constants.STYLE_STARTARROW] = undefined;
      },
    ],
    [
      AssociationDirectionKind.BOTH,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
      (_style: StyleMap) => {
        // the style is fully managed by the FlowKind.ASSOCIATION_FLOW style
      },
    ],
  ]);

  constructor(private graph: BpmnGraph) {}

  configureStyles(): void {
    this.configureDefaultVertexStyle();

    this.configurePoolStyle();
    this.configureLaneStyle();

    this.configureTextAnnotationStyle();
    this.configureGroupStyle();

    this.configureActivityStyles();
    this.configureEventStyles();
    this.configureGatewayStyles();

    this.configureDefaultEdgeStyle();
    this.configureFlowStyles();
  }

  private getStylesheet(): Stylesheet {
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
    style[constants.STYLE_SHAPE] = constants.SHAPE_SWIMLANE;

    // label style
    style[constants.STYLE_VERTICAL_ALIGN] = constants.ALIGN_MIDDLE;
    style[constants.STYLE_ALIGN] = constants.ALIGN_CENTER;
    style[constants.STYLE_STARTSIZE] = StyleDefault.POOL_LABEL_SIZE;
    style[constants.STYLE_FILLCOLOR] = StyleDefault.POOL_LABEL_FILL_COLOR;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.POOL, style);
  }

  private configureLaneStyle(): void {
    const style: StyleMap = {};
    style[constants.STYLE_SHAPE] = constants.SHAPE_SWIMLANE;

    // label style
    style[constants.STYLE_VERTICAL_ALIGN] = constants.ALIGN_MIDDLE;
    style[constants.STYLE_ALIGN] = constants.ALIGN_CENTER;
    style[constants.STYLE_SWIMLANE_LINE] = 0; // hide the line between the title region and the content area
    style[constants.STYLE_STARTSIZE] = StyleDefault.LANE_LABEL_SIZE;
    style[constants.STYLE_FILLCOLOR] = StyleDefault.LANE_LABEL_FILL_COLOR;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.LANE, style);
  }

  private configureEventStyles(): void {
    ShapeUtil.eventKinds().forEach(kind => {
      const style: StyleMap = {};
      style[constants.STYLE_SHAPE] = kind;
      style[constants.STYLE_PERIMETER] = mxgraph.mxPerimeter.EllipsePerimeter;
      style[constants.STYLE_STROKEWIDTH] = kind == ShapeBpmnElementKind.EVENT_END ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN;
      style[constants.STYLE_VERTICAL_LABEL_POSITION] = constants.ALIGN_BOTTOM;
      this.putCellStyle(kind, style);
    });
  }

  private configureTextAnnotationStyle(): void {
    const style: StyleMap = {};
    style[constants.STYLE_SHAPE] = ShapeBpmnElementKind.TEXT_ANNOTATION;
    style[constants.STYLE_VERTICAL_ALIGN] = constants.ALIGN_MIDDLE;
    style[constants.STYLE_ALIGN] = constants.ALIGN_LEFT;
    style[constants.STYLE_SPACING_LEFT] = 5;
    style[constants.STYLE_FILLCOLOR] = StyleDefault.TEXT_ANNOTATION_FILL_COLOR;
    style[constants.STYLE_STROKEWIDTH] = StyleDefault.STROKE_WIDTH_THIN;
    this.putCellStyle(ShapeBpmnElementKind.TEXT_ANNOTATION, style);
  }

  private configureGroupStyle(): void {
    const style: StyleMap = {};
    style[constants.STYLE_ROUNDED] = true;
    style[constants.STYLE_ABSOLUTE_ARCSIZE] = true;
    style[constants.STYLE_ARCSIZE] = StyleDefault.SHAPE_ARC_SIZE;
    style[constants.STYLE_DASHED] = true;
    style[constants.STYLE_DASH_PATTERN] = '7 4 1 4';
    style[constants.STYLE_STROKEWIDTH] = StyleDefault.STROKE_WIDTH_THIN;
    style[constants.STYLE_FILLCOLOR] = StyleDefault.GROUP_FILL_COLOR;
    // Default label positioning
    style[constants.STYLE_ALIGN] = constants.ALIGN_CENTER;
    style[constants.STYLE_VERTICAL_ALIGN] = constants.ALIGN_TOP;

    this.putCellStyle(ShapeBpmnElementKind.GROUP, style);
  }

  private configureActivityStyles(): void {
    ShapeUtil.activityKinds().forEach(kind => {
      const style: StyleMap = {};
      style[constants.STYLE_SHAPE] = kind;
      style[constants.STYLE_VERTICAL_ALIGN] = constants.ALIGN_MIDDLE;
      style[constants.STYLE_ABSOLUTE_ARCSIZE] = true;
      style[constants.STYLE_ARCSIZE] = StyleDefault.SHAPE_ARC_SIZE;
      style[constants.STYLE_STROKEWIDTH] = kind == ShapeBpmnElementKind.CALL_ACTIVITY ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN;
      this.putCellStyle(kind, style);
    });
  }

  private configureGatewayStyles(): void {
    ShapeUtil.gatewayKinds().forEach(kind => {
      const style: StyleMap = {};
      style[constants.STYLE_SHAPE] = kind;
      style[constants.STYLE_PERIMETER] = mxgraph.mxPerimeter.RhombusPerimeter;
      style[constants.STYLE_STROKEWIDTH] = StyleDefault.STROKE_WIDTH_THIN;
      style[constants.STYLE_VERTICAL_ALIGN] = constants.ALIGN_TOP;

      // Default label positioning
      style[constants.STYLE_LABEL_POSITION] = constants.ALIGN_LEFT;
      style[constants.STYLE_VERTICAL_LABEL_POSITION] = constants.ALIGN_TOP;

      this.putCellStyle(kind, style);
    });
  }

  private configureDefaultEdgeStyle(): void {
    const style = this.getStylesheet().getDefaultEdgeStyle();
    style[constants.STYLE_SHAPE] = BpmnStyleIdentifier.EDGE;
    style[constants.STYLE_ENDSIZE] = 12;
    style[constants.STYLE_STROKEWIDTH] = 1.5;
    style[constants.STYLE_ROUNDED] = 1;
    style[constants.STYLE_ARCSIZE] = 5;
    style[constants.STYLE_VERTICAL_ALIGN] = constants.ALIGN_BOTTOM;

    delete style[constants.STYLE_ENDARROW];

    StyleConfigurator.configureCommonDefaultStyle(style);
  }

  private static configureCommonDefaultStyle(style: StyleMap): void {
    style[constants.STYLE_FONTFAMILY] = StyleDefault.DEFAULT_FONT_FAMILY;
    style[constants.STYLE_FONTSIZE] = StyleDefault.DEFAULT_FONT_SIZE;
    style[constants.STYLE_FONTCOLOR] = StyleDefault.DEFAULT_FONT_COLOR;
    style[constants.STYLE_FILLCOLOR] = StyleDefault.DEFAULT_FILL_COLOR;
    style[constants.STYLE_STROKECOLOR] = StyleDefault.DEFAULT_STROKE_COLOR;
    style[constants.STYLE_LABEL_BACKGROUNDCOLOR] = constants.NONE;

    // only works with html labels (enabled by GraphConfigurator)
    style[constants.STYLE_WHITE_SPACE] = 'wrap';
  }

  private configureEdgeStyles<T>(styleKinds: T[], specificStyles: Map<T, (style: StyleMap) => void>): void {
    styleKinds.forEach(kind => {
      const style: StyleMap = {};
      specificStyles.get(kind)(style);
      this.graph.getStylesheet().putCellStyle(kind.toString(), style);
    });
  }

  private configureFlowStyles(): void {
    this.configureEdgeStyles<FlowKind>(Object.values(FlowKind), this.specificFlowStyles);
    this.configureEdgeStyles<SequenceFlowKind>(Object.values(SequenceFlowKind), this.specificSequenceFlowStyles);
    this.configureEdgeStyles<AssociationDirectionKind>(Object.values(AssociationDirectionKind), this.specificAssociationFlowStyles);
  }
}

class MapWithDefault<T> extends Map<T, (style: StyleMap) => void> {
  override get(key: T): (style: StyleMap) => void {
    return (
      super.get(key) ??
      (() => {
        // do nothing intentionally, there is no extra style to configure
      })
    );
  }
}
