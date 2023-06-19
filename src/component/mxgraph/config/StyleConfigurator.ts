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
import type { BPMNCellStyle } from '../renderer/StyleComputer';
import { constants, Perimeter } from '@maxgraph/core';
import type { ArrowType, ShapeValue, Stylesheet } from '@maxgraph/core';

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
  // TODO maxgraph@0.1.0 in StyleConfigurator, we don't need to use BPMNCellStyle, CellStyle is enough

  private specificFlowStyles = new MapWithDefault<FlowKind>([
    [
      FlowKind.SEQUENCE_FLOW,
      (style: BPMNCellStyle) => {
        style.endArrow = 'blockThin';
      },
    ],
    [
      FlowKind.MESSAGE_FLOW,
      (style: BPMNCellStyle) => {
        style.dashed = true;
        style.dashPattern = '8 5';
        style.startArrow = 'oval';
        style.startSize = 8;
        style.startFill = true;
        style.bpmn.edge.startFillColor = StyleDefault.MESSAGE_FLOW_MARKER_START_FILL_COLOR;
        style.endArrow = 'blockThin';
        style.endFill = true;
        style.bpmn.edge.endFillColor = StyleDefault.MESSAGE_FLOW_MARKER_END_FILL_COLOR;
      },
    ],
    [
      FlowKind.ASSOCIATION_FLOW,
      (style: BPMNCellStyle) => {
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
      (style: BPMNCellStyle) => {
        // TODO maxgraph@0.1.0 remove forcing type when maxGraph fixes its types
        style.startArrow = <ArrowType>MarkerIdentifier.ARROW_DASH;
      },
    ],
    [
      SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
      (style: BPMNCellStyle) => {
        style.startArrow = 'diamondThin';
        style.startSize = 18;
        style.startFill = true;
        style.bpmn.edge.startFillColor = StyleDefault.SEQUENCE_FLOW_CONDITIONAL_FROM_ACTIVITY_MARKER_FILL_COLOR;
      },
    ],
  ]);
  private specificAssociationFlowStyles = new MapWithDefault<AssociationDirectionKind>([
    [
      AssociationDirectionKind.NONE,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
      (_style: BPMNCellStyle) => {
        // the style is fully managed by the FlowKind.ASSOCIATION_FLOW style
      },
    ],
    [
      AssociationDirectionKind.ONE,
      (style: BPMNCellStyle) => {
        style.endArrow = 'openThin';
      },
    ],
    [
      AssociationDirectionKind.BOTH,
      (style: BPMNCellStyle) => {
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

  private putCellStyle(name: ShapeBpmnElementKind, style: BPMNCellStyle): void {
    this.getStylesheet().putCellStyle(name, style);
  }

  private configureDefaultVertexStyle(): void {
    // TODO rebase arc style configuration missing in configureDefaultVertexStyle?
    // It was previously in configureActivityStyles --> move it from here
    //     const style = this.getStylesheet().getDefaultVertexStyle();
    //     configureCommonDefaultStyle(style);
    //
    //     style[mxConstants.STYLE_ABSOLUTE_ARCSIZE] = true;
    //     style[mxConstants.STYLE_ARCSIZE] = StyleDefault.SHAPE_ARC_SIZE;
    configureCommonDefaultStyle(this.getStylesheet().getDefaultVertexStyle() as BPMNCellStyle);
  }

  private configurePoolStyle(): void {
    const style: BPMNCellStyle = {
      // TODO maxgraph@0.1.0  "TS2748: Cannot access ambient const enums when the '--isolatedModules' flag is provided." constants.SHAPE.SWIMLANE
      shape: 'swimlane',
      // label style
      verticalAlign: 'middle',
      align: 'center',
      // TODO maxgraph@0.1.0 find a way to not force cast
      startSize: <number>StyleDefault.POOL_LABEL_SIZE,
      // TODO maxgraph@0.1.0 find a way to not force cast
      fillColor: <string>StyleDefault.POOL_LABEL_FILL_COLOR,
    };

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.POOL, style);
  }

  private configureLaneStyle(): void {
    const style: BPMNCellStyle = {
      // TODO maxgraph@0.1.0  "TS2748: Cannot access ambient const enums when the '--isolatedModules' flag is provided." constants.SHAPE.SWIMLANE
      shape: 'swimlane',
      // label style
      verticalAlign: 'middle',
      align: 'center',
      swimlaneLine: false, // hide the line between the title region and the content area
      // TODO maxgraph@0.1.0 find a way to not force cast
      startSize: <number>StyleDefault.LANE_LABEL_SIZE,
      // TODO maxgraph@0.1.0 find a way to not force cast
      fillColor: <string>StyleDefault.LANE_LABEL_FILL_COLOR,
    };

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.LANE, style);
  }

  private configureEventStyles(): void {
    ShapeUtil.eventKinds().forEach(kind => {
      const style: BPMNCellStyle = {
        // TODO maxgraph@0.1.0 remove forcing type when maxGraph fixes its types
        shape: <ShapeValue>(<unknown>kind),
        perimeter: Perimeter.EllipsePerimeter,
        // TODO maxgraph@0.1.0 find a way to not force cast
        strokeWidth: <number>(kind == ShapeBpmnElementKind.EVENT_END ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN),
        verticalLabelPosition: 'bottom',
      };
      this.putCellStyle(kind, style);
    });
  }

  private configureTextAnnotationStyle(): void {
    const style: BPMNCellStyle = {
      // TODO maxgraph@0.1.0 remove forcing type when maxGraph fixes its types
      shape: <ShapeValue>(<unknown>ShapeBpmnElementKind.TEXT_ANNOTATION),
      // label style
      verticalAlign: 'middle',
      align: 'left',
      spacingLeft: 5,
      // TODO maxgraph@0.1.0 find a way to not force cast
      fillColor: <string>StyleDefault.TEXT_ANNOTATION_FILL_COLOR,
      // TODO maxgraph@0.1.0 find a way to not force cast
      strokeWidth: <number>StyleDefault.STROKE_WIDTH_THIN,
    };
    this.putCellStyle(ShapeBpmnElementKind.TEXT_ANNOTATION, style);
  }

  private configureGroupStyle(): void {
    const style: BPMNCellStyle = {
      rounded: true,
      // TODO rebase arc configuration no more in dedicated style
      absoluteArcSize: 1,
      // TODO maxgraph@0.1.0 find a way to not force cast
      arcSize: <number>StyleDefault.SHAPE_ARC_SIZE,
      dashed: true,
      dashPattern: '7 4 1 4',
      // TODO maxgraph@0.1.0 find a way to not force cast
      strokeWidth: <number>StyleDefault.STROKE_WIDTH_THIN,
      // TODO maxgraph@0.1.0 find a way to not force cast
      fillColor: <string>StyleDefault.GROUP_FILL_COLOR,

      // Default label positioning
      align: 'center',
      verticalAlign: 'top',
    };
    this.putCellStyle(ShapeBpmnElementKind.GROUP, style);
  }

  private configureActivityStyles(): void {
    ShapeUtil.activityKinds().forEach(kind => {
      const style: BPMNCellStyle = {
        // TODO maxgraph@0.1.0 remove forcing type when maxGraph fixes its types
        shape: <ShapeValue>(<unknown>kind),
        rounded: true, // required by the BPMN specification

        // TODO rebase arcSize seems to have been moved in another configuration
        //absoluteArcSize: 1,
        // TODO maxgraph@0.1.0 find a way to not force cast
        //arcSize: <number>StyleDefault.SHAPE_ARC_SIZE,

        // label style
        verticalAlign: 'middle',
        // TODO maxgraph@0.1.0 find a way to not force cast
        strokeWidth: <number>(kind == ShapeBpmnElementKind.CALL_ACTIVITY ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN),
      };
      this.putCellStyle(kind, style);
    });
  }

  private configureGatewayStyles(): void {
    ShapeUtil.gatewayKinds().forEach(kind => {
      const style: BPMNCellStyle = {
        // TODO maxgraph@0.1.0 remove forcing type when maxGraph fixes its types
        shape: <ShapeValue>(<unknown>kind),
        perimeter: Perimeter.RhombusPerimeter,
        verticalAlign: 'top',
        // TODO maxgraph@0.1.0 find a way to not force cast
        strokeWidth: <number>StyleDefault.STROKE_WIDTH_THIN,

        // Default label positioning
        labelPosition: 'left',
        verticalLabelPosition: 'top',
      };
      this.putCellStyle(kind, style);
    });
  }

  private configureDefaultEdgeStyle(): void {
    const style = this.getStylesheet().getDefaultEdgeStyle() as BPMNCellStyle;
    configureCommonDefaultStyle(style);

    // TODO maxgraph@0.1.0 remove forcing type when maxGraph fixes its types
    style.shape = <ShapeValue>BpmnStyleIdentifier.EDGE;
    style.endSize = 12;
    style.strokeWidth = 1.5;
    style.rounded = true;
    style.arcSize = 5;
    style.verticalAlign = 'bottom';
    // The end arrow must be redefined in specific style
    style.endArrow = undefined;
  }

  private configureEdgeStyles<T>(styleKinds: T[], specificStyles: Map<T, (style: BPMNCellStyle) => void>): void {
    styleKinds.forEach(kind => {
      // TODO maxgraph@0.1.0 review if we need to set bpmn.edge (this is not enough for edge.ts)
      const style: BPMNCellStyle = { bpmn: { edge: {} } };
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

function configureCommonDefaultStyle(style: BPMNCellStyle): void {
  style.fontFamily = StyleDefault.DEFAULT_FONT_FAMILY;
  style.fontSize = StyleDefault.DEFAULT_FONT_SIZE;
  style.fontColor = StyleDefault.DEFAULT_FONT_COLOR;
  style.fillColor = StyleDefault.DEFAULT_FILL_COLOR;
  style.strokeColor = StyleDefault.DEFAULT_STROKE_COLOR;
  style.labelBackgroundColor = constants.NONE;

  // only works with html labels (enabled by GraphConfigurator)
  style.whiteSpace = 'wrap';
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
