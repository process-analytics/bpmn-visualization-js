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
import { MxGraphFactoryService } from '../../service/MxGraphFactoryService';
import { mxgraph } from 'ts-mxgraph';

export enum MarkerConstant {
  ARROW_DASH = 'dash',
}

export default class MarkerConfigurator {
  private mxMarker: typeof mxgraph.mxMarker = MxGraphFactoryService.getMxGraphProperty('mxMarker');

  public configureMarkers(): void {
    // Registers and defines the custom markers
    this.registerArrowDashMarker();
  }

  private registerArrowDashMarker(): void {
    // This implementation is adapted from the draw.io BPMN 'dash' marker
    // https://github.com/jgraph/drawio/blob/f539f1ff362e76127dcc7e68b5a9d83dd7d4965c/src/main/webapp/js/mxgraph/Shapes.js#L2796

    const createMarker =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: mxgraph.mxXmlCanvas2D, shape: mxgraph.mxShape, type: any, pe: any, unitX: number, unitY: number, size: number, source: mxgraph.mxCell, sw: any): any => {
        const nx = unitX * (size + sw + 4);
        const ny = unitY * (size + sw + 4);

        return function() {
          c.begin();
          c.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2);
          c.lineTo(pe.x + ny / 2 - (3 * nx) / 2, pe.y - (3 * ny) / 2 - nx / 2);
          c.stroke();
        };
      };
    this.mxMarker.addMarker(MarkerConstant.ARROW_DASH, createMarker);
  }
}
