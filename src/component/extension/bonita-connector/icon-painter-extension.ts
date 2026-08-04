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

const iconOriginalSize = { width: 100, height: 100 };

export const bonitaConnectorIconPainterExtension: IconPainterExtensionPoint = {
  paintBonitaConnectorIcon(this: IconPainter, paintParameter: PaintParameter): void {
    const canvas = this.newBpmnCanvas(paintParameter, iconOriginalSize);

    // TODO placeholder shape, replaced by the actual connector icon. It only proves that the method injected in the
    // icon painter is the one being called.
    canvas.setFillColor('Green');
    canvas.setStrokeColor('Green');
    canvas.rect(0, 0, iconOriginalSize.width, iconOriginalSize.height);
    canvas.fillAndStroke();
  },
};
