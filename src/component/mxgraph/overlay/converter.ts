/*
Copyright 2021 Bonitasoft S.A.

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

import type { CustomCellOverlayOptions, CustomCellOverlayPosition, CustomCellOverlayStyle } from './custom-overlay';
import type { Overlay, OverlayFont, OverlayPosition, OverlayFill, OverlayStroke } from '../../registry';

import { StyleDefault } from '../style';

const overlayPositions = new Map<OverlayPosition, CustomCellOverlayPosition>([
  // Edge
  ['start', { horizontalAlign: 'left', verticalAlign: 'top' }],
  ['middle', { horizontalAlign: 'center', verticalAlign: 'top' }],
  ['end', { horizontalAlign: 'right', verticalAlign: 'top' }],
  // Shape
  ['top-left', { horizontalAlign: 'left', verticalAlign: 'top' }],
  ['top-right', { horizontalAlign: 'right', verticalAlign: 'top' }],
  ['top-center', { horizontalAlign: 'center', verticalAlign: 'top' }],
  ['bottom-left', { horizontalAlign: 'left', verticalAlign: 'bottom' }],
  ['bottom-right', { horizontalAlign: 'right', verticalAlign: 'bottom' }],
  ['bottom-center', { horizontalAlign: 'center', verticalAlign: 'bottom' }],
  ['middle-left', { horizontalAlign: 'left', verticalAlign: 'middle' }],
  ['middle-right', { horizontalAlign: 'right', verticalAlign: 'middle' }],
]);

const convertPosition = (overlay: Overlay): CustomCellOverlayPosition => overlayPositions.get(overlay.position);

const convertFill = (convertedStyle: CustomCellOverlayStyle, apiFill: OverlayFill): void => {
  if (apiFill) {
    convertedStyle.fill.color = apiFill.color ?? convertedStyle.fill.color;
    convertedStyle.fill.opacity = apiFill.opacity ?? convertedStyle.fill.opacity;
  }
};

const convertStroke = (convertedStyle: CustomCellOverlayStyle, apiStroke: OverlayStroke): void => {
  if (apiStroke) {
    convertedStyle.stroke.color = apiStroke.color ?? convertedStyle.stroke.color;
    convertedStyle.stroke.width = apiStroke.width ?? convertedStyle.stroke.width;
  }
};

const convertFont = (convertedStyle: CustomCellOverlayStyle, apiFont: OverlayFont): void => {
  if (apiFont) {
    convertedStyle.font.color = apiFont.color ?? convertedStyle.font.color;
    convertedStyle.font.size = apiFont.size ?? convertedStyle.font.size;
  }
};

const convertStyle = (overlay: Overlay): CustomCellOverlayStyle => {
  // recompute the style at each call to ensure we consider default changes that could occur after lib initialization
  const defaultStyle = {
    fill: { color: StyleDefault.DEFAULT_OVERLAY_FILL_COLOR.valueOf(), opacity: StyleDefault.DEFAULT_OVERLAY_FILL_OPACITY.valueOf() },
    stroke: { color: StyleDefault.DEFAULT_OVERLAY_STROKE_COLOR.valueOf(), width: StyleDefault.DEFAULT_OVERLAY_STROKE_WIDTH.valueOf() },
    font: { color: StyleDefault.DEFAULT_OVERLAY_FONT_COLOR.valueOf(), size: StyleDefault.DEFAULT_OVERLAY_FONT_SIZE.valueOf() },
  };

  const style = overlay.style;
  const convertedStyle = { ...defaultStyle } as CustomCellOverlayStyle;
  if (!style) {
    return convertedStyle;
  }

  convertFill(convertedStyle, style.fill);
  convertStroke(convertedStyle, style.stroke);
  convertFont(convertedStyle, style.font);

  return convertedStyle;
};

export class OverlayConverter {
  convert(overlay: Overlay): CustomCellOverlayOptions {
    const position = convertPosition(overlay);
    const style = convertStyle(overlay);
    return { position, style };
  }
}
