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

import type { BpmnCellStyle } from '@lib/component/mxgraph/style/types';

import { bpmnInColorStyleExtension } from '@lib/component/extension/bpmn-in-color/style-extension';
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
      const style: BpmnCellStyle = {};

      bpmnInColorStyleExtension.enrichShapeStyle(shape, style);

      expect(style.fillColor).toBe('#aabbcc');
      expect(style.strokeColor).toBe('#112233');
      expect(style.swimlaneFillColor).toBeUndefined();
    });

    it.each([ShapeBpmnElementKind.POOL, ShapeBpmnElementKind.LANE])('also sets swimlane fill color for %s', (kind: ShapeBpmnElementKind) => {
      const shape = newShape(kind);
      shape.extensions.fillColor = '#abcdef';
      const style: BpmnCellStyle = {};

      bpmnInColorStyleExtension.enrichShapeStyle(shape, style);

      expect(style.fillColor).toBe('#abcdef');
      expect(style.swimlaneFillColor).toBe('#abcdef');
    });

    it('does not set swimlane fill color when fillColor is absent on a pool', () => {
      const shape = newShape(ShapeBpmnElementKind.POOL);
      const style: BpmnCellStyle = {};

      bpmnInColorStyleExtension.enrichShapeStyle(shape, style);

      expect(style.fillColor).toBeUndefined();
      expect(style.swimlaneFillColor).toBeUndefined();
    });

    it('sets font color from label extensions', () => {
      const shape = newShape(ShapeBpmnElementKind.TASK, newLabel('#fontcolor'));
      const style: BpmnCellStyle = {};

      bpmnInColorStyleExtension.enrichShapeStyle(shape, style);

      expect(style.fontColor).toBe('#fontcolor');
    });

    it('produces an empty style when no extension data is present', () => {
      const shape = newShape(ShapeBpmnElementKind.TASK);
      const style: BpmnCellStyle = {};

      bpmnInColorStyleExtension.enrichShapeStyle(shape, style);

      expect(style).toEqual({});
    });
  });

  describe('enrichEdgeStyle', () => {
    it('sets stroke color from edge extensions', () => {
      const edge = newSequenceFlowEdge();
      edge.extensions.strokeColor = '#abc123';
      const style: BpmnCellStyle = {};

      bpmnInColorStyleExtension.enrichEdgeStyle(edge, style);

      expect(style.strokeColor).toBe('#abc123');
    });

    it('sets font color from label extensions', () => {
      const edge = newSequenceFlowEdge(newLabel('#labelcolor'));
      const style: BpmnCellStyle = {};

      bpmnInColorStyleExtension.enrichEdgeStyle(edge, style);

      expect(style.fontColor).toBe('#labelcolor');
    });

    it('produces an empty style when no extension data is present', () => {
      const edge = newSequenceFlowEdge();
      const style: BpmnCellStyle = {};

      bpmnInColorStyleExtension.enrichEdgeStyle(edge, style);

      expect(style).toEqual({});
    });
  });

  describe('enrichMessageFlowIconStyle', () => {
    it('sets stroke color from the edge stroke color extension', () => {
      const edge = newMessageFlowEdge();
      edge.extensions.strokeColor = '#deadbe';
      const style: BpmnCellStyle = {};

      bpmnInColorStyleExtension.enrichMessageFlowIconStyle(edge, style);

      expect(style.strokeColor).toBe('#deadbe');
    });

    it('does not set anything when no stroke color is present', () => {
      const edge = newMessageFlowEdge();
      const style: BpmnCellStyle = {};

      bpmnInColorStyleExtension.enrichMessageFlowIconStyle(edge, style);

      expect(style).toEqual({});
    });
  });
});
