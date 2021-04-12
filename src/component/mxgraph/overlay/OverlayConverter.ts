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
import { Overlay, OverlayPosition } from '../../registry';
import { StyleDefault } from '../StyleUtils';
import { MxGraphCustomOverlayOptions, MxGraphCustomOverlayPosition, MxGraphCustomOverlayStyle } from './custom-overlay';

export class OverlayConverter {
  private overlayPositions: Map<OverlayPosition, MxGraphCustomOverlayPosition> = new Map([
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

  convert(overlay: Overlay): MxGraphCustomOverlayOptions {
    const position = this.convertPosition(overlay);
    const style = OverlayConverter.convertStyle(overlay);
    return { position, style };
  }

  private convertPosition(overlay: Overlay): MxGraphCustomOverlayPosition {
    return this.overlayPositions.get(overlay.position);
  }

  private static convertStyle(overlay: Overlay): MxGraphCustomOverlayStyle {
    // recompute the style at each call to ensure we consider default changes that could occur after lib initialization
    const defaultStyle = {
      fill: { color: StyleDefault.DEFAULT_OVERLAY_FILL_COLOR.valueOf(), opacity: StyleDefault.DEFAULT_OVERLAY_FILL_OPACITY.valueOf() },
      stroke: { color: StyleDefault.DEFAULT_OVERLAY_STROKE_COLOR.valueOf(), width: StyleDefault.DEFAULT_OVERLAY_STROKE_WIDTH.valueOf() },
      font: { color: StyleDefault.DEFAULT_OVERLAY_FONT_COLOR.valueOf(), size: StyleDefault.DEFAULT_OVERLAY_FONT_SIZE.valueOf() },
    };

    const style = overlay.style;
    const convertedStyle = <MxGraphCustomOverlayStyle>{ ...defaultStyle };
    if (!style) {
      return convertedStyle;
    }

    convertedStyle.fill.color = style.fill?.color ?? convertedStyle.fill.color;
    convertedStyle.fill.opacity = style.fill?.opacity ?? convertedStyle.fill.opacity;

    convertedStyle.stroke.color = style.stroke?.color ?? convertedStyle.stroke.color;
    convertedStyle.stroke.width = style.stroke?.width ?? convertedStyle.stroke.width;

    convertedStyle.font.color = style.font?.color ?? convertedStyle.font.color;
    convertedStyle.font.size = style.font?.size ?? convertedStyle.font.size;

    return convertedStyle;
  }
}
