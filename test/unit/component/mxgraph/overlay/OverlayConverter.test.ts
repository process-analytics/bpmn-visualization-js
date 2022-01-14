/**
 * @jest-environment jsdom
 */
/**
 * Copyright 2021 Bonitasoft S.A.
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
import { OverlayConverter } from '../../../../../src/component/mxgraph/overlay/OverlayConverter';
import type { MxGraphCustomOverlayPosition } from '../../../../../src/component/mxgraph/overlay/custom-overlay';
import type { Overlay, OverlayPosition } from '../../../../../src/bpmn-visualization';
import { StyleDefault } from '../../../../../src/bpmn-visualization';

describe('overlay converter', () => {
  const overlayConverter = new OverlayConverter();

  const positionParameters = [
    ['top-left', { horizontalAlign: 'left', verticalAlign: 'top' }],
    ['top-right', { horizontalAlign: 'right', verticalAlign: 'top' }],
    ['top-center', { horizontalAlign: 'center', verticalAlign: 'top' }],
    ['bottom-left', { horizontalAlign: 'left', verticalAlign: 'bottom' }],
    ['bottom-right', { horizontalAlign: 'right', verticalAlign: 'bottom' }],
    ['bottom-center', { horizontalAlign: 'center', verticalAlign: 'bottom' }],
    ['middle-left', { horizontalAlign: 'left', verticalAlign: 'middle' }],
    ['middle-right', { horizontalAlign: 'right', verticalAlign: 'middle' }],
    ['start', { horizontalAlign: 'left', verticalAlign: 'top' }],
    ['middle', { horizontalAlign: 'center', verticalAlign: 'top' }],
    ['end', { horizontalAlign: 'right', verticalAlign: 'top' }],
    [undefined, undefined],
    [null, undefined],
  ];
  it.each(positionParameters as [[OverlayPosition, MxGraphCustomOverlayPosition]])(
    'convert API overlay position %s to mxGraph overlay position %s',
    (apiPosition: OverlayPosition, mxGraphPosition: MxGraphCustomOverlayPosition) => {
      const overlay: Overlay = { position: apiPosition };

      const result = overlayConverter.convert(overlay);

      expect(result.position).toEqual(mxGraphPosition);
    },
  );

  it('convert API overlay with fully defined style to mxGraph overlay', () => {
    const overlay: Overlay = {
      position: undefined,
      style: { fill: { color: 'Green', opacity: 10 }, stroke: { color: 'Blue', width: 50 }, font: { color: 'Yellow', size: 6 } },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({
      fill: { color: 'Green', opacity: 10 },
      stroke: { color: 'Blue', width: 50 },
      font: { color: 'Yellow', size: 6 },
    });
  });

  it('convert API overlay without style to mxGraph overlay', () => {
    const overlay: Overlay = { position: undefined };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({
      fill: { color: StyleDefault.DEFAULT_OVERLAY_FILL_COLOR, opacity: StyleDefault.DEFAULT_OVERLAY_FILL_OPACITY },
      stroke: { color: StyleDefault.DEFAULT_OVERLAY_STROKE_COLOR, width: StyleDefault.DEFAULT_OVERLAY_STROKE_WIDTH },
      font: { color: StyleDefault.DEFAULT_OVERLAY_FONT_COLOR, size: StyleDefault.DEFAULT_OVERLAY_FONT_SIZE },
    });
  });

  it('use default fill, when there is no fill in API overlay on conversion', () => {
    const overlay: Overlay = {
      position: undefined,
      style: { stroke: { color: 'Red', width: 5 }, font: { color: 'Yellow', size: 16 } },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({
      fill: { color: StyleDefault.DEFAULT_OVERLAY_FILL_COLOR, opacity: StyleDefault.DEFAULT_OVERLAY_FILL_OPACITY },
      stroke: { color: 'Red', width: 5 },
      font: { color: 'Yellow', size: 16 },
    });
  });

  it('use default fill color, when there is no fill color in API overlay on conversion', () => {
    const overlay: Overlay = {
      position: undefined,
      style: { fill: { opacity: 30 }, stroke: { color: 'Gray', width: 4 }, font: { color: 'Orange', size: 6 } },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({
      fill: { color: StyleDefault.DEFAULT_OVERLAY_FILL_COLOR, opacity: 30 },
      stroke: { color: 'Gray', width: 4 },
      font: { color: 'Orange', size: 6 },
    });
  });

  it('use default fill opacity, when there is no fill opacity in API overlay on conversion', () => {
    const overlay: Overlay = {
      position: undefined,
      style: { fill: { color: 'Chartreuse' }, stroke: { color: 'Gray', width: 4 }, font: { color: 'Orange', size: 6 } },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({
      fill: { color: 'Chartreuse', opacity: StyleDefault.DEFAULT_OVERLAY_FILL_OPACITY },
      stroke: { color: 'Gray', width: 4 },
      font: { color: 'Orange', size: 6 },
    });
  });

  it('use default stroke, when there is no stroke in API overlay on conversion', () => {
    const overlay: Overlay = {
      position: undefined,
      style: { fill: { color: 'Chartreuse', opacity: 50 }, font: { color: 'Pink', size: 8 } },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({
      fill: { color: 'Chartreuse', opacity: 50 },
      stroke: { color: StyleDefault.DEFAULT_OVERLAY_FONT_COLOR, width: StyleDefault.DEFAULT_OVERLAY_STROKE_WIDTH },
      font: { color: 'Pink', size: 8 },
    });
  });

  it('use default stroke color, when there is no stroke color in API overlay on conversion', () => {
    const overlay: Overlay = {
      position: undefined,
      style: { fill: { color: 'Chartreuse', opacity: 10 }, stroke: { width: 3 }, font: { color: 'Brown', size: 10 } },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({
      fill: { color: 'Chartreuse', opacity: 10 },
      stroke: { color: StyleDefault.DEFAULT_OVERLAY_STROKE_COLOR, width: 3 },
      font: { color: 'Brown', size: 10 },
    });
  });

  it('use default stroke width, when there is no stroke width in API overlay on conversion', () => {
    const overlay: Overlay = {
      position: undefined,
      style: { fill: { color: 'Chartreuse', opacity: 10 }, stroke: { color: 'Gray' }, font: { color: 'Brown', size: 10 } },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({
      fill: { color: 'Chartreuse', opacity: 10 },
      stroke: { color: 'Gray', width: StyleDefault.DEFAULT_OVERLAY_STROKE_WIDTH },
      font: { color: 'Brown', size: 10 },
    });
  });

  it('use default font, when there is no font in API overlay on conversion', () => {
    const overlay: Overlay = {
      position: undefined,
      style: { fill: { color: 'Chartreuse', opacity: 10 }, stroke: { color: 'Red', width: 5 } },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({
      fill: { color: 'Chartreuse', opacity: 10 },
      stroke: { color: 'Red', width: 5 },
      font: { color: StyleDefault.DEFAULT_OVERLAY_FONT_COLOR, size: StyleDefault.DEFAULT_OVERLAY_FONT_SIZE },
    });
  });

  it('use default font color, when there is no font color in API overlay on conversion', () => {
    const overlay: Overlay = {
      position: undefined,
      style: { fill: { color: 'Chartreuse', opacity: 10 }, stroke: { color: 'Blue', width: 3 }, font: { size: 11.78 } },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({
      fill: { color: 'Chartreuse', opacity: 10 },
      stroke: { color: 'Blue', width: 3 },
      font: { color: StyleDefault.DEFAULT_OVERLAY_FONT_COLOR, size: 11.78 },
    });
  });

  it('use default font size, when there is no font size in API overlay on conversion', () => {
    const overlay: Overlay = {
      position: undefined,
      style: { fill: { color: 'Chartreuse', opacity: 10 }, stroke: { color: 'Blue', width: 3 }, font: { color: 'Yellow' } },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({
      fill: { color: 'Chartreuse', opacity: 10 },
      stroke: { color: 'Blue', width: 3 },
      font: { color: 'Yellow', size: StyleDefault.DEFAULT_OVERLAY_FONT_SIZE },
    });
  });
});
