/*
Copyright 2021 Bonitasoft S.A.

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

import {
  CellRenderer,
  Client,
  constants,
  Dictionary,
  EdgeStyle,
  ImageShape,
  InternalEvent,
  Perimeter,
  Point,
  Rectangle,
  RectangleShape,
  SvgCanvas2D,
  styleUtils,
} from '@maxgraph/core';

/**
 * The `mxgraph` context that allows access to the mxGraph objects.
 *
 * **WARNING**: this is for advanced users.
 *
 * Here are some examples where calling the mxGraph API directly can be useful:
 * ```javascript
 * // Get the mxGraph version
 * const mxGraphVersion = mxgraph.mxClient.VERSION;
 * // Call mxUtils in custom BPMN Shapes
 * c.setFillColor(mxgraph.mxUtils.getValue(this.style, BpmnStyleIdentifier.EDGE_START_FILL_COLOR, this.stroke));
 * ```
 *
 * @since 0.30.0
 */
export const mxgraph = {
  CellRenderer: CellRenderer,
  mxCellRenderer: CellRenderer,
  mxClient: Client,
  mxConstants: constants,
  mxDictionary: Dictionary,
  mxEvent: InternalEvent,
  mxPerimeter: Perimeter,
  mxPoint: Point,
  mxRectangle: Rectangle,
  mxRectangleShape: RectangleShape,
  mxSvgCanvas2D: SvgCanvas2D,
  mxUtils: styleUtils,
  ImageShape,
  EdgeStyle,
};

/** @internal */
export {
  CellRenderer as mxCellRenderer,
  Client as mxClient,
  constants as mxConstants,
  InternalEvent as mxEvent,
  Perimeter as mxPerimeter,
  Point,
  Point as mxPoint,
  Rectangle,
  Rectangle as mxRectangle,
  RectangleShape as mxRectangleShape,
  SvgCanvas2D as mxSvgCanvas2D,
  styleUtils as mxUtils,
} from '@maxgraph/core';
