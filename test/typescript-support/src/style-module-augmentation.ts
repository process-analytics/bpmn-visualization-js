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

// Checks that the BPMN specific style properties declared by bpmn-visualization are visible on the maxGraph style types,
// through the module augmentation shipped in the bpmn-visualization declarations.
// Importing bpmn-visualization is required: the augmentation is only applied when its declarations are part of the program.

import type { Cell, CellStateStyle, CellStyle } from '@maxgraph/core';
// eslint-disable-next-line import/no-unresolved -- The bpmn-visualization package may not have been built before running eslint (it happens when running GitHub Actions)
import type { FlowKind } from 'bpmn-visualization';

// eslint-disable-next-line import/no-unresolved -- The bpmn-visualization package may not have been built before running eslint (it happens when running GitHub Actions)
import { BpmnVisualization, ShapeBpmnElementKind, ShapeBpmnMarkerKind } from 'bpmn-visualization';

const bpmnVisualization = new BpmnVisualization({ container: 'bpmn-container' });
const graph = bpmnVisualization.graph;

// Write: the BPMN properties are accepted in a maxGraph style, both in the type annotation and when passed to the API.
const style: CellStyle = {
  shape: ShapeBpmnElementKind.TASK_USER,
  bvKind: ShapeBpmnElementKind.TASK_USER,
  bvMarkers: [ShapeBpmnMarkerKind.LOOP],
  bvCssClasses: ['a-css-class'],
  bvIsInstantiating: true,
};
graph.getStylesheet().putCellStyle('aBpmnStyle', style);

// Read: the BPMN properties are typed on the style of a rendered cell, without casting it.
export function readBpmnProperties(cell: Cell): unknown[] {
  const stateStyle: CellStateStyle = graph.getCellStyle(cell);
  const kind: ShapeBpmnElementKind | FlowKind | undefined = stateStyle.bvKind;
  const markers: ShapeBpmnMarkerKind[] | undefined = stateStyle.bvMarkers;
  const cssClasses: string[] | undefined = stateStyle.bvCssClasses;
  const isInterrupting: boolean | undefined = stateStyle.bvIsInterrupting;
  return [kind, markers, cssClasses, isInterrupting];
}

// A property that the augmentation does not declare is still rejected. Without this check, the statements above would
// also compile if the maxGraph style types accepted arbitrary properties, and the test would prove nothing.
// @ts-expect-error 'bvUndeclaredProperty' does not exist in type 'CellStyle'
const invalidStyle: CellStyle = { shape: 'rectangle', bvUndeclaredProperty: 42 };
graph.getStylesheet().putCellStyle('anInvalidStyle', invalidStyle);
