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
import type { BpmnCellStyle } from '../../mxgraph/style/types';
import type { StyleExtensionPoint } from '../extension-points';

import './types';

import { ShapeUtil } from '../../../model/bpmn/internal';

function enrichLabelStyle(label: Label | undefined, style: BpmnCellStyle): void {
  const color = label?.extensions.color;
  color && (style.fontColor = color);
}

export const bpmnInColorStyleExtension: StyleExtensionPoint = {
  enrichShapeStyle(shape: Shape, style: BpmnCellStyle): void {
    const extensions = shape.extensions;
    const fillColor = extensions.fillColor;
    if (fillColor) {
      style.fillColor = fillColor;
      if (ShapeUtil.isPoolOrLane(shape.bpmnElement.kind)) {
        style.swimlaneFillColor = fillColor;
      }
    }
    extensions.strokeColor && (style.strokeColor = extensions.strokeColor);
    enrichLabelStyle(shape.label, style);
  },
  enrichEdgeStyle(edge: Edge, style: BpmnCellStyle): void {
    const extensions = edge.extensions;
    extensions.strokeColor && (style.strokeColor = extensions.strokeColor);
    enrichLabelStyle(edge.label, style);
  },
  enrichMessageFlowIconStyle(edge: Edge, style: BpmnCellStyle): void {
    edge.extensions.strokeColor && (style.strokeColor = edge.extensions.strokeColor);
  },
};
