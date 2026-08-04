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

import type { IconPainter, PaintParameter } from '../../mxgraph/shape/render';
import type { IconPainterExtensionPoint } from '../extension-points';

import './types';

const iconOriginalSize = { width: 43.609, height: 22.686 };

export const bonitaConnectorIconPainterExtension: IconPainterExtensionPoint = {
  /**
   * The connector icon of Bonita Studio, provided by Bonitasoft.
   *
   * The gradient and the colors of the original icon are not reproduced: as the other icons of the library, it is
   * painted with the stroke and fill colors of the shape it is painted on.
   */
  paintBonitaConnectorIcon(this: IconPainter, paintParameter: PaintParameter): void {
    const canvas = this.newBpmnCanvas(paintParameter, iconOriginalSize);

    // The cable
    canvas.begin();
    canvas.moveTo(28.836, 16.073);
    canvas.curveTo(28.836, 16.073, 17.836, 30.113, 15.604, 13.78);
    canvas.curveTo(14.181, 3.389, 4.019, 10.822, 1, 12.142);
    canvas.stroke();

    // The 2 pins
    canvas.begin();
    canvas.moveTo(38.276, 11.721);
    canvas.curveTo(38.079, 11.925, 37.755, 11.929, 37.551, 11.731);
    canvas.lineTo(36.93, 11.124);
    canvas.curveTo(36.728, 10.928, 36.724, 10.605, 36.92, 10.403);
    canvas.lineTo(41.608, 5.596);
    canvas.curveTo(41.804, 5.394, 42.129, 5.388, 42.33, 5.585);
    canvas.lineTo(42.953, 6.193);
    canvas.curveTo(43.156, 6.39, 43.16, 6.713, 42.961, 6.915);
    canvas.close();
    canvas.fillAndStroke();

    canvas.begin();
    canvas.moveTo(33.068, 6.782);
    canvas.curveTo(32.87, 6.984, 32.547, 6.988, 32.343, 6.791);
    canvas.lineTo(31.721, 6.185);
    canvas.curveTo(31.52, 5.988, 31.516, 5.664, 31.71, 5.463);
    canvas.lineTo(36.398, 0.654);
    canvas.curveTo(36.594, 0.452, 36.919, 0.448, 37.12, 0.645);
    canvas.lineTo(37.743, 1.251);
    canvas.curveTo(37.946, 1.449, 37.95, 1.772, 37.753, 1.975);
    canvas.close();
    canvas.fillAndStroke();

    // The plug, painted last to hide the end of the cable
    canvas.begin();
    canvas.moveTo(29.081, 2.856);
    canvas.curveTo(29.081, 2.856, 18.418, 11.83, 24.773, 18.564);
    canvas.curveTo(31.127, 25.298, 39.23, 17.269, 41.098, 14.875);
    canvas.close();
    canvas.fillAndStroke();
  },
};
