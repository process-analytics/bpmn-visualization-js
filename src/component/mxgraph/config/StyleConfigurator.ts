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

import type { Stylesheet } from '@maxgraph/core';
import { constants, Perimeter } from '@maxgraph/core';

import { AssociationDirectionKind, FlowKind, SequenceFlowKind, ShapeBpmnElementKind, ShapeUtil } from '../../../model/bpmn/internal';
import { BpmnShapeIdentifier, MarkerIdentifier, StyleDefault } from '../style';
import type { BpmnGraph } from '../BpmnGraph';
import type { BPMNCellStyle } from '../renderer/StyleComputer';

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
      (style: BPMNCellStyle) => {
        style.endArrow = constants.ARROW.BLOCK_THIN;
      },
    ],
    [
      FlowKind.MESSAGE_FLOW,
      (style: BPMNCellStyle) => {
        style.dashed = true;
        style.dashPattern = '8 5';
        style.startArrow = constants.ARROW.OVAL;
        style.startSize = 8;
        style.startFill = true;
        style.bpmn.edge.startFillColor = StyleDefault.MESSAGE_FLOW_MARKER_START_FILL_COLOR;
        style.endArrow = constants.ARROW.BLOCK_THIN;
        style.endFill = true;
        style.bpmn.edge.endFillColor = StyleDefault.MESSAGE_FLOW_MARKER_END_FILL_COLOR;
      },
    ],
    [
      FlowKind.ASSOCIATION_FLOW,
      (style: BPMNCellStyle) => {
        style.dashed = true;
        style.dashPattern = '1 2';
        style.endArrow = constants.ARROW.OPEN_THIN;
        style.startArrow = constants.ARROW.OPEN_THIN;
        style.startSize = 12;
      },
    ],
  ]);
  private specificSequenceFlowStyles = new MapWithDefault<SequenceFlowKind>([
    [
      SequenceFlowKind.DEFAULT,
      (style: BPMNCellStyle) => {
        style.startArrow = MarkerIdentifier.ARROW_DASH;
      },
    ],
    [
      SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
      (style: BPMNCellStyle) => {
        style.startArrow = constants.ARROW.DIAMOND_THIN;
        style.startSize = 18;
        style.startFill = true;
        style.bpmn.edge.startFillColor = StyleDefault.SEQUENCE_FLOW_CONDITIONAL_FROM_ACTIVITY_MARKER_FILL_COLOR;
      },
    ],
  ]);
  private specificAssociationFlowStyles = new MapWithDefault<AssociationDirectionKind>([
    [
      AssociationDirectionKind.NONE,
      (style: BPMNCellStyle) => {
        style.startArrow = undefined;
        style.endArrow = undefined;
      },
    ],
    [
      AssociationDirectionKind.ONE,
      (style: BPMNCellStyle) => {
        style.startArrow = undefined;
      },
    ],
    [
      AssociationDirectionKind.BOTH,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
      (_style: BPMNCellStyle) => {
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

  private putCellStyle(name: ShapeBpmnElementKind, style: BPMNCellStyle): void {
    this.getStylesheet().putCellStyle(name, style);
  }

  private configureDefaultVertexStyle(): void {
    StyleConfigurator.configureCommonDefaultStyle(this.getStylesheet().getDefaultVertexStyle() as BPMNCellStyle);
  }

  private configurePoolStyle(): void {
    const style: BPMNCellStyle = {
      shape: constants.SHAPE.SWIMLANE,
      // label style
      verticalAlign: constants.ALIGN.MIDDLE,
      align: constants.ALIGN.CENTER,
      startSize: StyleDefault.POOL_LABEL_SIZE,
      fillColor: StyleDefault.POOL_LABEL_FILL_COLOR,
    };

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.POOL, style);
  }

  private configureLaneStyle(): void {
    const style: BPMNCellStyle = {
      shape: constants.SHAPE.SWIMLANE,
      // label style
      verticalAlign: constants.ALIGN.MIDDLE,
      align: constants.ALIGN.CENTER,
      swimlaneLine: false, // hide the line between the title region and the content area
      startSize: StyleDefault.LANE_LABEL_SIZE,
      fillColor: StyleDefault.LANE_LABEL_FILL_COLOR,
    };

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.LANE, style);
  }

  private configureEventStyles(): void {
    ShapeUtil.eventKinds().forEach(kind => {
      const style: BPMNCellStyle = {
        shape: kind,
        perimeter: Perimeter.EllipsePerimeter,
        strokeWidth: kind == ShapeBpmnElementKind.EVENT_END ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN,
        verticalLabelPosition: constants.ALIGN.BOTTOM,
      };
      this.putCellStyle(kind, style);
    });
  }

  private configureTextAnnotationStyle(): void {
    const style: BPMNCellStyle = {
      shape: ShapeBpmnElementKind.TEXT_ANNOTATION,
      // label style
      verticalAlign: constants.ALIGN.MIDDLE,
      align: constants.ALIGN.LEFT,
      spacingLeft: 5,
      fillColor: StyleDefault.TEXT_ANNOTATION_FILL_COLOR,
      strokeWidth: StyleDefault.STROKE_WIDTH_THIN,
    };
    this.putCellStyle(ShapeBpmnElementKind.TEXT_ANNOTATION, style);
  }

  private configureGroupStyle(): void {
    const style: BPMNCellStyle = {
      rounded: true,
      absoluteArcSize: 1,
      arcSize: StyleDefault.SHAPE_ARC_SIZE,
      dashed: true,
      dashPattern: '7 4 1 4',
      strokeWidth: StyleDefault.STROKE_WIDTH_THIN,
      fillColor: StyleDefault.GROUP_FILL_COLOR,

      // Default label positioning
      align: constants.ALIGN.CENTER,
      verticalAlign: constants.ALIGN.TOP,
    };
    this.putCellStyle(ShapeBpmnElementKind.GROUP, style);
  }

  private configureActivityStyles(): void {
    ShapeUtil.activityKinds().forEach(kind => {
      const style: BPMNCellStyle = {
        shape: kind,
        absoluteArcSize: 1,
        arcSize: StyleDefault.SHAPE_ARC_SIZE,

        // label style
        verticalAlign: constants.ALIGN.MIDDLE,
        strokeWidth: kind == ShapeBpmnElementKind.CALL_ACTIVITY ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN,
      };
      this.putCellStyle(kind, style);
    });
  }

  private configureGatewayStyles(): void {
    ShapeUtil.gatewayKinds().forEach(kind => {
      const style: BPMNCellStyle = {
        shape: kind,
        perimeter: Perimeter.RhombusPerimeter,
        verticalAlign: constants.ALIGN.TOP,
        strokeWidth: StyleDefault.STROKE_WIDTH_THIN,

        // Default label positioning
        labelPosition: constants.ALIGN.LEFT,
        verticalLabelPosition: constants.ALIGN.TOP,
      };
      this.putCellStyle(kind, style);
    });
  }

  private configureDefaultEdgeStyle(): void {
    const style = this.getStylesheet().getDefaultEdgeStyle() as BPMNCellStyle;
    style.shape = BpmnShapeIdentifier.EDGE;
    style.endSize = 12;
    style.strokeWidth = 1.5;
    style.rounded = true;
    style.arcSize = 5;
    style.verticalAlign = constants.ALIGN.BOTTOM;
    style.endArrow = undefined;

    StyleConfigurator.configureCommonDefaultStyle(style);
  }

  private static configureCommonDefaultStyle(style: BPMNCellStyle): void {
    style.fontFamily = StyleDefault.DEFAULT_FONT_FAMILY;
    style.fontSize = StyleDefault.DEFAULT_FONT_SIZE;
    style.fontColor = StyleDefault.DEFAULT_FONT_COLOR;
    style.fillColor = StyleDefault.DEFAULT_FILL_COLOR;
    style.strokeColor = StyleDefault.DEFAULT_STROKE_COLOR;
    style.labelBackgroundColor = constants.NONE;

    // only works with html labels (enabled by GraphConfigurator)
    style.whiteSpace = 'wrap';
  }

  private configureEdgeStyles<T>(styleKinds: T[], specificStyles: Map<T, (style: BPMNCellStyle) => void>): void {
    styleKinds.forEach(kind => {
      const style: BPMNCellStyle = { bpmn: {} };
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

class MapWithDefault<T> extends Map<T, (style: BPMNCellStyle) => void> {
  override get(key: T): (style: BPMNCellStyle) => void {
    return (
      super.get(key) ??
      (() => {
        // do nothing intentionally, there is no extra style to configure
      })
    );
  }
}
