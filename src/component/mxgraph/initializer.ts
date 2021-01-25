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
import factory, { mxGraphExportObject } from 'mxgraph';

export const mxgraph = initialize();

function initialize(): mxGraphExportObject {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // set options globally, as it is not working when passing options to the factory (https://github.com/jgraph/mxgraph/issues/479)
  (window as any)['mxLoadResources'] = false;
  (window as any)['mxLoadStylesheets'] = false;
  // extras, otherwise we got 'Uncaught ReferenceError: assignment to undeclared variable mx...'
  (window as any)['mxForceIncludes'] = false;
  (window as any)['mxResourceExtension'] = '.txt';
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return factory({});
}
