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
import { MxGraphCustomOverlayPosition } from '../../../../../src/component/mxgraph/overlay/custom-overlay';
import { Overlay, OverlayPosition } from '../../../../../src/component/registry';
import { StyleDefault } from '../../../../../src/component/mxgraph/StyleUtils';

describe('overlay converter', () => {
  const overlayConverter = new OverlayConverter();

  it.each([
    [<OverlayPosition>'top-left', <MxGraphCustomOverlayPosition>{ horizontalAlign: 'left', verticalAlign: 'top' }],
    [<OverlayPosition>'top-right', <MxGraphCustomOverlayPosition>{ horizontalAlign: 'right', verticalAlign: 'top' }],
    [<OverlayPosition>'top-center', <MxGraphCustomOverlayPosition>{ horizontalAlign: 'center', verticalAlign: 'top' }],
    [<OverlayPosition>'bottom-left', <MxGraphCustomOverlayPosition>{ horizontalAlign: 'left', verticalAlign: 'bottom' }],
    [<OverlayPosition>'bottom-right', <MxGraphCustomOverlayPosition>{ horizontalAlign: 'right', verticalAlign: 'bottom' }],
    [<OverlayPosition>'bottom-center', <MxGraphCustomOverlayPosition>{ horizontalAlign: 'center', verticalAlign: 'bottom' }],
    [<OverlayPosition>'middle-left', <MxGraphCustomOverlayPosition>{ horizontalAlign: 'left', verticalAlign: 'middle' }],
    [<OverlayPosition>'middle-right', <MxGraphCustomOverlayPosition>{ horizontalAlign: 'right', verticalAlign: 'middle' }],
    [<OverlayPosition>'start', <MxGraphCustomOverlayPosition>{ horizontalAlign: 'left', verticalAlign: 'top' }],
    [<OverlayPosition>'middle', <MxGraphCustomOverlayPosition>{ horizontalAlign: 'center', verticalAlign: 'top' }],
    [<OverlayPosition>'end', <MxGraphCustomOverlayPosition>{ horizontalAlign: 'right', verticalAlign: 'top' }],
    [undefined, undefined],
    [null, undefined],
  ])('convert API overlay position %s to mxGraph overlay position %s', (apiPosition: OverlayPosition, mxGraphPosition: MxGraphCustomOverlayPosition) => {
    const overlay: Overlay = { position: apiPosition };

    const result = overlayConverter.convert(overlay);

    expect(result.position).toEqual(mxGraphPosition);
  });

  it('convert API overlay to mxGraph overlay', () => {
    const overlay: Overlay = {
      position: undefined,
      fill: { color: 'Green', opacity: 10 },
      stroke: { color: 'Blue', pattern: '2 3', width: 50 },
      font: { color: 'Yellow', size: 6 },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style).toEqual({ font: { color: 'Yellow', size: 6 }, fill: { color: 'Green', opacity: 10 }, stroke: { color: 'Blue', pattern: '2 3', width: 50 } });
  });

  it('set default fill color, when there is no fill color in API overlay on conversion', () => {
    const overlay: Overlay = {
      position: undefined,
      fill: { opacity: 10 },
      stroke: { color: 'Blue', pattern: '2 3', width: 50 },
      font: { color: 'Yellow', size: 6 },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style.fill.color).toEqual(StyleDefault.DEFAULT_FILL_COLOR);
  });

  it('set default stroke color, when there is no fill color in API overlay on conversion', () => {
    const overlay: Overlay = {
      position: undefined,
      fill: { color: 'Green', opacity: 10 },
      stroke: { pattern: '2 3', width: 50 },
      font: { color: 'Yellow', size: 6 },
    };

    const result = overlayConverter.convert(overlay);

    expect(result.style.stroke.color).toEqual(StyleDefault.DEFAULT_STROKE_COLOR);
  });
});
