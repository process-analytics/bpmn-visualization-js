/**
 * Copyright 2021 Bonitasoft S.A.
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
import factory, { type mxGraphExportObject } from 'mxgraph';

export const mxgraph = initialize();

/** @internal */
declare global {
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
  window.mxForceIncludes = false;
  window.mxLoadResources = false;
  // Required otherwise we got 'Uncaught ReferenceError: assignment to undeclared variable mx...'
  window.mxLoadStylesheets = false;
  window.mxResourceExtension = '.txt';

  return factory({});
}
