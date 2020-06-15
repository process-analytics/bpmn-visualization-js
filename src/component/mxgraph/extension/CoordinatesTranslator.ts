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
import { mxgraph } from 'ts-mxgraph';
import { MxGraphFactoryService } from '../../../service/MxGraphFactoryService';

export default class CoordinatesTranslator {
  private mxPoint: typeof mxgraph.mxPoint = MxGraphFactoryService.getMxGraphProperty('mxPoint');

  constructor(readonly graph: mxgraph.mxGraph) {}

  /**
   * Compute an absolute coordinate in relative coordinates in the parent cell referential.
   * @param parent the cell to use for the new coordinate referential
   * @param absoluteCoordinate
   */
  public computeRelativeCoordinates(parent: mxgraph.mxCell, absoluteCoordinate: mxgraph.mxPoint): mxgraph.mxPoint {
    const translateForRoot = this.getTranslateForRoot(parent);
    const relativeX = absoluteCoordinate.x + translateForRoot.x;
    const relativeY = absoluteCoordinate.y + translateForRoot.y;
    return new this.mxPoint(relativeX, relativeY);
  }

  // Returns the translation to be applied to a cell whose mxGeometry x and y values are expressed with absolute coordinates
  // (i.e related to the graph default parent) you want to assign as parent to the cell passed as argument of this function.
  // That way, you will be able to express the cell coordinates as relative to its parent cell.
  //
  // This implementation is taken from the example described in the documentation of mxgraph#getTranslateForRoot (4.1.1)
  // The translation is generally negative
  private getTranslateForRoot(cell: mxgraph.mxCell): mxgraph.mxPoint {
    const model = this.graph.getModel();
    const offset = new this.mxPoint(0, 0);

    while (cell != null) {
      const geo = model.getGeometry(cell);
      if (geo != null) {
        offset.x -= geo.x;
        offset.y -= geo.y;
      }
      cell = model.getParent(cell);
    }

    return offset;
  }
}
