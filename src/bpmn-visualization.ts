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

// Public API
export * from './component/options';
export { BpmnVisualization } from './component/BpmnVisualization';
export * from './component/registry';
export * from './component/version';
export type { Navigation } from './component/navigation';
export * from './model/bpmn/internal';

// not part of the public API but needed for the custom theme examples
export { StyleConfigurator } from './component/mxgraph/config/StyleConfigurator';
export * from './component/mxgraph/style';
export * from './component/mxgraph/shape/render';

// the mxGraph context - for backward compatibility
// @deprecated Use direct imports from '@maxgraph/core' instead
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
