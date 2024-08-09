/*
Copyright 2020 Bonitasoft S.A.

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

import { AssociationDirectionKind, FlowKind, SequenceFlowKind, ShapeBpmnElementKind, ShapeUtil } from '../../../model/bpmn/internal';
import { BpmnStyleIdentifier, MarkerIdentifier, StyleDefault } from '../style';
import type { BpmnGraph } from '../BpmnGraph';
import { constants, Perimeter } from '@maxgraph/core';
import type { CellStyle, Stylesheet } from '@maxgraph/core';

const arrowDefaultSize = 12;

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
      (style: CellStyle) => {
        style.endArrow = 'blockThin';
      },
    ],
    [
      FlowKind.MESSAGE_FLOW,
      (style: CellStyle) => {
        style.dashed = true;
        style.dashPattern = '8 5';
        style.startArrow = 'oval';
        style.startSize = 8;
        style.startFill = true; // TODO maxgraph@0.1.0 could be removed when maxGraph fixes https://github.com/maxGraph/maxGraph/pull/157
        style.startFillColor = StyleDefault.MESSAGE_FLOW_MARKER_START_FILL_COLOR;
        style.endArrow = 'blockThin';
        style.endFill = true; // TODO maxgraph@0.1.0 could be removed when maxGraph fixes https://github.com/maxGraph/maxGraph/pull/157
        style.endFillColor = StyleDefault.MESSAGE_FLOW_MARKER_END_FILL_COLOR;
      },
    ],
    [
      FlowKind.ASSOCIATION_FLOW,
      (style: CellStyle) => {
        style.dashed = true;
        style.dashPattern = '1 2';
        // endArrow  and startArrow are defined in specific AssociationDirectionKind styles when needed
        style.startSize = arrowDefaultSize;
      },
    ],
  ]);
  private specificSequenceFlowStyles = new MapWithDefault<SequenceFlowKind>([
    [
      SequenceFlowKind.DEFAULT,
      (style: CellStyle) => {
        style.startArrow = MarkerIdentifier.ARROW_DASH;
      },
    ],
    [
      SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
      (style: CellStyle) => {
        style.startArrow = 'diamondThin';
        style.startSize = 18;
        style.startFill = true; // TODO maxgraph@0.1.0 could be removed when maxGraph fixes https://github.com/maxGraph/maxGraph/pull/157
        style.startFillColor = StyleDefault.SEQUENCE_FLOW_CONDITIONAL_FROM_ACTIVITY_MARKER_FILL_COLOR;
      },
    ],
  ]);
  private specificAssociationFlowStyles = new MapWithDefault<AssociationDirectionKind>([
    [
      AssociationDirectionKind.NONE,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
      (_style: CellStyle) => {
        // the style is fully managed by the FlowKind.ASSOCIATION_FLOW style
      },
    ],
    [
      AssociationDirectionKind.ONE,
      (style: CellStyle) => {
        style.endArrow = 'openThin';
      },
    ],
    [
      AssociationDirectionKind.BOTH,
      (style: CellStyle) => {
        style.endArrow = 'openThin';
        style.startArrow = 'openThin';
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

  private putCellStyle(name: ShapeBpmnElementKind, style: CellStyle): void {
    this.getStylesheet().putCellStyle(name, style);
  }

  private configureDefaultVertexStyle(): void {
    const style = this.getStylesheet().getDefaultVertexStyle();
    configureCommonDefaultStyle(style);

    style.absoluteArcSize = true;
    style.arcSize = StyleDefault.SHAPE_ARC_SIZE;
  }

  private configurePoolStyle(): void {
    const style: CellStyle = {
      shape: constants.SHAPE.SWIMLANE,
      // label style
      verticalAlign: 'middle',
      align: 'center',
      startSize: StyleDefault.POOL_LABEL_SIZE,
      fillColor: StyleDefault.POOL_LABEL_FILL_COLOR,
    };

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.POOL, style);
  }

  private configureLaneStyle(): void {
    const style: CellStyle = {
      shape: constants.SHAPE.SWIMLANE,
      // label style
      verticalAlign: 'middle',
      align: 'center',
      swimlaneLine: false, // hide the line between the title region and the content area
      startSize: StyleDefault.LANE_LABEL_SIZE,
      fillColor: StyleDefault.LANE_LABEL_FILL_COLOR,
    };

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.LANE, style);
  }

  private configureEventStyles(): void {
    ShapeUtil.eventKinds().forEach(kind => {
      const style: CellStyle = {
        shape: kind,
        // TODO maxgraph@0.10.2 decide if we use the function or the string to set the perimeter (apply to all configuration in this file)
        // using a string will reduce adherence to the maxGraph implementation
        // in case maxGraph provide a way to not register its default style configuration, using a function would avoid to have to register the perimeter in the style registry
        // be also aware of https://github.com/process-analytics/bpmn-visualization-js/pull/2814#issuecomment-1692971602
        perimeter: Perimeter.EllipsePerimeter,
        strokeWidth: kind == ShapeBpmnElementKind.EVENT_END ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN,
        verticalLabelPosition: 'bottom',
      };
      this.putCellStyle(kind, style);
    });
  }

  private configureTextAnnotationStyle(): void {
    const style: CellStyle = {
      shape: ShapeBpmnElementKind.TEXT_ANNOTATION,
      // label style
      verticalAlign: 'middle',
      align: 'left',
      spacingLeft: 5,
      fillColor: StyleDefault.TEXT_ANNOTATION_FILL_COLOR,
      strokeWidth: StyleDefault.STROKE_WIDTH_THIN,
    };
    this.putCellStyle(ShapeBpmnElementKind.TEXT_ANNOTATION, style);
  }

  private configureGroupStyle(): void {
    const style: CellStyle = {
      rounded: true,
      dashed: true,
      dashPattern: '7 4 1 4',
      strokeWidth: StyleDefault.STROKE_WIDTH_THIN,
      fillColor: StyleDefault.GROUP_FILL_COLOR,
      // Default label positioning
      align: 'center',
      verticalAlign: 'top',
    };
    this.putCellStyle(ShapeBpmnElementKind.GROUP, style);
  }

  private configureActivityStyles(): void {
    ShapeUtil.activityKinds().forEach(kind => {
      const style: CellStyle = {
        shape: kind,
        rounded: true, // required by the BPMN specification
        verticalAlign: 'middle', // label style
        strokeWidth: kind == ShapeBpmnElementKind.CALL_ACTIVITY ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN,
      };
      this.putCellStyle(kind, style);
    });
  }

  private configureGatewayStyles(): void {
    ShapeUtil.gatewayKinds().forEach(kind => {
      const style: CellStyle = {
        shape: kind,
        perimeter: Perimeter.RhombusPerimeter,
        verticalAlign: 'top',
        strokeWidth: StyleDefault.STROKE_WIDTH_THIN,

        // Default label positioning
        labelPosition: 'left',
        verticalLabelPosition: 'top',
      };
      this.putCellStyle(kind, style);
    });
  }

  private configureDefaultEdgeStyle(): void {
    const style = this.getStylesheet().getDefaultEdgeStyle() as CellStyle;
    configureCommonDefaultStyle(style);

    style.shape = BpmnStyleIdentifier.EDGE;
    style.endSize = arrowDefaultSize;
    style.strokeWidth = 1.5;
    style.rounded = true;
    // TODO maxgraph@0.10.1 the rendered edge arcSize seems larger than with mxGraph (also seen with maxgraph 0.1.0)
    // style.arcSize = 2; // put 2 in maxgraph@0.10.1, in mxGraph@4.2.2 we used 5
    style.verticalAlign = 'bottom';
    // The end arrow must be redefined in specific style
    delete style.endArrow;
  }

  private configureEdgeStyles<T>(styleKinds: T[], specificStyles: Map<T, (style: CellStyle) => void>): void {
    styleKinds.forEach(kind => {
      const style: CellStyle = {};
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

function configureCommonDefaultStyle(style: CellStyle): void {
  style.fontFamily = StyleDefault.DEFAULT_FONT_FAMILY;
  style.fontSize = StyleDefault.DEFAULT_FONT_SIZE;
  style.fontColor = StyleDefault.DEFAULT_FONT_COLOR;
  style.fillColor = StyleDefault.DEFAULT_FILL_COLOR;
  style.strokeColor = StyleDefault.DEFAULT_STROKE_COLOR;
  style.labelBackgroundColor = constants.NONE;

  // only works with html labels (enabled by GraphConfigurator)
  style.whiteSpace = 'wrap';
}

class MapWithDefault<T> extends Map<T, (style: CellStyle) => void> {
  override get(key: T): (style: CellStyle) => void {
    return (
      super.get(key) ??
      (() => {
        // do nothing intentionally, there is no extra style to configure
      })
    );
  }
}
