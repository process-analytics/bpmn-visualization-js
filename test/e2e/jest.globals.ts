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

import { mxgraphFactory } from 'ts-mxgraph';

const {
  mxClient,
  mxUtils,
  mxConstants,
  mxCodec,
  mxCodecRegistry,
  mxEvent,
  mxSvgCanvas2D,
  mxCellRenderer,
  mxGeometry,
  mxPerimeter,
  mxGraph,
  mxGraphModel,
  mxShape,
  mxMarker,
  mxPoint,
  mxEllipse,
  mxRhombus,
  mxRectangleShape,
} = mxgraphFactory({
  mxLoadResources: false,
  mxLoadStylesheets: false,
});
// to prevent TS error Property 'mxXyz' does not exist on type 'Global'.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = global;

globalAny.mxClient = mxClient;
globalAny.mxUtils = mxUtils;
globalAny.mxConstants = mxConstants;
globalAny.mxCodec = mxCodec;
globalAny.mxCodecRegistry = mxCodecRegistry;
globalAny.mxEvent = mxEvent;
globalAny.mxSvgCanvas2D = mxSvgCanvas2D;
globalAny.mxCellRenderer = mxCellRenderer;
globalAny.mxGeometry = mxGeometry;
globalAny.mxPerimeter = mxPerimeter;
globalAny.mxGraph = mxGraph;
globalAny.mxGraphModel = mxGraphModel;
globalAny.mxShape = mxShape;
globalAny.mxMarker = mxMarker;
globalAny.mxPoint = mxPoint;
globalAny.mxEllipse = mxEllipse;
globalAny.mxRhombus = mxRhombus;
globalAny.mxRectangleShape = mxRectangleShape;
