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
import type Shape from '../../../model/bpmn/internal/shape/Shape';
import type { BPMNEdge, BPMNLabel, BPMNShape } from '../../../model/bpmn/json/bpmndi';
import type { ParsingExtensionPoint } from '../extension-points';

import './types';

function setColorExtensionsOnShape(shape: Shape, bpmnShape: BPMNShape): void {
  const fillColor = bpmnShape['background-color'] ?? bpmnShape.fill;
  fillColor && (shape.extensions.fillColor = fillColor);
  const strokeColor = bpmnShape['border-color'] ?? bpmnShape.stroke;
  strokeColor && (shape.extensions.strokeColor = strokeColor);
}

function setColorExtensionsOnLabel(label: { extensions: { color?: string } } | undefined, bpmnLabel: string | BPMNLabel | undefined): void {
  if (label && bpmnLabel && typeof bpmnLabel === 'object' && bpmnLabel.color) {
    label.extensions.color = bpmnLabel.color;
  }
}

function setColorExtensionsOnEdge(edge: Edge, bpmnEdge: BPMNEdge): void {
  const strokeColor = bpmnEdge['border-color'] ?? bpmnEdge.stroke;
  strokeColor && (edge.extensions.strokeColor = strokeColor);
}

export const bpmnInColorParsingExtension: ParsingExtensionPoint = {
  onShapeDeserialized(shape: Shape, bpmnShape: BPMNShape): void {
    setColorExtensionsOnShape(shape, bpmnShape);
    setColorExtensionsOnLabel(shape.label, bpmnShape.BPMNLabel);
  },
  onEdgeDeserialized(edge: Edge, bpmnEdge: BPMNEdge): void {
    setColorExtensionsOnEdge(edge, bpmnEdge);
    setColorExtensionsOnLabel(edge.label, bpmnEdge.BPMNLabel);
  },
  hasLabelExtensionData(bpmnLabel: unknown): boolean {
    return typeof bpmnLabel === 'object' && bpmnLabel !== null && 'color' in bpmnLabel;
  },
};
