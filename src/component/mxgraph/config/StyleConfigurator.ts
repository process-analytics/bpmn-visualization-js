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

import type { BpmnGraph } from '../BpmnGraph';
import type { mxStylesheet, StyleMap } from 'mxgraph';

import { AssociationDirectionKind, FlowKind, SequenceFlowKind, ShapeBpmnElementKind, ShapeUtility } from '../../../model/bpmn/internal';
import { mxConstants, mxPerimeter } from '../initializer';
import { BpmnStyleIdentifier, MarkerIdentifier, StyleDefault } from '../style';

const arrowDefaultSize = 12;

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

const specificFlowStyles = new MapWithDefault<FlowKind>([
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
      style[mxConstants.STYLE_STARTFILL] = true;
      style[BpmnStyleIdentifier.EDGE_START_FILL_COLOR] = StyleDefault.MESSAGE_FLOW_MARKER_START_FILL_COLOR;
      style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK_THIN;
      style[mxConstants.STYLE_ENDFILL] = true;
      style[BpmnStyleIdentifier.EDGE_END_FILL_COLOR] = StyleDefault.MESSAGE_FLOW_MARKER_END_FILL_COLOR;
    },
  ],
  [
    FlowKind.ASSOCIATION_FLOW,
    (style: StyleMap) => {
      style[mxConstants.STYLE_DASHED] = true;
      style[mxConstants.STYLE_DASH_PATTERN] = '1 2';
      // STYLE_ENDARROW and STYLE_STARTARROW are defined in specific AssociationDirectionKind styles when needed
      style[mxConstants.STYLE_STARTSIZE] = arrowDefaultSize;
    },
  ],
]);

const specificSequenceFlowStyles = new MapWithDefault<SequenceFlowKind>([
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
      style[mxConstants.STYLE_STARTFILL] = true;
      style[BpmnStyleIdentifier.EDGE_START_FILL_COLOR] = StyleDefault.SEQUENCE_FLOW_CONDITIONAL_FROM_ACTIVITY_MARKER_FILL_COLOR;
    },
  ],
]);

const specificAssociationFlowStyles = new MapWithDefault<AssociationDirectionKind>([
  [
    AssociationDirectionKind.NONE,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
    (_style: StyleMap) => {
      // the style is fully managed by the FlowKind.ASSOCIATION_FLOW style
    },
  ],
  [
    AssociationDirectionKind.ONE,
    (style: StyleMap) => {
      style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OPEN_THIN;
    },
  ],
  [
    AssociationDirectionKind.BOTH,
    (style: StyleMap) => {
      style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_OPEN_THIN;
      style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OPEN_THIN;
    },
  ],
]);

/**
 * Configure the styles used for BPMN rendering.
 *
 * **WARN**: You may use it to customize the BPMN Theme as suggested in the examples. But be aware that the way the default BPMN theme can be modified is subject to change.
 *
 * @category BPMN Theme
 * @experimental
 */
export class StyleConfigurator {
  constructor(private readonly graph: BpmnGraph) {}

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

  private getStylesheet(): mxStylesheet {
    return this.graph.getStylesheet();
  }

  private putCellStyle(name: ShapeBpmnElementKind, style: StyleMap): void {
    this.getStylesheet().putCellStyle(name, style);
  }

  private configureDefaultVertexStyle(): void {
    const style = this.getStylesheet().getDefaultVertexStyle();
    configureCommonDefaultStyle(style);

    style[mxConstants.STYLE_ABSOLUTE_ARCSIZE] = true;
    style[mxConstants.STYLE_ARCSIZE] = StyleDefault.SHAPE_ARC_SIZE;
  }

