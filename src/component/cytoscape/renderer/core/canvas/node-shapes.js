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
var CRp = {};

CRp.nodeShapeImpl = function (name, context, centerX, centerY, width, height, points) {
  switch (name) {
    case 'ellipse':
      return this.drawEllipsePath(context, centerX, centerY, width, height);
    case 'polygon':
      return this.drawPolygonPath(context, centerX, centerY, width, height, points);
    case 'round-polygon':
      return this.drawRoundPolygonPath(context, centerX, centerY, width, height, points);
    case 'roundrectangle':
    case 'round-rectangle':
      return this.drawRoundRectanglePath(context, centerX, centerY, width, height);
    case 'cutrectangle':
    case 'cut-rectangle':
      return this.drawCutRectanglePath(context, centerX, centerY, width, height);
    case 'bottomroundrectangle':
    case 'bottom-round-rectangle':
      return this.drawBottomRoundRectanglePath(context, centerX, centerY, width, height);
    case 'barrel':
      return this.drawBarrelPath(context, centerX, centerY, width, height);
    case 'new-shape':
      return this.drawNewShapePath(context, centerX, centerY, width, height);
  }
};

export default CRp;
