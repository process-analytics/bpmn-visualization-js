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
import { MxGraphCustomOverlayOptions, MxGraphCustomOverlayPosition } from './custom-overlay';

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
    const fill = overlay?.fill?.color ? overlay.fill : { ...overlay.fill, color: StyleDefault.DEFAULT_FILL_COLOR };
    const stroke = overlay?.stroke?.color ? overlay.stroke : { ...overlay.stroke, color: StyleDefault.DEFAULT_STROKE_COLOR };

    return <MxGraphCustomOverlayOptions>{ position, style: { font: overlay.font, fill, stroke } };
  }

  private convertPosition(overlay: Overlay): MxGraphCustomOverlayPosition {
    return this.overlayPositions.get(overlay.position);
  }
}
