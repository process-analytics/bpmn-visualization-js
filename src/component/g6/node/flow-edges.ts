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
import { buildPaintParameter, IconPainterProvider } from './render';
import StyleUtils from '../StyleUtils';
import { MessageVisibleKind } from '../../../model/bpmn/internal/edge/MessageVisibleKind';
import { mxgraph } from '../initializer';
import { mxAbstractCanvas2D, mxRectangle } from 'mxgraph'; // for types

/!**
 * @internal
 *!/
export class MessageFlowIconShape extends mxgraph.mxRectangleShape {
  protected iconPainter = IconPainterProvider.get();

  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintVertexShape(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    const withFilledIcon = StyleUtils.getBpmnIsInitiating(this.style) === MessageVisibleKind.NON_INITIATING;
    const paintParameter = buildPaintParameter(c, x, y, w, h, this, 1, withFilledIcon);

    this.iconPainter.paintEnvelopeIcon(paintParameter);
  }
}
*/

import { Group as GGroup } from '@antv/g-canvas';
import { IShape } from '@antv/g-canvas/lib/interfaces';
import { BpmnG6EdgeConfig } from '../G6Renderer';
import { ShapeOptions } from '@antv/g6/lib/interface/shape';
import G6 from '@antv/g6';

// private specificFlowStyles: Map<FlowKind, (style: StyleMap) => void> = new Map([
//   [
//     FlowKind.SEQUENCE_FLOW,
//     (style: StyleMap) => {
//       style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK_THIN;
//     },
//   ],
//   [
//     FlowKind.MESSAGE_FLOW,
//     (style: StyleMap) => {
//       style[mxConstants.STYLE_DASHED] = true;
//       style[mxConstants.STYLE_DASH_PATTERN] = '8 5';
//       style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_OVAL;
//       style[mxConstants.STYLE_STARTSIZE] = 8;
//       style[mxConstants.STYLE_STARTFILL] = false;
//       style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK_THIN;
//       style[mxConstants.STYLE_ENDFILL] = false;
//     },
//   ],
//   [
//     FlowKind.ASSOCIATION_FLOW,
//     (style: StyleMap) => {
//       style[mxConstants.STYLE_DASHED] = true;
//       style[mxConstants.STYLE_DASH_PATTERN] = '1 2';
//       style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OPEN_THIN;
//       style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_OPEN_THIN;
//       style[mxConstants.STYLE_STARTSIZE] = 12;
//     },
//   ],
// ]);

// private specificAssociationFlowStyles: Map<AssociationDirectionKind, (style: StyleMap) => void> = new Map([
//   [
//     AssociationDirectionKind.NONE,
//     (style: StyleMap) => {
//       style[mxConstants.STYLE_STARTARROW] = undefined;
//       style[mxConstants.STYLE_ENDARROW] = undefined;
//       style[mxConstants.STYLE_EDGE] = undefined; // ensure no orthogonal segments, see also https://github.com/process-analytics/bpmn-visualization-js/issues/295
//     },
//   ],
//   [
//     AssociationDirectionKind.ONE,
//     (style: StyleMap) => {
//       style[mxConstants.STYLE_STARTARROW] = undefined;
//       style[mxConstants.STYLE_EDGE] = undefined; // ensure no orthogonal segments, see also https://github.com/process-analytics/bpmn-visualization-js/issues/295
//     },
//   ],
//   [
//     AssociationDirectionKind.BOTH,
//     (style: StyleMap) => {
//       style[mxConstants.STYLE_EDGE] = undefined; // ensure no orthogonal segments, see also https://github.com/process-analytics/bpmn-visualization-js/issues/295
//     },
//   ],
// ]);

export function getSequenceFlowDefinition(): ShapeOptions {
  return {
    options: {
      type: 'polyline',
      style: {
        stroke: '#ccc',
        endArrow: {
          path: G6.Arrow.triangle(10, 20, 25),
          d: 25,
        },
      },
    },
    draw: drawSequenceFlow(),
  };
}
function drawSequenceFlow(): (cfg?: BpmnG6EdgeConfig, group?: GGroup) => IShape {
  return (cfg, group): IShape => {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;

    // style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK_THIN;

    // private specificSequenceFlowStyles: Map<SequenceFlowKind, (style: StyleMap) => void> = new Map([
    //   [
    //     SequenceFlowKind.DEFAULT,
    //     (style: StyleMap) => {
    //       style[mxConstants.STYLE_STARTARROW] = MarkerIdentifier.ARROW_DASH;
    //     },
    //   ],
    //   [
    //     SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
    //     (style: StyleMap) => {
    //       style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_DIAMOND_THIN;
    //       style[mxConstants.STYLE_STARTSIZE] = 18;
    //       style[mxConstants.STYLE_STARTFILL] = false;
    //     },
    //   ],
    // ]);

    const endArrow = (cfg.style && cfg.style.endArrow) || {
      path: G6.Arrow.triangle(10, 20, 25),
      d: 25,
    };

    let points = [startPoint]; // the start point
    // the control points
    if (cfg.controlPoints) {
      points = points.concat(cfg.controlPoints);
    }
    // the end point
    points.push(endPoint);

    return group.addShape('path', {
      attrs: {
        source: cfg.source,
        target: cfg.target,

        stroke: '#333',
        lineWidth: 8,
        lineAppendWidth: 5,
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 1/3
          ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 2/3
          ['L', endPoint.x, endPoint.y],
        ],
        endArrow,

        label: cfg.label,
        labelCfg: {
          refX: 10, // x offset of the label
          refY: 10, // y offset of the label
          style: {
            fill: '#595959',
          },
        },
      },
      // must be assigned in G6 3.3 and later versions. it can be any value you want
      name: 'path-shape',
    });
  };
}
