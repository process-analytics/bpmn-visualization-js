/*
Copyright 2022 Bonitasoft S.A.

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

import { mxClient } from './mxgraph/initializer';

// WARN: this constant is automatically updated at release time by the 'manage-version-in-files.mjs' script.
// So, if you modify the name of this file or this constant, please update the script accordingly.
const libraryVersion = '0.44.0';

/**
 * Returns the version of `bpmn-visualization` and the version of its dependencies.
 * @since 0.43.0
 */
export const getVersion = (): Version => {
  return { lib: libraryVersion, dependencies: new Map([['mxGraph', mxClient.VERSION]]) };
};

/**
 * The version of `bpmn-visualization` and the version of its dependencies.
 */
export interface Version {
  /** The `bpmn-visualization` version. */
  lib: string;
  /** The version of the `bpmn-visualization` dependencies. This may **not** list all dependencies. */
  dependencies: Map<string, string>;
}
