/**
 * @jest-environment jsdom
 */
/*
Copyright 2023 Bonitasoft S.A.

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
import type { CellStyle } from '@maxgraph/core';

import { constants } from '@maxgraph/core';

import { getBpmnIsInstantiating, setCssClasses, setStyle, setStyleFlag, updateFill, updateFont, updateStroke } from '@lib/component/mxgraph/style/utils';
import { ShapeBpmnElementKind } from '@lib/model/bpmn/internal';

describe('setStyle', () => {
  test('sets the value when defined', () => {
    const style: CellStyle = {};
    setStyle(style, 'fillColor', 'red');
    expect(style.fillColor).toBe('red');
  });

  test('does nothing when the value is undefined', () => {
    const style: CellStyle = { fillColor: 'red' };
    setStyle(style, 'fillColor', undefined);
    expect(style.fillColor).toBe('red');
  });

  test('applies the converter', () => {
    const style: CellStyle = {};
    setStyle(style, 'strokeWidth', 3, value => value * 2);
    expect(style.strokeWidth).toBe(6);
  });
});

describe('setStyleFlag', () => {
  test('sets the flag when value is defined', () => {
    const style: CellStyle = {};
    setStyleFlag(style, 'fontStyle', constants.FONT_STYLE_MASK.BOLD, true);
    expect(style.fontStyle).toBe(constants.FONT_STYLE_MASK.BOLD);
  });

  test('does not toggle when the value is undefined', () => {
    const style: CellStyle = {};
    setStyleFlag(style, 'fontStyle', constants.FONT_STYLE_MASK.BOLD, undefined);
    expect(style.fontStyle).toBeUndefined();
  });
});

describe('updateStroke', () => {
  test('sets the stroke color', () => {
    const style: CellStyle = {};
    updateStroke(style, { color: '#123456' });
    expect(style.strokeColor).toBe('#123456');
  });

  test("ignores the 'default' color", () => {
    const style: CellStyle = {};
    updateStroke(style, { color: 'default' });
    expect(style.strokeColor).toBeUndefined();
  });
});

describe('updateFont', () => {
  test('sets the font family and size', () => {
    const style: CellStyle = {};
    updateFont(style, { family: 'Arial', size: 12 });
    expect(style.fontFamily).toBe('Arial');
    expect(style.fontSize).toBe(12);
  });

  test('sets the bold font style flag', () => {
    const style: CellStyle = {};
    updateFont(style, { isBold: true });
    expect(style.fontStyle).toBe(constants.FONT_STYLE_MASK.BOLD);
  });
});

describe('updateFill', () => {
  test('sets the fill color', () => {
    const style: BpmnCellStyle = { bpmn: { kind: ShapeBpmnElementKind.TASK } };
    updateFill(style, { color: '#abcdef' });
    expect(style.fillColor).toBe('#abcdef');
    expect(style.swimlaneFillColor).toBeUndefined();
  });

  test('also sets the swimlane fill color for a pool', () => {
    const style: BpmnCellStyle = { bpmn: { kind: ShapeBpmnElementKind.POOL } };
    updateFill(style, { color: '#abcdef' });
    expect(style.fillColor).toBe('#abcdef');
    expect(style.swimlaneFillColor).toBe('#abcdef');
  });
});

describe('setCssClasses', () => {
  test('sets the extra CSS classes', () => {
    const style: BpmnCellStyle = {};
    setCssClasses(style, ['class-1', 'class-2']);
    expect(style.bpmn?.extraCssClasses).toEqual(['class-1', 'class-2']);
  });

  test('deletes the extra CSS classes when empty', () => {
    const style: BpmnCellStyle = { bpmn: { extraCssClasses: ['class-1'] } };
    setCssClasses(style, []);
    expect(style.bpmn?.extraCssClasses).toBeUndefined();
  });
});

describe('getBpmnIsInstantiating', () => {
  test.each`
    isInstantiating | expected
    ${true}         | ${true}
    ${false}        | ${false}
    ${undefined}    | ${false}
  `('returns $expected when bpmn.isInstantiating is $isInstantiating', ({ isInstantiating, expected }: { isInstantiating: boolean | undefined; expected: boolean }) => {
    expect(getBpmnIsInstantiating({ bpmn: { isInstantiating } })).toBe(expected);
  });
});