  private configurePoolStyle(): void {
    const style: StyleMap = {};
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;

    // label style
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_STARTSIZE] = StyleDefault.POOL_LABEL_SIZE;
    style[mxConstants.STYLE_FILLCOLOR] = StyleDefault.POOL_LABEL_FILL_COLOR;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.POOL, style);
  }

  private configureLaneStyle(): void {
    const style: StyleMap = {};
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;

    // label style
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_SWIMLANE_LINE] = 0; // hide the line between the title region and the content area
    style[mxConstants.STYLE_STARTSIZE] = StyleDefault.LANE_LABEL_SIZE;
    style[mxConstants.STYLE_FILLCOLOR] = StyleDefault.LANE_LABEL_FILL_COLOR;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.LANE, style);
  }

  private configureEventStyles(): void {
    for (const kind of ShapeUtility.eventKinds()) {
      const style: StyleMap = {};
      style[mxConstants.STYLE_SHAPE] = kind;
      style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
      style[mxConstants.STYLE_STROKEWIDTH] = kind == ShapeBpmnElementKind.EVENT_END ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN;
      style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_BOTTOM;
      this.putCellStyle(kind, style);
    }
  }

  private configureTextAnnotationStyle(): void {
    const style: StyleMap = {};
    style[mxConstants.STYLE_SHAPE] = ShapeBpmnElementKind.TEXT_ANNOTATION;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
    style[mxConstants.STYLE_SPACING_LEFT] = 5;
    style[mxConstants.STYLE_FILLCOLOR] = StyleDefault.TEXT_ANNOTATION_FILL_COLOR;
    style[mxConstants.STYLE_STROKEWIDTH] = StyleDefault.STROKE_WIDTH_THIN;
    this.putCellStyle(ShapeBpmnElementKind.TEXT_ANNOTATION, style);
  }

  private configureGroupStyle(): void {
    const style: StyleMap = {};
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_DASHED] = true;
    style[mxConstants.STYLE_DASH_PATTERN] = '7 4 1 4';
    style[mxConstants.STYLE_STROKEWIDTH] = StyleDefault.STROKE_WIDTH_THIN;
    style[mxConstants.STYLE_FILLCOLOR] = StyleDefault.GROUP_FILL_COLOR;
    // Default label positioning
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;

    this.putCellStyle(ShapeBpmnElementKind.GROUP, style);
  }

  private configureActivityStyles(): void {
    for (const kind of ShapeUtility.activityKinds()) {
      const style: StyleMap = {};
      style[mxConstants.STYLE_SHAPE] = kind;
      style[mxConstants.STYLE_ROUNDED] = true; // required by the BPMN specification
      style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
      style[mxConstants.STYLE_STROKEWIDTH] = kind == ShapeBpmnElementKind.CALL_ACTIVITY ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN;
      this.putCellStyle(kind, style);
    }
  }

  private configureGatewayStyles(): void {
    for (const kind of ShapeUtility.gatewayKinds()) {
      const style: StyleMap = {};
      style[mxConstants.STYLE_SHAPE] = kind;
      style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
      style[mxConstants.STYLE_STROKEWIDTH] = StyleDefault.STROKE_WIDTH_THIN;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;

      // Default label positioning
      style[mxConstants.STYLE_LABEL_POSITION] = mxConstants.ALIGN_LEFT;
      style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_TOP;

      this.putCellStyle(kind, style);
    }
  }

  private configureDefaultEdgeStyle(): void {
    const style = this.getStylesheet().getDefaultEdgeStyle();
    configureCommonDefaultStyle(style);

    style[mxConstants.STYLE_SHAPE] = BpmnStyleIdentifier.EDGE;
    style[mxConstants.STYLE_ENDSIZE] = arrowDefaultSize;
    style[mxConstants.STYLE_STROKEWIDTH] = 1.5;
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_ARCSIZE] = 5;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_BOTTOM;

    // The end arrow must be redefined in specific style
    delete style[mxConstants.STYLE_ENDARROW];
  }

  private configureEdgeStyles<T>(styleKinds: T[], specificStyles: Map<T, (style: StyleMap) => void>): void {
    for (const kind of styleKinds) {
      const style: StyleMap = {};
      specificStyles.get(kind)(style);
      this.graph.getStylesheet().putCellStyle(kind.toString(), style);
    }
  }

  private configureFlowStyles(): void {
    this.configureEdgeStyles<FlowKind>(Object.values(FlowKind), specificFlowStyles);
    this.configureEdgeStyles<SequenceFlowKind>(Object.values(SequenceFlowKind), specificSequenceFlowStyles);
    this.configureEdgeStyles<AssociationDirectionKind>(Object.values(AssociationDirectionKind), specificAssociationFlowStyles);
  }
}

function configureCommonDefaultStyle(style: StyleMap): void {
  style[mxConstants.STYLE_FONTFAMILY] = StyleDefault.DEFAULT_FONT_FAMILY;
  style[mxConstants.STYLE_FONTSIZE] = StyleDefault.DEFAULT_FONT_SIZE;
  style[mxConstants.STYLE_FONTCOLOR] = StyleDefault.DEFAULT_FONT_COLOR;
  style[mxConstants.STYLE_FILLCOLOR] = StyleDefault.DEFAULT_FILL_COLOR;
  style[mxConstants.STYLE_STROKECOLOR] = StyleDefault.DEFAULT_STROKE_COLOR;
  style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = mxConstants.NONE;

  // only works with html labels (enabled by GraphConfigurator)
  style[mxConstants.STYLE_WHITE_SPACE] = 'wrap';
}
