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

// Use mxgraph types
// The `preserve="true"` directive is required to retain types in the output starting from TypeScript 5.5.
// See https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#preservetrue for details.
// It is sufficient to add the `preserve` attribute once across all triple-slash directives, as the API Extractor will merge them when generating the final single definition file.
/// <reference types="@typed-mxgraph/typed-mxgraph" preserve="true"/>

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

// the mxGraph context
export { mxgraph } from './component/mxgraph/initializer';
