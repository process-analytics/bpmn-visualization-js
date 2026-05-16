/*
Copyright 2026 Bonitasoft S.A.

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

import type { Edge } from '../../../model/bpmn/internal/edge/edge';
import type Label from '../../../model/bpmn/internal/Label';
import type Shape from '../../../model/bpmn/internal/shape/Shape';
import type { StyleExtensionPoint } from '../extension-points';

import './types';

import { ShapeUtil } from '../../../model/bpmn/internal';
import { mxConstants } from '../../mxgraph/initializer';

function enrichLabelStyle(label: Label | undefined, styleValues: Map<string, string | number>): void {
  const color = label?.extensions.color;
  color && styleValues.set(mxConstants.STYLE_FONTCOLOR, color);
}

export const bpmnInColorStyleExtension: StyleExtensionPoint = {
  enrichShapeStyle(shape: Shape, styleValues: Map<string, string | number>): void {
    const extensions = shape.extensions;
    const fillColor = extensions.fillColor;
    if (fillColor) {
      styleValues.set(mxConstants.STYLE_FILLCOLOR, fillColor);
      if (ShapeUtil.isPoolOrLane(shape.bpmnElement.kind)) {
        styleValues.set(mxConstants.STYLE_SWIMLANE_FILLCOLOR, fillColor);
      }
    }
    extensions.strokeColor && styleValues.set(mxConstants.STYLE_STROKECOLOR, extensions.strokeColor);
    enrichLabelStyle(shape.label, styleValues);
  },
  enrichEdgeStyle(edge: Edge, styleValues: Map<string, string | number>): void {
    const extensions = edge.extensions;
    extensions.strokeColor && styleValues.set(mxConstants.STYLE_STROKECOLOR, extensions.strokeColor);
    enrichLabelStyle(edge.label, styleValues);
  },
  enrichMessageFlowIconStyle(edge: Edge, styleValues: Map<string, string | number>): void {
    edge.extensions.strokeColor && styleValues.set(mxConstants.STYLE_STROKECOLOR, edge.extensions.strokeColor);
  },
};
