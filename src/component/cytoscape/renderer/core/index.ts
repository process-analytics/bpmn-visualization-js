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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import CanvasRenderer from '../../../../../node_modules/cytoscape/src/extensions/renderer/canvas/index.js';
import CanvasRenderer from './canvas/index.js';

// export default function extension(): any {
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// const CanvasRenderer = cytoscape().extension('renderer', 'canvas');

// CanvasRenderer.prototype.nodeShapeImpl = function (name: any, context: any, centerX: any, centerY: any, width: any, height: any, points: any) {
//   // eslint-disable-next-line no-console
//   console.log('____________________________________EXTENDED___________________________________');
//   switch (name) {
//     case 'ellipse':
//       return this.drawEllipsePath(context, centerX, centerY, width, height);
//     case 'polygon':
//       return this.drawPolygonPath(context, centerX, centerY, width, height, points);
//     case 'round-polygon':
//       return this.drawRoundPolygonPath(context, centerX, centerY, width, height, points);
//     case 'roundrectangle':
//     case 'round-rectangle':
//       return this.drawRoundRectanglePath(context, centerX, centerY, width, height);
//     case 'cutrectangle':
//     case 'cut-rectangle':
//       return this.drawCutRectanglePath(context, centerX, centerY, width, height);
//     case 'bottomroundrectangle':
//     case 'bottom-round-rectangle':
//       return this.drawBottomRoundRectanglePath(context, centerX, centerY, width, height);
//     case 'barrel':
//       return this.drawBarrelPath(context, centerX, centerY, width, height);
//     case 'newShape':
//       return this.drawBarrelPath(context, centerX, centerY, width, height);
//   }
// };

// return CanvasRenderer;
// }
export default CanvasRenderer;
