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
import type { CellStyle, Stylesheet } from '@maxgraph/core';

import { constants } from '@maxgraph/core';

import { AssociationDirectionKind, FlowKind, SequenceFlowKind, ShapeBpmnElementKind, ShapeUtil } from '../../../model/bpmn/internal';
import { MarkerIdentifier, StyleDefault } from '../style';

const arrowDefaultSize = 12;

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

const specificFlowStyles = new MapWithDefault<FlowKind>([
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
      // TODO maxgraph@0.23.0 the startFill/endFill flags could now be removed: maxGraph PR#157 (native marker
      // start/end fill, the same support that allowed deleting BpmnConnector) has landed. Re-evaluate whether the
      // explicit startFill/endFill are still needed once we have stable passing e2e visualization tests.
      style.startFill = true;
      style.startFillColor = StyleDefault.MESSAGE_FLOW_MARKER_START_FILL_COLOR;
      style.endArrow = 'blockThin';
      style.endFill = true;
      style.endFillColor = StyleDefault.MESSAGE_FLOW_MARKER_END_FILL_COLOR;
    },
  ],
  [
    FlowKind.ASSOCIATION_FLOW,
    (style: CellStyle) => {
      style.dashed = true;
      style.dashPattern = '1 2';
      // endArrow and startArrow are defined in specific AssociationDirectionKind styles when needed.
      // TODO maxgraph@0.23.0 workaround: startSize is set on the AssociationDirectionKind.BOTH style (the only
      // association direction that has a start arrow) instead of here on every association.
      // maxGraph ConnectorShape.augmentBoundingBox checks `style.startArrow !== NONE`, which is true for an unset
      // (undefined) startArrow, so it wrongly grows the bounding box of arrowless associations by a start-marker margin
      // sized by startSize. That enlarges getGraphBounds and shifts the on-load fit scale (~0.18%), which breaks the e2e
      // visual snapshots. mxGraph used getValue(style, STARTARROW, NONE), defaulting the absent key to NONE and skipping
      // the branch. Restore the line below (and drop the startSize in the BOTH style) once maxGraph treats an undefined
      // startArrow as NONE.
      // style.startSize = arrowDefaultSize;
    },
  ],
]);

const specificSequenceFlowStyles = new MapWithDefault<SequenceFlowKind>([
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
      // TODO maxgraph@0.23.0 same startFill re-evaluation as the MESSAGE_FLOW style above (maxGraph PR#157)
      style.startFill = true;
      style.startFillColor = StyleDefault.SEQUENCE_FLOW_CONDITIONAL_FROM_ACTIVITY_MARKER_FILL_COLOR;
    },
  ],
]);

const specificAssociationFlowStyles = new MapWithDefault<AssociationDirectionKind>([
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
      style.startArrow = 'openThin';
      style.endArrow = 'openThin';
      // TODO maxgraph@0.23.0 workaround: the startSize is set here on the BOTH style (the only association direction that has a start arrow) instead of on the FlowKind.ASSOCIATION_FLOW style (which applies to all association directions). See the comment in specificFlowStyles for more details.
      style.startSize = arrowDefaultSize;
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
      shape: 'swimlane',
      // label style
      verticalAlign: 'middle',
      align: 'center',
      startSize: StyleDefault.POOL_LABEL_SIZE,
      fillColor: StyleDefault.POOL_LABEL_FILL_COLOR,
    };

    this.putCellStyle(ShapeBpmnElementKind.POOL, style);
  }

  private configureLaneStyle(): void {
    const style: CellStyle = {
      shape: 'swimlane',
      // label style
      verticalAlign: 'middle',
      align: 'center',
      swimlaneLine: false, // hide the line between the title region and the content area
      startSize: StyleDefault.LANE_LABEL_SIZE,
      fillColor: StyleDefault.LANE_LABEL_FILL_COLOR,
    };

    this.putCellStyle(ShapeBpmnElementKind.LANE, style);
  }

  private configureEventStyles(): void {
    for (const kind of ShapeUtil.eventKinds()) {
      const style: CellStyle = {
        shape: kind,
        perimeter: 'ellipsePerimeter',
        strokeWidth: kind == ShapeBpmnElementKind.EVENT_END ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN,
        verticalLabelPosition: 'bottom',
      };
      this.putCellStyle(kind, style);
    }
  }

  private configureTextAnnotationStyle(): void {
    const style: CellStyle = {
      shape: ShapeBpmnElementKind.TEXT_ANNOTATION,
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
    for (const kind of ShapeUtil.activityKinds()) {
      const style: CellStyle = {
        shape: kind,
        rounded: true, // required by the BPMN specification
        verticalAlign: 'middle',
        strokeWidth: kind == ShapeBpmnElementKind.CALL_ACTIVITY ? StyleDefault.STROKE_WIDTH_THICK : StyleDefault.STROKE_WIDTH_THIN,
      };
      this.putCellStyle(kind, style);
    }
  }

  private configureGatewayStyles(): void {
    for (const kind of ShapeUtil.gatewayKinds()) {
      const style: CellStyle = {
        shape: kind,
        perimeter: 'rhombusPerimeter',
        strokeWidth: StyleDefault.STROKE_WIDTH_THIN,
        verticalAlign: 'top',

        // Default label positioning
        labelPosition: 'left',
        verticalLabelPosition: 'top',
      };

      this.putCellStyle(kind, style);
    }
  }

  private configureDefaultEdgeStyle(): void {
    const style = this.getStylesheet().getDefaultEdgeStyle();
    configureCommonDefaultStyle(style);

    style.endSize = arrowDefaultSize;
    style.strokeWidth = 1.5;
    style.rounded = true;
    // arcSize restored to the original mxGraph value (5): maxGraph 0.21.0 fixed the arc computation, so 5 renders
    // correctly again. The 0.20.0 POC had to halve it to 2.5 to work around the pre-0.21.0 computation.
    // TODO maxgraph@0.23.0 confirm with the visual (e2e) tests that arcSize = 5 renders as expected (e2e disabled for now)
    style.arcSize = 5;
    style.verticalAlign = 'bottom';

    // The end arrow must be redefined in specific style
    delete style.endArrow;
  }

  private configureEdgeStyles<T>(styleKinds: T[], specificStyles: Map<T, (style: CellStyle) => void>): void {
    for (const kind of styleKinds) {
      const style: CellStyle = {};
      specificStyles.get(kind)(style);
      this.getStylesheet().putCellStyle((kind as string).toString(), style);
    }
  }

  private configureFlowStyles(): void {
    this.configureEdgeStyles<FlowKind>(Object.values(FlowKind), specificFlowStyles);
    this.configureEdgeStyles<SequenceFlowKind>(Object.values(SequenceFlowKind), specificSequenceFlowStyles);
    this.configureEdgeStyles<AssociationDirectionKind>(Object.values(AssociationDirectionKind), specificAssociationFlowStyles);
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
