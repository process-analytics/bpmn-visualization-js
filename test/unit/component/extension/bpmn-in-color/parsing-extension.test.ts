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

import type { BPMNEdge, BPMNShape } from '@lib/model/bpmn/json/bpmndi';

import { bpmnInColorParsingExtension } from '@lib/component/extension/bpmn-in-color/parsing-extension';
import { ShapeBpmnElementKind } from '@lib/model/bpmn/internal';
import { Edge } from '@lib/model/bpmn/internal/edge/edge';
import { MessageFlow } from '@lib/model/bpmn/internal/edge/flows';
import Label from '@lib/model/bpmn/internal/Label';
import Shape from '@lib/model/bpmn/internal/shape/Shape';
import ShapeBpmnElement from '@lib/model/bpmn/internal/shape/ShapeBpmnElement';

function newShape(label?: Label): Shape {
  return new Shape('id', new ShapeBpmnElement('id', 'name', ShapeBpmnElementKind.TASK), undefined, label);
}

function newMessageFlowEdge(label?: Label): Edge {
  return new Edge('id', new MessageFlow('id', 'name', undefined, undefined), undefined, label);
}

describe('BPMN in Color — parsing extension', () => {
  describe('onShapeDeserialized', () => {
    it('reads BPMN in Color spec attributes (background-color, border-color)', () => {
      const shape = newShape();
      bpmnInColorParsingExtension.onShapeDeserialized(shape, { 'background-color': '#aabbcc', 'border-color': '#112233' } as BPMNShape);
      expect(shape.extensions.fillColor).toBe('#aabbcc');
      expect(shape.extensions.strokeColor).toBe('#112233');
    });

    it('falls back to bpmn.io attributes (fill, stroke) when BPMN in Color attributes are missing', () => {
      const shape = newShape();
      bpmnInColorParsingExtension.onShapeDeserialized(shape, { fill: '#fallfill', stroke: '#fallstroke' } as BPMNShape);
      expect(shape.extensions.fillColor).toBe('#fallfill');
      expect(shape.extensions.strokeColor).toBe('#fallstroke');
    });

    it('prioritizes BPMN in Color spec over bpmn.io fallback', () => {
      const shape = newShape();
      bpmnInColorParsingExtension.onShapeDeserialized(shape, {
        'background-color': '#spec-fill',
        fill: '#io-fill',
        'border-color': '#spec-stroke',
        stroke: '#io-stroke',
      } as BPMNShape);
      expect(shape.extensions.fillColor).toBe('#spec-fill');
      expect(shape.extensions.strokeColor).toBe('#spec-stroke');
    });

    it('reads label color when shape has a label and BPMNLabel carries a color', () => {
      const label = new Label(undefined, undefined);
      const shape = newShape(label);
      bpmnInColorParsingExtension.onShapeDeserialized(shape, { BPMNLabel: { color: '#labelcolor' } } as BPMNShape);
      expect(label.extensions.color).toBe('#labelcolor');
    });

    it('does not crash when the shape has no label even if BPMNLabel carries a color', () => {
      const shape = newShape();
      expect(() => bpmnInColorParsingExtension.onShapeDeserialized(shape, { BPMNLabel: { color: '#labelcolor' } } as BPMNShape)).not.toThrow();
    });

    it('does not set label color when BPMNLabel is a string (not an object)', () => {
      const label = new Label(undefined, undefined);
      const shape = newShape(label);
      bpmnInColorParsingExtension.onShapeDeserialized(shape, { BPMNLabel: 'just an id reference' } as BPMNShape);
      expect(label.extensions.color).toBeUndefined();
    });

    it('does not pollute shape extensions when no color attributes are present', () => {
      const shape = newShape();
      bpmnInColorParsingExtension.onShapeDeserialized(shape, {} as BPMNShape);
      expect(Object.hasOwn(shape.extensions, 'fillColor')).toBeFalse();
      expect(Object.hasOwn(shape.extensions, 'strokeColor')).toBeFalse();
    });

    it('does not pollute label extensions when BPMNLabel object has no color key', () => {
      const label = new Label(undefined, undefined);
      const shape = newShape(label);
      bpmnInColorParsingExtension.onShapeDeserialized(shape, { BPMNLabel: { labelStyle: 'id' } } as BPMNShape);
      expect(Object.hasOwn(label.extensions, 'color')).toBeFalse();
    });
  });

  describe('onEdgeDeserialized', () => {
    it('reads BPMN in Color border-color attribute', () => {
      const edge = newMessageFlowEdge();
      bpmnInColorParsingExtension.onEdgeDeserialized(edge, { 'border-color': '#edge-stroke' } as BPMNEdge);
      expect(edge.extensions.strokeColor).toBe('#edge-stroke');
    });

    it('falls back to bpmn.io stroke attribute', () => {
      const edge = newMessageFlowEdge();
      bpmnInColorParsingExtension.onEdgeDeserialized(edge, { stroke: '#edge-io-stroke' } as BPMNEdge);
      expect(edge.extensions.strokeColor).toBe('#edge-io-stroke');
    });

    it('reads label color when edge has a label and BPMNLabel carries a color', () => {
      const label = new Label(undefined, undefined);
      const edge = newMessageFlowEdge(label);
      bpmnInColorParsingExtension.onEdgeDeserialized(edge, { BPMNLabel: { color: '#edge-label' } } as BPMNEdge);
      expect(label.extensions.color).toBe('#edge-label');
    });

    it('does not pollute edge extensions when no stroke attribute is present', () => {
      const edge = newMessageFlowEdge();
      bpmnInColorParsingExtension.onEdgeDeserialized(edge, {} as BPMNEdge);
      expect(Object.hasOwn(edge.extensions, 'strokeColor')).toBeFalse();
    });
  });

  describe('hasLabelExtensionData', () => {
    it.each([
      ['undefined', undefined, false],
      ['null', null, false],
      ['empty string', '', false],
      ['non-empty string', 'a label id', false],
      ['object without color', { labelStyle: 'id' }, false],
      ['object with color', { color: '#abc' }, true],
      ['object with color and other keys', { color: '#abc', labelStyle: 'id' }, true],
    ])('returns %s for %s', (_name, input, expected) => {
      expect(bpmnInColorParsingExtension.hasLabelExtensionData(input)).toBe(expected);
    });
  });
});
