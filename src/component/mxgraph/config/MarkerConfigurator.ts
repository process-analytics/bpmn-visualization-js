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

import { MarkerIdentifier } from '../style';
import { mxgraph } from '../initializer';
import type { mxAbstractCanvas2D, mxCell, mxPoint, mxShape } from 'mxgraph';

/**
 * @internal
 */
export default class MarkerConfigurator {
  configureMarkers(): void {
    this.registerArrowDashMarker();
  }

  private registerArrowDashMarker(): void {
    // This implementation is adapted from the draw.io BPMN 'dash' marker
    // https://github.com/jgraph/drawio/blob/f539f1ff362e76127dcc7e68b5a9d83dd7d4965c/src/main/webapp/js/mxgraph/Shapes.js#L2796

    // prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
    const createMarker = (
      c: mxAbstractCanvas2D,
      _shape: mxShape,
      _type: string,
      pe: mxPoint,
      unitX: number,
      unitY: number,
      size: number,
      _source: mxCell,
      strokewidth: number,
    ): (() => void) => {
      const nx = unitX * (size + strokewidth + 4);
      const ny = unitY * (size + strokewidth + 4);

      return function () {
        c.begin();
        c.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2);
        c.lineTo(pe.x + ny / 2 - (3 * nx) / 2, pe.y - (3 * ny) / 2 - nx / 2);
        c.stroke();
      };
    };
    mxgraph.mxMarker.addMarker(MarkerIdentifier.ARROW_DASH, createMarker);
  }
}
