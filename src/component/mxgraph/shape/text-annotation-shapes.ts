/**
 * Copyright 2020 Bonitasoft S.A.
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

import { StyleDefault } from '../style';
import { mxgraph } from '../initializer';
import type { mxAbstractCanvas2D } from 'mxgraph';

/**
 * @internal
 */
export class TextAnnotationShape extends mxgraph.mxRectangleShape {
  override paintBackground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    // paint sort of left square bracket shape - for text annotation
    c.begin();
    c.moveTo(x + StyleDefault.TEXT_ANNOTATION_BORDER_LENGTH, y);
    c.lineTo(x, y);
    c.lineTo(x, y + h);
    c.lineTo(x + StyleDefault.TEXT_ANNOTATION_BORDER_LENGTH, y + h);

    c.fillAndStroke();
  }
}
