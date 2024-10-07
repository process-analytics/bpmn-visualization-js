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

import factory, { type mxGraphExportObject } from 'mxgraph';

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
export const mxgraph = initialize();

/** @internal */
export const mxCellRenderer = mxgraph.mxCellRenderer;
/** @internal */
export const mxClient = mxgraph.mxClient;
/** @internal */
export const mxConstants = mxgraph.mxConstants;
/** @internal */
export const mxEvent = mxgraph.mxEvent;
/** @internal */
export const mxPerimeter = mxgraph.mxPerimeter;
/** @internal */
export const mxPoint = mxgraph.mxPoint;
/** @internal */
export const mxRectangle = mxgraph.mxRectangle;
/** @internal */
export const mxRectangleShape = mxgraph.mxRectangleShape;
/** @internal */
export const mxSvgCanvas2D = mxgraph.mxSvgCanvas2D;
/** @internal */
export const mxUtils = mxgraph.mxUtils;

/** @internal */
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Since we are overriding an existing interface in the global scope, it is not possible to convert it to a type.
  interface Window {
    mxForceIncludes: boolean;
    mxLoadResources: boolean;
    mxLoadStylesheets: boolean;
    mxResourceExtension: string;
  }
}

function initialize(): mxGraphExportObject {
  // set options globally, as it is not working when passing options to the factory (https://github.com/jgraph/mxgraph/issues/479)
  // Required otherwise 'Uncaught ReferenceError: assignment to undeclared variable mx...'
  globalThis.mxForceIncludes = false;
  globalThis.mxLoadResources = false;
  // Required otherwise we got 'Uncaught ReferenceError: assignment to undeclared variable mx...'
  globalThis.mxLoadStylesheets = false;
  globalThis.mxResourceExtension = '.txt';

  return factory({});
}
