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
import { mxgraph } from 'ts-mxgraph';
import { ShapeBpmnElementKind } from '../../../model/bpmn/shape/ShapeBpmnElementKind';
import ShapeUtil from '../../../model/bpmn/shape/ShapeUtil';
import { SequenceFlowKind } from '../../../model/bpmn/edge/SequenceFlowKind';
import { MarkerIdentifier, StyleDefault, StyleIdentifier } from '../StyleUtils';
import Shape from '../../../model/bpmn/shape/Shape';
import Edge from '../../../model/bpmn/edge/Edge';
import Bounds from '../../../model/bpmn/Bounds';
import { ShapeBpmnBoundaryEvent, ShapeBpmnEvent, ShapeBpmnSubProcess } from '../../../model/bpmn/shape/ShapeBpmnElement';
import { Font } from '../../../model/bpmn/Label';
import { FlowKind } from '../../../model/bpmn/edge/FlowKind';
import { MessageFlow, SequenceFlow } from '../../../model/bpmn/edge/Flow';

// TODO 'clone' function is missing in mxgraph-type-definitions@1.0.2
declare const mxUtils: typeof mxgraph.mxUtils;

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class StyleConfigurator {
  private specificFlowStyles: Map<FlowKind, (style: any) => void> = new Map([
    [
      FlowKind.MESSAGE_FLOW,
      (style: any) => {
        style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_OVAL;
        style[mxConstants.STYLE_STARTSIZE] = 7;
        style[mxConstants.STYLE_STARTFILL] = false;
        style[mxConstants.STYLE_STROKECOLOR] = 'DeepPink';
      },
    ],
  ]);
  private specificSequenceFlowStyles: Map<SequenceFlowKind, (style: any) => void> = new Map([
    [
      SequenceFlowKind.DEFAULT,
      (style: any) => {
        style[mxConstants.STYLE_STARTARROW] = MarkerIdentifier.ARROW_DASH;
      },
    ],
    [
      SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
      (style: any) => {
        style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_DIAMOND_THIN;
        style[mxConstants.STYLE_STARTSIZE] = 18;
        style[mxConstants.STYLE_STARTFILL] = false;
      },
    ],
  ]);

  constructor(private graph: mxGraph) {}

  public configureStyles(): void {
    mxConstants.RECTANGLE_ROUNDING_FACTOR = 0.1;
    this.configureDefaultVertexStyle();

    this.configurePoolStyle();
    this.configureLaneStyle();

    this.configureActivityStyles();
    this.configureEventStyles();
    this.configureGatewayStyles();

    this.configureDefaultEdgeStyle();
    this.configureFlowStyles();
  }

  private getStylesheet(): any {
    return this.graph.getStylesheet();
  }

  private getDefaultVertexStyle(): any {
    return this.getStylesheet().getDefaultVertexStyle();
  }

  private getDefaultEdgeStyle(): any {
    return this.getStylesheet().getDefaultEdgeStyle();
  }

  private cloneDefaultVertexStyle(): any {
    const defaultStyle = this.getDefaultVertexStyle();
    return mxUtils.clone(defaultStyle);
  }

  private cloneDefaultEdgeStyle(): any {
    const defaultStyle = this.getDefaultEdgeStyle();
    return mxUtils.clone(defaultStyle);
  }

  private putCellStyle(name: ShapeBpmnElementKind, style: any): void {
    this.getStylesheet().putCellStyle(name, style);
  }

  private configureDefaultVertexStyle(): void {
    const style = this.getDefaultVertexStyle();
    this.configureCommonDefaultStyle(style);
  }

  private configurePoolStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_HORIZONTAL] = false;
    style[mxConstants.STYLE_FILLCOLOR] = '#d3d2d1';

    // TODO manage pool text area rendering
    // most of BPMN pool are ok when setting it to 30
    style[mxConstants.STYLE_STARTSIZE] = 30;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.POOL, style);
  }

  private configureLaneStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_HORIZONTAL] = false;
    style[mxConstants.STYLE_SWIMLANE_LINE] = 0; // hide the line between the title region and the content area

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
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK_THIN;
    style[mxConstants.STYLE_ENDSIZE] = 12;
    style[mxConstants.STYLE_STROKEWIDTH] = 1.5;
    style[mxConstants.STYLE_ROUNDED] = 1;
    style[mxConstants.STYLE_ARCSIZE] = 5;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_BOTTOM;

    this.configureCommonDefaultStyle(style);
  }

  private configureCommonDefaultStyle(style: any): void {
    style[mxConstants.STYLE_FONTFAMILY] = StyleDefault.DEFAULT_FONT_FAMILY;
    style[mxConstants.STYLE_FONTSIZE] = StyleDefault.DEFAULT_FONT_SIZE;
    style[mxConstants.STYLE_FONTCOLOR] = StyleDefault.DEFAULT_FONT_COLOR;
    style[mxConstants.STYLE_FILLCOLOR] = StyleDefault.DEFAULT_FILL_COLOR;
    style[mxConstants.STYLE_STROKECOLOR] = StyleDefault.DEFAULT_STROKE_COLOR;
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = mxConstants.NONE;

    // only works with html labels (enabled by MxGraphConfigurator)
    style[mxConstants.STYLE_WHITE_SPACE] = 'wrap';
  }

  private configureEdgeStyles<T>(styleKinds: T[], specificStyles: Map<T, (style: any) => void>): void {
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

  private configureFlowStyles(): void {
    this.configureEdgeStyles<FlowKind>(Object.values(FlowKind), this.specificFlowStyles);
    this.configureSequenceFlowStyles();
  }

  computeStyle(bpmnCell: Shape | Edge, labelBounds: Bounds): string {
    const styleValues = new Map<string, string | number>();

    const bpmnElement = bpmnCell.bpmnElement;
    const styles: string[] = [bpmnElement.kind as string];
    if (bpmnCell instanceof Shape) {
      if (bpmnElement instanceof ShapeBpmnEvent) {
        styleValues.set(StyleIdentifier.BPMN_STYLE_EVENT_KIND, bpmnElement.eventKind);

        if (bpmnElement instanceof ShapeBpmnBoundaryEvent) {
          styleValues.set(StyleIdentifier.BPMN_STYLE_IS_INTERRUPTING, String(bpmnElement.isInterrupting));
        }
      } else if (bpmnElement instanceof ShapeBpmnSubProcess) {
        styleValues.set(StyleIdentifier.BPMN_STYLE_SUB_PROCESS_KIND, bpmnElement.subProcessKind);
        styleValues.set(StyleIdentifier.BPMN_STYLE_IS_EXPANDED, String(bpmnCell.isExpanded));
      }
    } else {
      if (bpmnCell.bpmnElement instanceof SequenceFlow) {
        styles.push(bpmnCell.bpmnElement.sequenceFlowKind);
      } else if (bpmnCell.bpmnElement instanceof MessageFlow && bpmnCell.bpmnElement.hasMessage) {
        styleValues.set(mxConstants.STYLE_STROKECOLOR, 'DeepSkyBlue');
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
      styleValues.set(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
      if (bpmnCell instanceof Shape) {
        // arbitrarily increase width to relax too small bounds (for instance for reference diagrams from miwg-test-suite)
        styleValues.set(mxConstants.STYLE_LABEL_WIDTH, labelBounds.width + 1);
        // align settings
        styleValues.set(mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_TOP);
        styleValues.set(mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_LEFT);
      }
    }
    // when no label bounds, adjust the default style dynamically
    else if (bpmnCell instanceof Shape && bpmnCell.isExpanded && bpmnElement instanceof ShapeBpmnSubProcess) {
      styleValues.set(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP);
    }

    return [] //
      .concat([...styles])
      .concat([...styleValues].filter(([, v]) => v).map(([key, value]) => key + '=' + value))
      .join(';');
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
