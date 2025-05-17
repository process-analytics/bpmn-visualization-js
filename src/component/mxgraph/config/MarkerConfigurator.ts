/*
Copyright 2020 Bonitasoft S.A.

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

import { MarkerIdentifier } from '../style';
import type { AbstractCanvas2D, ArrowValue, MarkerFactoryFunction, Point, Shape } from '@maxgraph/core';
import { EdgeMarker, EdgeMarkerRegistry } from '@maxgraph/core';

/**
 * @internal
 */
export default class MarkerConfigurator {
  configureMarkers(): void {
    this.registerArrowDashMarker();
    // register maxGraph built-in markers used in bpmn-visualization (not registered by default as we used BaseGraph)
    // see https://github.com/maxGraph/maxGraph/blob/0a18ab1479f0235087c7763dafc098f12cd5f0c9/packages/core/src/view/style/register.ts#L139

    const markersToRegister: [ArrowValue, MarkerFactoryFunction][] = [
      ['blockThin', EdgeMarker.createArrow(3)],
      ['openThin', EdgeMarker.createOpenArrow(3)],
      ['oval', EdgeMarker.oval],
      ['diamondThin', EdgeMarker.diamond],
    ];
    for (const [type, factory] of markersToRegister) {
      EdgeMarkerRegistry.add(type, factory);
    }
  }

  private registerArrowDashMarker(): void {
    // This implementation is adapted from the draw.io BPMN 'dash' marker
    // https://github.com/jgraph/drawio/blob/f539f1ff362e76127dcc7e68b5a9d83dd7d4965c/src/main/webapp/js/mxgraph/Shapes.js#L2796

    // prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
    const createMarker: MarkerFactoryFunction = (
      c: AbstractCanvas2D,
      _shape: Shape,
      _type: string,
      pe: Point,
      unitX: number,
      unitY: number,
      size: number,
      _source: boolean,
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
    EdgeMarkerRegistry.add(MarkerIdentifier.ARROW_DASH, createMarker);
  }
}
