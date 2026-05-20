/**
 * @jest-environment jsdom
 */
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

import { bpmnInColorStyleExtension } from '@lib/component/extension/bpmn-in-color/style-extension';
import { mxConstants } from '@lib/component/mxgraph/initializer';
import { ShapeBpmnElementKind } from '@lib/model/bpmn/internal';
import { Edge } from '@lib/model/bpmn/internal/edge/edge';
import { MessageFlow, SequenceFlow } from '@lib/model/bpmn/internal/edge/flows';
import { SequenceFlowKind } from '@lib/model/bpmn/internal/edge/kinds';
import Label from '@lib/model/bpmn/internal/Label';
import Shape from '@lib/model/bpmn/internal/shape/Shape';
import ShapeBpmnElement from '@lib/model/bpmn/internal/shape/ShapeBpmnElement';

function newShape(kind: ShapeBpmnElementKind, label?: Label): Shape {
  return new Shape('id', new ShapeBpmnElement('id', 'name', kind), undefined, label);
}

function newLabel(color?: string): Label {
  const label = new Label(undefined, undefined);
  if (color !== undefined) label.extensions.color = color;
  return label;
}

function newSequenceFlowEdge(label?: Label): Edge {
  return new Edge('id', new SequenceFlow('id', 'name', undefined, undefined, SequenceFlowKind.NORMAL), undefined, label);
}

function newMessageFlowEdge(): Edge {
  return new Edge('id', new MessageFlow('id', 'name', undefined, undefined));
}

describe('BPMN in Color — style extension', () => {
  describe('enrichShapeStyle', () => {
    it('sets fill and stroke color when present on shape extensions', () => {
      const shape = newShape(ShapeBpmnElementKind.TASK);
      shape.extensions.fillColor = '#aabbcc';
      shape.extensions.strokeColor = '#112233';
      const styleValues = new Map<string, string | number>();

      bpmnInColorStyleExtension.enrichShapeStyle(shape, styleValues);

      expect(styleValues.get(mxConstants.STYLE_FILLCOLOR)).toBe('#aabbcc');
      expect(styleValues.get(mxConstants.STYLE_STROKECOLOR)).toBe('#112233');
      expect(styleValues.has(mxConstants.STYLE_SWIMLANE_FILLCOLOR)).toBeFalse();
    });

    it.each([ShapeBpmnElementKind.POOL, ShapeBpmnElementKind.LANE])('also sets swimlane fill color for %s', (kind: ShapeBpmnElementKind) => {
      const shape = newShape(kind);
      shape.extensions.fillColor = '#abcdef';
      const styleValues = new Map<string, string | number>();

      bpmnInColorStyleExtension.enrichShapeStyle(shape, styleValues);

      expect(styleValues.get(mxConstants.STYLE_FILLCOLOR)).toBe('#abcdef');
      expect(styleValues.get(mxConstants.STYLE_SWIMLANE_FILLCOLOR)).toBe('#abcdef');
    });

    it('does not set swimlane fill color when fillColor is absent on a pool', () => {
      const shape = newShape(ShapeBpmnElementKind.POOL);
      const styleValues = new Map<string, string | number>();

      bpmnInColorStyleExtension.enrichShapeStyle(shape, styleValues);

      expect(styleValues.has(mxConstants.STYLE_FILLCOLOR)).toBeFalse();
      expect(styleValues.has(mxConstants.STYLE_SWIMLANE_FILLCOLOR)).toBeFalse();
    });

    it('sets font color from label extensions', () => {
      const shape = newShape(ShapeBpmnElementKind.TASK, newLabel('#fontcolor'));
      const styleValues = new Map<string, string | number>();

      bpmnInColorStyleExtension.enrichShapeStyle(shape, styleValues);

      expect(styleValues.get(mxConstants.STYLE_FONTCOLOR)).toBe('#fontcolor');
    });

    it('produces an empty map when no extension data is present', () => {
      const shape = newShape(ShapeBpmnElementKind.TASK);
      const styleValues = new Map<string, string | number>();

      bpmnInColorStyleExtension.enrichShapeStyle(shape, styleValues);

      expect(styleValues.size).toBe(0);
    });
  });

  describe('enrichEdgeStyle', () => {
    it('sets stroke color from edge extensions', () => {
      const edge = newSequenceFlowEdge();
      edge.extensions.strokeColor = '#abc123';
      const styleValues = new Map<string, string | number>();

      bpmnInColorStyleExtension.enrichEdgeStyle(edge, styleValues);

      expect(styleValues.get(mxConstants.STYLE_STROKECOLOR)).toBe('#abc123');
    });

    it('sets font color from label extensions', () => {
      const edge = newSequenceFlowEdge(newLabel('#labelcolor'));
      const styleValues = new Map<string, string | number>();

      bpmnInColorStyleExtension.enrichEdgeStyle(edge, styleValues);

      expect(styleValues.get(mxConstants.STYLE_FONTCOLOR)).toBe('#labelcolor');
    });

    it('produces an empty map when no extension data is present', () => {
      const edge = newSequenceFlowEdge();
      const styleValues = new Map<string, string | number>();

      bpmnInColorStyleExtension.enrichEdgeStyle(edge, styleValues);

      expect(styleValues.size).toBe(0);
    });
  });

  describe('enrichMessageFlowIconStyle', () => {
    it('sets stroke color from the edge stroke color extension', () => {
      const edge = newMessageFlowEdge();
      edge.extensions.strokeColor = '#deadbe';
      const styleValues = new Map<string, string | number>();

      bpmnInColorStyleExtension.enrichMessageFlowIconStyle(edge, styleValues);

      expect(styleValues.get(mxConstants.STYLE_STROKECOLOR)).toBe('#deadbe');
    });

    it('does not set anything when no stroke color is present', () => {
      const edge = newMessageFlowEdge();
      const styleValues = new Map<string, string | number>();

      bpmnInColorStyleExtension.enrichMessageFlowIconStyle(edge, styleValues);

      expect(styleValues.size).toBe(0);
    });
  });
});
